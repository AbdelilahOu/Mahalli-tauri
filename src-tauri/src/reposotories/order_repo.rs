use crate::diesel::prelude::*;
use crate::models::{NewOrder, Order};
use crate::schema;

pub fn get_orders(page: i32, connection: &mut SqliteConnection) -> Vec<Order> {
    let offset = (page - 1) * 17;

    let result = schema::orders::dsl::orders
        .order(schema::orders::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<Order>(connection)
        .expect("Error fetching all orders");
    result
}

pub fn get_order(i_id: i32, connection: &mut SqliteConnection) -> Order {
    let result = schema::orders::dsl::orders
        .find(&i_id)
        .first::<Order>(connection)
        .expect("Error fetching order");

    result
}

pub fn insert_order(new_i: NewOrder, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::orders::dsl::orders)
        .values(new_i)
        .execute(connection)
        .expect("Error adding order");

    result
}

pub fn delete_order(i_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::orders::dsl::orders.find(&i_id))
        .execute(connection)
        .expect("Error deleting order");

    result
}

pub fn update_order(i_update: Order, i_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(schema::orders::dsl::orders.find(&i_id))
        .set(schema::orders::status.eq(i_update.status))
        .execute(connection)
        .expect("Error updating order");

    result
}
