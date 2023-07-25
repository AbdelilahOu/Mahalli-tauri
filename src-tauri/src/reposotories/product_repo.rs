use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product};
use crate::schema::{products::dsl::products, products::*};

pub fn get_products() -> Vec<Product> {
    let mut connection = establish_connection();
    let result = products
        .load::<Product>(&mut connection)
        .expect("error get all products");
    result
}

pub fn get_product(product_id: i32) -> Product {
    let mut connection = establish_connection();
    let result = products
        .find(&product_id)
        .first::<Product>(&mut connection)
        .expect("error get all products");

    result
}
pub fn create_product(new_product: NewProduct) -> usize {
    let mut connection = establish_connection();

    let result = diesel::insert_into(products)
        .values(new_product)
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}

pub fn delete_product(product_id: i32) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(products.find(&product_id))
        .execute(&mut connection)
        .expect("Expect delete channel");

    result
}
pub fn update_product(to_be_updated: Product, product_id: i32) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(products.find(&product_id))
        .set((
            tva.eq(to_be_updated.tva),
            name.eq(to_be_updated.name),
            price.eq(to_be_updated.price),
            image.eq(to_be_updated.image),
            description.eq(to_be_updated.description),
        ))
        .execute(&mut connection)
        .expect("Expect add articles");

    result
}
