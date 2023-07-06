#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct ProductRecord {
    id: i64,
    name: String,
    // price: f64,
    // tva: f64,
    // description: String,
    // stock: i64,
}

#[tauri::command]
fn command_name(csv_path: String) -> Result<Vec<ProductRecord>, String> {
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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![command_name])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
