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
    return result;
}
