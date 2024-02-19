use ::entity::prelude::*;
use sea_orm::*;

use crate::{NewInventory, NewProduct, Product};

pub struct MutationsService;

impl MutationsService {
    pub async fn create_product(db: &DbConn, product: NewProduct) -> Result<(), DbErr> {
        let product = ProductActiveModel {
            name: ActiveValue::Set(product.name),
            price: ActiveValue::Set(product.price),
            image: ActiveValue::Set(product.image),
            description: ActiveValue::Set(product.description),
            min_quantity: ActiveValue::Set(product.min_quantity),
            ..Default::default()
        };
        match product.save(db).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }
    pub async fn update_product(db: &DbConn, product: Product) -> Result<(), DbErr> {
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
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }
    pub async fn delete_product(db: &DbConn, id: String) -> Result<u64, DbErr> {
        let city_model = Products::find_by_id(id).one(db).await?;
        match city_model {
            Some(city_model) => {
                let city = city_model.delete(db).await?;
                Ok(city.rows_affected)
            }
            None => Ok(0),
        }
    }
    pub async fn create_inv_mvm(db: &DbConn, mvm: NewInventory) -> Result<String, DbErr> {
        let in_mvm = InventoryMouvementActiveModel {
            mvm_type: ActiveValue::Set(mvm.mvm_type),
            quantity: ActiveValue::Set(mvm.quantity),
            product_id: ActiveValue::Set(mvm.product_id),
            ..Default::default()
        };
        match in_mvm.save(db).await {
            Ok(im) => Ok(im.id.unwrap()),
            Err(err) => Err(err),
        }
    }
}
