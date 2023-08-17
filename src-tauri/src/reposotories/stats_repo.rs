use serde_json::{json, Value};

use crate::diesel::prelude::*;
use crate::schema::*;

pub fn get_best_three_client(connection: &mut SqliteConnection) -> Vec<Value> {
    let invoice_client_join = invoices::table.on(clients::id.eq(invoices::client_id));
    let invoiceitem_invoice_join =
        invoice_items::table.on(invoices::id.eq(invoice_items::invoice_id));
    let invoiceitem_product_join = products::table.on(invoice_items::product_id.eq(products::id));

    let result = clients::table
        .inner_join(invoice_client_join)
        .inner_join(invoiceitem_invoice_join)
        .inner_join(invoiceitem_product_join)
        .select((
            clients::fullname,
            diesel::dsl::sql::<diesel::sql_types::BigInt>(
                "SUM(products.price * ABS(invoice_items.quantity)) AS amount",
            ),
        ))
        .group_by(clients::fullname)
        .order(diesel::dsl::sql::<diesel::sql_types::BigInt>("amount DESC"))
        .limit(3)
        .load::<(String, i64)>(connection)
        .expect("Error fetching best three clients");

    result
        .iter()
        .map(|(name, amount)| {
            json!({
                "name":name,
                "amount":amount
            })
        })
        .collect::<Vec<Value>>()
}

pub fn get_best_three_seller(connection: &mut SqliteConnection) -> Vec<Value> {
    let order_seller_join = orders::table.on(sellers::id.eq(orders::seller_id));
    let orderitem_order_join = order_items::table.on(orders::id.eq(order_items::order_id));
    let orderitem_product_join = products::table.on(order_items::product_id.eq(products::id));

    let result = sellers::table
        .inner_join(order_seller_join)
        .inner_join(orderitem_order_join)
        .inner_join(orderitem_product_join)
        .select((
            sellers::name,
            diesel::dsl::sql::<diesel::sql_types::BigInt>(
                "SUM(products.price * ABS(order_items.quantity)) AS amount",
            ),
        ))
        .group_by(sellers::name)
        .order(diesel::dsl::sql::<diesel::sql_types::BigInt>("amount DESC"))
        .limit(3)
        .load::<(String, i64)>(connection)
        .expect("Error fetching best three sellers");

    result
        .iter()
        .map(|(name, amount)| {
            json!({
                "name":name,
                "amount":amount
            })
        })
        .collect::<Vec<Value>>()
}
