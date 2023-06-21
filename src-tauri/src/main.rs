#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use csv::Error;

// use tauri::command::private::SerializeKind;

// #[derive(Debug, serde::Deserialize, serde::Serialize)]
// struct Record {
//     id: i64,
//     name: String,
//     price: f64,
//     tva: f64,
//     description: String,
//     stock: i64,
// }

// async fn get_csv_data(csv_path: String) -> Result<Vec<Record>, Error> {
//     let mut records_array = Vec::<Record>::new();
//     let reader = csv::ReaderBuilder::new().from_path(csv_path);

//     match reader {
//         Ok(mut r) => {
//             for record in r.deserialize() {
//                 let record: Record = record.unwrap();
//                 records_array.push(record);
//             }

//             Ok(records_array)
//         }
//         Err(e) => Err(e),
//     }
// }

#[tauri::command]
fn command_name(csv_path: String) -> Vec<Record> {
    let records = get_csv_data(csv_path);
    return records;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![command_name])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
