import type {
  productT,
  productState,
  updateProductT,
  newProductT,
} from "@/types";
import { saveFile } from "@/utils/fs";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";

export const useProductStore = defineStore("ProductStore", {
  state: (): productState => {
    return {
      products: [],
    };
  },
  actions: {
    getAllProducts: async function () {
      try {
        this.products = await invoke("get_products", { page: 1 });
      } catch (error) {
        console.log(error);
      }
    },
    createOneProduct: async function (product: newProductT) {
      try {
        let image: string = await saveFile(product.image as string, "Image");
        await invoke("insert_product", { product });
        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneProduct: async function (id: number) {
      try {
        await invoke("delete_product", { id });

        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneProduct: async function (id: number, product: updateProductT) {
      try {
        await invoke("update_product", { product, id });

        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
