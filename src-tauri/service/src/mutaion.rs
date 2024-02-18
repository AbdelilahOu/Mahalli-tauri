use ::entity::products::{
    ActiveModel as ProductActiveModel, Entity as ProductEnt, Model as ProductModel,
};
use sea_orm::*;

use crate::{NewProduct, Product};

pub struct MutationsService;

impl MutationsService {
    pub async fn create_product(db: &DbConn, product: NewProduct) -> Result<ProductModel, DbErr> {
        let product = ProductActiveModel {
            name: ActiveValue::Set(product.name),
            price: ActiveValue::Set(product.price),
            image: ActiveValue::Set(product.image),
            description: ActiveValue::Set(product.description),
            min_quantity: ActiveValue::Set(product.min_quantity),
            ..Default::default()
        };
        match product.save(db).await {
            Ok(p) => Ok(p.try_into_model()?),
            Err(err) => Err(err),
        }
    }
    pub async fn update_product(db: &DbConn, product: Product) -> Result<String, DbErr> {
        let product = ProductActiveModel {
            id: ActiveValue::Set(product.id),
            name: ActiveValue::Set(product.name),
            price: ActiveValue::Set(product.price),
            image: ActiveValue::Set(product.image),
            description: ActiveValue::Set(product.description),
            min_quantity: ActiveValue::Set(product.min_quantity),
            ..Default::default()
        };
        match product.save(db).await {
            Ok(p) => Ok(p.try_into_model()?.id),
            Err(err) => Err(err),
        }
    }
    pub async fn delete_product(db: &DbConn, id: String) -> Result<u64, DbErr> {
        let city_model = ProductEnt::find_by_id(id).one(db).await?;
        match city_model {
            Some(city_model) => {
                let city = city_model.delete(db).await?;
                Ok(city.rows_affected)
            }
            None => Ok(0),
        }
    }
}
