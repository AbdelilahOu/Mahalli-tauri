use serde_json::{json, Value};

use crate::diesel::dsl::sql;
use crate::diesel::prelude::*;
use crate::diesel::sql_types::{BigInt, Text};
use crate::schema::{
    clients, inventory_mouvements, invoice_items, invoices, order_items, orders, products, sellers,
};

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
            sql::<BigInt>("SUM(products.price * ABS(invoice_items.quantity)) AS amount"),
        ))
        .group_by(clients::fullname)
        .order(sql::<BigInt>("amount DESC"))
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
            sql::<BigInt>("SUM(products.price * ABS(order_items.quantity)) AS amount"),
        ))
        .group_by(sellers::name)
        .order(sql::<BigInt>("amount DESC"))
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

pub fn get_inventory_stats(connection: &mut SqliteConnection) -> Vec<Value> {
    let select_date = sql::<Text>("strftime('%Y-%m', date) AS group_month");

    let result = inventory_mouvements::table
        .select((
            select_date.clone(),
            sql::<BigInt>("SUM(CASE WHEN model = 'IN' THEN ABS(quantity) ELSE 0 END) AS total_in"),
            sql::<BigInt>(
                "SUM(CASE WHEN model = 'OUT' THEN ABS(quantity) ELSE 0 END) AS total_out",
            ),
        ))
        .group_by(sql::<Text>("group_month"))
        .order_by(inventory_mouvements::id.desc())
        .limit(3)
        .load::<(String, i64, i64)>(connection)
        .expect("Error fetching inventory stats");

    let mut final_result = Vec::<Value>::new();

    result.iter().for_each(|(date, total_in, total_out)| {
        final_result.push(json!({
            "group_month":date,
            "total_in":total_in,
            "total_out":total_out
        }))
    });

    final_result
}

pub fn get_client_details(id: i32, connection: &mut SqliteConnection) -> Vec<Value> {
    let invoice_client_join = invoices::table.on(clients::id.eq(invoices::client_id));
    let invoiceitem_invoice_join =
        invoice_items::table.on(invoices::id.eq(invoice_items::invoice_id));
    let invoiceitem_product_join = products::table.on(invoice_items::product_id.eq(products::id));

    let result = clients::table
        .inner_join(invoice_client_join)
        .inner_join(invoiceitem_invoice_join)
        .inner_join(invoiceitem_product_join)
        .select((
            products::name,
            sql::<Text>("strftime('%Y-%m', i.created_at) AS month"),
            sql::<BigInt>("ABS(COALESCE(SUM(ii.quantity), 0)) AS quantity"),
        ))
        .load::<(String, String, i64)>(connection)
        .expect("Error fetching best three clients");

    let mut final_result = Vec::<Value>::new();

    result.iter().for_each(|(name, month, quantity)| {
        // groups by month and sum the quantity
        final_result.push(json!({
            "name":name,
            "month":month,
            "quantity":quantity
        }))
    });

    final_result
}
