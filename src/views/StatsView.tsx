import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import { chartOptions } from "@/constants/chartOptions";
import { useStatsStore } from "@/stores/statsStore";
import { ChartLine } from "@/components/ChartLine";
import { ChartBar } from "@/components/ChartBart";
import type { FilteredStockData } from "@/types";
import { generateColor } from "@/utils/generateColor";
import { ChartDoughnut } from "@/components/ChartDoughnut";

export const StatsView = defineComponent({
  name: "Stats",
  components: { ChartBar, ChartLine },
  setup() {
    const InsOuts = reactive({
      keys: ["IN", "OUT"] as const,
      months: [] as string[],
      data: {} as FilteredStockData,
    });

    onBeforeMount(async () => {
      const { result, months: resultMonths } =
        await useStatsStore().getStockMouvementStats();
      InsOuts.months = resultMonths.reverse();
      InsOuts.data = result;
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
          <div class="w-full h-full flex">
            <ChartDoughnut
              id="doughnut"
              chartData={{
                labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
                datasets: [
                  {
                    backgroundColor: [
                      "#41B883",
                      "#E46651",
                      "#00D8FF",
                      "#DD1B16",
                    ],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
              chartOptions={{ responsive: true, maintainAspectRatio: false }}
            />
            {/* <ChartDoughnut
              id="doughnutsjkdlkfds"
              chartData={{
                labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
                datasets: [
                  {
                    backgroundColor: [
                      "#41B883",
                      "#E46651",
                      "#00D8FF",
                      "#DD1B16",
                    ],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
              chartOptions={{ responsive: true, maintainAspectRatio: false }}
            /> */}
          </div>
        </div>
      </main>
    );
  },
});
