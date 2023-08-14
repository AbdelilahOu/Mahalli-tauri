use crate::diesel::prelude::*;
use crate::models::{NewSeller, Seller};
use crate::schema;

pub fn get_sellers(page: i32, connection: &mut SqliteConnection) -> Vec<Seller> {
    let offset = (page - 1) * 17;

    let result = schema::sellers::dsl::sellers
        .order(schema::sellers::id.desc())
        .limit(17 as i64)
        .offset(offset as i64)
        .load::<Seller>(connection)
        .expect("error get all sellers");

    result
}

pub fn get_seller(s_id: i32, connection: &mut SqliteConnection) -> Seller {
    let result = schema::sellers::dsl::sellers
        .find(&s_id)
        .first::<Seller>(connection)
        .expect("error get all sellers");

    result
}

pub fn insert_seller(new_c: NewSeller, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::sellers::dsl::sellers)
        .values(new_c)
        .execute(connection)
        .expect("Expect add seller");

    result
}

pub fn delete_seller(s_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::sellers::dsl::sellers.find(&s_id))
        .execute(connection)
        .expect("Expect delete seller");

    result
}

pub fn update_seller(s_update: Seller, s_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(schema::sellers::dsl::sellers.find(&s_id))
        .set((
            schema::sellers::name.eq(s_update.name),
            schema::sellers::email.eq(s_update.email),
            schema::sellers::address.eq(s_update.address),
            schema::sellers::image.eq(s_update.image),
        ))
        .execute(connection)
        .expect("Expect update seller");

    result
}
