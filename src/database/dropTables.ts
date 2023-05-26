import type Database from "tauri-plugin-sql-api";

export const drop = async (db: Database) => {
  console.log("run drop tables");
  try {
    await db.execute("DROP TABLE IF EXISTS clients");
    await db.execute("DROP TABLE IF EXISTS sellers");
    await db.execute("DROP TABLE IF EXISTS orders");
    await db.execute("DROP TABLE IF EXISTS invoices");
    await db.execute("DROP TABLE IF EXISTS order_items");
    await db.execute("DROP TABLE IF EXISTS invoice_items");
    await db.execute("DROP TABLE IF EXISTS products");
    await db.execute("DROP TABLE IF EXISTS stock_mouvements");
  } catch (error) {
    console.log(error);
  }
};
