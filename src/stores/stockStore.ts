import type { newStockMvmT, inventoryState } from "@/types";
import { defineStore } from "pinia";

export const useStockStore = defineStore("StockStore", {
  state: (): inventoryState => {
    return {
      inventoryMouvements: [],
    };
  },
  actions: {
    getAllStockMouvements: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    createStockMouvement: async function (inventorymvm: newStockMvmT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
