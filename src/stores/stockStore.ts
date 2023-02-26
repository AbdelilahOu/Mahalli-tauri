import type { newStockMvmT, stockState, stockT } from "@/types";
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
      const { db } = await database();
      try {
        const stocks: stockT[] = await db.select(
          "SELECT * FROM stock_mouvements ORDER BY id DESC"
        );
        const invoiceItems: {
          quantity: number;
          stock_id: number;
          invoice_id: number;
        }[] = await db.select(
          "SELECT quantity, invoice_id, stock_id  FROM invoice_items"
        );
        const commandItems: {
          quantity: number;
          stock_id: number;
          command_id: number;
        }[] = await db.select(
          "SELECT quantity, command_id, stock_id  FROM command_items"
        );
        const products: { name: string; price: number; id: number }[] =
          await db.select("SELECT name, price,id  FROM products");

        this.stockMouvements = stocks.map((stock) => {
          const product = products.find(
            (product) => stock.product_id == product.id
          );
          return {
            ...stock,
            product: { name: product?.name || "", price: product?.price || 0 },
            commandItem: commandItems.find(
              (item) => item.stock_id === stock.id
            ),
            invoiceItem: invoiceItems.find(
              (item) => item.stock_id === stock.id
            ),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    createStockMouvement: async function (stockmvm: newStockMvmT) {
      const { db } = await database();
      try {
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
