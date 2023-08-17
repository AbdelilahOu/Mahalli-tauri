// use crate::diesel::prelude::*;
// use crate::models::{Client, NewClient};
// use crate::schema::*;

// pub fn get_best_three_client(connection: &mut SqliteConnection) {
//     let invoice_client_join = invoices::table.on(clients::id.eq(invoices::client_id));
//     let invoiceitem_invoice_join =
//         invoice_items::table.on(invoices::id.eq(invoice_items::invoice_id));
//     let invoiceitem_product_join = products::table.on(invoice_items::product_id.eq(products::id));

//     let result = clients::table
//         .inner_join(invoice_client_join)
//         .inner_join(invoiceitem_invoice_join)
//         .inner_join(invoiceitem_product_join)
//         .select((
//             clients::fullname,
//             diesel::dsl::sql::<diesel::sql_types::BigInt>(
//                 "SUM(products.price * ABS(invoice_items.quantity)) AS amount",
//             ),
//         ))
//         .group_by(clients::fullname)
//         .order(diesel::dsl::sql::<diesel::sql_types::BigInt>("amount DESC"))
//         .limit(3)
//         .load(connection)
//         .expect("Error fetching best three clients");
// }

// pub fn client_daily_expenses(a_week: String, connection: &mut SqliteConnection) {
//     invoices::table
//         .inner_join(invoice_items::table.on(invoices::id.eq(invoice_items::invoice_id)))
//         .inner_join(products::table.on(invoice_items::product_id.eq(products::id)))
//         .filter(invoices::client_id.eq(clients::id))
//         .filter(invoices::created_at.gt(a_week))
//         .select((
//             diesel::dsl::sql::<diesel::sql_types::Date>(
//                 "strftime('%Y-%m-%d', invoices.created_at) AS day",
//             ),
//             diesel::dsl::sql::<diesel::sql_types::BigInt>(
//                 "SUM(products.price * ABS(invoice_items.quantity)) AS expense",
//             ),
//         ))
//         .group_by(diesel::dsl::sql::<diesel::sql_types::Date>("day"))
//         .order(diesel::dsl::sql::<diesel::sql_types::Date>("day"))
//         .limit(7)
//         .load(connection)
//         .expect("Error fetching client daily expenses");
// }
