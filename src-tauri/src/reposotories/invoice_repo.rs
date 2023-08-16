use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{Client, Invoice, InvoiceItem, NewInvoice, Product};
use crate::schema;

pub fn get_invoices(page: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let offset = (page - 1) * 17;

    let result = schema::invoices::table
        .inner_join(schema::clients::table.on(schema::invoices::client_id.eq(schema::clients::id)))
        .select((schema::invoices::all_columns, schema::clients::all_columns))
        .order(schema::invoices::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<(Invoice, Client)>(connection)
        .expect("Error fetching invoices with clients");

    result
        .into_iter()
        .map(|(invoice, client)| {
            let invoice_items: Vec<(InvoiceItem, Product)> = schema::invoice_items::table
                .inner_join(
                    schema::products::table
                        .on(schema::invoice_items::product_id.eq(schema::products::id)),
                )
                .select((
                    schema::invoice_items::all_columns,
                    schema::products::all_columns,
                ))
                .filter(schema::invoice_items::invoice_id.eq(invoice.id))
                .load::<(InvoiceItem, Product)>(connection)
                .expect("Error fetching invoice items with products");

            let invoice_items_json = json!({
                "invoiceItems": invoice_items.into_iter().map(|(item, product)| {
                    json!({
                        "id": item.id,
                        "quantity": item.quantity,
                        "product_id": item.product_id,
                        "inventory_id": item.inventory_id,
                        "product": {
                            "id": product.id,
                            "name": product.name,
                            "price": product.price
                        }
                    })
                }).collect::<Vec<_>>()
            });

            json!({
                "id": invoice.id,
                "status": invoice.status,
                "created_at": invoice.created_at,
                "client_id": invoice.client_id,
                "client": {
                    "id": client.id,
                    "fullname": client.fullname
                },
                "invoiceItems": invoice_items_json["invoiceItems"]
            })
        })
        .collect::<Vec<_>>()
}

pub fn get_invoice(i_id: i32, connection: &mut SqliteConnection) -> Invoice {
    let result = schema::invoices::dsl::invoices
        .find(&i_id)
        .first::<Invoice>(connection)
        .expect("Error fetching invoice");

    result
}

pub fn insert_invoice(new_i: NewInvoice, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::invoices::dsl::invoices)
        .values(new_i)
        .execute(connection)
        .expect("Error adding invoice");

    result
}

pub fn delete_invoice(i_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::invoices::dsl::invoices.find(&i_id))
        .execute(connection)
        .expect("Error deleting invoice");

    result
}

pub fn update_invoice(i_update: Invoice, i_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::update(schema::invoices::dsl::invoices.find(&i_id))
        .set((
            schema::invoices::total.eq(i_update.total),
            schema::invoices::status.eq(i_update.status),
            // Add other fields here if needed
        ))
        .execute(connection)
        .expect("Error updating invoice");

    result
}
