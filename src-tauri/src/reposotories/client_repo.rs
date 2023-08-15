use crate::diesel::prelude::*;
use crate::models::{Client, NewClient};
use crate::schema;

// pub fn get_all_clients(connection: &mut SqliteConnection) -> Vec<Client> {
//     let result = schema::clients::dsl::clients
//         .load::<Client>(connection)
//         .expect("error get all clients");
//     result
// }

pub fn get_clients(page: i32, connection: &mut SqliteConnection) -> Vec<Client> {
    let offset = (page - 1) * 17;

    let result = schema::clients::dsl::clients
        .order(schema::clients::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<Client>(connection)
        .expect("error get all clients");
    result
}

pub fn get_client(c_id: i32, connection: &mut SqliteConnection) -> Client {
    let result = schema::clients::dsl::clients
        .find(&c_id)
        .first::<Client>(connection)
        .expect("error get all clients");

    result
}

pub fn insert_client(new_c: NewClient, connection: &mut SqliteConnection) -> Client {
    // insert
    diesel::insert_into(schema::clients::dsl::clients)
        .values(new_c)
        .execute(connection)
        .expect("Expect add client");
    // select last inserted row
    let result = schema::clients::dsl::clients
        .order_by(schema::clients::id.desc())
        .first::<Client>(connection)
        .expect("error get all clients");

    result
}

pub fn delete_client(c_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::clients::dsl::clients.find(&c_id))
        .execute(connection)
        .expect("Expect delete client");

    result
}

pub fn update_client(c_update: Client, c_id: i32, connection: &mut SqliteConnection) -> Client {
    diesel::update(schema::clients::dsl::clients.find(&c_id))
        .set((
            schema::clients::fullname.eq(c_update.fullname),
            schema::clients::email.eq(c_update.email),
            schema::clients::address.eq(c_update.address),
            schema::clients::image.eq(c_update.image),
        ))
        .execute(connection)
        .expect("Expect add client");

    let result = get_client(c_id, connection);

    result
}
