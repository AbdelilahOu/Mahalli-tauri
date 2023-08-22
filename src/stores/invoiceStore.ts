import { invoiceDetailsJoins, invoicesJoins } from "@/database/dbQueryJson";
import type { invoiceState, updateInvoiceT, newInvoiceT } from "@/types";
import { defineStore } from "pinia";

export const useInvoiceStore = defineStore("InvoiceStore", {
  state: (): invoiceState => {
    return {
      invoices: [],
      invoice: null,
    };
  },
  actions: {
    getAllInvoices: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    getOneInvoice: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    createOneInvoice: async function (invoice: newInvoiceT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    updateOneInvoice: async function (id: number, invoice: updateInvoiceT) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneInvoice: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneinvoiceItem: async function (id: number) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
