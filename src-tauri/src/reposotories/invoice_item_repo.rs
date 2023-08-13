use crate::diesel::prelude::*;
use crate::models::{InvoiceItem, NewInvoiceItem};
use crate::schema;

pub fn get_invoice_items(connection: &mut SqliteConnection) -> Vec<InvoiceItem> {
    let result = schema::invoice_items::dsl::invoice_items
        .load::<InvoiceItem>(connection)
        .expect("Error fetching all invoices");
    result
}

// pub fn get_invoice_item(invoice_id: i32,connection: &mut SqliteConnection) -> InvoiceItem {
//
//     let result = schema::invoices::dsl::invoices
//         .find(&invoice_id)
//         .first::<InvoiceItem>( connection)
//         .expect("Error fetching invoice");

//     result
// }

pub fn insert_invoice_item(new_ii: NewInvoiceItem, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::invoice_items::dsl::invoice_items)
        .values(new_ii)
        .execute(connection)
        .expect("Error adding invoice");

    result
}

pub fn delete_invoice_item(invoice_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(schema::invoices::dsl::invoices.find(&invoice_id))
        .execute(connection)
        .expect("Error deleting invoice");

    result
}

pub fn update_invoice_item(
    i_update: InvoiceItem,
    i_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(schema::invoice_items::dsl::invoice_items.find(&i_id))
        .set(schema::invoice_items::quantity.eq(i_update.quantity))
        .execute(connection)
        .expect("Error updating invoice");

    result
}
