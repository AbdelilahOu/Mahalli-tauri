use tauri::api::process::{Command, CommandEvent};

use std::fmt::Debug;

#[warn(unused_imports)]
use super::schema::{
    ClientRecord, InvoiceItemRecord, InvoiceRecord, OrderItemRecord, OrderRecord, ProductRecord,
    SellerRecord, StockMouvementRecord,
};

#[tauri::command]
pub async fn export_db_csv() {
    let (mut rx, mut child) = Command::new("sqlite3")
        .args(["serve"])
        .spawn()
        .expect("Failed to spawn packaged node");

    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            println!("{:?}", line);
            child.write("message from Rust\n".as_bytes()).unwrap();
        }
    }
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum TableRecord {
    Client(Vec<ClientRecord>),
    Product(Vec<ProductRecord>),
}

#[tauri::command]
pub fn get_csv_records(csv_path: String, table: Option<String>) -> Result<TableRecord, String> {
    match table {
        Some(a) => {
            if a == String::from("clients") {
                match read_csv::<ClientRecord>(csv_path) {
                    Ok(r) => Ok(TableRecord::Client(r)),
                    Err(e) => {
                        println!("{:?}", e);
                        Err(e)
                    }
                }
            } else if a == String::from("products") {
                match read_csv::<ProductRecord>(csv_path) {
                    Ok(r) => Ok(TableRecord::Product(r)),
                    Err(e) => {
                        println!("{:?}", e);
                        Err(e)
                    }
                }
            } else {
                Err(String::from("this table doesnt exist"))
            }
        }
        None => Err(String::from("didn't specify the table")),
    }
}

fn read_csv<T: for<'de> serde::Deserialize<'de> + Debug>(
    csv_path: String,
) -> Result<Vec<T>, String> {
    let mut records_array = Vec::new();
    let reader = csv::ReaderBuilder::new().from_path(csv_path);

    match reader {
        Ok(mut r) => {
            for record in r.deserialize() {
                match record {
                    Ok(r) => {
                        println!("{:?}", r);
                        records_array.push(r);
                    }
                    Err(e) => {
                        println!(
                            "{:?},{:?}",
                            String::from("Theres an error with this record"),
                            e
                        );
                    }
                }
            }
            Ok(records_array)
        }
        Err(e) => {
            println!("{:?}", e);
            Err(String::from("hi theres an error"))
        }
    }
}
