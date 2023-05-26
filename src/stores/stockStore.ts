import type { newStockMvmT, stockState } from "@/types";
import { stockJoins } from "@/database/dbQueryJson";
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
        const res = (await this.db.select(stockJoins)) as {
          data: string;
        }[];
        this.stockMouvements = res.map((r) => JSON.parse(r.data));
      } catch (error) {
        console.log(error);
      }
    },
    createStockMouvement: async function (stockmvm: newStockMvmT) {
      try {
        await this.db.execute(
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
