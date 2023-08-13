use crate::diesel::prelude::*;
use crate::models::{InventoryMvm, NewInventoryMvm};
use crate::schema;

pub fn get_inventory(connection: &mut SqliteConnection) -> Vec<InventoryMvm> {
    let result = schema::inventory_mouvements::dsl::inventory_mouvements
        .load::<InventoryMvm>(connection)
        .expect("Error fetching all inventorys");
    result
}

// pub fn get_inventory_mvm(mvm_id: i32,connection: &mut SqliteConnection) -> InventoryMvm {
//
//     let result = schema::inventory_mouvements::dsl::inventory_mouvements
//         .find(&mvm_id)
//         .first::<InventoryMvm>( connection)
//         .expect("Error fetching inventory");

//     result
// }

pub fn insert_inventory_mvm(new_ii: NewInventoryMvm, connection: &mut SqliteConnection) -> usize {
    let result = diesel::insert_into(schema::inventory_mouvements::dsl::inventory_mouvements)
        .values(new_ii)
        .execute(connection)
        .expect("Error adding inventory");

    result
}

pub fn delete_inventory_mvm(mvm_id: i32, connection: &mut SqliteConnection) -> usize {
    let result =
        diesel::delete(schema::inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
            .execute(connection)
            .expect("Error deleting inventory");

    result
}

pub fn update_inventory_mvm(
    mvm_update: InventoryMvm,
    mvm_id: i32,
    connection: &mut SqliteConnection,
) -> usize {
    let result =
        diesel::update(schema::inventory_mouvements::dsl::inventory_mouvements.find(&mvm_id))
            .set(schema::inventory_mouvements::quantity.eq(mvm_update.quantity))
            .execute(connection)
            .expect("Error updating inventory");

    result
}
