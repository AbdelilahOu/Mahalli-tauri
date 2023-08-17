use crate::diesel::prelude::*;
use crate::models::{NewOrderItem, OrderItem};
use crate::schema::{order_items, orders};

pub fn get_order_items(page: i32, connection: &mut SqliteConnection) -> Vec<OrderItem> {
    let offset = (page - 1) * 17;

    let result = order_items::dsl::order_items
        .order(order_items::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<OrderItem>(connection)
        .expect("Error fetching all orders");

    result
}

pub fn insert_order_item(new_oi: NewOrderItem, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(order_items::dsl::order_items)
        .values(new_oi)
        .execute(connection)
        .expect("Error adding order");

    result
}

// pub fn get_order_item_by_order_id(o_id: i32, connection: &mut SqliteConnection) -> OrderItem {
//     let result = order_items::dsl::order_items
//         .load::<OrderItem>(connection)
//         .expect("Error fetching all orders");

//     result
// }

pub fn delete_order_item(oi_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(orders::dsl::orders.find(&oi_id))
        .execute(connection)
        .expect("Error deleting order");

    result
}

pub fn update_order_item(
    oi_update: OrderItem,
    oi_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(order_items::dsl::order_items.find(&oi_id))
        .set(order_items::quantity.eq(oi_update.quantity))
        .execute(connection)
        .expect("Error updating order");

    result
}
