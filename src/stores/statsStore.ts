import type { FilteredStockData } from "@/types";
import { clientDetailsJoins, inOutStatsJoins } from "@/database/dbQueryJson";
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

type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

export const useStatsStore = defineStore("StatsStore", {
  state: () => {
    return {};
  },
  actions: {
    getStockMouvementStats: async function () {
      const results = new Map<string, { IN: number; OUT: number }>();
      const months = new Set<string>();
      //
      const Rows: inOutReType = await this.db.select(inOutStatsJoins);
      //
      for (const { group_month, total_in: IN, total_out: OUT } of Rows) {
        const month = new Date(group_month).toLocaleDateString("fr-fr", {
          month: "long",
        });
        months.add(month);
        results.set(month, { IN, OUT: Math.abs(OUT) });
      }
      return {
        // @ts-ignore
        result: Object.fromEntries(results) as FilteredStockData,
        months: Array.from(months),
      };
    },
    getOrderedProduct: async function (id: number) {
      const existingDates = new Set<string>();
      const existingProducts = new Set<string>();

      const data: any[] = await this.db.select(clientDetailsJoins);
      let dataPerProduct: { [key: string]: number[] } = {};

      for (const row of data) {
        existingDates.add(row.month);
        existingProducts.add(row.name);
        if (!dataPerProduct[row.name]) dataPerProduct[row.name] = [];
        dataPerProduct[row.name].push(row.quantity ?? 0);
      }

      return {
        data: dataPerProduct,
        dates: Array.from(existingDates),
        products: Array.from(existingProducts),
      };
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
