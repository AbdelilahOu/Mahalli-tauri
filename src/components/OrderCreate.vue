<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { OrderForCreateT } from "@/schemas/order.schema";
import { store } from "@/store";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import SearchableItems from "./ui/UISearchableItems.vue";
import UiModalCard from "./ui/UiModalCard.vue";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const isLoading = ref<boolean>(false);
const order = reactive<OrderForCreateT>({
  clientId: "",
  status: "",
  items: [
    {
      product_id: undefined,
      quantity: undefined,
      price: undefined,
    },
  ],
});

const addOrderItem = () => {
  order.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const deleteOrderItem = (index: number) => {
  order.items?.splice(index, 1);
};

const searchClients = async (search: string | number) => {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_clients",
    {
      search,
    },
  );
  if (!res.error) {
    clients.value = res.data;
  }
};

const searchProducts = async (search: string | number) => {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_products",
    {
      search,
    },
  );
  if (!res.error) {
    products.value = res.data;
  }
};

const createOrder = async () => {
  isLoading.value = true;
  if (order?.clientId && order.items?.length !== 0) {
    try {
      const orderRes = await invoke<Res<String>>("create_order", {
        order: {
          client_id: order.clientId,
          status: order.status,
        },
      });
      for await (const item of order.items) {
        const invRes = await invoke<Res<string>>("create_inventory", {
          mvm: {
            mvm_type: "OUT",
            product_id: item.product_id,
            quantity: item.quantity,
          },
        });
        await invoke<Res<string>>("create_order_item", {
          item: {
            order_id: orderRes.data,
            inventory_id: invRes.data,
            price: item.price,
          },
        });
      }
      //
      info(`CREATE ORDER: ${JSON.stringify(order)}`);
      //
      toast(t("notifications.order.created"), {
        closeButton: true,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (err: any) {
      error("CREATE ORDER: " + err.error);
    } finally {
      isLoading.value = false;
      hideModal();
    }
    return;
  }

  isLoading.value = false;
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 rounded-md relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ t("o.c.title") }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("o.c.d.s.title") }}
            </Label>
            <SearchableItems
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on:select="(id) => (order.clientId = id)"
            />
          </div>
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="status">
              {{ t("o.u.d.o.title") }}
            </Label>
            <Select v-model="order.status">
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DELIVERED">
                  {{ t("g.status.delivered") }}
                </SelectItem>
                <SelectItem value="CANCELED">
                  {{ t("g.status.cancelled") }}
                </SelectItem>
                <SelectItem value="PENDING">
                  {{ t("g.status.pending") }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="products">
            {{ t("o.c.d.o.products") }}
          </Label>
          <Button @click="addOrderItem">
            {{ t("o.c.d.o.add") }}
          </Button>
          <div
            class="products w-full grid pt-1 grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in order.items" :key="index">
              <SearchableItems
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on:select="
                  (id, price) => ((item.product_id = id), (item.price = price))
                "
              />
              <Input
                class="border-r-0"
                :placeHolder="t('o.c.d.o.placeholder[0]')"
                type="number"
                v-model="item.quantity"
              >
                <template #unite> Item </template>
              </Input>
              <Input
                class="border-r-0"
                :placeHolder="t('o.c.d.o.placeholder[1]')"
                type="number"
                v-model="item.price"
              >
                <template #unite> DH </template>
              </Input>
              <Trash2
                @click="deleteOrderItem(index)"
                class="cursor-pointer"
                :size="20"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="grid w-full grid-cols-3 gap-2">
        <Button @click="hideModal" variant="outline">
          {{ t("g.b.no") }}
        </Button>
        <Button class="col-span-2" @click="createOrder()">
          {{ t("g.b.c") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
