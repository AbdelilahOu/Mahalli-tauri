use entity::prelude::*;
use sea_orm::{
    sea_query::{
        Alias, Cond, Expr, Func, Query, SimpleExpr, SqliteQueryBuilder, SubQueryStatement,
    },
    ColumnTrait, Condition, DatabaseConnection as DbConn, DbBackend, DbErr, EntityTrait,
    FromQueryResult, JsonValue, Order, PaginatorTrait, QueryFilter, SelectColumns, Statement,
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
        let count = Products::find()
            .filter(
                Condition::any()
                    .add(products::Column::Name.like(format!("{}%", args.search)))
                    .add(products::Column::Description.like(format!("%{}%", args.search))),
            )
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Products)
            .exprs([
                Expr::col((Products, products::Column::Id)),
                Expr::col((Products, products::Column::Name)),
                Expr::col((Products, products::Column::Description)),
                Expr::col((Products, products::Column::Image)),
                Expr::col((Products, products::Column::CreatedAt)),
                Expr::col((Products, products::Column::Price)),
                Expr::col((Products, products::Column::MinQuantity)),
            ])
            .expr_as(
                SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(InventoryMouvements)
                            .expr(Func::coalesce([
                                Func::sum(Expr::col(inventory_mouvements::Column::Quantity)).into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .cond_where(
                                Cond::all().add(
                                    Expr::col((
                                        InventoryMouvements,
                                        inventory_mouvements::Column::ProductId,
                                    ))
                                    .equals((Products, products::Column::Id))
                                    .add(
                                        Expr::col((
                                            InventoryMouvements,
                                            inventory_mouvements::Column::MvmType,
                                        ))
                                        .equals(Alias::new("IN")),
                                    ),
                                ),
                            )
                            .to_owned(),
                    )),
                )
                .sub(SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(InventoryMouvements)
                            .expr(Func::coalesce([
                                Func::sum(Expr::col(inventory_mouvements::Column::Quantity)).into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .cond_where(
                                Cond::all().add(
                                    Expr::col((
                                        InventoryMouvements,
                                        inventory_mouvements::Column::ProductId,
                                    ))
                                    .equals((Products, products::Column::Id))
                                    .add(
                                        Expr::col((
                                            InventoryMouvements,
                                            inventory_mouvements::Column::MvmType,
                                        ))
                                        .equals(Alias::new("OUT")),
                                    ),
                                ),
                            )
                            .to_owned(),
                    )),
                )),
                Alias::new("stock"),
            )
            .cond_where(
                Cond::any()
                    .add(
                        Expr::col((Products, products::Column::Name))
                            .like(format!("{}%", args.search)),
                    )
                    .add(
                        Expr::col((Products, products::Column::Description))
                            .like(format!("%{}%", args.search)),
                    ),
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by(products::Column::CreatedAt, Order::Desc)
            .to_owned()
            .build(SqliteQueryBuilder);

        let res = SelectProducts::find_by_statement(Statement::from_sql_and_values(
            DbBackend::Sqlite,
            sql,
            values,
        ))
        .all(db)
        .await?;

        let mut result = Vec::<JsonValue>::new();
        res.into_iter().for_each(|row| {
            result.push(json!({
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "image": row.image,
                "price": row.price,
                "minQuantity": row.min_quantity,
                "stock": row.stock,
                "createdAt": row.created_at,
            }));
        });

        Ok(json!({
            "count": count,
            "products": result
        }))
    }
    pub async fn search_products(db: &DbConn, search: String) -> Result<Vec<JsonValue>, DbErr> {
        let products = Products::find()
            .select_column(products::Column::Name)
            .select_column(products::Column::Id)
            .filter(products::Column::Name.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(products)
    }
}
