use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewUser, User};
use crate::schema::users::{self, email, password, role, username};

pub fn get_user(u_id: i32, connection: &mut SqliteConnection) -> Value {
    let result = users::dsl::users
        .find(&u_id)
        .first::<User>(connection)
        .expect("error get all users");

    let count: Vec<i64> = users::table
        .count()
        .get_results(connection)
        .expect("coudnt get the count");

    json!({
        "count": count[0],
        "data": result
    })
}
pub fn insert_user(new_user: NewUser, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(users::dsl::users)
        .values((
            username.eq(new_user.username),
            password.eq(new_user.password),
            email.eq(new_user.email),
            role.eq(new_user.role),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}

pub fn delete_user(u_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(users::dsl::users.find(&u_id))
        .execute(connection)
        .expect("Expect delete channel");

    result
}

pub fn update_user(u_update: User, u_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(users::dsl::users.find(&u_id))
        .set((
            users::username.eq(u_update.username),
            users::password.eq(u_update.password),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
