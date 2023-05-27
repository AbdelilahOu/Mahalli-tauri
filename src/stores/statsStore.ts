import type { invoiceT, FilteredStockData, stockMvmT } from "@/types";
import { inOutStatsJoins } from "@/database/dbQueryJson";
import { defineStore } from "pinia";

const getMonth = (i: number) => {
  const SplitedCurr = new Date().toLocaleDateString("us-us").split("/");
  SplitedCurr[1] = "15";
  return new Date(
    new Date(SplitedCurr.join("/")).getTime() - i * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("fr-fr", {
    month: "long",
  });
};

type resultMVM = [result: FilteredStockData, months: [string, string, string]];
type resultPRD = [{ [key: string]: number[] }, string[], string[]];
type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

const olderThanThreeMonths = (date: string): boolean =>
  new Date(date) >
  new Date(new Date().getTime() - 2 * 30 * 24 * 60 * 60 * 1000);

export const useStatsStore = defineStore("StatsStore", {
  state: () => {
    return {};
  },
  actions: {
    getStockMouvementStats: async function (stocks: stockMvmT[]) {
      const months: string[] = [];
      //
      const Rows: inOutReType = await this.db.select(inOutStatsJoins);
      //
      const results = new Map<string, { IN: number; OUT: number }>();
      //
      for (const { group_month, total_in, total_out } of Rows) {
        const month = new Date(group_month).toLocaleDateString("fr-fr", {
          month: "long",
        });
        months.push(month);
        results.set(month, {
          IN: total_in,
          OUT: Math.abs(total_out),
        });
      }
      return {
        // @ts-ignore
        result: Object.fromEntries(results) as FilteredStockData,
        months,
      };
    },
    getOrderedProduct: (id: number, invoices: invoiceT[]): resultPRD => {
      const result: { [key: string]: { [key: string]: number } } = {};
      const existingDates: string[] = [];
      const existingProducts: string[] = [];

      let FiltredItems: {
        [key: string]: { quantity: number; name: string }[];
      } = invoices
        .filter((invoice) => invoice.client_id == id)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
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
        result[date] = FiltredItems[date].reduce((pre, cur) => {
          !existingProducts.includes(cur.name)
            ? existingProducts.push(cur.name)
            : existingProducts;
          pre[cur.name] = pre[cur.name] || 0;
          pre[cur.name] += cur.quantity;
          return pre;
        }, Object.create(null));
      }

      let dataPerProduct: { [key: string]: number[] } = {};

      for (const product of existingProducts) {
        dataPerProduct[product] = [];
        for (const date of existingDates) {
          dataPerProduct[product].push(result[date][product] ?? 0);
        }
      }

      return [dataPerProduct, existingDates, existingProducts];
    },
    ////////////////// GET FROM DB /////////////
    getPastThreeMonths: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    getBestThreeClients: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    getBestThreeVendors: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    getBestThreeProducts: async function () {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },
});
