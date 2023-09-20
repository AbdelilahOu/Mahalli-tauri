use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product, ProductWithQuantity};
use crate::schema::products::{description, image, name, price, tva};
use crate::schema::{inventory_mouvements, products};

pub fn get_products(page: i32, connection: &mut SqliteConnection) -> Value {
    let offset = (page - 1) * 17;

    let result = products::table
        .left_join(
            inventory_mouvements::table.on(products::id.eq(inventory_mouvements::product_id)),
        )
        .select((
            products::id,
            products::name,
            products::image,
            products::description,
            products::price,
            products::tva,
            diesel::dsl::sql::<diesel::sql_types::BigInt>(
                "COALESCE(SUM(inventory_mouvements.quantity), 0) AS quantity",
            ),
        ))
        .group_by(products::id)
        .order(products::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<ProductWithQuantity>(connection)
        .expect("error get all products");

    let count: Vec<i64> = products::table
        .count()
        .get_results(connection)
        .expect("coudnt get the count");

    json!({
        "count": count[0],
        "data": result
    })
}

pub fn get_all_products(connection: &mut SqliteConnection) -> Vec<Value> {
    let response = products::dsl::products
        .order(products::id.desc())
        .select((products::name, products::id))
        .load::<(String, i32)>(connection)
        .expect("error get all products");

    let mut result: Vec<Value> = Vec::new();

    response.into_iter().for_each(|(pname, p_id)| {
        result.push(json!({
            "name":pname,
            "id":p_id
        }))
    });

    result
}

pub fn get_product(p_id: i32, connection: &mut SqliteConnection) -> Product {
    let result = products::dsl::products
        .find(&p_id)
        .first::<Product>(connection)
        .expect("error get all products");

    result
}
pub fn insert_product(new_p: NewProduct, connection: &mut SqliteConnection) -> i32 {
    diesel::insert_into(products::dsl::products)
        .values((
            description.eq(new_p.description),
            name.eq(new_p.name),
            price.eq(new_p.price),
            tva.eq(new_p.tva),
            image.eq(new_p.image),
        ))
        .execute(connection)
        .expect("Expect add articles");

    // select last inserted row
    let result = products::dsl::products
        .order_by(products::id.desc())
        .select(products::id)
        .first::<i32>(connection)
        .expect("error get all products");

    result
}

pub fn delete_product(p_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(products::dsl::products.find(&p_id))
        .execute(connection)
        .expect("Expect delete channel");

    result
}
pub fn update_product(p_update: Product, p_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(products::dsl::products.find(&p_id))
        .set((
            products::tva.eq(p_update.tva),
            products::name.eq(p_update.name),
            products::price.eq(p_update.price),
            products::image.eq(p_update.image),
            products::description.eq(p_update.description),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
