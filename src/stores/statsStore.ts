import type {
  invoiceT,
  FilteredStockData,
  stockMvmT,
  productT,
  invoiceItemT,
} from "@/types";
import { defineStore } from "pinia";
import database from "@/database/db";

const getMonth = (i: number) =>
  new Date(
    new Date().getTime() - i * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("fr-fr", {
    month: "long",
  });

const olderThanThreeMonths = (date: string): boolean =>
  new Date(date) >
  new Date(new Date().getTime() - 2 * 30 * 24 * 60 * 60 * 1000);

export const useStatsStore = defineStore("StatsStore", {
  actions: {
    getStockMouvementStats: (
      stocks: stockMvmT[]
    ): [result: FilteredStockData, months: [string, string, string]] => {
      let result: FilteredStockData = {};
      const months: [string, string, string] = [
        getMonth(2),
        getMonth(1),
        getMonth(0),
      ];
      //group based on the month {january:[...]}
      let dataSet: { [key: string]: stockMvmT[] } = stocks
        .filter(({ date }) => olderThanThreeMonths(date))
        .map(({ date, quantity, model }) => ({
          date: new Date(date).toLocaleDateString("fr-fr", {
            month: "long",
          }),
          model,
          quantity,
        }))
        .reduce((r, { date, quantity, model }) => {
          r[date] = r[date] || [];
          r[date].push({ date, quantity, model });
          return r;
        }, Object.create(null));
      // group based on the model of the stock mouvmenet {january:{IN:[...],OUT:[...]}}
      for (const month of months) {
        if (dataSet[month]) {
          result[month] = dataSet[month].reduce((r, { model, quantity }) => {
            r[model] = r[model] || 0;
            r[model] += Math.abs(Number(quantity));
            return r;
          }, Object.create(null));
        }
      }
      return [result, months];
    },
    getOrderedProduct: (
      id: number,
      invoices: invoiceT[]
    ): [
      { [key: string]: { [key: string]: number } },
      string[],
      { [key: string]: string[] }
    ] => {
      const existingDates: string[] = [];
      const existingProduct: { [key: string]: string[] } = {};
      const result: { [key: string]: { [key: string]: number } } = {};

      let FiltredItems: {
        [key: string]: { quantity: number; name: string }[];
      } = invoices
        .filter((invoice) => invoice.client_id == id)
        .map((item) => ({
          date: new Date(item.created_at).toLocaleDateString("fr-fr", {
            month: "long",
          }),
          items: item.invoiceItems.map(({ quantity, product: { name } }) => ({
            quantity,
            name,
          })),
        }))
        .reduce((r, { date, items }) => {
          !existingDates.includes(date)
            ? existingDates.push(date)
            : existingDates;

          r[date] = r[date] || [];
          r[date].push(...items);
          return r;
        }, Object.create(null));

      for (const date of existingDates) {
        existingProduct[date] = [];

        result[date] = FiltredItems[date].reduce((pre, cur) => {
          !existingProduct[date].includes(cur.name)
            ? existingProduct[date].push(cur.name)
            : existingProduct[date];

          pre[cur.name] = pre[cur.name] || 0;
          pre[cur.name] += cur.quantity;
          return pre;
        }, Object.create(null));
      }

      return [result, existingDates, existingProduct];
    },
    ////////////////// GET FROM DB /////////////
    getPastThreeMonths: async function () {},
    getBestThreeClients: async function () {},
    getBestThreeVendors: async function () {},
    getBestThreeProducts: async function () {},
  },
});
