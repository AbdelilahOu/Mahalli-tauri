<script setup lang="ts">
import type { OrderForUpdateT } from "@/schemas/order.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const route = useRoute();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const order = reactive<OrderForUpdateT>({
  id: "",
  clientId: "",
  fullname: "",
  createdAt: "",
  status: "",
  items: [],
});

onBeforeMount(async () => {
  // @ts-ignore
  const res = await invoke<Res<OrderForUpdateT>>("get_order", {
    id: route.query.id,
  });

  if (!res.error) {
    order.id = res.data.id;
    order.clientId = res.data.clientId;
    order.createdAt = res.data.createdAt;
    order.status = res.data.status;
    order.fullname = res.data.fullname;
    order.items = res.data.items;
  }
});

const searchClients = async (search: string | number) => {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_clients",
    {
      search,
    }
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
    }
  );
  if (!res.error) {
    products.value = res.data;
  }
};

const addOrderItem = () => {
  order.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const updateTheOrders = async () => {
  try {
    await invoke<Res<String>>("update_order", {
      order: {
        id: order.id,
        client_id: order.clientId,
        status: order.status,
        items: order.items,
      },
    });
    // for await (const item of order.items) {
    //   if (!item.id) {
    //     const invRes = await invoke<Res<string>>("create_inventory", {
    //       mvm: {
    //         mvm_type: "OUT",
    //         product_id: item.product_id,
    //         quantity: item.quantity,
    //       },
    //     });
    //     await invoke<Res<string>>("create_order_item", {
    //       item: {
    //         order_id: order.id,
    //         inventory_id: invRes.data,
    //         price: item.price,
    //       },
    //     });
    //   } else {
    //     await invoke<Res<string>>("update_inventory", {
    //       mvm: {
    //         id: item.inventory_id,
    //         mvm_type: "OUT",
    //         product_id: item.product_id,
    //         quantity: item.quantity,
    //       },
    //     });
    //     await invoke<Res<string>>("update_order_item", {
    //       item: {
    //         id: item.id,
    //         order_id: order.id,
    //         inventory_id: item.inventory_id,
    //         price: item.price,
    //       },
    //     });
    //   }
    // }
    //
    info(`UPDATE ORDER: ${JSON.stringify(order)}`);
    //
    toast.success(t("notifications.order.updated"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("UPDATE ORDER: " + err.error);
  } finally {
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

async function deleteOneOrderItem(id: string) {
  try {
    await invoke("delete_order_item", { id });
  } catch (err: any) {
    error("ERROR DELETE ORDER ITEM: " + err.error);
  }
}

const deleteOrderItem = (index: number) => {
  const item = order.items?.splice(index, 1)[0];
  if (item?.id) deleteOneOrderItem(item.id);
};
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle> {{ t("o.u.title") }} N° {{ order?.id }} </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("g.fields.fullname") }}
            </Label>
            <SearchableItems
              v-if="order.fullname"
              :defaultValue="order.fullname"
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on:select="(id) => (order.clientId = id)"
            />
          </div>
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="status">
              {{ t("g.fields.status") }}
            </Label>
            <Select v-model="order.status">
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
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addOrderItem">
            {{ t("o.u.d.o.add") }}
          </Button>
          <div
            class="w-full pt-1 grid grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in order.items" :key="index">
              <SearchableItems
                :defaultValue="item.name"
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on:select="
                  (id, price) => ((item.product_id = id), (item.price = price))
                "
              />
              <Input
                v-model="item.quantity"
                class="border-r-0"
                :placeHolder="t('o.c.d.o.placeholder[0]')"
                type="number"
              >
                <template #unite> {{ t("g.fields.item") }} </template>
              </Input>
              <Input
                v-model="item.price"
                class="border-r-0"
                :placeHolder="t('o.c.d.o.placeholder[1]')"
                type="number"
              >
                <template #unite> DH </template>
              </Input>
              <Trash2
                @click="deleteOrderItem(index)"
                class="cursor-pointer m-auto"
                :size="20"
              />
            </template>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="hideModal">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="updateTheOrders">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
