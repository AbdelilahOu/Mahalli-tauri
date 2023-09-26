<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";

const exportDatabase = async () => {
  try {
    await invoke("export_db_csv");
  } catch (error) {
    console.log(error);
  } finally {
    store.setters.updateStore({ key: "show", value: false });
  }
};

const importDatabase = async () => {
  try {
    await invoke("seed_db");
  } catch (error) {
    console.log(error);
  } finally {
    store.setters.updateStore({ key: "show", value: false });
  }
};
</script>

<template>
  <div
    class="w-1/2 h-fit z-50 gap-3 rounded-[4px] flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      Sittings
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <div class="w-full h-10 grid grid-cols-2 items-center">
        <span class="font-semibold text-lg">Export database as csv</span>
        <Button variant="default" @click="exportDatabase">
          <UiIcon
            class="cursor-default hover:bg-transparent mr-2"
            name="export"
          />
          Export
        </Button>
      </div>
      <div class="w-full h-10 grid grid-cols-2 items-center">
        <span class="font-semibold text-lg">Use fake data</span>
        <Button variant="default" @click="importDatabase">
          <UiIcon
            class="cursor-default hover:bg-transparent mr-2"
            name="export"
          />
          Export
        </Button>
      </div>
    </div>
  </div>
</template>
