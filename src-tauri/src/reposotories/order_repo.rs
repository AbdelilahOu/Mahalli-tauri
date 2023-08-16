use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewOrder, Order, OrderItem, Product, Seller};
use crate::schema;

pub fn get_orders(page: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let offset = (page - 1) * 17;

    let result = schema::orders::table
        .inner_join(schema::sellers::table.on(schema::orders::seller_id.eq(schema::sellers::id)))
        .select((schema::orders::all_columns, schema::sellers::all_columns))
        .order(schema::orders::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<(Order, Seller)>(connection)
        .expect("Error fetching orders with sellers");

    result
        .into_iter()
        .map(|(order, seller)| {
            let order_items: Vec<(OrderItem, Product)> = schema::order_items::table
                .inner_join(
                    schema::products::table
                        .on(schema::order_items::product_id.eq(schema::products::id)),
                )
                .select((
                    schema::order_items::all_columns,
                    schema::products::all_columns,
                ))
                .filter(schema::order_items::order_id.eq(order.id))
                .load::<(OrderItem, Product)>(connection)
                .expect("Error fetching order items with products");

            let order_items_json = json!({
                "orderItems": order_items.into_iter().map(|(item, product)| {
                    json!({
                        "id": item.id,
                        "price": item.price,
                        "quantity": item.quantity,
                        "product_id": item.product_id,
                        "inventory_id": item.inventory_id,
                        "product": {
                            "id": product.id,
                            "name": product.name,
                            "price": product.price
                        }
                    })
                }).collect::<Vec<_>>()
            });

            json!({
                "id": order.id,
                "status": order.status,
                "created_at": order.created_at,
                "seller_id": order.seller_id,
                "seller": {
                    "id": seller.id,
                    "name": seller.name
                },
                "orderItems": order_items_json["orderItems"]
            })
        })
        .collect::<Vec<_>>()
}

pub fn get_order(o_id: i32, connection: &mut SqliteConnection) -> Value {
    let result = schema::orders::table
        .inner_join(schema::sellers::table.on(schema::orders::seller_id.eq(schema::sellers::id)))
        .inner_join(
            schema::order_items::table.on(schema::orders::id.eq(schema::order_items::order_id)),
        )
        .inner_join(
            schema::products::table.on(schema::order_items::product_id.eq(schema::products::id)),
        )
        .select((
            schema::orders::all_columns,
            schema::sellers::all_columns,
            schema::order_items::all_columns,
            schema::products::all_columns,
        ))
        .filter(schema::orders::id.eq(o_id))
        .load::<(Order, Seller, OrderItem, Product)>(connection)
        .expect("Error fetching order details");

    let (order, seller, order_items, _) = result[0].clone();

    let order_items_json = json!({
        "orderItems": order_items.into_iter().map(|order_item| {
            json!({
                "id": order_item.id,
                "price": order_item.price,
                "quantity": order_item.quantity,
                "product_id": order_item.product_id,
                "product": {
                    "id": order_item.product.id,
                    "name": order_item.product.name,
                    "description": order_item.product.description,
                    "price": order_item.product.price,
                    "tva": order_item.product.tva,
                    "image": order_item.product.image
                }
            })
        }).collect::<Vec<_>>()
    });

    json!({
        "id": order.id,
        "status": order.status,
        "created_at": order.created_at,
        "seller": {
            "id": seller.id,
            "name": seller.name,
            "phone": seller.phone,
            "email": seller.email,
            "address": seller.address,
            "image": seller.image
        },
        "orderItems": order_items_json["orderItems"]
    })
}

pub fn insert_order(new_o: NewOrder, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::orders::dsl::orders)
        .values(new_o)
        .execute(connection)
        .expect("Error adding order");

    result
}

pub fn delete_order(o_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::orders::dsl::orders.find(&o_id))
        .execute(connection)
        .expect("Error deleting order");

    result
}

pub fn update_order(o_update: Order, o_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(schema::orders::dsl::orders.find(&o_id))
        .set(schema::orders::status.eq(o_update.status))
        .execute(connection)
        .expect("Error updating order");

    result
}
