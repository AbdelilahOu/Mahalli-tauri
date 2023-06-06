import {
  bestThreeClients,
  bestThreeSellers,
  clientDailyExpenses,
  clientDetailsJoins,
  inOutStatsJoins,
  sellerDailyExpenses,
  sellerDetailsJoins,
} from "@/database/dbQueryJson";
import type { FilteredStockData } from "@/types";
import { defineStore } from "pinia";
import _ from "lodash";

type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

export const useStatsStore = defineStore("StatsStore", {
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
    getProductPerMonth: async function (id: number, isClient: boolean = true) {
      const data: any[] = await this.db.select(
        isClient ? clientDetailsJoins : sellerDetailsJoins,
        [id]
      );

      const existingDates = _.keys(_.groupBy(data, "month"));
      const existingProducts = _.keys(_.groupBy(data, "name"));
      const dataPerProduct = _.mapValues(_.groupBy(data, "name"), (value) =>
        _.reduce(
          value,
          (pr, cr) => {
            if (!pr) pr = [];
            pr.push(cr.quantity);
            return pr;
          },
          [] as number[]
        )
      );

      return {
        data: dataPerProduct,
        dates: existingDates,
        products: existingProducts,
      };
    },
    getBestThree: async function (isClients = true) {
      const data: { name: string; amount: number }[] = await this.db.select(
        isClients ? bestThreeClients : bestThreeSellers
      );
      //
      const result = _.mapValues(_.groupBy(data, "name"), (value) =>
        _.reduce(value, (pr, cr) => (pr += cr.amount), 0)
      );
      //
      return { names: _.keys(result), result: _.values(result) };
    },
    getDailyExpenses: async function (id: number, isClient = true) {
      const result: { day: string; expense: number }[] = await this.db.select(
        isClient ? clientDailyExpenses : sellerDailyExpenses,
        [id, new Date(new Date().setDate(new Date().getDate() - 7))]
      );
      // date related
      const nextDay = new Date().getDay() == 6 ? 0 : new Date().getDay() + 1;
      const resultMap = new Map<number, number>();
      const weekDays = [0, 1, 2, 3, 4, 5, 6];

      for (const index of weekDays) {
        resultMap.set(index, 0);
      }

      for (const { day, expense } of result) {
        resultMap.set(new Date(day).getDay(), expense);
      }

      // @ts-ignore
      const K = _.keys(Object.fromEntries(resultMap));
      // @ts-ignore
      const V = _.values(Object.fromEntries(resultMap));
      const rearrangedKeys = K.slice(nextDay).concat(K.slice(0, nextDay));
      const rearrangedValues = V.slice(nextDay).concat(V.slice(0, nextDay));

      return {
        keys: rearrangedKeys,
        values: rearrangedValues,
      };
    },
  },
});
