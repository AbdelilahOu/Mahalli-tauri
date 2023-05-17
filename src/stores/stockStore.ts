import type { newStockMvmT, stockMvmT, stockState } from "@/types";
import database from "@/database/db";
import { defineStore } from "pinia";

export const useStockStore = defineStore("StockStore", {
  state: (): stockState => {
    return {
      stockMouvements: [],
    };
  },
  actions: {
    getAllStockMouvements: async function () {
      try {
        const { db } = await database();
        // get stocks
        const stocks: stockMvmT[] = await db.select(
          "SELECT * FROM stock_mouvements ORDER BY id DESC"
        );
        // get joins
        for await (const stock of stocks) {
          const invoiceitem: any[] = await db.select(
            "SELECT invoice_id FROM invoice_items WHERE stock_id = $1",
            [stock.id]
          );
          const commanditem: any[] = await db.select(
            "SELECT command_id FROM command_items WHERE stock_id = $1",
            [stock.id]
          );
          const product: any[] = await db.select(
            "SELECT name, price, id FROM products WHERE id = $1",
            [stock.product_id]
          );
          // get index
          const index = stocks.indexOf(stock);
          // assign joins
          stocks[index].commandItem = commanditem[0] as {
            command_id: number;
          };
          stocks[index].invoiceItem = invoiceitem[0] as {
            invoice_id: number;
          };
          stocks[index].product = product[0] as {
            name: string;
            price: number;
          };
        }

        this.stockMouvements = stocks;
      } catch (error) {
        console.log(error);
      }
    },
    createStockMouvement: async function (stockmvm: newStockMvmT) {
      try {
        const { db } = await database();
        await db.execute(
          "INSERT INTO stock_mouvements (model,product_id,quantity) VALUES ($1,$2,$3)",
          ["IN", stockmvm.productId, stockmvm.quantity]
        );
        this.getAllStockMouvements();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
