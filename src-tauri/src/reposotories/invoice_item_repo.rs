use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{InvoiceItem, NewInvoiceItem};
use crate::schema;

pub fn get_invoice_items() -> Vec<InvoiceItem> {
    let mut connection = establish_connection();
    let result = schema::invoice_items::dsl::invoice_items
        .load::<InvoiceItem>(&mut connection)
        .expect("Error fetching all invoices");
    result
}

// pub fn get_invoice_item(invoice_id: i32) -> InvoiceItem {
//     let mut connection = establish_connection();
//     let result = schema::invoices::dsl::invoices
//         .find(&invoice_id)
//         .first::<InvoiceItem>(&mut connection)
//         .expect("Error fetching invoice");

//     result
// }

pub fn insert_invoice_item(new_invoice_item: NewInvoiceItem) -> usize {
    let mut connection = establish_connection();
    let result = diesel::insert_into(schema::invoices::dsl::invoices)
        .values(new_invoice_item)
        .execute(&mut connection)
        .expect("Error adding invoice");

    result
}

pub fn delete_invoice_item(invoice_id: i32) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::invoices::dsl::invoices.find(&invoice_id))
        .execute(&mut connection)
        .expect("Error deleting invoice");

    result
}

pub fn update_invoice_item(to_be_updated: InvoiceItem, invoice_id: i32) -> usize {
    let mut connection = establish_connection();

    let result = diesel::update(schema::invoices::dsl::invoices.find(&invoice_id))
        .set((
            schema::invoices::total.eq(to_be_updated.total),
            schema::invoices::status.eq(to_be_updated.status),
            // Add other fields here if needed
        ))
        .execute(&mut connection)
        .expect("Error updating invoice");

    result
}
