<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { type WatchStopHandle } from "vue";
import type { SupplierT } from "@/schemas/supplier.schema";
import type { Res } from "@/types";
import { error } from "tauri-plugin-log-api";
import { PlusCircleIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { t } = useI18n();
const route = useRoute();
const { toggleModal, setModalName } = useStore();
//
const suppliers = ref<SupplierT[]>([]);
const searchQuery = ref<string>("");
const totalRows = ref<number>(0);
//
const page = computed(() => Number(route.query.page));
const refresh = computed(() => route.query.refresh);
//
provide("count", totalRows);
provide("itemsCount", 17);

//
let timer: any;
let unwatch: WatchStopHandle | null = null;
onMounted(() => {
  unwatch = watch(
    [searchQuery, page, refresh],
    ([search, p], [oldSearch]) => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          if (p && p > 0) getSuppliers(search, p);
        },
        search != oldSearch && oldSearch ? 500 : 0
      );
    },
    {
      immediate: true,
    }
  );
});

//
onUnmounted(() => {
  if (unwatch) unwatch();
});
//
async function getSuppliers(search: string, page: number = 1) {
  try {
    const res = await invoke<Res<any>>("list_suppliers", {
      args: {
        search,
        page,
        limit: 17,
      },
    });
    //
    suppliers.value = res.data.suppliers;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("LIST SUPPLIERS: " + err.error);
  }
}

//
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
