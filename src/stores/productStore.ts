import { selectProductsWithQuantity } from "@/database/dbQueryJson";
import type {
  productState,
  newProductT,
  updateProductT,
  productT,
} from "@/types";
import { defineStore } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  state: (): productState => {
    return {
      products: [],
    };
  },
  actions: {
    getAllProducts: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    createOneProduct: async function (Product: newProductT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    updateOneProduct: async function (id: number, Product: updateProductT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneProduct: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
