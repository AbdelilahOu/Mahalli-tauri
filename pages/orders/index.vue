<script setup lang="ts">
import type { OrderProductT, OrderT } from "@/schemas/order.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Calendar as CalendarIcon, PlusCircleIcon } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import type { WatchStopHandle } from "vue";
import { toast } from "vue-sonner";

const { t } = useI18n();
const route = useRoute();
const { toggleModal, setModalName } = useStore();
//
const searchQuery = ref<string>("");
const page = computed(() => Number(route.query.page));
const refresh = computed(() => route.query.refresh);
const orders = ref<OrderT[]>([]);
const totalRows = ref<number>(0);
const status = ref<string | undefined>(undefined);
const createdAt = ref<string | number | undefined>(undefined);
const orderProducts = ref<OrderProductT[]>([]);
//
const LIMIT = 25;
provide("count", totalRows);
provide("itemsPerPage", LIMIT);
//
onUnmounted(() => {
  if (unwatch) unwatch();
});

let timer: any;
let unwatch: WatchStopHandle | null = null;
onMounted(() => {
  unwatch = watch(
    [searchQuery, page, refresh, createdAt, status],
    ([search, p], [oldSearch]) => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          if (p && p > 0) getOrders(search, p);
        },
        search != oldSearch && oldSearch ? 500 : 0
      );
    },
    {
      immediate: true,
    }
  );
});

const getOrders = async (search: string, page = 1) => {
  try {
    const res = await invoke<Res<any>>("list_orders", {
      args: {
        page,
        search,
        limit: LIMIT,
        status: status.value,
        created_at: createdAt.value
          ? new Date(createdAt.value).toISOString().slice(0, 10)
          : null,
      },
    });

    orders.value = res.data.orders;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if ("error" in err) {
      error("LIST ORDERS: " + err.error);
      return;
    }
    error("LIST ORDERS: " + err);
  }
};

const listOrderProduct = async (id?: string) => {
  try {
    const res = await invoke<Res<any>>("list_order_products", {
      id,
    });
    //
    orderProducts.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if ("error" in err) {
      error("LIST ORDER PRODUCTS: " + err.error);
      return;
    }
    error("LIST ORDER PRODUCTS: " + err);
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
        <div class="w-2/3 lg:max-w-[50%] grid grid-cols-3 gap-2">
          <Input
            v-model="searchQuery"
            name="search"
            type="text"
            :placeholder="t('g.s')"
          />

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
          <Select v-model="status" name="status">
            <SelectTrigger>
              <SelectValue
                class="text-muted-foreground"
                :placeholder="t('o.c.d.o.placeholder[2]')"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DELIVERED">
                {{ t("g.status.delivered") }}
              </SelectItem>
              <SelectItem value="CANCELED">
                {{ t("g.status.canceled") }}
              </SelectItem>
              <SelectItem value="PENDING">
                {{ t("g.status.pending") }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="w-fit flex gap-1">
          <Button class="gap-2 text-nowrap" @click="updateModal('OrderCreate')">
            <PlusCircleIcon :size="20" />

            {{ t("o.i.addButton") }}
          </Button>
        </div>
      </div>

      <OrdersTable
        :orders="orders"
        :order-products="orderProducts"
        @list-order-products="listOrderProduct"
      />
    </div>
  </main>
</template>
