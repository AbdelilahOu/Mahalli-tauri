import { groupBy, reduce, keys, values, mapValues } from "lodash";
import type { FilteredInventoryData, inOutReType } from "@/types";
import { defineComponent, onBeforeMount, reactive } from "vue";
import { ChartDoughnut } from "@/components/ChartDoughnut";
import { globalTranslate } from "@/utils/globalTranslate";
import { chartOptions } from "@/constants/chartOptions";
import { ChartHolder } from "@/components/ChartHolder";
import { generateColor } from "@/utils/generateColor";
import { ChartLine } from "@/components/ChartLine";
import { ChartBar } from "@/components/ChartBar";
import { invoke } from "@tauri-apps/api";
import { getWeekDay } from "@/utils/formatDate";

export const StatsView = defineComponent({
  name: "Stats",
  components: { ChartBar, ChartLine },
  setup() {
    const InsOuts = reactive({
      keys: ["IN", "OUT"] as const,
      months: [] as string[],
      data: {} as FilteredInventoryData,
    });

    const BestThree = reactive({
      client: {
        keys: [] as string[],
        data: [] as number[],
      },
      seller: {
        keys: [] as string[],
        data: [] as number[],
      },
    });

    async function getInventoryMouvementStats() {
      const results = new Map<string, { IN: number; OUT: number }>();
      const months = new Set<string>();
      //
      const Rows: inOutReType = await invoke("get_inventory_stats");
      //
      for (const { group_month, total_in: IN, total_out: OUT } of Rows) {
        const month = new Date(group_month).toLocaleDateString("en-us", {
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
    }
    async function getProductPerMonth(id: number, isClient = true) {
      const data: any[] = await invoke(
        isClient ? "get_c_product_month" : "get_s_product_month",
        { id }
      );

      const existingDates = keys(groupBy(data, "month"));
      const existingProducts = keys(groupBy(data, "name"));
      const dataPerProduct = mapValues(groupBy(data, "name"), (value) =>
        reduce(
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
    }
    async function getBestThree(isClients = true) {
      const data: { name: string; amount: number }[] = await invoke(
        isClients ? "get_b3_clients" : "get_b3_sellers"
      );
      //
      const result = mapValues(groupBy(data, "name"), (value) =>
        reduce(value, (pr, cr) => (pr += cr.amount), 0)
      );
      //
      return { names: keys(result), result: values(result) };
    }
    async function getDailyExpenses(id: number, isClient = true) {
      const result: { day: string; expense: number }[] = await invoke(
        isClient ? "get_c_week_expenses" : "get_s_week_expenses",
        { id }
      );

      console.log(
        result,
        isClient,
        isClient ? "get_c_week_expenses" : "get_s_week_expenses"
      );
      // date related
      const nextDay = new Date().getDay() == 6 ? 0 : new Date().getDay() + 1;
      const resultMap = new Map<string, number>();
      const weekDays = [0, 1, 2, 3, 4, 5, 6];

      for (const index of weekDays) {
        resultMap.set(getWeekDay(index), 0);
      }

      for (const { day, expense } of result) {
        console.log(
          day,
          new Date(day).toLocaleDateString("en-us", {
            weekday: "short",
          })
        );
        resultMap.set(
          new Date(day).toLocaleDateString("en-us", {
            weekday: "short",
          }),
          expense
        );
      }

      // @ts-ignore
      const K = keys(Object.fromEntries(resultMap));
      // @ts-ignore
      const V = values(Object.fromEntries(resultMap));
      const rearrangedKeys = K.slice(nextDay).concat(K.slice(0, nextDay));
      const rearrangedValues = V.slice(nextDay).concat(V.slice(0, nextDay));

      return {
        keys: rearrangedKeys,
        values: rearrangedValues,
      };
    }

    onBeforeMount(async () => {
      const InOutStats = await getInventoryMouvementStats();
      InsOuts.months = InOutStats.months.reverse();
      InsOuts.data = InOutStats.result;

      const TopClients = await getBestThree();
      const TopSellers = await getBestThree(false);

      BestThree.client.keys = TopClients.names;
      BestThree.client.data = TopClients.result;

      BestThree.seller.keys = TopSellers.names;
      BestThree.seller.data = TopSellers.result;
    });

    return () => (
      <main class="w-full h-full px-3 py-1">
        <div class="w-full h-full flex flex-col gap-4">
          <div class="w-full h-fit ">
            <ChartHolder>
              {{
                default: () => (
                  <ChartBar
                    id="inventory-mouvements-for-past-three-months"
                    chartData={{
                      labels: InsOuts.months,
                      datasets: InsOuts.keys.map((model, index) => {
                        const color = generateColor();
                        return {
                          label: globalTranslate(`Stats.Labels[${index}]`),
                          backgroundColor: color,
                          borderColor: color.replace("0.2", "0.5"),
                          data: InsOuts.months.map(
                            (month) => InsOuts.data[month][model] ?? 0
                          ),
                          borderWidth: 2,
                        };
                      }),
                    }}
                    chartOptions={chartOptions}
                  />
                ),
                title: () => (
                  <h1 class="m-2 w-full text-center text-base font-medium">
                    <i>{globalTranslate("Stats.Title")}</i>
                  </h1>
                ),
              }}
            </ChartHolder>
          </div>
          <div class="w-full flex gap-4 lg:justify-start justify-between h-full">
            <div class="w-1/2 h-full">
              <ChartHolder>
                {{
                  default: () => (
                    <ChartDoughnut
                      id="doughnut"
                      chartData={{
                        labels: BestThree.client.keys,
                        datasets: [
                          {
                            backgroundColor: BestThree.client.keys.map(() =>
                              generateColor().replace("0.2", "0.5")
                            ),
                            data: BestThree.client.data,
                          },
                        ],
                      }}
                      chartOptions={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  ),
                  title: () => (
                    <h1 class="m-2 w-full text-center text-base font-medium">
                      <i>Best clients based on expenses</i>
                    </h1>
                  ),
                }}
              </ChartHolder>
            </div>
            <div class=" w-1/2 h-full">
              <ChartHolder>
                {{
                  default: () => (
                    <ChartDoughnut
                      id="doughnut"
                      chartData={{
                        labels: BestThree.seller.keys,
                        datasets: [
                          {
                            backgroundColor: BestThree.seller.keys.map(() =>
                              generateColor().replace("0.2", "0.5")
                            ),
                            data: BestThree.seller.data,
                          },
                        ],
                      }}
                      chartOptions={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  ),
                  title: () => (
                    <h1 class="m-2 w-full text-center text-base font-medium">
                      <i>Best sellers based on expenses</i>
                    </h1>
                  ),
                }}
              </ChartHolder>
            </div>
          </div>
        </div>
      </main>
    );
  },
});
