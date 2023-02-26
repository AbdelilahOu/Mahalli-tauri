import type {
  invoiceState,
  invoiceT,
  invoiceItemT,
  updateInvoiceT,
  newInvoiceT,
  clientT,
  invoiceDetailsItemT,
} from "@/types";
import { formatDate } from "@/utils/formatDate";
import { defineStore } from "pinia";
import database from "@/database/db";

export const useInvoiceStore = defineStore("InvoiceStore", {
  state: (): invoiceState => {
    return {
      invoices: [],
      invoice: null,
    };
  },
  actions: {
    getAllInvoices: async function () {
      const { db } = await database();
      try {
        const invoices: invoiceT[] = await db.select(
          "SELECT * FROM invoices ORDER BY id DESC"
        );
        // console.log(invoices);
        const invoiceItems: invoiceItemT[] = await db.select(
          "SELECT * FROM invoice_items"
        );
        for await (const item of invoiceItems) {
          let product: { price: number; name: string }[] = await db.select(
            "SELECT price ,name FROM products WHERE id = $1",
            [item.product_id]
          );
          invoiceItems[invoiceItems.indexOf(item)]["product"] = product[0];
        }
        this.invoices = invoices.map((invoice) => ({
          ...invoice,
          invoiceItems: invoiceItems
            .filter((items) => items.invoice_id === invoice.id)
            .map((item) => ({ ...item, quantity: Math.abs(item.quantity) })),
          total: invoiceItems
            .filter((items) => items.invoice_id === invoice.id)
            .reduce(
              (acc, curr) =>
                (acc += Math.abs(curr.quantity) * curr.product.price),
              0
            ),
        }));
      } catch (error) {
        console.log(error);
      }
    },
    getOneInvoice: async function (id: number) {
      const { db } = await database();
      try {
        const invoice: invoiceT[] = await db.select(
          "SELECT * FROM invoices WHERE id = $1",
          [id]
        );
        const client: clientT[] = await db.select(
          "SELECT * FROM clients WHERE id = $1",
          [invoice[0].client_id]
        );
        let invoiceItems: invoiceDetailsItemT[] = await db.select(
          "SELECT * FROM invoice_items WHERE invoice_id = $1",
          [id]
        );
        for await (const item of invoiceItems) {
          let product: {
            name: string;
            price: number;
            tva: number;
            description: string;
          }[] = await db.select(
            "SELECT name, price, tva, description FROM products WHERE id = $1",
            [item.product_id]
          );
          invoiceItems[invoiceItems.indexOf(item)]["product"] = product[0];
        }
        this.invoice = {
          ...invoice[0],
          client: client[0],
          invoiceItems: invoiceItems.map((item) => ({
            ...item,
            quantity: Math.abs(item.quantity),
          })),
        };
      } catch (error) {
        console.log(error);
      }
    },
    createOneInvoice: async function (invoice: newInvoiceT) {
      const { db } = await database();
      try {
        const { client_id, invoiceItems } = invoice;
        await db.execute(
          "INSERT INTO invoices (client_id,total) VALUES ($1,$2)",
          [client_id, 0]
        );
        const id: { id: number }[] = await db.select(
          "SELECT max(id) as id FROM invoices"
        );
        for await (const { quantity, product_id } of invoiceItems) {
          await db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [-quantity, "OUT", product_id]
          );
          const stock_id: { id: number }[] = await db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );
          await db.execute(
            "INSERT INTO invoice_items (quantity,product_id,invoice_id,stock_id) VALUES ($1,$2,$3,$4)",
            [quantity, product_id, id[0].id, stock_id[0].id]
          );
        }
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneInvoice: async function (id: number, invoice: updateInvoiceT) {
      const { db } = await database();
      try {
        const { total, client_id, invoiceItems } = invoice;
        await db.execute(
          "UPDATE invoices SET total = $1 , client_id = $2 WHERE id = $3",
          [total, client_id, id]
        );
        for await (const item of invoiceItems) {
          if (item.id) {
            await db.execute(
              "UPDATE invoice_items SET product_id = $1 , quantity = $2 WHERE id = $3",
              [item.product_id, -Number(item.quantity), item.id]
            );
            await db.execute(
              "UPDATE stock_mouvements SET quantity = $1 WHERE id = $2",
              [-Number(item.quantity), item.stock_id]
            );
          } else {
            await db.execute(
              "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
              [-Number(item.quantity), "OUT", item.product_id]
            );
            const stock_id: { id: number }[] = await db.select(
              "SELECT max(id) as id FROM stock_mouvements"
            );
            await db.execute(
              "INSERT INTO invoice_items (quantity,product_id,invoice_id,stock_id) VALUES ($1,$2,$3,$4)",
              [-Number(item.quantity), item.product_id, id, stock_id[0].id]
            );
          }
        }
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneInvoice: async function (id: number) {
      const { db } = await database();
      try {
        await db.execute("DELETE FROM invoices WHERE id = $1", [id]);
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneinvoiceItem: async function (id: number) {
      const { db } = await database();
      try {
        await db.execute("DELETE FROM invoice_items WHERE id = $1", [id]);
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
