<script setup lang="ts">
import { groupBy, keys, values, mapValues } from "@/utils/lightLodash";
import type { FilteredInventoryData, inOutReType } from "@/types";
import { onBeforeMount, reactive } from "vue";
import ChartDoughnut from "@/components/ChartDoughnut.vue";
import { CHART_OPTIONS } from "@/constants/defaultValues";
import { useI18n } from "vue-i18n";
import ChartHolder from "@/components/ChartHolder.vue";
import { generateColor } from "@/utils/generateColor";
import ChartBar from "@/components/ChartBar.vue";
import { invoke } from "@tauri-apps/api";

const { t } = useI18n();

const InsOuts = reactive({
  keys: [] as { [key: string]: any; data: number[] }[],
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

async function getBestThree(isClients = true) {
  const data: { name: string; amount: number }[] = await invoke(
    isClients ? "get_b3_clients" : "get_b3_sellers"
  );
  //
  const result = mapValues(groupBy(data, "name"), (value: any[]) =>
    value.reduce((pr, cr) => (pr += cr.amount), 0)
  );
  //
  return { names: keys(result), result: values(result) };
}

onBeforeMount(async () => {
  const labels = [t(`Stats.Labels[0]`), t(`Stats.Labels[1]`)];
  const InOutStats = await getInventoryMouvementStats();
  InsOuts.months = InOutStats.months.reverse();
  InsOuts.data = InOutStats.result;
  InsOuts.keys = ["IN", "OUT"].map((model, index) => {
    const color = generateColor();
    return {
      label: labels[index],
      backgroundColor: color,
      borderColor: color.replace("0.2", "0.5"),
      data: InsOuts.months.map(
        // @ts-ignore
        (month) => InsOuts.data[month][model] ?? 0
      ),
      borderWidth: 2,
    };
  });

  const TopClients = await getBestThree();
  const TopSellers = await getBestThree(false);

  BestThree.client.keys = TopClients.names;
  BestThree.client.data = TopClients.result;

  BestThree.seller.keys = TopSellers.names;
  BestThree.seller.data = TopSellers.result;
});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <ChartBar
              id="inventory-mouvements-for-past-three-months"
              :chartData="{
                labels: InsOuts.months,
                datasets: InsOuts.keys,
              }"
              :chartOptions="CHART_OPTIONS"
            />
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("stats.Title") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full flex gap-4 lg:justify-start justify-between h-full">
        <div class="w-1/2 h-full">
          <ChartHolder>
            <template #default>
              <ChartDoughnut
                id="doughnut"
                :chartData="{
                  labels: BestThree.client.keys,
                  datasets: [
                    {
                      backgroundColor: BestThree.client.keys.map(() =>
                        generateColor().replace('0.2', '0.5')
                      ),
                      data: BestThree.client.data,
                    },
                  ],
                }"
                :chartOptions="{
                  responsive: true,
                  maintainAspectRatio: false,
                }"
              />
            </template>
            <template #title>
              <h1 class="m-2 w-full text-center text-base font-medium">
                <i>Best clients based on expenses</i>
              </h1>
            </template>
          </ChartHolder>
        </div>
        <div class="w-1/2 h-full">
          <ChartHolder>
            <template #default>
              <ChartDoughnut
                id="doughnut"
                :chartData="{
                  labels: BestThree.seller.keys,
                  datasets: [
                    {
                      backgroundColor: BestThree.seller.keys.map(() =>
                        generateColor().replace('0.2', '0.5')
                      ),
                      data: BestThree.seller.data,
                    },
                  ],
                }"
                :chartOptions="{
                  responsive: true,
                  maintainAspectRatio: false,
                }"
              />
            </template>
            <template #title>
              <h1 class="m-2 w-full text-center text-base font-medium">
                <i>Best sellers based on expenses</i>
              </h1>
            </template>
          </ChartHolder>
        </div>
      </div>
    </div>
  </main>
</template>
