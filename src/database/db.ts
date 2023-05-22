import database from "tauri-plugin-sql-api";

export default async () => {
  const db = await database.load("sqlite:db3.sqlite");

  const seedDatabase = async () => {
    console.log("run create tables");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        address TEXT DEFAULT '',
        image TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        price REAL NOT NULL,
        tva REAL NOT NULL DEFAULT 0,
        image TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        address TEXT DEFAULT '',
        image TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        client_id INTEGER NOT NULL,
        CONSTRAINT invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        invoice_id INTEGER NOT NULL,
        quantity BIGINT NOT NULL,
        stock_id INTEGER NOT NULL,
        CONSTRAINT invoice_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT invoice_items_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES stock_mouvements (id) ON DELETE NO ACTION ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        seller_id INTEGER NOT NULL,
        CONSTRAINT orders_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers (id) ON DELETE CASCADE ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        price REAl,
        order_id INTEGER NOT NULL,
        stock_id INTEGER NOT NULL,
        quantity BIGINT NOT NULL,
        CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT order_items_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES stock_mouvements (id) ON DELETE NO ACTION ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS stock_mouvements (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        model TEXT NOT NULL,
        quantity BIGINT NOT NULL,
        product_id INTEGER NOT NULL,
        CONSTRAINT stock_mouvements_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS order_items_stock_id_key ON order_items (stock_id);
      CREATE UNIQUE INDEX IF NOT EXISTS order_items_id_key ON order_items (id);
      CREATE UNIQUE INDEX IF NOT EXISTS invoice_items_stock_id_key ON invoice_items (stock_id);
      CREATE UNIQUE INDEX IF NOT EXISTS products_name_key ON products (name);

    `);
  };

  const drop = async () => {
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

  return {
    db,
    drop,
    seedDatabase,
  };
};
