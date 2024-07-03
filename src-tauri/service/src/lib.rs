mod models;
mod mutation;
mod query;
mod transaction;

mod entities {
    pub use entity::clients::{self, ActiveModel as ClientActiveModel, Entity as Clients };
    pub use entity::inventory_movements::{self, ActiveModel as InventoryActiveModel, Entity as InventoryMovements };
    pub use entity::invoices::{self, ActiveModel as InvoiceActiveModel, Entity as Invoices };
    pub use entity::order_items::{self, ActiveModel as OrderItemActiveModel, Entity as OrderItems };
    pub use entity::orders::{self, ActiveModel as OrderActiveModel, Entity as Orders };
    pub use entity::products::{self, ActiveModel as ProductActiveModel, Entity as Products };
    pub use entity::quote_items::{self, ActiveModel as QuoteItemActiveModel, Entity as QuoteItems };
    pub use entity::quotes::{self, ActiveModel as QuoteActiveModel, Entity as Quotes };
    pub use entity::suppliers::{self, ActiveModel as SupplierActiveModel, Entity as Suppliers };
}

pub use models::*;
pub use mutation::*;
pub use query::*;
pub use transaction::*;

pub use sea_orm;
