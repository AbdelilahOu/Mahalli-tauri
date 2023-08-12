use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{Invoice, NewInvoice};
use crate::schema;

pub fn get_invoices() -> Vec<Invoice> {
    let mut connection = establish_connection();
    let result = schema::invoices::dsl::invoices
        .load::<Invoice>(&mut connection)
        .expect("Error fetching all invoices");
    result
}

pub fn get_invoice(invoice_id: i32) -> Invoice {
    let mut connection = establish_connection();
    let result = schema::invoices::dsl::invoices
        .find(&invoice_id)
        .first::<Invoice>(&mut connection)
        .expect("Error fetching invoice");

    result
}

pub fn insert_invoice(new_invoice: NewInvoice) -> usize {
    let mut connection = establish_connection();
    let result = diesel::insert_into(schema::invoices::dsl::invoices)
        .values(new_invoice)
        .execute(&mut connection)
        .expect("Error adding invoice");

    result
}

pub fn delete_invoice(invoice_id: i64) -> usize {
    let mut connection = establish_connection();
    let result = diesel::delete(schema::invoices::dsl::invoices.find(&invoice_id))
        .execute(&mut connection)
        .expect("Error deleting invoice");

    result
}

pub fn update_invoice(to_be_updated: Invoice, invoice_id: i64) -> usize {
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
