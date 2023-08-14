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

pub fn get_order(o_id: i32, connection: &mut SqliteConnection) -> Order {
    let result = schema::orders::dsl::orders
        .find(&o_id)
        .first::<Order>(connection)
        .expect("Error fetching order");

    result
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
