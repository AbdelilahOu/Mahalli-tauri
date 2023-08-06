use crate::csvparsing::{export, import, import::TableRecord};
use crate::models::*;
use crate::reposotories::*;

// csv stuff
#[tauri::command]
pub async fn export_db_csv() {
    // let result = export::export_db_csv().await;
    // result
}

#[tauri::command]
pub fn get_csv_records(csv_path: String, table: Option<String>) -> Result<TableRecord, String> {
    let result = import::get_csv_records(csv_path, table);
    result
}

#[tauri::command]
pub fn get_products() -> Vec<Product> {
    let result = product_repo::get_products();
    result
}

#[tauri::command]
pub fn get_product(id: i32) -> Product {
    let result = product_repo::get_product(id);
    result
}

#[tauri::command]
pub fn delete_product(id: i32) -> usize {
    let result = product_repo::delete_product(id);
    result
}

#[tauri::command]
pub fn create_product(new_product: NewProduct) -> usize {
    let result = product_repo::create_product(new_product);
    result
}

#[tauri::command]
pub fn update_product(product: Product, id: i32) -> usize {
    let result = product_repo::update_product(product, id);
    result
}

#[tauri::command]
pub fn get_clients() -> Vec<Client> {
    let result = client_repo::get_clients();
    result
}

#[tauri::command]
pub fn get_client(id: i32) -> Client {
    let result = client_repo::get_client(id);
    result
}

#[tauri::command]
pub fn delete_client(id: i32) -> usize {
    let result = client_repo::delete_client(id);
    result
}

#[tauri::command]
pub fn create_client(new_client: NewClient) -> usize {
    let result = client_repo::create_client(new_client);
    result
}

#[tauri::command]
pub fn update_client(client: Client, id: i32) -> usize {
    let result = client_repo::update_client(client, id);
    result
}

#[tauri::command]
pub fn get_user(id: i32) -> User {
    let result = user_repo::get_user(id);
    result
}

#[tauri::command]
pub fn delete_user(id: i32) -> usize {
    let result = user_repo::delete_user(id);
    result
}

#[tauri::command]
pub fn create_user(new_user: NewUser) -> usize {
    let result = user_repo::create_user(new_user);
    result
}

#[tauri::command]
pub fn update_user(user: User, id: i32) -> usize {
    let result = user_repo::update_user(user, id);
    result
}
