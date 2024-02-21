use entity::prelude::*;
use sea_orm::{
    sea_query::{
        Alias, Cond, Expr, Func, IntoCondition, Query, SimpleExpr, SqliteQueryBuilder,
        SubQueryStatement,
    },
    ColumnTrait, Condition, DatabaseConnection as DbConn, DbBackend, DbErr, EntityTrait,
    FromQueryResult, JsonValue, Order, PaginatorTrait, QueryFilter, SelectColumns, Statement,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{SelectClients, SelectProducts, SelectSellers};

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
                                    .into_condition()
                                    .add(
                                        inventory_mouvements::Column::MvmType
                                            .eq("IN")
                                            .into_condition(),
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
                                    .into_condition()
                                    .add(
                                        inventory_mouvements::Column::MvmType
                                            .eq("OUT")
                                            .into_condition(),
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
                            .like(format!("{}%", args.search))
                            .into_condition(),
                    )
                    .add(
                        Expr::col((Products, products::Column::Description))
                            .like(format!("%{}%", args.search))
                            .into_condition(),
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
    pub async fn list_clients(db: &DbConn, args: ListArgs) -> Result<JsonValue, DbErr> {
        let count = Clients::find()
            .filter(clients::Column::FullName.like(format!("{}%", args.search)))
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Clients)
            .exprs([
                Expr::col((Clients, clients::Column::Id)),
                Expr::col((Clients, clients::Column::FullName)),
                Expr::col((Clients, clients::Column::Address)),
                Expr::col((Clients, clients::Column::PhoneNumber)),
                Expr::col((Clients, clients::Column::Image)),
                Expr::col((Clients, clients::Column::Email)),
            ])
            .expr_as(
                SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(Invoices)
                            .expr(Func::coalesce([
                                Func::sum(
                                    Expr::col((
                                        InventoryMouvements,
                                        inventory_mouvements::Column::Quantity,
                                    ))
                                    .mul(Expr::col((InvoiceItems, invoice_items::Column::Price))),
                                )
                                .into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .inner_join(
                                InvoiceItems,
                                Expr::col((InvoiceItems, invoice_items::Column::InvoiceId))
                                    .equals((Invoices, invoices::Column::Id)),
                            )
                            .inner_join(
                                InventoryMouvements,
                                Expr::col((InventoryMouvements, inventory_mouvements::Column::Id))
                                    .equals((InvoiceItems, invoice_items::Column::InventoryId)),
                            )
                            .cond_where(
                                Cond::all().add(
                                    Expr::col((Invoices, invoices::Column::Status))
                                        .eq("PAID")
                                        .into_condition()
                                        .add(
                                            Expr::col((Invoices, invoices::Column::ClientId))
                                                .equals((Clients, clients::Column::Id))
                                                .into_condition(),
                                        ),
                                ),
                            )
                            .to_owned(),
                    )),
                ),
                Alias::new("credi"),
            )
            .cond_where(
                Expr::col((Clients, clients::Column::FullName))
                    .like(format!("{}%", args.search))
                    .into_condition(),
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by(clients::Column::CreatedAt, Order::Desc)
            .to_owned()
            .build(SqliteQueryBuilder);

        let res = SelectClients::find_by_statement(Statement::from_sql_and_values(
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
                "fullname": row.full_name,
                "address": row.address,
                "image": row.image,
                "email": row.email,
                "phoneNumber": row.phone_number,
                "credi": row.credi,
            }));
        });

        Ok(json!({
            "count": count,
            "clients": result
        }))
    }
    pub async fn search_clients(db: &DbConn, search: String) -> Result<Vec<JsonValue>, DbErr> {
        let clients = Clients::find()
            .select_column(clients::Column::FullName)
            .select_column(clients::Column::Id)
            .filter(clients::Column::FullName.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(clients)
    }
    //
    pub async fn list_sellers(db: &DbConn, args: ListArgs) -> Result<JsonValue, DbErr> {
        let count = Sellers::find()
            .filter(sellers::Column::FullName.like(format!("{}%", args.search)))
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Sellers)
            .exprs([
                Expr::col((Sellers, sellers::Column::Id)),
                Expr::col((Sellers, sellers::Column::FullName)),
                Expr::col((Sellers, sellers::Column::Address)),
                Expr::col((Sellers, sellers::Column::PhoneNumber)),
                Expr::col((Sellers, sellers::Column::Image)),
                Expr::col((Sellers, sellers::Column::Email)),
            ])
            .expr_as(
                SimpleExpr::SubQuery(
                    None,
                    Box::new(SubQueryStatement::SelectStatement(
                        Query::select()
                            .from(Orders)
                            .expr(Func::coalesce([
                                Func::sum(
                                    Expr::col((
                                        InventoryMouvements,
                                        inventory_mouvements::Column::Quantity,
                                    ))
                                    .mul(Expr::col((OrderItems, order_items::Column::Price))),
                                )
                                .into(),
                                Expr::val(0.0f64).into(),
                            ]))
                            .inner_join(
                                OrderItems,
                                Expr::col((OrderItems, order_items::Column::OrderId))
                                    .equals((Orders, orders::Column::Id)),
                            )
                            .inner_join(
                                InventoryMouvements,
                                Expr::col((InventoryMouvements, inventory_mouvements::Column::Id))
                                    .equals((OrderItems, order_items::Column::InventoryId)),
                            )
                            .cond_where(
                                Cond::all().add(
                                    Expr::col((Orders, orders::Column::Status))
                                        .eq("PAID")
                                        .into_condition()
                                        .add(
                                            Expr::col((Orders, orders::Column::SellerId))
                                                .equals((Sellers, sellers::Column::Id))
                                                .into_condition(),
                                        ),
                                ),
                            )
                            .to_owned(),
                    )),
                ),
                Alias::new("credi"),
            )
            .cond_where(
                Expr::col((Sellers, sellers::Column::FullName))
                    .like(format!("{}%", args.search))
                    .into_condition(),
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by(sellers::Column::CreatedAt, Order::Desc)
            .to_owned()
            .build(SqliteQueryBuilder);

        let res = SelectSellers::find_by_statement(Statement::from_sql_and_values(
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
                "fullname": row.full_name,
                "address": row.address,
                "image": row.image,
                "email": row.email,
                "phoneNumber": row.phone_number,
                "credi": row.credi,
            }));
        });

        Ok(json!({
            "count": count,
            "sellers": result
        }))
    }
    //
    pub async fn search_sellers(db: &DbConn, search: String) -> Result<Vec<JsonValue>, DbErr> {
        let sellers = Sellers::find()
            .select_column(sellers::Column::FullName)
            .select_column(sellers::Column::Id)
            .filter(sellers::Column::FullName.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(sellers)
    }
}
