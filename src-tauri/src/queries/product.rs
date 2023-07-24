use serde::{Deserialize, Serialize};

use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::{self};
use crate::schema;

pub struct ProductRepo {}

impl ProductRepo {
    pub fn get_products() {
        let mut connection = establish_connection();
        let results = schema::products::dsl::products
            .load::<models::Product>(&mut connection)
            .expect("error get all products");
    }
    pub fn get_product() {}
    pub fn create_product() {}
    pub fn delete_product() {}
    pub fn update_product() {}
}
