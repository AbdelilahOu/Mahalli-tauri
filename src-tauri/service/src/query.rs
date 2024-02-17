use entity::{
    inventory_mouvements::{self, Entity as InventoryMouvement},
    invoice_items::{self, Entity as InvoiceItems},
    order_items::{self, Entity as OrderItems},
    products::{self, Entity as Product},
};
use sea_orm::{
    sea_query::{Expr, Query},
    DatabaseConnection, JoinType, Order,
};

pub struct QueriesService;

impl QueriesService {
    pub fn list_products(_db: DatabaseConnection) {
        Query::select()
            .from(Product)
            .exprs([
                Expr::col((Product, products::Column::Id)),
                Expr::col((Product, products::Column::Name)),
                Expr::col((Product, products::Column::Description)),
                Expr::col((Product, products::Column::Image)),
                Expr::col((Product, products::Column::Price)),
            ])
            // .expr_as(_, _)
            .order_by(products::Column::CreatedAt, Order::Desc)
            .join(
                JoinType::LeftJoin,
                Product,
                Expr::col((Product, products::Column::Id))
                    .equals((InvoiceItems, invoice_items::Column::ProductId)),
            )
            .join(
                JoinType::LeftJoin,
                Product,
                Expr::col((Product, products::Column::Id))
                    .equals((OrderItems, order_items::Column::ProductId)),
            );
    }
}
