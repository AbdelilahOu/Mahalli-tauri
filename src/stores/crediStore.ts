import type { crediT, newCrediT } from "@/types";
import { defineStore } from "pinia";

export const useCrediStore = defineStore("CrediStore", {
  state: (): { Credis: crediT[] } => {
    return {
      Credis: [],
    };
  },
  actions: {
    getAllCredis: async function () {},
    createCredi: async function (Credi: newCrediT) {},
    deleteOneCredi: async function (id: number) {},
  },
});
