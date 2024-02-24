use entity::prelude::*;
use sea_orm::{
    sea_query::{
        Alias, Cond, Expr, Func, IntoCondition, Query, SimpleExpr, SqliteQueryBuilder,
        SubQueryStatement,
    },
    ColumnTrait, Condition, DatabaseConnection as DbConn, DbBackend, DbErr, EntityTrait,
    FromQueryResult, JoinType, JsonValue, Order, PaginatorTrait, QueryFilter, QuerySelect,
    QueryTrait, RelationTrait, Statement,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{
    SelectClients, SelectOrders, SelectOrdersItemsForUpdate, SelectProducts, SelectSuppliers,
};

#[derive(Deserialize, Serialize, Debug)]
pub struct ListArgs {
    pub page: u64,
    pub limit: u64,
    pub search: String,
    pub status: Option<String>,
    pub created_at: Option<String>,
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
            .select_only()
            .expr_as_(Expr::col(products::Column::Name), "label")
            .expr_as_(Expr::col(products::Column::Id), "value")
            .filter(products::Column::Name.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(products)
    }
    //
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
            .select_only()
            .expr_as_(Expr::col(clients::Column::FullName), "label")
            .expr_as_(Expr::col(clients::Column::Id), "value")
            .filter(clients::Column::FullName.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(clients)
    }
    //
    pub async fn list_suppliers(db: &DbConn, args: ListArgs) -> Result<JsonValue, DbErr> {
        let count = Suppliers::find()
            .filter(suppliers::Column::FullName.like(format!("{}%", args.search)))
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Suppliers)
            .exprs([
                Expr::col((Suppliers, suppliers::Column::Id)),
                Expr::col((Suppliers, suppliers::Column::FullName)),
                Expr::col((Suppliers, suppliers::Column::Address)),
                Expr::col((Suppliers, suppliers::Column::PhoneNumber)),
                Expr::col((Suppliers, suppliers::Column::Image)),
                Expr::col((Suppliers, suppliers::Column::Email)),
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
                                            Expr::col((Orders, orders::Column::SupplierId))
                                                .equals((Suppliers, suppliers::Column::Id))
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
                Expr::col((Suppliers, suppliers::Column::FullName))
                    .like(format!("{}%", args.search))
                    .into_condition(),
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by(suppliers::Column::CreatedAt, Order::Desc)
            .to_owned()
            .build(SqliteQueryBuilder);

        let res = SelectSuppliers::find_by_statement(Statement::from_sql_and_values(
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
            "suppliers": result
        }))
    }
    pub async fn search_suppliers(db: &DbConn, search: String) -> Result<Vec<JsonValue>, DbErr> {
        let suppliers = Suppliers::find()
            .select_only()
            .expr_as_(Expr::col(suppliers::Column::FullName), "label")
            .expr_as_(Expr::col(suppliers::Column::Id), "value")
            .filter(suppliers::Column::FullName.like(format!("{}%", search)))
            .into_json()
            .all(db)
            .await?;

        Ok(suppliers)
    }
    //
    pub async fn list_orders(db: &DbConn, args: ListArgs) -> Result<JsonValue, DbErr> {
        let count = Orders::find()
            .apply_if(Some(args.search.clone()), |query, v| {
                query.filter(
                    Expr::col((Suppliers, suppliers::Column::FullName)).like(format!("{}%", v)),
                )
            })
            .apply_if(args.status.clone(), |query, v| {
                query.filter(Expr::col((Orders, orders::Column::Status)).eq(v))
            })
            .apply_if(args.created_at.clone(), |query, v| {
                query.filter(Expr::cust_with_values(
                    "strftime('%Y-%m-%d', orders.created_at) = ?",
                    [v],
                ))
            })
            .join(JoinType::Join, orders::Relation::Suppliers.def())
            .count(db)
            .await?;

        let (sql, values) = Query::select()
            .from(Orders)
            .exprs([
                Expr::col((Orders, orders::Column::Id)),
                Expr::col((Orders, orders::Column::Status)),
                Expr::col((Orders, orders::Column::CreatedAt)),
                Expr::col((Orders, orders::Column::SupplierId)),
                Expr::col((Suppliers, suppliers::Column::FullName)),
            ])
            .expr_as(
                Func::coalesce([
                    Func::count(Expr::col(inventory_mouvements::Column::Quantity)).into(),
                    Expr::val(0i64).into(),
                ]),
                Alias::new("products"),
            )
            .expr_as(
                Func::coalesce([
                    Func::sum(
                        Expr::col((InventoryMouvements, inventory_mouvements::Column::Quantity))
                            .mul(Expr::col((OrderItems, order_items::Column::Price))),
                    )
                    .into(),
                    Expr::val(0.0f64).into(),
                ]),
                Alias::new("total"),
            )
            .left_join(
                OrderItems,
                Expr::col((OrderItems, order_items::Column::OrderId))
                    .equals((Orders, orders::Column::Id)),
            )
            .left_join(
                InventoryMouvements,
                Expr::col((InventoryMouvements, inventory_mouvements::Column::Id))
                    .equals((OrderItems, order_items::Column::InventoryId)),
            )
            .join(
                JoinType::Join,
                Suppliers,
                Expr::col((Suppliers, suppliers::Column::Id))
                    .equals((Orders, orders::Column::SupplierId)),
            )
            .cond_where(
                Expr::col((Suppliers, suppliers::Column::FullName))
                    .like(format!("{}%", args.search)),
            )
            .conditions(
                args.status.clone().is_some(),
                |x| {
                    x.and_where(Expr::col((Orders, orders::Column::Status)).eq(args.status));
                },
                |_| {},
            )
            .conditions(
                args.created_at.clone().is_some(),
                |x| {
                    x.and_where(Expr::cust_with_values(
                        "strftime('%Y-%m-%d', orders.created_at) = ?",
                        args.created_at,
                    ));
                },
                |_| {},
            )
            .limit(args.limit)
            .offset((args.page - 1) * args.limit)
            .order_by((Orders, orders::Column::CreatedAt), Order::Desc)
            .group_by_col((Orders, orders::Column::Id))
            .to_owned()
            .build(SqliteQueryBuilder);

        println!("{:?},{}", sql.clone(), count.clone());

        let res = SelectOrders::find_by_statement(Statement::from_sql_and_values(
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
                "supplierId": row.supplier_id,
                "createdAt": row.created_at,
                "fullname": row.full_name,
                "status": row.status,
                "products": row.products,
                "total": row.total,
            }));
        });

        Ok(json!({
            "count": count,
            "orders": result
        }))
    }
    pub async fn get_order(db: &DbConn, id: String) -> Result<JsonValue, DbErr> {
        let order = Orders::find_by_id(id.clone())
            .find_also_related(Suppliers)
            .one(db)
            .await?;

        match order {
            Some(order) => {
                let (sql, values) = Query::select()
                    .exprs([
                        Expr::col((OrderItems, order_items::Column::Id)),
                        Expr::col((OrderItems, order_items::Column::InventoryId)),
                        Expr::col((OrderItems, order_items::Column::Price)),
                        Expr::col((InventoryMouvements, inventory_mouvements::Column::Quantity)),
                        Expr::col((Products, products::Column::Name)),
                    ])
                    .expr_as(
                        Expr::col((Products, products::Column::Id)),
                        Alias::new("product_id"),
                    )
                    .from(OrderItems)
                    .join(
                        JoinType::Join,
                        InventoryMouvements,
                        Expr::col((InventoryMouvements, inventory_mouvements::Column::Id))
                            .equals((OrderItems, order_items::Column::InventoryId)),
                    )
                    .join(
                        JoinType::Join,
                        Products,
                        Expr::col((Products, products::Column::Id))
                            .equals((InventoryMouvements, inventory_mouvements::Column::ProductId)),
                    )
                    .cond_where(Expr::col((OrderItems, order_items::Column::OrderId)).eq(id))
                    .to_owned()
                    .build(SqliteQueryBuilder);

                let items = SelectOrdersItemsForUpdate::find_by_statement(
                    Statement::from_sql_and_values(DbBackend::Sqlite, sql, values),
                )
                .all(db)
                .await?;

                let mut result = Vec::<JsonValue>::new();
                items.into_iter().for_each(|item| {
                    result.push(json!({
                        "id": item.id,
                        "inventory_id": item.inventory_id,
                        "product_id": item.product_id,
                        "price": item.price,
                        "quantity": item.quantity,
                        "name": item.name,
                    }));
                });

                Ok(json!({
                    "id": order.0.id,
                    "supplierId": order.0.supplier_id,
                    "createdAt": order.0.created_at,
                    "status": order.0.status,
                    "fullname": order.1.unwrap().full_name,
                    "items": result,
                }))
            }
            None => Err(DbErr::RecordNotFound(String::from("no order"))),
        }
    }
    //
}
