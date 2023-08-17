use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{InventoryMvm, InvoiceItem, NewInventoryMvm, OrderItem, Product};
use crate::schema;

pub fn get_inventory(page: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let offset = (page - 1) * 17;

    let result = schema::inventory_mouvements::table
        .inner_join(
            schema::products::table
                .on(schema::inventory_mouvements::product_id.eq(schema::products::id)),
        )
        .select((
            schema::inventory_mouvements::all_columns,
            schema::products::all_columns,
        ))
        .order(schema::inventory_mouvements::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<(InventoryMvm, Product)>(connection)
        .expect("Error fetching invoices with clients");

    result
        .into_iter()
        .map(|(mvm, product)| {
            let invoice_items = schema::invoice_items::dsl::invoice_items
                .filter(schema::invoice_items::inventory_id.eq(mvm.id))
                .load::<InvoiceItem>(connection)
                .expect("Error fetching all invoices");

            let order_items = schema::order_items::dsl::order_items
                .filter(schema::order_items::inventory_id.eq(mvm.id))
                .load::<OrderItem>(connection)
                .expect("Error fetching all orders");

            let mut final_result = Vec::<Value>::new();

            for oi in order_items {
                final_result.push(json!({
                    "id": mvm.id,
                    "date": mvm.date,
                    "model": mvm.model,
                    "quantity": mvm.quantity,
                    "orderItem": json!({
                        "order_id": oi.order_id,
                        "price": oi.price
                    }),
                    "invoiceItem": json!({
                        "invoice_id": 0
                    }),
                    "product_id": mvm.product_id,
                    "product": json!({
                        "name": product.name,
                        "price": product.price
                    })
                }));
            }

            for ii in invoice_items {
                final_result.push(json!({
                    "id": mvm.id,
                    "date": mvm.date,
                    "model": mvm.model,
                    "quantity": mvm.quantity,
                    "orderItem": json!({
                        "order_id": 0,
                        "price": 0
                    }),
                    "invoiceItem": json!({
                        "invoice_id": ii.invoice_id
                    }),
                    "product_id": mvm.product_id,
                    "product": json!({
                        "name": product.name,
                        "price": product.price
                    })
                }));
            }

            final_result.into()
        })
        .collect::<Vec<Value>>()
}

// pub fn get_inventory_mvm(mvm_id: i32,connection: &mut SqliteConnection) -> InventoryMvm {
//
//     let result = schema::inventory_mouvements::dsl::inventory_mouvements
//         .find(&mvm_id)
//         .first::<InventoryMvm>( connection)
//         .expect("Error fetching inventory");

//     result
// }

pub fn insert_inventory_mvm(new_ii: NewInventoryMvm, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::inventory_mouvements::dsl::inventory_mouvements)
        .values(new_ii)
        .execute(connection)
        .expect("Error adding inventory");

    result
}

pub fn delete_inventory_mvm(mvm_id: i32, connection: &mut SqliteConnection) -> usize {
    let result =
        diesel::delete(schema::inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
            .execute(connection)
            .expect("Error deleting inventory");

    result
}

pub fn update_inventory_mvm(
    mvm_update: InventoryMvm,
    mvm_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result =
        diesel::update(schema::inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
            .set(schema::inventory_mouvements::quantity.eq(mvm_update.quantity))
            .execute(connection)
            .expect("Error updating inventory");

    result
}
