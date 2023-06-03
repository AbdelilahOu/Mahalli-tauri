import { defineComponent, onBeforeMount, reactive } from "vue";
import { ChartDoughnut } from "@/components/ChartDoughnut";
import { globalTranslate } from "@/utils/globalTranslate";
import { chartOptions } from "@/constants/chartOptions";
import { generateColor } from "@/utils/generateColor";
import { useStatsStore } from "@/stores/statsStore";
import { ChartLine } from "@/components/ChartLine";
import { ChartBar } from "@/components/ChartBart";
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
      const { result, months: resultMonths } =
        await statsStore.getStockMouvementStats();
      InsOuts.months = resultMonths.reverse();
      InsOuts.data = result;

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
            <h1 class="uppercase text-gray-600 font-semibold mb-1">
              {globalTranslate("Stats.Title")}
            </h1>
            <ChartBar
              id="stock-mouvements-for-past-three-months"
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
          </div>
          <div class="w-full flex gap-4 px-4 h-full">
            <div class="w-1/2 h-full">
              <ChartDoughnut
                id="doughnut"
                chartData={{
                  labels: BestThree.client.keys,
                  datasets: [
                    {
                      backgroundColor: BestThree.client.keys.map(() =>
                        generateColor()
                      ),
                      data: BestThree.client.data,
                    },
                  ],
                }}
                chartOptions={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div class="w-1/2 h-full">
              <ChartDoughnut
                id="doughnut"
                chartData={{
                  labels: ["EmberJs", "ReactJs", "AngularJs"],
                  datasets: [
                    {
                      backgroundColor: [
                        generateColor().replace("0.2", "0.4"),
                        generateColor().replace("0.2", "0.4"),
                        generateColor().replace("0.2", "0.4"),
                      ],
                      data: [20, 80, 10],
                    },
                  ],
                }}
                chartOptions={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  },
});
