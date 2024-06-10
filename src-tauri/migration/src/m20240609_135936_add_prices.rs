use sea_orm_migration::prelude::*;

use crate::m20220101_000001_init_::Product;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager.alter_table(sea_query::Table::alter()
            .table(Product::Table)
            .rename_column(Alias::new("price"), Alias::new("purchase_price"))
            .to_owned()).await?;

        manager.alter_table(sea_query::Table::alter()
            .table(Product::Table)
            .add_column_if_not_exists(
                ColumnDef::new(Alias::new("selling_price")).float().not_null().default(0.0f32)
            ).to_owned()).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.alter_table(sea_query::Table::alter()
            .table(Product::Table).rename_column(Alias::new("purchase_price"), Alias::new("price")).to_owned()
        ).await?;

        manager.alter_table(sea_query::Table::alter()
            .table(Product::Table).drop_column(Alias::new("selling_price")).to_owned()
        ).await?;

        Ok(())
    }
}