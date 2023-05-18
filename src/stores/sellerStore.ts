import type { sellerT, sellerState, updateSellerT, newSellerT } from "@/types";
import database from "@/database/db";
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
        const { db } = await database();
        const allSellers: sellerT[] = await db.select(
          "SELECT *  FROM sellers ORDER BY id DESC"
        );
        this.sellers = allSellers;
      } catch (error) {
        console.log(error);
      }
    },
    getOneSeller: async function (id: number) {
      this.seller = this.sellers.find((cli) => cli.id === id) ?? null;
      if (!this.seller) {
        try {
          const { db } = await database();
          const seller: sellerT = await db.select(
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
        const { db } = await database();
        await db.execute(
          "INSERT INTO sellers (name,email,phone,address) VALUES ($1,$2,$3,$4)",
          [seller.name, seller.email, seller.phone, seller.address]
        );
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneSeller: async function (id: number) {
      try {
        const { db } = await database();
        await db.execute("DELETE FROM sellers WHERE id = $1", [id]);
        this.getAllSellers();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneSeller: async function (id: number, seller: updateSellerT) {
      try {
        const { db } = await database();
        await db.execute(
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
