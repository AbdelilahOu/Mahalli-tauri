import { invoiceDetailsJoins, invoicesJoins } from "@/database/dbQueryJson";
import type { invoiceState, updateInvoiceT, newInvoiceT } from "@/types";
import { defineStore } from "pinia";

export const useInvoiceStore = defineStore("InvoiceStore", {
  state: (): invoiceState => {
    return {
      invoices: [],
      invoice: null,
    };
  },
  actions: {
    getAllInvoices: async function () {
      try {
        const result: { data: string }[] = await this.db.select(invoicesJoins);
        this.invoices = result.map((c) => JSON.parse(c.data));
      } catch (error) {
        console.log(error);
      }
    },
    getOneInvoice: async function (id: number) {
      try {
        const result: any[] = await this.db.select(invoiceDetailsJoins, [id]);
        this.invoice = JSON.parse(result[0].data);
      } catch (error) {
        console.log(error);
      }
    },
    createOneInvoice: async function (invoice: newInvoiceT) {
      try {
        const { client_id, invoiceItems, status } = invoice;

        await this.db.execute(
          "INSERT INTO invoices (client_id,total,status) VALUES ($1,$2,$3)",
          [client_id, 0, status]
        );
        const id: { id: number }[] = await this.db.select(
          "SELECT max(id) as id FROM invoices"
        );
        for await (const { quantity, product_id } of invoiceItems) {
          await this.db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [-quantity, "OUT", product_id]
          );
          const stock_id: { id: number }[] = await this.db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );

          await this.db.execute(
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
      try {
        const { total, client_id, invoiceItems } = invoice;

        await this.db.execute(
          "UPDATE invoices SET total = $1 , client_id = $2 WHERE id = $3",
          [total, client_id, id]
        );
        for await (const item of invoiceItems) {
          if (item.id) {
            await this.db.execute(
              "UPDATE invoice_items SET product_id = $1 , quantity = $2 WHERE id = $3",
              [item.product_id, -Number(item.quantity), item.id]
            );

            await this.db.execute(
              "UPDATE stock_mouvements SET quantity = $1 WHERE id = $2",
              [-Number(item.quantity), item.stock_id]
            );
          } else {
            await this.db.execute(
              "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
              [-Number(item.quantity), "OUT", item.product_id]
            );
            const stock_id: { id: number }[] = await this.db.select(
              "SELECT max(id) as id FROM stock_mouvements"
            );

            await this.db.execute(
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
      try {
        await this.db.execute("DELETE FROM invoices WHERE id = $1", [id]);
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneinvoiceItem: async function (id: number) {
      try {
        await this.db.execute("DELETE FROM invoice_items WHERE id = $1", [id]);
        this.getAllInvoices();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
