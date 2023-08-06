use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{NewUser, User};
use crate::schema;

pub fn get_user(product_id: i32) -> User {
    let mut connection = establish_connection();
    let result = schema::users::dsl::users
        .find(&product_id)
        .first::<User>(&mut connection)
        .expect("error get all users");

    result
}
pub fn create_user(new_user: NewUser) -> usize {
    let mut connection = establish_connection();
    let result = diesel::insert_into(schema::users::dsl::users)
        .values(new_user)
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}

pub fn delete_user(product_id: i32) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::users::dsl::users.find(&product_id))
        .execute(&mut connection)
        .expect("Expect delete channel");

    result
}

pub fn update_user(to_be_updated: User, product_id: i32) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(schema::users::dsl::users.find(&product_id))
        .set((
            schema::users::username.eq(to_be_updated.username),
            schema::users::password.eq(to_be_updated.password),
        ))
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}
