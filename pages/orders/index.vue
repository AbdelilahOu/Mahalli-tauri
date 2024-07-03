<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Calendar as CalendarIcon, PlusCircleIcon } from "lucide-vue-next";
import type { OrderProductT, OrderT } from "@/schemas/order.schema";
import type { Res, QueryParams } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const route = useRoute();
const { t, d } = useI18n();
const { toggleModal, setModalName } = useStore();
const { updateQueryParams } = useUpdateRouteQueryParams();

const orders = ref<OrderT[]>([]);
const totalRows = ref<number>(0);
const orderProducts = ref<OrderProductT[]>([]);

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

const fetchOrders = async () => {
  try {
    const res: Res<any> = await invoke("list_orders", {
      args: {
        page: Number(queryParams.value.page) ?? 1,
        search: queryParams.value.search ?? "",
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
        status: queryParams.value.status,
        created_at: queryParams.value.created_at,
      },
    });
    orders.value = res.data.orders;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST ORDERS: " + err.error);
      return;
    }
    error("LIST ORDERS: " + err);
  }
};

watch(queryParams, fetchOrders, { deep: true });

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

watch([status, createdAt], () => {
  updateQueryParams({
    status: status.value,
    created_at: createdAt.value
      ? new Date(createdAt.value).toISOString()
      : undefined,
  });
});

onMounted(fetchOrders);

const listOrderProduct = async (id?: string) => {
  try {
    const res = await invoke<Res<any>>("list_order_products", {
      id,
    });
    orderProducts.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("ERROR LIST ORDER PRODUCTS: " + err.error);
      return;
    }
    error("ERROR LIST ORDER PRODUCTS: " + err);
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
        <div class="w-2/3 lg:max-w-[50%] flex gap-2">
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
                  createdAt ? d(new Date(createdAt), "short") : t("g.pick-date")
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
