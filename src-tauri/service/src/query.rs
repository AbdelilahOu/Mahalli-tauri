use entity::{
    inventory_mouvements::{self, Entity as InventoryMouvement},
    invoice_items::{self, Entity as InvoiceItems},
    order_items::{self, Entity as OrderItems},
    products::{self, Entity as Product},
};
use sea_orm::{
    sea_query::{
        Alias, Cond, Expr, Func, Query, SimpleExpr, SqliteQueryBuilder, SubQueryStatement,
    },
    ColumnTrait, Condition, ConnectionTrait, DatabaseConnection as DbConn, DbBackend, DbErr,
    EntityTrait, FromQueryResult, JoinType, JsonValue, Order, PaginatorTrait, QueryFilter,
    SelectColumns, Statement,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::SelectProducts;

#[derive(Deserialize, Serialize)]
pub struct ListArgs {
    pub page: u64,
    pub limit: u64,
    pub search: String,
}

pub struct QueriesService;

impl QueriesService {
    pub async fn list_products(db: &DbConn, args: ListArgs) -> Result<JsonValue, DbErr> {
        let count = Product::find()
            .filter(
                Condition::any()
                    .add(products::Column::Name.like(format!("{}%", args.search)))
                    .add(products::Column::Description.like(format!("%{}%", args.search))),
            )
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Product)
            .exprs([
                Expr::col((Product, products::Column::Id)),
                Expr::col((Product, products::Column::Name)),
                Expr::col((Product, products::Column::Description)),
                Expr::col((Product, products::Column::Image)),
                Expr::col((Product, products::Column::CreatedAt)),
                Expr::col((Product, products::Column::Price)),
                Expr::col((Product, products::Column::MinQuantity)),
            ])
            .expr_as(
                SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(InventoryMouvement)
                            .expr(Func::coalesce([
                                Func::sum(Expr::col(inventory_mouvements::Column::Quantity)).into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .join(
                                JoinType::Join,
                                OrderItems,
                                Expr::col((OrderItems, order_items::Column::InventoryId))
                                    .equals((InventoryMouvement, inventory_mouvements::Column::Id)),
                            )
                            .cond_where(
                                Expr::col((OrderItems, order_items::Column::ProductId))
                                    .equals((Product, products::Column::Id)),
                            )
                            .to_owned(),
                    )),
                )
                .sub(SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(InventoryMouvement)
                            .expr(Func::coalesce([
                                Func::sum(Expr::col(inventory_mouvements::Column::Quantity)).into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .join(
                                JoinType::Join,
                                InvoiceItems,
                                Expr::col((InvoiceItems, invoice_items::Column::InventoryId))
                                    .equals((InventoryMouvement, inventory_mouvements::Column::Id)),
                            )
                            .cond_where(
                                Expr::col((InvoiceItems, invoice_items::Column::ProductId))
                                    .equals((Product, products::Column::Id)),
                            )
                            .to_owned(),
                    )),
                )),
                Alias::new("stock"),
            )
            .cond_where(
                Cond::any()
                    .add(
                        Expr::col((Product, products::Column::Name))
                            .like(format!("{}%", args.search)),
                    )
                    .add(
                        Expr::col((Product, products::Column::Description))
                            .like(format!("%{}%", args.search)),
                    ),
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by(products::Column::CreatedAt, Order::Desc)
            .to_owned()
            .build(SqliteQueryBuilder);

        let res = db
            .query_all(Statement::from_sql_and_values(
                DbBackend::Sqlite,
                sql,
                values,
            ))
            .await?;

        let mut result = Vec::<JsonValue>::new();
        res.into_iter().for_each(|row| {
            let product = SelectProducts::from_query_result(&row, "");
            match product {
                Ok(r) => result.push(json!({
                    "id": r.id,
                    "name": r.name,
                    "description": r.description,
                    "image": r.image,
                    "price": r.price,
                    "minQuantity": r.min_quantity,
                    "stock": r.stock,
                    "createdAt": r.created_at,
                })),
                Err(e) => {
                    println!("{:?}", e);
                }
            };
        });

        Ok(json!({
            "count": count,
            "products": result
        }))
    }
    pub async fn search_products(db: &DbConn, search: String) -> Result<Vec<JsonValue>, DbErr> {
        let products = Product::find()
            .select_column(products::Column::Name)
            .select_column(products::Column::Id)
            .filter(products::Column::Name.like(search))
            .into_json()
            .all(db)
            .await?;

        Ok(products)
    }
}
