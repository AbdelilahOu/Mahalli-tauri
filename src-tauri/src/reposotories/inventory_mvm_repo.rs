use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::InventoryMvm;
use crate::models::NewInventoryMvm;
use crate::models::Product;
use crate::models::UpdateInventoryMvm;
use crate::schema::inventory_mouvements;
use crate::schema::invoice_items;
use crate::schema::order_items;
use crate::schema::products;

pub fn get_inventory(page: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let offset = (page - 1) * 17;

    let result = inventory_mouvements::table
        .inner_join(products::table.on(inventory_mouvements::product_id.eq(products::id)))
        .select((inventory_mouvements::all_columns, products::all_columns))
        .order(inventory_mouvements::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<(InventoryMvm, Product)>(connection)
        .expect("Error fetching invoices with clients");

    result
        .into_iter()
        // .map(|(mvm, product, oi, ii)| {
        .map(|(mvm, product)| {
            let invoice_items: Vec<i32> = invoice_items::dsl::invoice_items
                .filter(invoice_items::inventory_id.eq(mvm.id))
                .select(invoice_items::invoice_id)
                .load::<i32>(connection)
                .expect("Error fetching all invoices");

            let order_items: Vec<(i32, Option<f32>)> = order_items::dsl::order_items
                .filter(order_items::inventory_id.eq(mvm.id))
                .select((order_items::order_id, order_items::price))
                .load::<(i32, Option<f32>)>(connection)
                .expect("Error fetching all orders");

            let ii = invoice_items.first();
            let oi = order_items.first();

            json!({
                "id": mvm.id,
                "date": mvm.date,
                "model": mvm.model,
                "quantity": mvm.quantity,
                "orderItem": json!({
                    "order_id": if oi.is_some() { oi.unwrap().0 } else { 0 },
                    "price": if oi.is_some() { oi.unwrap().1.unwrap_or(0.0) } else { 0.0 }
                }),
                "invoiceItem": json!({
                    "invoice_id": if ii.is_some() { ii.unwrap() } else { &0 },
            }),
                "product_id": mvm.product_id,
                "product": json!({
                    "name": product.name,
                    "price": product.price
                })
            })
        })
        .collect::<Vec<Value>>()
}

pub fn insert_inventory_mvm(new_im: NewInventoryMvm, connection: &mut SqliteConnection) -> i32 {
    diesel::insert_into(inventory_mouvements::dsl::inventory_mouvements)
        .values(new_im)
        .execute(connection)
        .expect("Error adding inventory");

    let result = inventory_mouvements::dsl::inventory_mouvements
        .order_by(inventory_mouvements::id.desc())
        .select(inventory_mouvements::id)
        .first::<i32>(connection)
        .expect("error get all inventory_mouvements");

    result
}

pub fn delete_inventory_mvm(mvm_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
        .execute(connection)
        .expect("Error deleting inventory");

    result
}

pub fn update_inventory_mvm(
    mvm_update: UpdateInventoryMvm,
    mvm_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
        .set(inventory_mouvements::quantity.eq(mvm_update.quantity))
        .execute(connection)
        .expect("Error updating inventory");

    result
}
