use serde_json::json;
use serde_json::Value;

use crate::diesel::prelude::*;
use crate::models::Client;
use crate::models::NewClient;
use crate::schema::clients;
use crate::schema::clients::*;

pub fn get_clients(page: i32, connection: &mut SqliteConnection) -> Vec<Client> {
    let offset = (page - 1) * 17;

    let result = clients::dsl::clients
        .order(clients::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<Client>(connection)
        .expect("error get all clients");

    result
}

pub fn get_all_clients(connection: &mut SqliteConnection) -> Vec<Value> {
    let response = clients::dsl::clients
        .order(clients::id.desc())
        .select((clients::fullname, clients::id))
        .load::<(String, i32)>(connection)
        .expect("error get all clients");

    let mut result: Vec<Value> = Vec::new();

    response.into_iter().for_each(|(fname, c_id)| {
        result.push(json!({
            "name":fname,
            "id":c_id
        }))
    });

    result
}

pub fn get_client(c_id: i32, connection: &mut SqliteConnection) -> Client {
    let result = clients::dsl::clients
        .find(&c_id)
        .first::<Client>(connection)
        .expect("error get all clients");

    result
}

pub fn insert_client(new_c: NewClient, connection: &mut SqliteConnection) -> Client {
    // insert
    diesel::insert_into(clients::dsl::clients)
        .values((
            fullname.eq(new_c.fullname),
            phone.eq(new_c.phone),
            email.eq(new_c.email),
            address.eq(new_c.address),
            image.eq(new_c.image),
        ))
        .execute(connection)
        .expect("Expect add client");
    // select last inserted row
    let result = clients::dsl::clients
        .order_by(clients::id.desc())
        .first::<Client>(connection)
        .expect("error get all clients");

    result
}

pub fn delete_client(c_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(clients::dsl::clients.find(&c_id))
        .execute(connection)
        .expect("Expect delete client");

    result
}

pub fn update_client(c_update: Client, c_id: i32, connection: &mut SqliteConnection) -> Client {
    diesel::update(clients::dsl::clients.find(&c_id))
        .set((
            clients::fullname.eq(c_update.fullname),
            clients::email.eq(c_update.email),
            clients::address.eq(c_update.address),
            clients::image.eq(c_update.image),
        ))
        .execute(connection)
        .expect("Expect add client");

    let result = get_client(c_id, connection);

    result
}
