use crate::diesel::prelude::*;
use crate::models::{NewProduct, Product, ProductWithQuantity};
use crate::schema::{inventory_mouvements, products};

pub fn get_products(page: i32, connection: &mut SqliteConnection) -> Vec<ProductWithQuantity> {
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
                "COALESCE(SUM(stock_mouvements.quantity), 0) AS quantity",
            ),
        ))
        .group_by(products::id)
        .order(products::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<ProductWithQuantity>(connection)
        .expect("error get all products");

    result
}

pub fn get_product(p_id: i32, connection: &mut SqliteConnection) -> Product {
    let result = products::dsl::products
        .find(&p_id)
        .first::<Product>(connection)
        .expect("error get all products");

    result
}
pub fn insert_product(new_p: NewProduct, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(products::dsl::products)
        .values(new_p)
        .execute(connection)
        .expect("Expect add articles");

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
