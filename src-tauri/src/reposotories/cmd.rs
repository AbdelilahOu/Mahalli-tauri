use crate::{
    models::{NewProduct, Product},
    reposotories::product_repo,
};

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
pub fn update_product() {}
