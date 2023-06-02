import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useStatsStore } from "@/stores/statsStore";
import { ChartLine } from "@/components/ChartLine";
import { ChartBar } from "@/components/ChartBart";
import type { FilteredStockData } from "@/types";
import { chartOptions } from "@/constants/chartOptions";

export const StatsView = defineComponent({
  name: "Stats",
  components: { ChartBar, ChartLine },
  setup() {
    // we got all the stock mouvements already
    const months = ref<string[]>([]);
    const stockData = ref<FilteredStockData>({});
    onBeforeMount(async () => {
      const { result, months: resultMonths } =
        await useStatsStore().getStockMouvementStats();
      months.value = resultMonths.reverse();
      stockData.value = result;
    });

    return () => (
      <main class="w-full h-full px-3 py-1">
        <div class="w-full h-full grid grid-cols-1 grid-rows-1">
          <div>
            <h1 class="uppercase text-gray-600 font-semibold mb-1">
              {globalTranslate("Stats.Title")}
            </h1>
            <ChartBar
              id="stock-mouvements-for-past-three-months"
              chartData={{
                labels: months.value,
                datasets: [
                  {
                    label: globalTranslate("Stats.Labels[0]"),
                    backgroundColor: "rgba(255, 200, 0, 0.2)",
                    borderColor: "rgba(255, 200, 0,0.5)",
                    data: months.value.map(
                      (month) => stockData.value[month]?.IN ?? 0
                    ),
                    borderWidth: 2,
                  },
                  {
                    label: globalTranslate("Stats.Labels[1]"),
                    data: months.value.map(
                      (month) => stockData.value[month]?.OUT ?? 0
                    ),
                    backgroundColor: "rgba(255, 200, 0, 0.6)",
                    borderColor: "rgba(255, 200, 0,1)",
                    borderWidth: 2,
                  },
                ],
              }}
              chartOptions={chartOptions}
            />
          </div>
          {/* <ChartLine
            id="stock-mouvements-for"
            chartData={{
              labels: ["January", "February", "March"],
              datasets: [
                {
                  label: "",
                  borderColor: "rgba(255, 200, 0,0.5)",
                  data: [11, 89, 10],
                  // borderWidth: 2,
                  tention: 0.3,
                },
                {
                  data: [13, 7, 97],
                  borderColor: "rgba(255, 200, 0,1)",
                  // borderWidth: 2,
                  tention: 0.5,
                },
              ],
            }}
            chartOptions={{
              responsive: true,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "rgba(25,23,17,0.6)",
                    textStrokeWidth: 10,
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    lineWidth: 1,
                    drawBorder: false,
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    color: "rgba(25,23,17,0.6)",
                    min: 0,
                    textStrokeWidth: 1,
                    padding: 10,
                  },
                },
              },
            }}
          /> */}
        </div>
      </main>
    );
  },
});
