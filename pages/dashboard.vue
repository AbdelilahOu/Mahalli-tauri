<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { GroupedBar } from "@unovis/ts";
import {
  VisAxis,
  VisGroupedBar,
  VisBulletLegend,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";
import { DollarSign, NotepadText, Truck } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t, locale } = useI18n();

interface movementsT {
  createdAt: string;
  mvmType: "IN" | "OUT";
  quantity: number;
  price: number;
}

type groupedMvm = Record<
  string,
  Record<
    "IN" | "OUT",
    {
      quantity: number;
      price: number;
    }
  >
>;

const STATUS_COLORS = {
  CANCELED: "bg-red-100 border-red-500 text-red-900",
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  DELIVERED: "bg-green-100 border-green-500 text-green-900",
  PAID: "bg-green-100 border-green-500 text-green-900",
} as const;

//
const movements = ref<groupedMvm>();
const movementsLabels = ref<string[]>([]);
const tickFormatToDate = (i: number) => {
  if (i % 1 != 0) return "";
  return new Date(movementsLabels.value[i]).toLocaleDateString("fr-fr", {});
};
const barQuantityTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedMvm[string], i: number) => {
    const mvmType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    return "<span>" + t("g.plrz.i", { n: d[mvmType].quantity }) + "</span>";
  },
};
const barPriceTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedMvm[string], i: number) => {
    const mvmType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    return "<span>" + d[mvmType].price.toFixed(2) + " DH</span>";
  },
};

async function getInventoryMovementStats() {
  try {
    const res = await invoke<Res<movementsT[]>>("list_mvm_stats");
    const result = res.data.reduce((acc, item) => {
      const { createdAt: date, mvmType, quantity, price } = item;
      const createdAt = new Date(date).toISOString().split("T")[0];
      if (!acc[createdAt]) {
        acc[createdAt] = {
          IN: {
            quantity: 0,
            price: 0,
          },
          OUT: {
            quantity: 0,
            price: 0,
          },
        };
      }

      if (!acc[createdAt][mvmType]) {
        acc[createdAt][mvmType] = { quantity, price };
      } else {
        acc[createdAt][mvmType].quantity += quantity;
        acc[createdAt][mvmType].price += price;
      }

      return acc;
    }, {} as groupedMvm);

    movements.value = result;
    const movementLabelsSet = new Set<string>(Object.keys(movements.value));
    movementsLabels.value = [...movementLabelsSet];
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS INVENTORY MOUVEMENTS: " + err.error);
  }
}

const bestClients = ref<any[]>();
async function getBestClients() {
  try {
    const res = await invoke<Res<any[]>>("list_top_clients");
    //
    bestClients.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS BEST CLIENTS: " + err.error);
  }
}

const bestProducts = ref<any[]>();
async function getBestProducts() {
  try {
    const res = await invoke<Res<any[]>>("list_top_products");
    //
    bestProducts.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS BEST PRODUCTS: " + err.error);
  }
}

const statusCounts = ref<any>();
async function getStatusCounts() {
  try {
    const res = await invoke<Res<any[]>>("list_status_count");
    //
    statusCounts.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS STATUS COUNT: " + err.error);
  }
}

const revenue = ref<any>();
async function getRevenue() {
  try {
    const res = await invoke<Res<any>>("list_revenue");

    const data = res.data.revenue[0];
    let percentageDeff = (
      ((data?.currentRevenue - data?.lastMonthRevenue) /
        data?.lastMonthRevenue) *
      100
    ).toFixed(2);
    if (!data?.lastMonthRevenue) percentageDeff = "0";
    revenue.value = {
      percentageDeff,
      currentRevenue: data.currentRevenue,
    };
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS REVENUE: " + err.error);
  }
}

const expenses = ref<any>();
async function getExpenses() {
  try {
    const res = await invoke<Res<any>>("list_expenses");
    const data = res.data.expenses[0];
    let percentageDeff = (
      ((data?.currentExpenses - data?.lastMonthExpenses) /
        data?.lastMonthExpenses) *
      100
    )?.toFixed(2);
    if (!data?.lastMonthExpenses) percentageDeff = "0";
    expenses.value = {
      percentageDeff,
      currentExpenses: data.currentExpenses,
    };
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("STATS EXPENSES: " + err.error);
  }
}

onBeforeMount(async () => {
  await Promise.all([
    getRevenue(),
    getExpenses(),
    getInventoryMovementStats(),
    getBestClients(),
    getBestProducts(),
    getStatusCounts(),
  ]);
});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-2">
      <div class="grid grid-cols-1 lg:grid-cols-4 col-span-2 gap-2">
        <Card class="h-fit w-full">
          <CardHeader
            class="flex border-b-0 flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("dashboard.i.revenue") }}
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-0">
            <div class="text-2xl font-bold">
              {{ revenue?.currentRevenue.toFixed(2) }} DH
            </div>
            <p class="text-xs text-muted-foreground">
              {{ revenue?.percentageDeff < 0 ? "-" : "+" }}
              {{ t("dashboard.i.growth", { n: revenue?.percentageDeff }) }}
            </p>
          </CardContent>
        </Card>
        <Card class="h-fit w-full">
          <CardHeader
            class="flex border-b-0 flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("dashboard.i.expenses") }}
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-0">
            <div class="text-2xl font-bold">
              {{ expenses?.currentExpenses.toFixed(2) }} DH
            </div>
            <p class="text-xs text-muted-foreground">
              {{ expenses?.percentageDeff < 0 ? "-" : "+" }}
              {{ t("dashboard.i.growth", { n: expenses?.percentageDeff }) }}
            </p>
          </CardContent>
        </Card>
        <Card class="w-full">
          <CardHeader
            class="flex flex-row border-b-0 items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("g.r.Orders") }}</CardTitle
            >
            <Truck class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="flex justify-start flex-row gap-2 py-3">
            <Badge
              v-for="(status, index) in statusCounts?.orders"
              :key="index"
              variant="secondary"
              :class="
                // @ts-ignore
                cn('rounded-sm h-8 w-full', STATUS_COLORS[status.status])
              "
            >
              {{ status.status_count }}
              {{ t("g.status." + status.status.toLowerCase()) }}
            </Badge>
          </CardContent>
        </Card>
        <Card class="lg:order-4 w-full">
          <CardHeader
            class="flex flex-row items-center justify-between border-b-0 space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("g.r.Invoices") }}
            </CardTitle>
            <NotepadText class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="flex flex-row justify-start gap-2 py-3">
            <Badge
              v-for="(status, index) in statusCounts?.invoices"
              :key="index"
              variant="secondary"
              :class="
                // @ts-ignore
                cn('rounded-sm h-8 w-full', STATUS_COLORS[status.status])
              "
            >
              {{ status.status_count }}
              {{ t("g.status." + status.status.toLowerCase()) }}
            </Badge>
          </CardContent>
        </Card>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="bestClients"
              :data="bestClients"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="(d: any) => d.price"
              />
              <VisAxis
                type="x"
                :tick-format="
                  (i: number) => (bestClients ? bestClients[i].Fullname : i)
                "
              />
              <VisAxis type="y" :label="t('g.fields.price') + ' (DH)'" />
              <VisTooltip
                :triggers="{
                  [GroupedBar.selectors.bar]: (d: any) => {
                    return '<span>' + d.price + ' DH</span>';
                  },
                }"
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.b3c") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="bestProducts"
              :data="bestProducts"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="(d: any) => d.quantity"
              />
              <VisAxis
                type="x"
                :tick-format="
                  (i: number) => (bestProducts ? bestProducts[i].name : i)
                "
              />
              <VisAxis type="y" :label="t('g.fields.quantity')" />
              <VisTooltip
                :triggers="{
                  [GroupedBar.selectors.bar]: (d: any) => {
                    return (
                      '<span>' +
                      d.name +
                      ': ' +
                      t('g.plrz.i', { n: d.quantity }) +
                      '</span>'
                    );
                  },
                }"
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.bp") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="movements"
              :data="Object.values(movements)"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.quantity, (d: any) => d.OUT.quantity]"
              />
              <VisAxis type="x" :tick-format="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.quantity')" />
              <VisTooltip :triggers="barQuantityTriggers" />
              <VisBulletLegend
                class="my-2 m-auto w-fit"
                :items="
                  ['in', 'out'].map((a) => ({
                    name: t('g.status.' + a),
                  }))
                "
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.title") }} ({{ t("g.fields.item") }})</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="movements"
              :data="Object.values(movements)"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.price, (d: any) => d.OUT.price]"
              />
              <VisAxis type="x" :tick-format="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.price') + ' (DH)'" />
              <VisTooltip :triggers="barPriceTriggers" />
              <VisBulletLegend
                class="my-2 m-auto w-fit"
                :items="
                  ['in', 'out'].map((a) => ({
                    name: t('g.status.' + a),
                  }))
                "
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.title") }} (DH)</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
    </div>
  </main>
</template>
