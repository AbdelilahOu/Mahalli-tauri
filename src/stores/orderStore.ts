import type { orderState, updateOrdersT, newOrdersT, orderT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { defineStore } from "pinia";

export const useOrdersStore = defineStore("OrderStore", {
  state: (): orderState => {
    return {
      orders: [],
      order: null,
    };
  },
  actions: {
    getAllOrders: async function (page: number = 1) {
      try {
        this.orders = await invoke("get_orders", { page });
      } catch (error) {
        console.log(error);
      }
    },
    getOneOrder: async function (id: number) {
      try {
        this.order = await invoke("get_order", { id });
      } catch (error) {
        console.log(error);
      }
    },
    createOneOrder: async function (order: newOrdersT) {},
    updateOneOrder: async function (id: number, order: updateOrdersT) {
      try {
        await invoke("update_order", { order, id });
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrder: async function (id: number) {
      try {
        await invoke("delete_order", { id });
        this.orders = this.orders.filter((order) => order.id !== id);
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrderItem: async function (id: number) {
      try {
        await invoke("delete_order_items", { id });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
