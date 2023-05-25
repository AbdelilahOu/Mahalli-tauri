import type { newStockMvmT, stockMvmT, stockState } from "@/types";
import database from "@/database/db";
import { defineStore } from "pinia";
import { stockJoins } from "@/database/dbQueryJson";

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
        const res = (await db.select(stockJoins)) as {
          data: string;
        }[];
        this.stockMouvements = res.map((r) => JSON.parse(r.data));
        console.log(this.stockMouvements);
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
