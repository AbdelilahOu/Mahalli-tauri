<script setup lang="ts">
import ChartHolder from "@/components/ChartHolder.vue";
import { onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import {
  VisXYContainer,
  VisGroupedBar,
  VisAxis,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";
import { Donut, GroupedBar } from "@unovis/ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invoke } from "@tauri-apps/api";
import { ref } from "vue";
import type { Res } from "@/types";

const { t, d } = useI18n();

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
  return Math.abs(num) > 999
    ? (Math.abs(num) / 1000).toFixed(1) + "K"
    : Math.abs(num);
}
async function getInventoryMouvementStats() {
  try {
    const res = await invoke<Res<mouvementsT[]>>("list_mvm_stats");
    if (!res?.error) {
      const result = res.data.reduce((acc, item) => {
        const { createdAt, mvmType, quantity, price } = item;

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
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

const bestClients = ref<any[]>();
async function getBestClients() {
  try {
    const res = await invoke<Res<any[]>>("list_top_clients");
    if (!res?.error) {
      bestClients.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

const bestSuppliers = ref<any[]>();
async function getBestSuppliers() {
  try {
    console.log(await invoke<Res<any[]>>("list_status_count"));
    const res = await invoke<Res<any[]>>("list_top_suppliers");
    if (!res?.error) {
      bestSuppliers.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

const statusCounts = ref<any>();
async function getStatusCounts() {
  try {
    const res = await invoke<Res<any[]>>("list_status_count");
    if (!res?.error) {
      statusCounts.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}

onBeforeMount(async () => {
  getInventoryMouvementStats();
  getBestClients();
  getBestSuppliers();
  getStatusCounts();
});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 col-span-2 gap-4">
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium"> Orders </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </CardHeader>
          <CardContent class="flex justify-start gap-2">
            <Badge
              v-for="(status, index) in statusCounts.orders"
              :key="index"
              variant="secondary"
              class="rounded-sm h-8 w-full"
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
            <CardTitle class="text-sm font-medium"> Invoices </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </CardHeader>
          <CardContent class="flex justify-start gap-2">
            <Badge
              v-for="(status, index) in statusCounts.invoices"
              :key="index"
              variant="secondary"
              class="rounded-sm h-8 w-full"
            >
              {{ status.status_count }}
              {{ t("g.status." + status.status.toLowerCase()) }}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
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
              <VisAxis type="x" label="months" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" label="quantity" />
              <VisTooltip :triggers="barQuantityTriggers" />
              <VisBulletLegend
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
              <i>{{ t("dashboard.i.title") }}</i>
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
              <VisAxis type="x" label="months" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" label="price in DH" />
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
              <i>{{ t("dashboard.i.title") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full flex gap-4 h-full">
        <div class="w-1/2 h-full">
          <ChartHolder>
            <template #default>
              <div v-if="bestClients" class="w-full h-full flex flex-col gap-2">
                <VisBulletLegend
                  class="text-left my-2"
                  :items="
                    bestClients?.map((a) => ({
                      name: a.Fullname + ' : ' + numberToK(a.price) + ' DH',
                    }))
                  "
                />

                <VisSingleContainer :data="bestClients">
                  <VisDonut
                    :cornerRadius="5"
                    :padAngle="0.01"
                    :value="(d: any) => d.price"
                    :events="{
                      [Donut.selectors.segment]: {
                        mouseover: (d: any) => '<span>' + 50 + ' DH</span>',
                      },
                    }"
                  />
                </VisSingleContainer>
              </div>
            </template>
            <template #title>
              <h1 class="m-2 w-full text-center text-base font-medium">
                <i>{{ t("dashboard.i.b3c") }}</i>
              </h1>
            </template>
          </ChartHolder>
        </div>
        <div class="w-1/2 h-full">
          <ChartHolder>
            <template #default>
              <div
                v-if="bestSuppliers"
                class="w-full h-full flex flex-col gap-2"
              >
                <VisBulletLegend
                  class="text-left my-2"
                  :items="
                    bestSuppliers?.map((a) => ({
                      name: a.Fullname + ' : ' + numberToK(a.price) + ' DH',
                    }))
                  "
                />
                <VisSingleContainer v-if="bestSuppliers" :data="bestSuppliers">
                  <VisDonut
                    :cornerRadius="5"
                    :padAngle="0.01"
                    :value="(d: any) => d.price"
                  />
                </VisSingleContainer>
              </div>
            </template>
            <template #title>
              <h1 class="m-2 w-full text-center text-base font-medium">
                <i>
                  {{ t("dashboard.i.b3s") }}
                </i>
              </h1>
            </template>
          </ChartHolder>
        </div>
      </div>
    </div>
  </main>
</template>
