#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use csv::StringRecord;

// #[tauri::command]
// async fn command_name(csv_path: String) -> Result<Vec<StringRecord>, ()> {
//     // create fn to parse csv and return an array of all the rcords
//     let rdr = csv::ReaderBuilder::new();
//     let mut records = rdr.from_path(csv_path);
//     match records {
//         Ok(r) => {
//             let records_array = r.records().collect::<Result<Vec<_>, _>>();
//             Ok(records_array);
//         }
//         Err(e) => Err(()),
//         _ => Err(()),
//     }
// }

fn main() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![command_name])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
