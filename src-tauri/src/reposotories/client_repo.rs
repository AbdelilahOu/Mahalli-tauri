use crate::diesel::prelude::*;
use crate::models::{Client, NewClient};
use crate::schema;

pub fn get_clients(connection: &mut SqliteConnection) -> Vec<Client> {
    // let mut connection = establish_connection();
    let result = schema::clients::dsl::clients
        .load::<Client>(connection)
        .expect("error get all clients");
    result
}

pub fn get_client(c_id: i32, connection: &mut SqliteConnection) -> Client {
    // let mut connection = establish_connection();
    let result = schema::clients::dsl::clients
        .find(&c_id)
        .first::<Client>(connection)
        .expect("error get all clients");

    result
}
pub fn insert_client(new_client: NewClient, connection: &mut SqliteConnection) -> usize {
    // let mut connection = establish_connection();
    let result = diesel::insert_into(schema::clients::dsl::clients)
        .values(new_client)
        .execute(connection)
        .expect("Expect add articles");

    result
}

pub fn delete_client(c_id: i32, connection: &mut SqliteConnection) -> usize {
    // let mut connection = establish_connection();
    let result = diesel::delete(schema::clients::dsl::clients.find(&c_id))
        .execute(connection)
        .expect("Expect delete channel");

    result
}
pub fn update_client(to_be_updated: Client, c_id: i32, connection: &mut SqliteConnection) -> usize {
    // let mut connection = establish_connection();

    let result = diesel::update(schema::clients::dsl::clients.find(&c_id))
        .set((
            schema::clients::fullname.eq(to_be_updated.fullname),
            schema::clients::email.eq(to_be_updated.email),
            schema::clients::address.eq(to_be_updated.address),
            schema::clients::image.eq(to_be_updated.image),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
