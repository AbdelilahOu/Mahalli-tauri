import database from "tauri-plugin-sql-api";

export default async () => {
  const db = await database.load("sqlite:db.sqlite");

  const createClientTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        addresse TEXT DEFAULT '',
        image TEXT DEFAULT ''
      );
    `);
  };

  const createProductsTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        price REAL NOT NULL,
        tva REAL NOT NULL DEFAULT 0,
        image TEXT DEFAULT ''
      );
    `);
    await db.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS products_name_key ON products (name);`
    );
  };

  const createSellersTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        addresse TEXT DEFAULT '',
        image TEXT DEFAULT ''
      );
    `);
  };
  const createInvoicesTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        client_id INTEGER NOT NULL,
        CONSTRAINT invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  };
  const createInvoiceItemsTable = async () => {
    await db.execute(`
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
   `);
    await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS invoice_items_stock_id_key ON invoice_items (stock_id);
  `);
  };
  const createCommandsTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS commands (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        seller_id INTEGER NOT NULL,
        CONSTRAINT commands_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
   `);
  };
  const createCommandItemsTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS command_items (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        price REAl,
        command_id INTEGER NOT NULL,
        stock_id INTEGER NOT NULL,
        quantity BIGINT NOT NULL,
        CONSTRAINT command_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT command_items_command_id_fkey FOREIGN KEY (command_id) REFERENCES commands (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT command_items_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES stock_mouvements (id) ON DELETE NO ACTION ON UPDATE CASCADE
      );
   `);
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS command_items_stock_id_key ON command_items (stock_id);
    `);
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS command_items_id_key ON command_items (id);
    `);
  };

  const createStockTable = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS stock_mouvements (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        model TEXT NOT NULL,
        quantity BIGINT NOT NULL,
        product_id INTEGER NOT NULL,
        CONSTRAINT stock_mouvements_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  };

  const main = async () => {
    console.log("run create tables");
    try {
      createClientTable();
      createCommandItemsTable();
      createCommandsTable();
      createInvoiceItemsTable();
      createInvoicesTable();
      createProductsTable();
      createSellersTable();
      createStockTable();
    } catch (error) {
      console.log(error);
    }
  };

  const drop = async () => {
    console.log("run drop tables");
    try {
      await db.execute("DROP TABLE IF EXISTS clients");
      await db.execute("DROP TABLE IF EXISTS sellers");
      await db.execute("DROP TABLE IF EXISTS commands");
      await db.execute("DROP TABLE IF EXISTS invoices");
      await db.execute("DROP TABLE IF EXISTS command_items");
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
    main,
  };
};
