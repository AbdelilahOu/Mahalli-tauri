import { orderDetailsJoins, ordersJoins } from "@/database/dbQueryJson";
import type { orderState, newOrdersT, updateOrdersT } from "@/types";
import { defineStore } from "pinia";

export const useOrdersStore = defineStore("OrdersStore", {
  state: (): orderState => {
    return {
      orders: [],
      order: null,
    };
  },
  actions: {
    getAllOrders: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    getOneOrders: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    createOneOrders: async function (Orders: newOrdersT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    updateOneOrders: async function (id: number, Orders: updateOrdersT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrders: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrdersItem: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
