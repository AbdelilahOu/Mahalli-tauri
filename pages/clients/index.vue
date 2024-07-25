<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { PlusCircleIcon } from "lucide-vue-next";
import type { ClientT } from "@/schemas/client.schema";
import type { Res, QueryParams } from "@/types";
import { useDebounceFn } from "@vueuse/core";
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

const fetchClients = async (params: QueryParams) => {
  try {
    const res: Res<any> = await invoke("list_clients", {
      args: {
        search: params.search ?? "",
        page: Number(params.page) ?? 1,
        limit: params.limit ? Number(params.limit) : LIMIT,
      },
    });
    return res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST CLIENTS: " + err.error);
    } else {
      error("LIST CLIENTS: " + err);
    }
    throw err;
  }
};

const { data } = useAsyncData(
  "clients",
  () => fetchClients(queryParams.value),
  { watch: [queryParams] }
);

const clients = computed(() => data.value?.clients ?? []);
const totalRows = computed(() => data.value?.count ?? 0);

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
            @click="updateModal('ClientCreate')"
          >
            <PlusCircleIcon :size="20" />
            {{ t("c.i.addButton") }}
          </Button>
        </div>
      </div>
      <ClientsTable :clients="clients" />
    </div>
  </main>
</template>
