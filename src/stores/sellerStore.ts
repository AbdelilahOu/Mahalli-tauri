import type { sellerT, sellerState, updateSellerT, newSellerT } from "@/types";
import { saveFile } from "@/utils/fs";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";

export const useSellerStore = defineStore("SellerStore", {
  state: (): sellerState => {
    return {
      sellers: [],
      seller: null,
    };
  },
  actions: {
    getAllSellers: async function () {
      try {
        this.sellers = await invoke("get_sellers", { page: 1 });
      } catch (error) {
        console.log(error);
      }
    },
    getOneSeller: async function (id: number) {
      this.seller = this.sellers.find((cli: sellerT) => cli.id === id) ?? null;
      if (!this.seller) {
        try {
          const seller: sellerT = await invoke("get_seller", { id });
          this.seller = seller;
        } catch (error) {
          console.log(error);
        }
      }
    },
    createOneSeller: async function (seller: newSellerT) {
      try {
        let image: string = await saveFile(seller.image as string, "Image");
        await invoke("insert_seller", { seller });
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneSeller: async function (id: number) {
      try {
        await invoke("delete_seller", { id });

        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneSeller: async function (id: number, seller: updateSellerT) {
      try {
        await invoke("update_seller", { seller, id });

        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
