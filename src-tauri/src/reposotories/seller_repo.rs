use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewSeller, Seller};
use crate::schema::sellers::{self, address, email, image, name, phone};

pub fn get_sellers(page: i32, connection: &mut SqliteConnection) -> Value {
    let offset = (page - 1) * 17;

    let result = sellers::dsl::sellers
        .order(sellers::id.desc())
        .limit(17 as i64)
        .offset(offset as i64)
        .load::<Seller>(connection)
        .expect("error get all sellers");

    let count: Vec<i64> = sellers::table
        .count()
        .get_results(connection)
        .expect("coudnt get the count");

    json!({
        "count": count[0],
        "data": result
    })
}

pub fn get_all_sellers(connection: &mut SqliteConnection) -> Vec<Value> {
    let response = sellers::dsl::sellers
        .order(sellers::id.desc())
        .select((sellers::name, sellers::id))
        .load::<(String, i32)>(connection)
        .expect("error get all sellers");

    let mut result: Vec<Value> = Vec::new();

    response.into_iter().for_each(|(fname, c_id)| {
        result.push(json!({
            "label":fname,
            "value":c_id
        }))
    });

    result
}

pub fn get_seller(s_id: i32, connection: &mut SqliteConnection) -> Seller {
    let result = sellers::dsl::sellers
        .find(&s_id)
        .first::<Seller>(connection)
        .expect("error get all sellers");

    result
}

pub fn insert_seller(new_c: NewSeller, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(sellers::dsl::sellers)
        .values((
            name.eq(new_c.name),
            image.eq(new_c.image),
            address.eq(new_c.address),
            email.eq(new_c.email),
            phone.eq(new_c.phone),
        ))
        .execute(connection)
        .expect("Expect add seller");

    result
}

pub fn delete_seller(s_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(sellers::dsl::sellers.find(&s_id))
        .execute(connection)
        .expect("Expect delete seller");

    result
}

pub fn update_seller(s_update: Seller, s_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(sellers::dsl::sellers.find(&s_id))
        .set((
            sellers::name.eq(s_update.name),
            sellers::email.eq(s_update.email),
            sellers::address.eq(s_update.address),
            sellers::image.eq(s_update.image),
        ))
        .execute(connection)
        .expect("Expect update seller");

    result
}
