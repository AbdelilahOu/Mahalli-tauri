use entity::products::ActiveModel as ProductActiveModel;
use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr};

pub struct MutationsService;

impl MutationsService {
    pub async fn create_product(db: &DatabaseConnection) -> Result<(), DbErr> {
        let product = ProductActiveModel {
            ..Default::default()
        };
        match product.save(db).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }
    pub async fn update_product(db: &DatabaseConnection) -> Result<(), DbErr> {
        let product = ProductActiveModel {
            ..Default::default()
        };
        match product.save(db).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }
    pub async fn delete_product(db: &DatabaseConnection) -> Result<(), DbErr> {
        let product = ProductActiveModel {
            ..Default::default()
        };
        match product.delete(db).await {
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }
}
