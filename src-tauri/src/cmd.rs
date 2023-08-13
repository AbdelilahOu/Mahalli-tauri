use dotenv::dotenv;
use std::env;
use std::path;

use crate::csvparsing::export;
use crate::csvparsing::import;
use crate::csvparsing::import::TableRecord;
use crate::db;
use crate::models::*;
use crate::reposotories::*;
use crate::AppState;

// csv stuff
#[tauri::command]
pub async fn export_db_csv(table: String) {
    // result
    dotenv().ok();
    let _env = env::var("DEV_ENV");
    let database_url: String = if _env.is_ok() == false {
        path::Path::new(&tauri::api::path::data_dir().unwrap())
            .join(".stocker")
            .join("stocker.db")
            .to_str()
            .expect("Failed to convert path to string")
            .to_string()
    } else {
        env::var("DATABASE_URL").expect("DATABASE_URL not set")
    };

    let result = export::export_db_csv(
        &database_url,
        &path::Path::new(&tauri::api::path::data_dir().unwrap())
            .to_str()
            .unwrap(),
        &table,
    )
    .await;

    result
}

#[tauri::command]
pub fn get_csv_records(csv_path: String, table: Option<String>) -> Result<TableRecord, String> {
    let result = import::get_csv_records(csv_path, table);
    result
}
// database stuff
#[tauri::command]
pub async fn seed_db() {
    db::seed_db().await
}

// inteties
#[tauri::command]
pub fn get_clients(state: tauri::State<AppState>) -> Vec<Client> {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    // get data
    let result = client_repo::get_clients(conn);
    result
}

#[tauri::command]
pub fn get_client(id: i32, state: tauri::State<AppState>) -> Client {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    //
    let result = client_repo::get_client(id, conn);
    result
}

#[tauri::command]
pub fn delete_client(id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    //
    let result = client_repo::delete_client(id, conn);
    result
}

#[tauri::command]
pub fn insert_client(new_client: NewClient, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    //
    let result = client_repo::insert_client(new_client, conn);
    result
}

#[tauri::command]
pub fn update_client(client: Client, id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    //
    let result = client_repo::update_client(client, id, conn);
    result
}

#[tauri::command]
pub fn get_products(state: tauri::State<AppState>) -> Vec<Product> {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = product_repo::get_products();
    result
}

#[tauri::command]
pub fn get_product(id: i32, state: tauri::State<AppState>) -> Product {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = product_repo::get_product(id);
    result
}

#[tauri::command]
pub fn delete_product(id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = product_repo::delete_product(id);
    result
}

#[tauri::command]
pub fn insert_product(new_product: NewProduct, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = product_repo::insert_product(new_product);
    result
}

#[tauri::command]
pub fn update_product(product: Product, id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = product_repo::update_product(product, id);
    result
}

#[tauri::command]
pub fn get_user(id: i32, state: tauri::State<AppState>) -> User {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = user_repo::get_user(id);
    result
}

#[tauri::command]
pub fn delete_user(id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = user_repo::delete_user(id);
    result
}

#[tauri::command]
pub fn insert_user(new_user: NewUser, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = user_repo::insert_user(new_user);
    result
}

#[tauri::command]
pub fn update_user(user: User, id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = user_repo::update_user(user, id);
    result
}

#[tauri::command]
pub fn get_invoice(id: i32, state: tauri::State<AppState>) -> Invoice {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = invoice_repo::get_invoice(id);
    result
}

#[tauri::command]
pub fn get_invoices(state: tauri::State<AppState>) -> Vec<Invoice> {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = invoice_repo::get_invoices();
    result
}

#[tauri::command]
pub fn delete_invoice(id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = invoice_repo::delete_invoice(id);
    result
}

#[tauri::command]
pub fn insert_invoice(new_invoice: NewInvoice, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = invoice_repo::insert_invoice(new_invoice);
    result
}

#[tauri::command]
pub fn update_invoice(invoice: Invoice, id: i32, state: tauri::State<AppState>) -> usize {
    // get connection from state
    let mut conn = state.db_conn.lock().unwrap();
    let conn = &mut *conn;
    let result = invoice_repo::update_invoice(invoice, id);
    result
}
