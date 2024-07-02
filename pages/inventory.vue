<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { CalendarIcon } from "lucide-vue-next";
import type { InventoryT } from "@/schemas/inventory.schema";
import type { Res, QueryParams } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const route = useRoute();
const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const inventory = ref<InventoryT[]>([]);
const totalRows = ref<number>(0);

const searchQuery = ref<string>(route.query.search);
const status = ref<string | undefined>(route.query.status);
const createdAt = ref<string | number | undefined>(route.query.created_at);

const LIMIT = 25;
provide("count", totalRows);
provide("itemsPerPage", LIMIT);

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
  status: route.query.status,
  created_at: route.query.created_at,
}));

const fetchInventory = async () => {
  try {
    const res: Res<any> = await invoke("list_inventory", {
      args: {
        search: queryParams.value.search ?? "",
        page: Number(queryParams.value.page) ?? 1,
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
        status: queryParams.value.status,
        created_at: queryParams.value.created_at,
      },
    });

    inventory.value = res.data.inventory;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST INVENTORY: " + err.error);
      return;
    }
    error("LIST INVENTORY: " + err);
  }
};

watch(queryParams, fetchInventory, { deep: true });

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

watch([status, createdAt], () => {
  updateQueryParams({
    status: status.value,
    created_at: createdAt.value
      ? new Date(createdAt.value).toISOString().slice(0, 10)
      : undefined,
  });
});
onMounted(fetchInventory);
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-full lg:max-w-[50%] max-w-[70%] grid grid-cols-3 gap-2">
          <Input v-model="searchQuery" type="text" :placeholder="t('g.s')" />

          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !createdAt && 'text-muted-foreground'
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span class="text-nowrap">{{
                  createdAt
                    ? new Date(createdAt).toLocaleDateString("fr-fr")
                    : t("g.pick-date")
                }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="createdAt" />
            </PopoverContent>
          </Popover>
          <Select v-model="status">
            <SelectTrigger>
              <SelectValue
                class="text-muted-foreground"
                :placeholder="t('o.c.d.o.placeholder[2]')"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OUT">
                {{ t("g.status.out") }}
              </SelectItem>
              <SelectItem value="IN">
                {{ t("g.status.in") }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div />
      </div>

      <InventoryTable :inventory="inventory" />
    </div>
  </main>
</template>
