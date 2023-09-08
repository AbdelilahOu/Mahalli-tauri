use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::models::{Client, Invoice, InvoiceItem, NewInvoice, Product, UpdateInvoice};
use crate::schema::invoices::{client_id, status};
use crate::schema::{clients, invoice_items, invoices, products};

pub fn get_invoices(page: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let offset = (page - 1) * 17;

    let result = invoices::table
        .inner_join(clients::table.on(invoices::client_id.eq(clients::id)))
        .select((invoices::all_columns, clients::all_columns))
        .order(invoices::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<(Invoice, Client)>(connection)
        .expect("Error fetching invoices with clients");

    result
        .into_iter()
        .map(|(invoice, client)| {
            let invoice_items: Vec<(InvoiceItem, Product)> = invoice_items::table
                .inner_join(products::table.on(invoice_items::product_id.eq(products::id)))
                .select((invoice_items::all_columns, products::all_columns))
                .filter(invoice_items::invoice_id.eq(invoice.id))
                .load::<(InvoiceItem, Product)>(connection)
                .expect("Error fetching invoice items with products");

            let mut total = 0;

            let invoice_items_json = json!({
                "invoice_items": invoice_items.into_iter().map(|(item, product)| {
                    total += item.quantity * product.price as i64;
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
                "total": total,
                "client": {
                    "id": client.id,
                    "fullname": client.fullname
                },
                "invoice_items": invoice_items_json["invoice_items"]
            })
        })
        .collect::<Vec<_>>()
}

pub fn get_invoice(i_id: i32, connection: &mut SqliteConnection) -> Value {
    let result = invoices::table
        .inner_join(clients::table.on(invoices::client_id.eq(clients::id)))
        .filter(invoices::id.eq(i_id))
        .select((invoices::all_columns, clients::all_columns))
        .load::<(Invoice, Client)>(connection)
        .expect("Error fetching invoices with clients");

    let (invoice, client) = result.first().unwrap();

    let invoice_items: Vec<(InvoiceItem, Product)> = invoice_items::table
        .inner_join(products::table.on(invoice_items::product_id.eq(products::id)))
        .select((invoice_items::all_columns, products::all_columns))
        .filter(invoice_items::invoice_id.eq(invoice.id))
        .load::<(InvoiceItem, Product)>(connection)
        .expect("Error fetching invoice items with products");

    let invoice_items_json = json!({
        "invoice_items": invoice_items.into_iter().map(|(item, product)| {
            json!({
                "id": item.id,
                "quantity": item.quantity,
                "product_id": item.product_id,
                "invoice_id": item.invoice_id,
                "inventory_id": item.inventory_id,
                "product": product
            })
        }).collect::<Vec<_>>()
    });

    json!({
        "id": invoice.id,
        "status": invoice.status,
        "created_at": invoice.created_at,
        "client_id": invoice.client_id,
        "client": client,
        "invoice_items": invoice_items_json["invoice_items"]
    })
}

pub fn insert_invoice(new_i: NewInvoice, connection: &mut SqliteConnection) -> i32 {
    diesel::insert_into(invoices::dsl::invoices)
        .values((status.eq(new_i.status), client_id.eq(new_i.client_id)))
        .execute(connection)
        .expect("Error adding invoice");

    let result = invoices::dsl::invoices
        .order_by(invoices::id.desc())
        .select(invoices::id)
        .first::<i32>(connection)
        .expect("error get all invoices");

    result
}

pub fn delete_invoice(i_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(invoices::dsl::invoices.find(&i_id))
        .execute(connection)
        .expect("Error deleting invoice");

    result
}

pub fn update_invoice(
    i_update: UpdateInvoice,
    i_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(invoices::dsl::invoices.find(&i_id))
        .set((
            invoices::status.eq(i_update.status),
            // Add other fields here if needed
        ))
        .execute(connection)
        .expect("Error updating invoice");

    result
}
