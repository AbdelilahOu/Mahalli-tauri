#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod csv_thingy;

use tauri::api::process::Command;
use tauri::api::process::CommandEvent;

use crate::csv_thingy::schema::ProductRecord;

#[tauri::command]
fn get_csv_records(csv_path: String) -> Result<Vec<ProductRecord>, String> {
    let mut records_array = Vec::<ProductRecord>::new();
    let reader = csv::ReaderBuilder::new().from_path(csv_path);

    match reader {
        Ok(mut r) => {
            for record in r.deserialize() {
                match record {
                    Ok(r) => {
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
            return Err(String::from("hi theres an error"));
        }
    }
}

#[tauri::command]
async fn export_db_csv() {
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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![get_csv_records, export_db_csv])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
