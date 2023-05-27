import type { invoiceT, FilteredStockData } from "@/types";
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

type resultPRD = [{ [key: string]: number[] }, string[], string[]];
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
    getOrderedProduct: async function (id: number): Promise<resultPRD> {
      const result: { [key: string]: { [key: string]: number } } = {};
      const existingDates: string[] = [];
      const existingProducts: string[] = [];

      const data: { data: string }[] = await this.db.select(
        `
        SELECT json_object(
        'invoiceItems', (
            SELECT json_group_array(
                json_object(
                    'product', json_object(
                      'name', p.name,
                      'quantity', ABS(ii.quantity)
                    )
                )
            )
            FROM invoice_items ii
            INNER JOIN products p ON ii.product_id = p.id
            WHERE ii.invoice_id = i.id
        )
    ) AS data
    FROM invoices i
    WHERE i.client_id = 1
    ORDER BY i.id DESC
    ;
        `
      );

      console.log(data.map((a) => JSON.parse(a.data)));

      let dataPerProduct: { [key: string]: number[] } = {};

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
