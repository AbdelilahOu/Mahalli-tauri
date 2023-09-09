use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewOrderItem, OrderItem, UpdateOrderItem};
use crate::schema::order_items::{inventory_id, order_id, price, product_id, quantity};
use crate::schema::{order_items, orders};

pub fn get_order_items(page: i32, connection: &mut SqliteConnection) -> Value {
    let offset = (page - 1) * 17;

    let result = order_items::dsl::order_items
        .order(order_items::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<OrderItem>(connection)
        .expect("Error fetching all orders");

    let count: Vec<i64> = order_items::table
        .count()
        .get_results(connection)
        .expect("coudnt get the count");

    json!({
        "count": count[0],
        "data": result
    })
}

pub fn insert_order_item(new_oi: NewOrderItem, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(order_items::dsl::order_items)
        .values((
            product_id.eq(new_oi.product_id),
            order_id.eq(new_oi.order_id),
            quantity.eq(new_oi.quantity),
            price.eq(new_oi.price),
            inventory_id.eq(new_oi.inventory_id),
        ))
        .execute(connection)
        .expect("Error adding order");

    result
}

pub fn delete_order_item(oi_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(orders::dsl::orders.find(&oi_id))
        .execute(connection)
        .expect("Error deleting order");

    result
}

pub fn update_order_item(
    oi_update: UpdateOrderItem,
    oi_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(order_items::dsl::order_items.find(&oi_id))
        .set(order_items::quantity.eq(oi_update.quantity))
        .execute(connection)
        .expect("Error updating order");

    result
}
