import { defineComponent, onBeforeMount, reactive } from "vue";
import { ChartDoughnut } from "@/components/ChartDoughnut";
import { globalTranslate } from "@/utils/globalTranslate";
import { chartOptions } from "@/constants/chartOptions";
import { ChartHolder } from "@/components/ChartHolder";
import { generateColor } from "@/utils/generateColor";
import { useStatsStore } from "@/stores/statsStore";
import { ChartLine } from "@/components/ChartLine";
import { ChartBar } from "@/components/ChartBar";
import type { FilteredStockData } from "@/types";

export const StatsView = defineComponent({
  name: "Stats",
  components: { ChartBar, ChartLine },
  setup() {
    const statsStore = useStatsStore();

    const InsOuts = reactive({
      keys: ["IN", "OUT"] as const,
      months: [] as string[],
      data: {} as FilteredStockData,
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

    onBeforeMount(async () => {
      const InOutStats = await statsStore.getStockMouvementStats();
      InsOuts.months = InOutStats.months.reverse();
      InsOuts.data = InOutStats.result;

      const TopClients = await statsStore.getBestThree();
      const TopSellers = await statsStore.getBestThree(false);

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
                      datasets: InsOuts.keys.map((model) => {
                        const color = generateColor();
                        return {
                          label: globalTranslate("Stats.Labels[0]"),
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
