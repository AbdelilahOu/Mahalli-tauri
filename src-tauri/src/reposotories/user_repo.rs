use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{NewUser, User};
use crate::schema;

pub fn get_user(u_id: i32, connection: &mut SqliteConnection) -> User {
    let mut connection = establish_connection();
    let result = schema::users::dsl::users
        .find(&u_id)
        .first::<User>(&mut connection)
        .expect("error get all users");

    result
}
pub fn insert_user(new_user: NewUser, connection: &mut SqliteConnection) -> usize {
    let mut connection = establish_connection();
    let result = diesel::insert_into(schema::users::dsl::users)
        .values(new_user)
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}

pub fn delete_user(u_id: i32, connection: &mut SqliteConnection) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::users::dsl::users.find(&u_id))
        .execute(&mut connection)
        .expect("Expect delete channel");

    result
}

pub fn update_user(u_update: User, u_id: i32, connection: &mut SqliteConnection) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(schema::users::dsl::users.find(&u_id))
        .set((
            schema::users::username.eq(u_update.username),
            schema::users::password.eq(u_update.password),
        ))
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}
