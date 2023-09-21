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
            <Button @click="uploadCSV">
              <span
                class="fill-sky-400 transition-all duration-200 scale-[0.8] group-hover:fill-sky-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <!-- SVG Path for upload button -->
                </svg>
              </span>
            </Button>
            <Button @click="updateModal('OrderCreate')">
              <UiIcon
                class="fill-gray-900 cursor-default hover:bg-transparent"
                name="add"
              />
              {{ globalTranslate("Orders.index.addButton") }}
            </Button>
          </div>
        </div>
      </Transition>
      <Transition appear>
        <OrdersTable :Orders="orders" />
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  ref,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
  computed,
  type WatchStopHandle,
  provide,
} from "vue";
import { invoke } from "@tauri-apps/api";
import { globalTranslate } from "@/utils/globalTranslate";
import type { orderT, withCount } from "@/types";
import { store } from "@/store";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";

const router = useRouter();
const searchQuery = ref<string>("");
const page = computed(() => Number(router.currentRoute.value.query.page));
const refresh = computed(() => router.currentRoute.value.query.refresh);
const orders = ref<orderT[]>([]);
const totalRows = ref<number>(0);

const { updateQueryParams } = useUpdateRouteQueryParams();

let unwatch: WatchStopHandle | null = null;

provide("count", totalRows);

onBeforeMount(() => getOrders(page.value));

onUnmounted(() => {
  if (unwatch) unwatch();
});

onMounted(() => {
  unwatch = watch([page, refresh], ([p]) => {
    if (p && p > 0) getOrders(p);
  });
});

const getOrders = async (page = 1) => {
  try {
    const res = await invoke<withCount<orderT[]>>("get_orders", {
      page,
    });
    if (res.data.length) {
      orders.value = res.data;
      totalRows.value = res.count;
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadCSV = () => {
  store.setters.updateStore({ key: "name", value: "CsvUploader" });
  store.setters.updateStore({ key: "show", value: true });
  updateQueryParams({ table: "orders" });
};

const updateModal = (name: string) => {
  store.setters.updateStore({ key: "show", value: true });
  store.setters.updateStore({ key: "name", value: name });
};
</script>
