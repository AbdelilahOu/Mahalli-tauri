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
pub fn insert_client(new_c: NewClient, connection: &mut SqliteConnection) -> usize {
    // let mut connection = establish_connection();
    let result = diesel::insert_into(schema::clients::dsl::clients)
        .values(new_c)
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
pub fn update_client(c_update: Client, c_id: i32, connection: &mut SqliteConnection) -> usize {
    // let mut connection = establish_connection();

    let result = diesel::update(schema::clients::dsl::clients.find(&c_id))
        .set((
            schema::clients::fullname.eq(c_update.fullname),
            schema::clients::email.eq(c_update.email),
            schema::clients::address.eq(c_update.address),
            schema::clients::image.eq(c_update.image),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
