<script setup lang="ts">
import ChartHolder from "@/components/ChartHolder.vue";
import { onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { VisXYContainer, VisGroupedBar, VisAxis } from "@unovis/vue";

import { invoke } from "@tauri-apps/api";
import { ref } from "vue";
import type { DataRecord } from "@/types";

const { t, d } = useI18n();

const mouvements = ref<any[]>();
const x = (d: any) => {
  console.log(d);
  return d.createdAt;
};
const y = [(d: any) => d.price, (d: any) => d.quantity];

async function getInventoryMouvementStats() {
  try {
    const res = await invoke<any>("list_mvm_stats");
    if (!res?.error) {
      console.log(res);
      mouvements.value = res.data;
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
        <ChartHolder>
          <template #default>
            <VisXYContainer :height="500">
              <VisGroupedBar :data="mouvements" :x="x" :y="y" />
              <VisAxis type="x" label="Election Year" />
              <VisAxis type="y" label="Number of Votes (millions)" />
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
