<script setup lang="ts">
import ChartHolder from "@/components/ChartHolder.vue";
import { onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import {
  VisXYContainer,
  VisGroupedBar,
  VisAxis,
  VisStackedBar,
} from "@unovis/vue";

import { invoke } from "@tauri-apps/api";
import { ref } from "vue";
import type { DataRecord, Res } from "@/types";
import { object } from "zod";

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

const mouvements = ref<groupedMvm>();
const mouvementsLabels = ref<string[]>([]);
const tickFormatToDate = (i: number) => {
  if (i % 1 != 0) return "";
  console.log(
    new Date(mouvementsLabels.value[i]).toLocaleDateString("fr-fr", {}),
  );
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

onBeforeMount(async () => {
  getInventoryMouvementStats();
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
          <ChartHolder>
            <template #default> </template>
            <template #title>
              <h1 class="m-2 w-full text-center text-base font-medium">
                <i>{{ t("dashboard.i.b3c") }}</i>
              </h1>
            </template>
          </ChartHolder>
        </div>
        <div class="w-1/2 h-full">
          <ChartHolder>
            <template #default> </template>
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
