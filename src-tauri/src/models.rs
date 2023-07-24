use super::schema::products;
use diesel::sql_types::*;
use serde::Serialize;

#[derive(Debug, Queryable, QueryableByName, Clone, Serialize)]
pub struct Product {
    #[diesel(sql_type = Integer)]
    pub id: i32,
    #[diesel(sql_type = Text)]
    pub name: String,
    #[diesel(sql_type = Text)]
    pub image: String,
    #[diesel(sql_type = Text)]
    pub description: String,
    #[diesel(sql_type = Float)]
    pub price: f32,
    #[diesel(sql_type = Float)]
    pub tva: f32,
}

#[derive(Debug, Insertable, Clone)]
#[diesel(table_name = products)]
pub struct NewProduct {
    pub description: String,
    pub name: String,
    pub price: f32,
    pub tva: f32,
}
