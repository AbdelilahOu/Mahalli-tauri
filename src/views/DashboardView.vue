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
} from "@unovis/vue";
import { Donut } from "@unovis/ts";
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

onBeforeMount(async () => {
  getInventoryMouvementStats();
  getBestClients();
  getBestSuppliers();
});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-4">
      <div class="w-full h-fit">
        <ChartHolder v-if="mouvements">
          <template #default>
            <VisXYContainer :data="Object.values(mouvements)" :height="500">
              <VisGroupedBar
                :barPadding="0.1"
                :x="(d: any, index: number) => index"
                :y="[
                  (d: any) => d.IN.quantity / 100,
                  (d: any) => d.OUT.quantity / 100,
                ]"
              />
              <VisAxis type="x" label="months" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" label="quantity 100 item" />
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
        <ChartHolder v-if="mouvements">
          <template #default>
            <VisXYContainer :data="Object.values(mouvements)" :height="500">
              <VisGroupedBar
                :barPadding="0.1"
                :x="(d: any, index: number) => index"
                :y="[
                  (d: any) => d.IN.price / 1000,
                  (d: any) => d.OUT.price / 1000,
                ]"
              />
              <VisAxis type="x" label="months" :tickFormat="tickFormatToDate" />
              <VisAxis type="y" label="price in 1000 DH" />
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
          <ChartHolder v-if="bestClients">
            <template #default>
              <VisSingleContainer :data="bestClients">
                <VisDonut
                  :cornerRadius="5"
                  :padAngle="0.01"
                  :value="(d: any) => d.price"
                  :events="{
                    [Donut.selectors.segment]: {
                      mouseover: (d: any) => console.log(d),
                    },
                  }"
                />
              </VisSingleContainer>
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
              <VisSingleContainer :data="bestSuppliers">
                <VisDonut
                  :cornerRadius="5"
                  :padAngle="0.01"
                  :value="(d: any) => d.price"
                />
              </VisSingleContainer>
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
