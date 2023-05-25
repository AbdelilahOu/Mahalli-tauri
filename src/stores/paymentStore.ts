import type { crediT, newPaymentT } from "@/types";
import { defineStore } from "pinia";

export const usePaymentStore = defineStore("PaymentStore", {
  state: (): { Payments: crediT[] } => {
    return {
      Payments: [],
    };
  },
  actions: {
    getAllPayments: async function () {},
    createPayment: async function (Payment: newPaymentT) {},
    deleteOnePayment: async function (id: number) {},
  },
});
