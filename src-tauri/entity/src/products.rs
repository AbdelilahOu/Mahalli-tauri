//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.14

use sea_orm::{entity::prelude::*, Set};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "products")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub is_deleted: bool,
    pub is_archived: bool,
    pub description: Option<String>,
    #[sea_orm(column_type = "Double")]
    pub purchase_price: f64,
    #[sea_orm(column_type = "Double")]
    pub selling_price: f64,
    #[sea_orm(column_type = "Double")]
    pub min_quantity: f64,
    pub image: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::inventory_transactions::Entity")]
    InventoryTransactions,
    #[sea_orm(has_many = "super::quote_items::Entity")]
    QuoteItems,
}

impl Related<super::inventory_transactions::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::InventoryTransactions.def()
    }
}

impl Related<super::quote_items::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::QuoteItems.def()
    }
}

impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: Set(ulid::Ulid::new().to_string()),
            ..ActiveModelTrait::default()
        }
    }
}
