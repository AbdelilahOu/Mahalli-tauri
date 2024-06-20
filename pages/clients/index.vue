<script setup lang="ts">
import type { ClientT } from "@/schemas/client.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { PlusCircleIcon } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import type { WatchStopHandle } from "vue";
import { toast } from "vue-sonner";

const { t } = useI18n();
const route = useRoute();
const { toggleModal, setModalName } = useStore();

const clients = ref<ClientT[]>([]);
const searchQuery = ref<string>("");
const page = computed(() => Number(route.query.page));
const refresh = computed(() => route.query.refresh);

const totalRows = ref<number>(0);

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
          if (p && p > 0) getClients(search, p);
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

const getClients = async (search: string, page: number = 1) => {
  try {
    const res = await invoke<Res<any>>("list_clients", {
      args: {
        search,
        page,
        limit: 17,
      },
    });
    //
    clients.value = res.data.clients;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("LIST CLIENTS " + err.error);
  }
};

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
