use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product, ProductWithQuantity};
use crate::schema::products::{description, id, image, name, price, tva};
use crate::schema::{inventory_mouvements, products};
use crate::types::TProduct;

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
                "COALESCE(SUM(CASE WHEN inventory_mouvements.model = 'IN' THEN inventory_mouvements.quantity WHEN inventory_mouvements.model = 'OUT' THEN -inventory_mouvements.quantity END), 0) AS quantity",
            ),
        ))
        .group_by(products::id)
        .order(products::created_at.desc())
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
        .load::<(String, String)>(connection)
        .expect("error get all products");

    let mut result: Vec<Value> = Vec::new();

    response.into_iter().for_each(|(pname, p_id)| {
        result.push(json!({
            "label": pname,
            "value": format!("{}",p_id)
        }))
    });

    result
}

pub fn get_product(p_id: String, connection: &mut SqliteConnection) -> Product {
    let result = products::dsl::products
        .find(&p_id)
        .first::<Product>(connection)
        .expect("error get all products");

    result
}
pub fn insert_product(product: NewProduct, connection: &mut SqliteConnection) -> String {
    diesel::insert_into(products::dsl::products)
        .values((
            id.eq(product.id.clone()),
            description.eq(product.description),
            name.eq(product.name),
            price.eq(product.price),
            tva.eq(product.tva),
            image.eq(product.image),
        ))
        .execute(connection)
        .expect("Expect add articles");

    product.id
}

pub fn delete_product(p_id: String, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(products::dsl::products.find(&p_id))
        .execute(connection)
        .expect("Expect delete channel");

    result
}
pub fn update_product(product: TProduct, p_id: String, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(products::dsl::products.find(&p_id))
        .set((
            products::tva.eq(product.tva),
            products::name.eq(product.name),
            products::price.eq(product.price),
            products::image.eq(product.image),
            products::description.eq(product.description),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
