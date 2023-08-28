import type { newInventoryMvmT, inventoryState } from "@/types";
import { invoke } from "@tauri-apps/api";
import { defineStore } from "pinia";

export const useInventoryStore = defineStore("InventoryStore", {
  state: (): inventoryState => {
    return {
      inventoryMouvements: [],
    };
  },
  actions: {
    getAllInventoryMouvements: async function (page: number = 1) {
      try {
        this.inventoryMouvements = await invoke("get_inventory_mvms", { page });
        console.log(this.inventoryMouvements);
      } catch (error) {
        console.log(error);
      }
    },
    createInventoryMouvement: async function (inventorymvm: newInventoryMvmT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
