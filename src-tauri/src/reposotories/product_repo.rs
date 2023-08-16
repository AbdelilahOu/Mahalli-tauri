use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product, ProductWithQuantity};
use crate::schema;

pub fn get_products(page: i32, connection: &mut SqliteConnection) -> Vec<ProductWithQuantity> {
    let offset = (page - 1) * 17;

    let result = schema::products::table
        .left_join(
            schema::inventory_mouvements::table
                .on(schema::products::id.eq(schema::inventory_mouvements::product_id)),
        )
        .select((
            schema::products::id,
            schema::products::name,
            schema::products::image,
            schema::products::description,
            schema::products::price,
            schema::products::tva,
            diesel::dsl::sql::<diesel::sql_types::BigInt>(
                "COALESCE(SUM(stock_mouvements.quantity), 0) AS quantity",
            ),
        ))
        .group_by(schema::products::id)
        .order(schema::products::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<ProductWithQuantity>(connection)
        .expect("error get all products");

    result
}

pub fn get_product(p_id: i32, connection: &mut SqliteConnection) -> Product {
    let result = schema::products::dsl::products
        .find(&p_id)
        .first::<Product>(connection)
        .expect("error get all products");

    result
}
pub fn insert_product(new_p: NewProduct, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::products::dsl::products)
        .values(new_p)
        .execute(connection)
        .expect("Expect add articles");

    result
}

pub fn delete_product(p_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::products::dsl::products.find(&p_id))
        .execute(connection)
        .expect("Expect delete channel");

    result
}
pub fn update_product(p_update: Product, p_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(schema::products::dsl::products.find(&p_id))
        .set((
            schema::products::tva.eq(p_update.tva),
            schema::products::name.eq(p_update.name),
            schema::products::price.eq(p_update.price),
            schema::products::image.eq(p_update.image),
            schema::products::description.eq(p_update.description),
        ))
        .execute(connection)
        .expect("Expect add articles");

    result
}
