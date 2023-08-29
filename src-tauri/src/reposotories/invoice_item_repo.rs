use crate::diesel::prelude::*;
use crate::models:: UpdateInvoiceItem;
use crate::models::NewInvoiceItem;
use crate::models::InvoiceItem;
use crate::schema::invoices;
use crate::schema::invoice_items;

pub fn get_invoice_items(page: i32, connection: &mut SqliteConnection) -> Vec<InvoiceItem> {
    let offset = (page - 1) * 17;

    let result = invoice_items::dsl::invoice_items
        .order(invoice_items::id.desc())
        .limit(17)
        .offset(offset as i64)
        .load::<InvoiceItem>(connection)
        .expect("Error fetching all invoices item");
    result
}

pub fn insert_invoice_item(
    new_ii: NewInvoiceItem,
    connection: &mut SqliteConnection,
) -> InvoiceItem {
    diesel::insert_into(invoice_items::dsl::invoice_items)
        .values(new_ii)
        .execute(connection)
        .expect("Error adding invoice items");

    let result = invoice_items::dsl::invoice_items
        .order(invoice_items::id.desc())
        .first::<InvoiceItem>(connection)
        .expect("Error fetching all invoices items");

    result
}

pub fn delete_invoice_item(ii_id: i32, connection: &mut SqliteConnection) -> usize {
    let result = diesel::delete(invoices::dsl::invoices.find(&ii_id))
        .execute(connection)
        .expect("Error deleting invoice itesm");

    result
}

pub fn update_invoice_item(
    ii_update: UpdateInvoiceItem,
    ii_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result = diesel::update(invoice_items::dsl::invoice_items.find(&ii_id))
        .set(invoice_items::quantity.eq(ii_update.quantity))
        .execute(connection)
        .expect("Error updating invoice item");

    result
}
