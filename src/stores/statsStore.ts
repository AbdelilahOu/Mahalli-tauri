import type { FilteredInventoryData } from "@/types";
import { defineStore } from "pinia";
import _ from "lodash";
import { invoke } from "@tauri-apps/api";

type inOutReType = {
  group_month: string;
  total_in: number;
  total_out: number;
}[];

export const useStatsStore = defineStore("StatsStore", {
  actions: {
    getInventoryMouvementStats: async function () {
      const results = new Map<string, { IN: number; OUT: number }>();
      const months = new Set<string>();
      //
      const Rows: inOutReType = await invoke("get_inventory_stats");
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
        result: Object.fromEntries(results) as FilteredInventoryData,
        months: Array.from(months),
      };
    },
    getProductPerMonth: async function (id: number, isClient = true) {
      console.log(id);
      const data: any[] = await invoke(
        isClient ? "get_c_product_month" : "get_s_product_month",
        { id }
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
      const data: { name: string; amount: number }[] = await invoke(
        isClients ? "get_b3_clients" : "get_b3_sellers"
      );
      //
      const result = _.mapValues(_.groupBy(data, "name"), (value) =>
        _.reduce(value, (pr, cr) => (pr += cr.amount), 0)
      );
      //
      return { names: _.keys(result), result: _.values(result) };
    },
    getDailyExpenses: async function (id: number, isClient = true) {
      const result: { day: string; expense: number }[] = await invoke(
        isClient ? "get_c_week_expenses" : "get_s_week_expenses",
        { id }
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
