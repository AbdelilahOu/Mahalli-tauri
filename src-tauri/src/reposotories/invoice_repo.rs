use crate::diesel::prelude::*;
use crate::models::{Invoice, NewInvoice};
use crate::schema;

pub fn get_invoices(page: i32, connection: &mut SqliteConnection) -> Vec<Invoice> {
    let offset = (page - 1) * 17;

    let result = schema::invoices::dsl::invoices
        .order(schema::invoices::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<Invoice>(connection)
        .expect("Error fetching all invoices");
    result
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
