<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { PlusCircleIcon } from "lucide-vue-next";
import type { ProductT } from "@/schemas/products.schema";
import { useDebounceFn } from "@vueuse/core";
import type { QueryParams } from "@/types";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const route = useRoute();
const { t } = useI18n();
const { toggleModal, setModalName } = useStore();
const { updateQueryParams } = useUpdateRouteQueryParams();

const searchQuery = ref<string>(route.query.search as string);

const LIMIT = 25;

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
}));

const fetchProducts = async () => {
  try {
    const res: any = await invoke("list_products", {
      args: {
        search: queryParams.value.search ?? "",
        page: Number(queryParams.value.page) ?? 1,
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
      },
    });
    return res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST PRODUCTS: " + err.error);
    } else {
      error("LIST PRODUCTS: " + err);
    }
    throw err;
  }
};

const { data: productsData, refresh: refreshProducts } = await useAsyncData(
  "products",
  fetchProducts,
  {
    watch: [queryParams],
  }
);

const products = computed<ProductT[]>(() => productsData.value?.products ?? []);
const totalRows = computed<number>(() => productsData.value?.count ?? 0);

provide("count", totalRows);
provide("itemsPerPage", LIMIT);

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

const updateModal = (name: string) => {
  setModalName(name);
  toggleModal(true);
};
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-1/3">
          <Input v-model="searchQuery" type="text" :placeholder="t('g.s')" />
        </div>
        <div class="w-fit flex gap-2">
          <Button
            class="gap-2 text-nowrap"
            @click="updateModal('ProductCreate')"
          >
            <PlusCircleIcon :size="20" />
            {{ t("p.i.addButton") }}
          </Button>
        </div>
      </div>
      <ProductsTable :products="products" />
    </div>
  </main>
</template>
