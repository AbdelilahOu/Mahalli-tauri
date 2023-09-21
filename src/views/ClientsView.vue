<script setup lang="ts">
import {
  ref,
  computed,
  onBeforeMount,
  onUnmounted,
  provide,
  watch,
  type WatchStopHandle,
} from "vue";
import { useRouter } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import ClientsTable from "@/components/ClientsTable.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { clientT, withCount } from "@/types";
import UiIcon from "@/components/ui/UiIcon.vue";

const router = useRouter();
const { updateQueryParams } = useUpdateRouteQueryParams();

const clients = ref<clientT[]>([]);
const searchQuery = ref<string>("");
const page = computed(() => Number(router.currentRoute.value.query.page));
const refresh = computed(() => router.currentRoute.value.query.refresh);

const totalRows = ref<number>(0);
let unwatch: WatchStopHandle | null = null;

provide("count", totalRows);

onBeforeMount(() => getClients(page.value));

onUnmounted(() => {
  if (unwatch) unwatch();
});

const getClients = async (page: number = 1) => {
  try {
    const res = await invoke<withCount<clientT[]>>("get_clients", {
      page,
    });
    if (res?.data.length) {
      clients.value = res.data;
      totalRows.value = res.count;
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadCSV = () => {
  store.setters.updateStore({ key: "name", value: "CsvUploader" });
  store.setters.updateStore({ key: "show", value: true });
  updateQueryParams({ table: "clients" });
};

const updateModal = (name: string) => {
  store.setters.updateStore({ key: "show", value: true });
  store.setters.updateStore({ key: "name", value: name });
};
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <Transition appear>
        <div class="flex justify-between w-full gap-9 mb-1">
          <div class="w-1/3">
            <Input
              v-model="searchQuery"
              type="text"
              :placeHolder="globalTranslate('Global.search')"
            >
              <UiIcon
                class="fill-gray-400 cursor-default hover:bg-white"
                name="search"
              />
            </Input>
          </div>
          <div class="w-1/3 grid grid-cols-[60px_1fr] gap-1">
            <Button variant="ghost" @click="uploadCSV">
              <span
                class="fill-sky-500 transition-all duration-200 scale-[0.8] group-hover:fill-sky-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                ></svg>
              </span>
            </Button>
            <Button @click="() => updateModal('ClientCreate')">
              <UiIcon
                class="fill-white cursor-default hover:bg-transparent"
                name="add"
              />
              {{ globalTranslate("Clients.index.addButton") }}
            </Button>
          </div>
        </div>
      </Transition>

      <Transition appear>
        <ClientsTable :clients="clients" />
      </Transition>
    </div>
  </main>
</template>
