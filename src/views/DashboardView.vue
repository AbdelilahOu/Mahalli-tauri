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

const { t, d } = useI18n();

const mouvements = ref<any[]>([]);
const mouvementsLabels = ref<string[]>([]);

async function getInventoryMouvementStats() {
  try {
    const res = await invoke<Res<any[]>>("list_mvm_stats");
    if (!res?.error) {
      mouvements.value = res.data;
      let mouvementLabelsSet = new Set<string>();
      res.data.forEach((a) => mouvementLabelsSet.add(a.createdAt));
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
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-fit">
        <ChartHolder v-if="mouvements">
          <template #default>
            <VisXYContainer :data="mouvements" :height="500">
              <VisGroupedBar
                :x="(_: any, index: number) => index"
                :y="(d: any) => d.quantity / 100"
              />
              <VisAxis type="x" label="months" />
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
            <VisXYContainer :data="mouvements" :height="500">
              <VisGroupedBar
                :x="(_: any, index: number) => index"
                :y="(d: any) => d.price"
              />
              <VisAxis type="x" label="months" />
              <VisAxis type="y" label="price in dh" />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.title") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full flex gap-4 lg:justify-start justify-between h-full">
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
