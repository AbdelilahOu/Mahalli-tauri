use crate::{
    csvparsing::{export, import, import::TableRecord},
    models::{NewProduct, Product},
    reposotories::product_repo,
};

// csv stuff
#[tauri::command]
pub async fn export_db_csv() {
    let result = export::export_db_csv().await;
    result
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
