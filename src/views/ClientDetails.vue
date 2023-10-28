<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { invoke } from "@tauri-apps/api";
import { useRoute } from "vue-router";
import { CHART_OPTIONS, CHART_WO_TICKS } from "@/constants/defaultValues";
import { generateColor } from "@/utils/generateColor";
import { getWeekDay } from "@/utils/formatDate";
import { groupBy, keys, mapValues, values } from "@/utils/lightLodash";
import { store } from "@/store";
import ChartBar from "@/components/ChartBar.vue";
import ChartHolder from "@/components/ChartHolder.vue";
import ChartLine from "@/components/ChartLine.vue";
import type { clientT } from "@/types";
import UiCard from "@/components/ui/UiCard.vue";
import { useI18n } from "vue-i18n";

const { t, d } = useI18n();
const { id } = useRoute().params;
const client = ref<clientT | null>(null);

const ProductsStats = reactive({
  products: [] as { [key: string]: any; data: number[] }[],
  dates: [] as string[],
  data: {} as Record<string, number[]>,
});

const DailyStats = reactive({
  data: [] as number[],
  keys: [] as string[],
  color: generateColor(),
});

const getGradientBackground = (ctx: any) => {
  const canvas = ctx.chart.ctx;
  const gradient = canvas.createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, DailyStats.color.replace("0.2", "0.4"));
  gradient.addColorStop(1, DailyStats.color.replace("0.2", "0.07"));
  return gradient;
};

const getProductPerMonth = async (id: string) => {
  const data: any[] = await invoke("get_c_product_month", { id });

  const existingDates = keys(groupBy(data, "month"));
  const existingProducts = keys(groupBy(data, "name"));
  const dataPerProduct = mapValues(groupBy(data, "name"), (value: any[]) =>
    value.reduce((pr, cr) => {
      if (!pr) pr = [];
      pr.push(cr.quantity);
      return pr;
    }, [] as number[])
  );

  return {
    data: dataPerProduct,
    dates: existingDates,
    products: existingProducts,
  };
};

const getDailyExpenses = async (id: string) => {
  const result: { day: string; expense: number }[] = await invoke(
    "get_c_week_expenses",
    { id }
  );
  const nextDay = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1;
  const resultMap = new Map<string, number>();

  const weekDays = [0, 1, 2, 3, 4, 5, 6];

  for (const index of weekDays) {
    resultMap.set(getWeekDay(index), 0);
  }

  for (const { day, expense } of result) {
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
};

const toggleThisClient = (client: clientT | null, name: string) => {
  store.setters.updateStore({ key: "show", value: true });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "row", value: client });
};

onBeforeMount(async () => {
  const productStats = await getProductPerMonth(id as string);
  const dailyStats = await getDailyExpenses(id as string);

  DailyStats.keys = dailyStats.keys;
  DailyStats.data = dailyStats.values;

  ProductsStats.data = productStats.data;
  ProductsStats.dates = productStats.dates.map((pDate) =>
    d(new Date(pDate), "monthOnly")
  );
  ProductsStats.products = productStats.products.map((product) => {
    const color = generateColor();
    return {
      label: product,
      backgroundColor: color,
      borderColor: color.replace("0.2", "0.5"),
      data: ProductsStats.data[product],
      borderWidth: 2,
    };
  });
});

onBeforeMount(async () => {
  try {
    const res = await invoke<clientT>("get_client", { id });
    if (res.id) {
      client.value = res;
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <main class="w-full h-full px-3 py-1">
    <div
      class="w-full h-full text-black grid gap-4 xl:grid-cols-[400px_2px_1fr] xl:grid-rows-1 grid-rows-[260px_2px_1fr] grid-cols-1 print:pr-12"
    >
      <div
        class="w-full grid-cols-[400px_1fr] xl:grid-rows-[258px_1fr] xl:grid-cols-1 items-start justify-start gap-3 grid"
      >
        <UiCard
          title="Client information"
          @updateItem="toggleThisClient(client, 'ClientUpdate')"
          :item="client"
        />
        <div class="w-full flex items-end xl:items-start h-fit">
          <ChartLine
            id="sjdlsdksd"
            :chartData="{
              labels: DailyStats.keys,
              datasets: [
                {
                  label: 'daily expenses',
                  backgroundColor: getGradientBackground,
                  borderColor: DailyStats.color.replace('0.2', '0.5'),
                  data: DailyStats.data,
                  borderWidth: 2,
                  lineTension: 0.4,
                  pointRadius: 1,
                  fill: true,
                },
              ],
            }"
            :chartOptions="CHART_WO_TICKS"
          />
        </div>
      </div>
      <div class="xl:border-l-2 border-b-2"></div>
      <div class="w-full">
        <ChartHolder>
          <template #default>
            <ChartBar
              id="inventory-mouvements-for-past-three-months"
              :chartData="{
                labels: ProductsStats.dates,
                datasets: ProductsStats.products,
              }"
              :chartOptions="CHART_OPTIONS"
            />
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>
                {{ t("stats.de.title") }}
              </i>
            </h1>
          </template>
        </ChartHolder>
      </div>
    </div>
  </main>
</template>
