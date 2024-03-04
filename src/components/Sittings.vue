<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";
import UiModalCard from "./ui/UiModalCard.vue";

const isLoading = ref<boolean>(false);

const exportDatabase = async () => {
  // isLoading.value = true;
  // try {
  //   await invoke("export_db_csv");
  // } catch (err:any) {
  //   error("Error creating client : " + err.error);
  // } finally {
  //   isLoading.value = false;
  //   store.setters.updateStore({ key: "show", value: false });
  // }
};

const importDatabase = async () => {
  // isLoading.value = true;
  // try {
  //   await invoke("seed_db");
  // } catch (err:any) {
  //   error("Error creating client : " + err.error);
  // } finally {
  //   isLoading.value = false;
  //   store.setters.updateStore({ key: "show", value: false });
  // }
};
</script>

<template>
  <UiModalCard>
    <template #title> Sittings </template>
    <template #content>
      <div class="h-full w-full flex flex-col gap-2">
        <div class="w-full h-10 grid grid-cols-2 items-center">
          <span class="font-semibold text-lg">Export database as csv</span>
          <Button
            :disabled="isLoading"
            variant="default"
            @click="exportDatabase"
          >
            <UiIcon
              class="cursor-default hover:bg-transparent mr-2"
              name="export"
            />
            Export
          </Button>
        </div>
        <div class="w-full h-10 grid grid-cols-2 items-center">
          <span class="font-semibold text-lg">Use fake data</span>
          <Button
            :disabled="isLoading"
            variant="default"
            @click="importDatabase"
          >
            <!-- <UiIcon
            class="cursor-default hover:bg-transparent mr-2"
            name="export"
          /> -->
            Use
          </Button>
        </div>
      </div>
    </template>
  </UiModalCard>
</template>
