import type { sellerT, sellerState, updateSellerT, newSellerT } from "@/types";
import { defineStore } from "pinia";
import { saveFile } from "@/utils/fs";

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
        this.sellers = await this.db.select(
          "SELECT *  FROM sellers ORDER BY id DESC"
        );
      } catch (error) {
        console.log(error);
      }
    },
    getOneSeller: async function (id: number) {
      this.seller =
        this.sellers.find((sell: sellerT) => sell.id === id) ?? null;
      if (!this.seller) {
        try {
          const seller: sellerT = await this.db.select(
            "SELECT * FROM sellers WHERE id = $1",
            [id]
          );
          this.seller = seller;
        } catch (error) {
          console.log(error);
        }
      }
    },
    createOneSeller: async function (seller: newSellerT) {
      try {
        let image: string = await saveFile(seller.image as string, "Image");

        await this.db.execute(
          "INSERT INTO sellers (name,email,phone,address,image) VALUES ($1,$2,$3,$4,$5)",
          [seller.name, seller.email, seller.phone, seller.address, image]
        );
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneSeller: async function (id: number) {
      try {
        await this.db.execute("DELETE FROM sellers WHERE id = $1", [id]);
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneSeller: async function (id: number, seller: updateSellerT) {
      try {
        await this.db.execute(
          "UPDATE sellers SET name = $1,email = $2,phone = $3,address = $4 WHERE id = $5",
          [seller.name, seller.email, seller.phone, seller.address, seller.id]
        );
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
