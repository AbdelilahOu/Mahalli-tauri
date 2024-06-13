<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { type WatchStopHandle } from "vue";
import type { InventoryT } from "@/schemas/inventory.schema";
import type { Res } from "@/types";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const route = useRoute();
const { updateQueryParams } = useUpdateRouteQueryParams();
//
const inventoryMovements = ref<InventoryT[]>([]);
const searchQuery = ref<string>("");
const page = computed(() => Number(route.query.page));
const refresh = computed(() => route.query.refresh);
const status = ref<string | undefined>(undefined);
const createdAt = ref<string | number | undefined>(undefined);
const totalRows = ref<number>(0);
//
provide("count", totalRows);
provide("itemsCount", 30);
//
let timer: any;
let unwatch: WatchStopHandle | null = null;
onMounted(() => {
  unwatch = watch(
    [searchQuery, page, refresh, createdAt, status],
    ([search, p], [oldSearch]) => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          if (p && p > 0) getInventory(search, p);
        },
        search != oldSearch && oldSearch ? 500 : 0
      );
    },
    {
      immediate: true,
    }
  );
});

onUnmounted(() => {
  if (unwatch) unwatch();
});

async function getInventory(search: string, page: number = 1) {
  try {
    const res = await invoke<Res<any>>("list_inventory", {
      args: {
        page,
        search,
        limit: 30,
        status: status.value,
        created_at: createdAt.value
          ? new Date(createdAt.value).toISOString().slice(0, 10)
          : null,
      },
    });
    //
    inventoryMovements.value = res.data.inventory;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("LIST INVENTORY MOUVEMENTS: " + err.error);
  }
}

const uploadCSV = () => {
  store.setters.updateStore({ key: "name", value: "CsvUploader" });
  store.setters.updateStore({ key: "show", value: true });
  updateQueryParams({ table: "clients" });
};
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
        <div></div>
      </div>

      <InventoryTable :inventory="inventoryMovements" />
    </div>
  </main>
</template>
