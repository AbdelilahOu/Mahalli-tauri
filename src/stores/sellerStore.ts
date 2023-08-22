import type { sellerT, sellerState, updateSellerT, newSellerT } from "@/types";
import { saveFile } from "@/utils/fs";
import { defineStore } from "pinia";

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
      } catch (error) {
        console.log(error);
      }
    },
    getOneSeller: async function (id: number) {
      this.seller =
        this.sellers.find((sell: sellerT) => sell.id === id) ?? null;
      if (!this.seller) {
        try {
        } catch (error) {
          console.log(error);
        }
      }
    },
    createOneSeller: async function (seller: newSellerT) {
      try {
        let image: string = await saveFile(seller.image as string, "Image");
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneSeller: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    updateOneSeller: async function (id: number, seller: updateSellerT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
