use super::schema::*;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;

#[derive(Debug, Deserialize, Serialize)]
pub enum TableRecord {
    Order(Vec<OrderRecord>),
    Client(Vec<ClientRecord>),
    Seller(Vec<SellerRecord>),
    Product(Vec<ProductRecord>),
    Invoice(Vec<InvoiceRecord>),
    OrderItem(Vec<OrderItemRecord>),
    InvoiceItem(Vec<InvoiceItemRecord>),
    StockMouvement(Vec<StockMouvementRecord>),
}

#[tauri::command]
pub fn get_csv_records(csv_path: String, table: Option<String>) -> Result<TableRecord, String> {
    match table {
        Some(a) => {
            let records = match a.as_str() {
                "clients" => match read_csv::<ClientRecord>(csv_path) {
                    Ok(r) => TableRecord::Client(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "sellers" => match read_csv::<SellerRecord>(csv_path) {
                    Ok(r) => TableRecord::Seller(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "products" => match read_csv::<ProductRecord>(csv_path) {
                    Ok(r) => TableRecord::Product(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "invoices" => match read_csv::<InvoiceRecord>(csv_path) {
                    Ok(r) => TableRecord::Invoice(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "orders" => match read_csv::<OrderRecord>(csv_path) {
                    Ok(r) => TableRecord::Order(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "order_items" => match read_csv::<OrderItemRecord>(csv_path) {
                    Ok(r) => TableRecord::OrderItem(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                "invoice_items" => match read_csv::<InvoiceItemRecord>(csv_path) {
                    Ok(r) => TableRecord::InvoiceItem(r),
                    Err(e) => {
                        println!("{:?}", e);
                        return Err(e);
                    }
                },
                _ => return Err(String::from("This table doesn't exist")),
            };
            Ok(records)
        }
        None => Err(String::from("Didn't specify the table")),
    }
}

fn read_csv<T: for<'de> Deserialize<'de> + Debug>(csv_path: String) -> Result<Vec<T>, String> {
    let mut records_array = Vec::new();
    let reader = csv::ReaderBuilder::new().from_path(csv_path);

    match reader {
        Ok(mut r) => {
            for record in r.deserialize() {
                match record {
                    Ok(r) => {
                        println!("{r:?}");
                        records_array.push(r);
                    }
                    Err(e) => {
                        println!("{:?},{:?}", String::from("error in row"), e);
                    }
                }
            }
            Ok(records_array)
        }
        Err(e) => {
            println!("{:?}", e);
            Err(String::from("error reading file"))
        }
    }
}
