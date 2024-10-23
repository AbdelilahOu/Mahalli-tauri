<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Plus } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";
import * as Logger from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { SupplierCreate } from "#components";

const route = useRoute();
const { t } = useI18n();
const modal = useModal();
const { updateQueryParams } = useUpdateRouteQueryParams();

const searchQuery = ref<string>(route.query.search as string);

const LIMIT = 25;

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
}));

async function fetchSuppliers(params: QueryParams) {
  try {
    const res: Res<any> = await invoke("list_suppliers", {
      args: {
        search: params.search ?? "",
        page: Number(params.page) ?? 1,
        limit: params.limit ? Number(params.limit) : LIMIT,
      },
    });
    return res.data;
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      Logger.error(`LIST SUPPLIERS: ${err.error}`);
    }
    else {
      Logger.error(`LIST SUPPLIERS: ${err}`);
    }
  }
}

const { data } = useAsyncData(
  "suppliers",
  () => fetchSuppliers(queryParams.value),
  { watch: [queryParams] },
);

const suppliers = computed<SupplierT[]>(() => data.value?.suppliers ?? []);
const totalRows = computed<number>(() => data.value?.count ?? 0);

provide("count", totalRows);
provide("itemsPerPage", LIMIT);

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

const openCreateSupplierModal = () => modal.open(SupplierCreate, {});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-1/3">
          <Input v-model="searchQuery" type="text" :placeholder="t('search')" />
        </div>
        <div class="w-fit flex gap-2">
          <Button class="gap-2 text-nowrap" @click="openCreateSupplierModal">
            <Plus :size="20" />
            {{ t("buttons.toggle-create-supplier") }}
          </Button>
        </div>
      </div>
      <SuppliersTable :suppliers="suppliers" />
    </div>
  </main>
</template>
