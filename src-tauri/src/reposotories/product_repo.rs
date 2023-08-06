use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product};
use crate::schema;

pub fn get_products() -> Vec<Product> {
    let mut connection = establish_connection();
    let result = schema::products::dsl::products
        .load::<Product>(&mut connection)
        .expect("error get all products");
    result
}

pub fn get_product(product_id: i32) -> Product {
    let mut connection = establish_connection();
    let result = schema::products::dsl::products
        .find(&product_id)
        .first::<Product>(&mut connection)
        .expect("error get all products");

    result
}
pub fn create_product(new_product: NewProduct) -> usize {
    let mut connection = establish_connection();

    let result = diesel::insert_into(schema::products::dsl::products)
        .values(new_product)
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}

pub fn delete_product(product_id: i32) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::products::dsl::products.find(&product_id))
        .execute(&mut connection)
        .expect("Expect delete channel");

    result
}
pub fn update_product(to_be_updated: Product, product_id: i32) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(schema::products::dsl::products.find(&product_id))
        .set((
            schema::products::tva.eq(to_be_updated.tva),
            schema::products::name.eq(to_be_updated.name),
            schema::products::price.eq(to_be_updated.price),
            schema::products::image.eq(to_be_updated.image),
            schema::products::description.eq(to_be_updated.description),
        ))
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}
