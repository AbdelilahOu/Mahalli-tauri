import type {
  invoiceState,
  updateInvoiceT,
  newInvoiceT,
  invoiceT,
} from "@/types";
import { invoke } from "@tauri-apps/api";
import { defineStore } from "pinia";

export const useInvoiceStore = defineStore("InvoiceStore", {
  state: (): invoiceState => {
    return {
      invoices: [],
      invoice: null,
    };
  },
  actions: {
    getAllInvoices: async function (page: number = 1) {
      try {
        this.invoices = await invoke("get_invoices", { page });
      } catch (error) {
        console.log(error);
      }
    },
    getOneInvoice: async function (id: number) {
      try {
        this.invoice = await invoke("get_invoice", { id });
      } catch (error) {
        console.log(error);
      }
    },
    createOneInvoice: async function (invoice: newInvoiceT) {
      try {
        const insertedInvoice = await invoke<invoiceT>("insert_invoice", {
          invoice,
        });
        this.invoices.unshift(insertedInvoice);
      } catch (error) {
        console.log(error);
      }
    },
    updateOneInvoice: async function (id: number, invoice: updateInvoiceT) {
      try {
        await invoke("update_invoice", { invoice, id });
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneInvoice: async function (id: number) {
      try {
        await invoke("delete_invoice", { id });
        this.invoices = this.invoices.filter((invoice) => invoice.id !== id);
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneinvoiceItem: async function (id: number) {
      try {
        await invoke("delete_invoice_items", { id });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
