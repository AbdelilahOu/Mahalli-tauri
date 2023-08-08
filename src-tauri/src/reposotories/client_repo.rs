use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{Client, NewClient};
use crate::schema;

pub fn get_clients() -> Vec<Client> {
    let mut connection = establish_connection();
    let result = schema::clients::dsl::clients
        .load::<Client>(&mut connection)
        .expect("error get all clients");
    result
}

pub fn get_client(product_id: i32) -> Client {
    let mut connection = establish_connection();
    let result = schema::clients::dsl::clients
        .find(&product_id)
        .first::<Client>(&mut connection)
        .expect("error get all clients");

    result
}
pub fn insert_client(new_client: NewClient) -> usize {
    let mut connection = establish_connection();
    let result = diesel::insert_into(schema::clients::dsl::clients)
        .values(new_client)
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}

pub fn delete_client(product_id: i32) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::clients::dsl::clients.find(&product_id))
        .execute(&mut connection)
        .expect("Expect delete channel");

    result
}
pub fn update_client(to_be_updated: Client, product_id: i32) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(schema::clients::dsl::clients.find(&product_id))
        .set((
            schema::clients::fullname.eq(to_be_updated.fullname),
            schema::clients::email.eq(to_be_updated.email),
            schema::clients::address.eq(to_be_updated.address),
            schema::clients::image.eq(to_be_updated.image),
        ))
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}
