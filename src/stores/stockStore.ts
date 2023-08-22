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
      } catch (error) {
        console.log(error);
      }
    },
    createStockMouvement: async function (stockmvm: newStockMvmT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
