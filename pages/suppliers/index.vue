<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { PlusCircleIcon } from "lucide-vue-next";
import type { SupplierT } from "@/schemas/supplier.schema";
import type { Res, QueryParams } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const route = useRoute();
const { t } = useI18n();
const { toggleModal, setModalName } = useStore();
const { updateQueryParams } = useUpdateRouteQueryParams();

const suppliers = ref<SupplierT[]>([]);
const totalRows = ref<number>(0);

const searchQuery = ref<string>(route.query.search);

const LIMIT = 25;
provide("count", totalRows);
provide("itemsPerPage", LIMIT);

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
}));

const fetchSuppliers = async () => {
  try {
    const res: Res<any> = await invoke("list_suppliers", {
      args: {
        search: queryParams.value.search ?? "",
        page: Number(queryParams.value.page) ?? 1,
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
      },
    });
    suppliers.value = res.data.suppliers;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST SUPPLIERS: " + err.error);
      return;
    }
    error("LIST SUPPLIERS: " + err);
  }
};

watch(queryParams, fetchSuppliers, { deep: true });

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({
    search: searchQuery.value,
  });
}, 500);

watch(searchQuery, debouncedSearch);

onMounted(fetchSuppliers);

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
            @click="updateModal('SupplierCreate')"
          >
            <PlusCircleIcon :size="20" />
            {{ t("s.i.addButton") }}
          </Button>
        </div>
      </div>

      <SuppliersTable :suppliers="suppliers" />
    </div>
  </main>
</template>
