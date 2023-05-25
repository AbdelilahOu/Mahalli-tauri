import type {
  clientT,
  orderT,
  crediT,
  editModalArgsT,
  invoiceT,
  modalsState,
  productT,
  sellerT,
} from "@/types";
import { defineStore } from "pinia";

export const useModalStore = defineStore("ModalStore", {
  state: (): modalsState => {
    return {
      theModal: {
        show: false,
        name: "",
      },
      client: null,
      product: null,
      seller: null,
      order: null,
      invoice: null,
      credi: null,
    };
  },
  actions: {
    updateModal: function ({ key, value }: editModalArgsT) {
      this.theModal[key] = value;
    },
    updatePaymentRow: async function (value: crediT | null) {
      this.credi = value;
    },
    updateClientRow: function (value: clientT | null) {
      this.client = value;
    },
    updateProductRow: function (value: productT | null) {
      this.product = value;
    },
    updateSellerRow: function (value: sellerT | null) {
      this.seller = value;
    },
    updateOrdersRow: function (value: orderT | null) {
      this.order = value;
    },
    updateInvoiceRow: function (value: invoiceT | null) {
      this.invoice = value;
    },
  },
});
