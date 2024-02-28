<script setup lang="ts">
import ChartHolder from "@/components/ChartHolder.vue";
import { onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { VisXYContainer, VisLine, VisAxis } from "@unovis/vue";

const { t, d } = useI18n();

async function getInventoryMouvementStats() {}

async function getBestThree(isClients = true) {}

onBeforeMount(async () => {});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col gap-4">
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default> </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("stats.i.title") }}</i>
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
                <i>{{ t("stats.i.b3c") }}</i>
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
                  {{ t("stats.i.b3s") }}
                </i>
              </h1>
            </template>
          </ChartHolder>
        </div>
      </div>
    </div>
  </main>
</template>
