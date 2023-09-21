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
            <Button @click="updateModal('ProductCreate')">
              <UiIcon
                class="fill-gray-900 cursor-default hover:bg-transparent"
                name="add"
              />
              {{ globalTranslate("Products.index.addButton") }}
            </Button>
          </div>
        </div>
      </Transition>
      <Transition appear>
        <ProductsTable :products="products" />
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import ProductsTable from "@/components/ProductsTable.vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { Button } from "@/components/ui/button";
import type { productT, withCount } from "@/types";
import { Input } from "@/components/ui/input";
import UiIcon from "@/components/ui/UiIcon.vue";
import { invoke } from "@tauri-apps/api";
import { useRouter } from "vue-router";
import { store } from "@/store";
import {
  type WatchStopHandle,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  Transition,
  onMounted,
  computed,
  provide,
  watch,
  ref,
} from "vue";

const router = useRouter();
const { updateQueryParams } = useUpdateRouteQueryParams();
//
const products = ref<productT[]>([]);
const searchQuery = ref<string>("");
const totalRows = ref<number>(0);
//
const page = computed(() => Number(router.currentRoute.value.query.page));
const refresh = computed(() => router.currentRoute.value.query.refresh);
//
let unwatch: WatchStopHandle | null = null;
//
provide("count", totalRows);

//
onBeforeMount(() => getProducts(page.value));
//
onMounted(() => {
  unwatch = watch([page, refresh], ([p]) => {
    console.log(p, refresh);
    if (p && p > 0) getProducts(p);
  });
});
//
onUnmounted(() => {
  if (unwatch) unwatch();
});
//
async function getProducts(page: number = 1) {
  try {
    const res = await invoke<withCount<productT[]>>("get_products", {
      page,
    });
    if (res.data.length) {
      products.value = res.data;
      totalRows.value = res.count;
      return;
    }
  } catch (error) {
    console.log(error);
  }
}
const uploadCSV = () => {
  store.setters.updateStore({ key: "name", value: "CsvUploader" });
  store.setters.updateStore({ key: "show", value: true });
  updateQueryParams({ table: "products" });
};
//
const updateModal = (name: string) => {
  store.setters.updateStore({ key: "show", value: true });
  store.setters.updateStore({ key: "name", value: name });
};
</script>
