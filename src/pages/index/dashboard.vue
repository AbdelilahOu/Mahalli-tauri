<script setup lang="ts">
import ChartHolder from "@/components/ChartHolder.vue";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Res } from "@/types";
import { cn } from "@/utils/shadcn";
import { invoke } from "@tauri-apps/api";
import { GroupedBar } from "@unovis/ts";
import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";
import { DollarSign, NotepadText, Truck } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

interface mouvementsT {
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
const mouvements = ref<groupedMvm>();
const mouvementsLabels = ref<string[]>([]);
const tickFormatToDate = (i: number) => {
  if (i % 1 != 0) return "";
  return new Date(mouvementsLabels.value[i]).toLocaleDateString("fr-fr", {});
};
const barQuantityTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedMvm[string], i: number) => {
    let mvmType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    return (
      "<span>" +
      t("g.plrz.i", { n: d[mvmType].quantity.toFixed(2) }) +
      "</span>"
    );
  },
};
const barPriceTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedMvm[string], i: number) => {
    let mvmType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    return "<span>" + d[mvmType].price.toFixed(2) + " DH</span>";
  },
};
function numberToK(num: number) {
  return Intl.NumberFormat(locale.value, { notation: "compact" }).format(num);
}
async function getInventoryMouvementStats() {
  try {
    const res = await invoke<Res<mouvementsT[]>>("list_mvm_stats");
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

    mouvements.value = result;
    let mouvementLabelsSet = new Set<string>(Object.keys(mouvements.value));
    mouvementsLabels.value = [...mouvementLabelsSet];
  } catch (err: any) {
    error("STATS INVENTORY MOUVEMENTS: " + err);
  }
}

const bestClients = ref<any[]>();
async function getBestClients() {
  try {
    const res = await invoke<Res<any[]>>("list_top_clients");
    //
    bestClients.value = res.data;
  } catch (err: any) {
    error("STATS BEST CLIENTS: " + err);
  }
}

const bestSuppliers = ref<any[]>();
async function getBestSuppliers() {
  try {
    const res = await invoke<Res<any[]>>("list_top_suppliers");
    //
    bestSuppliers.value = res.data;
  } catch (err: any) {
    error("STATS BEST SUPPLIERS: " + err);
  }
}

const statusCounts = ref<any>();
async function getStatusCounts() {
  try {
    const res = await invoke<Res<any[]>>("list_status_count");
    //
    statusCounts.value = res.data;
  } catch (err: any) {
    error("STATS STATUS COUNT: " + err);
  }
}

const revenue = ref<any>();
async function getRevenue() {
  try {
    const res = await invoke<Res<any>>("list_revenue");

    let data = res.data.revenue[0];
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
    error("STATS REVENUE: " + err);
  }
}

const expenses = ref<any>();
async function getExpenses() {
  try {
    const res = await invoke<Res<any>>("list_expenses");
    let data = res.data.expenses[0];
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
    error("STATS EXPENSES: " + err);
  }
}

onBeforeMount(async () => {
  await Promise.all([
    getRevenue(),
    // getExpenses(),
    getInventoryMouvementStats(),
    getBestClients(),
    // getBestSuppliers(),
    getStatusCounts(),
  ]);
});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-2">
      <div class="grid grid-cols-2 col-span-2 gap-2">
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("dashboard.i.revenue") }}
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ revenue?.currentRevenue.toFixed(2) }} DH
            </div>
            <p class="text-xs text-muted-foreground">
              {{ revenue?.percentageDeff < 0 ? "-" : "+" }}
              {{ t("dashboard.i.growth", { n: revenue?.percentageDeff }) }}
            </p>
          </CardContent>
        </Card>
        <div class="flex-1 grid grid-cols-2 gap-2">
          <Card>
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">
                {{ t("g.r.Orders") }}</CardTitle
              >
              <Truck class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent class="flex justify-start gap-2 py-3">
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
          <Card class="lg:order-4">
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">
                {{ t("g.r.Invoices") }}
              </CardTitle>
              <NotepadText class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent class="flex justify-start gap-2 py-3">
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
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="mouvements"
              :data="Object.values(mouvements)"
              :height="500"
            >
              <VisGroupedBar
                :barPadding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.quantity, (d: any) => d.OUT.quantity]"
              />
              <VisAxis type="x" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.quantity')" />
              <VisTooltip :triggers="barQuantityTriggers" />
              <VisBulletLegend
                class="text-left my-2"
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
              v-if="mouvements"
              :data="Object.values(mouvements)"
              :height="500"
            >
              <VisGroupedBar
                :barPadding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.price, (d: any) => d.OUT.price]"
              />
              <VisAxis type="x" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.price') + ' (DH)'" />
              <VisTooltip :triggers="barPriceTriggers" />
              <VisBulletLegend
                class="text-left my-2"
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
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="bestClients"
              :data="bestClients"
              :height="500"
            >
              <VisGroupedBar
                :barPadding="0.1"
                :x="(d: any, index: number) => index"
                :y="(d: any) => d.price"
              />
              <VisAxis
                type="x"
                :tickFormat="
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
    </div>
  </main>
</template>
