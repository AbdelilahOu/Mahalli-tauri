use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Client::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Client::Id).string().not_null().primary_key())
                    .col(ColumnDef::new(Client::Fullname).string().not_null())
                    .col(
                        ColumnDef::new(Client::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Client::Phone).string())
                    .col(ColumnDef::new(Client::Email).string())
                    .col(ColumnDef::new(Client::Address).string())
                    .col(ColumnDef::new(Client::Image).string())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Seller::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Seller::Id).string().not_null().primary_key())
                    .col(ColumnDef::new(Seller::Fullname).string().not_null())
                    .col(
                        ColumnDef::new(Seller::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Seller::Phone).string())
                    .col(ColumnDef::new(Seller::Email).string())
                    .col(ColumnDef::new(Seller::Address).string())
                    .col(ColumnDef::new(Seller::Image).string())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Product::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Product::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Product::Name).string().not_null())
                    .col(
                        ColumnDef::new(Product::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Product::Description).string())
                    .col(
                        ColumnDef::new(Product::Price)
                            .float()
                            .not_null()
                            .default(0.0f32),
                    )
                    .col(ColumnDef::new(Product::Image).string())
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Client::Table).to_owned())
            .await?;
        Ok(())
    }
}

#[derive(DeriveIden)]
enum Client {
    #[sea_orm(iden = "clients")]
    Table,
    Id,
    #[sea_orm(iden = "full_name")]
    Fullname,
    #[sea_orm(iden = "phone_number")]
    Phone,
    #[sea_orm(iden = "created_at")]
    CreatedAt,
    #[sea_orm(iden = "image")]
    Image,
    #[sea_orm(iden = "email")]
    Email,
    #[sea_orm(iden = "address")]
    Address,
}

#[derive(DeriveIden)]
enum Seller {
    #[sea_orm(iden = "sellers")]
    Table,
    Id,
    #[sea_orm(iden = "full_name")]
    Fullname,
    #[sea_orm(iden = "phone_number")]
    Phone,
    #[sea_orm(iden = "created_at")]
    CreatedAt,
    #[sea_orm(iden = "image")]
    Image,
    #[sea_orm(iden = "email")]
    Email,
    #[sea_orm(iden = "address")]
    Address,
}

#[derive(DeriveIden)]
enum Product {
    #[sea_orm(iden = "products")]
    Table,
    Id,
    #[sea_orm(iden = "name")]
    Name,
    #[sea_orm(iden = "created_at")]
    CreatedAt,
    #[sea_orm(iden = "image")]
    Image,
    #[sea_orm(iden = "description")]
    Description,
    #[sea_orm(iden = "price")]
    Price,
}

#[derive(DeriveIden)]
enum InventoryMouvement {
    #[sea_orm(iden = "inventory_mouvements")]
    Table,
    Id,
    #[sea_orm(iden = "mvm_type")]
    MvmType,
    #[sea_orm(iden = "quantity")]
    Quantity,
}
