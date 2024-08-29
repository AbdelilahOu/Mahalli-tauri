<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { ORDER_STATUSES } from "@/consts/status";

const props = defineProps<{
  id: string;
  identifier: string;
}>();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const order = reactive<OrderForUpdateT>({
  id: "",
  clientId: "",
  fullName: "",
  createdAt: "",
  status: "",
  items: [],
});

onBeforeMount(async () => {
  const res = await invoke<Res<OrderForUpdateT>>("get_order", {
    id: props.id,
  });

  if (!res.error) {
    order.id = res.data.id;
    order.clientId = res.data.clientId;
    order.createdAt = res.data.createdAt;
    order.status = res.data.status;
    order.fullName = res.data.fullName;
    order.items = res.data.items;
  }
});

async function searchClients(search: string | number) {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_clients",
    {
      search,
    },
  );
  if (!res.error) {
    clients.value = res.data;
  }
}

async function searchProducts(search: string | number) {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_products",
    {
      search,
    },
  );
  if (!res.error) {
    products.value = res.data;
  }
}

function addOrderItem() {
  order.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
}

async function updateTheOrder() {
  try {
    await invoke<Res<string>>("update_order", {
      order: {
        id: order.id,
        client_id: order.clientId,
        status: order.status,
        items: order.items,
      },
    });
    //
    info(`UPDATE ORDER: ${JSON.stringify(order)}`);
    //
    toast.success(t("notifications.order.updated"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-update-${Math.random() * 9999}`,
    });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`UPDATE ORDER: ${err.error}`);
      return;
    }
    error(`UPDATE ORDER: ${err}`);
  }
  finally {
    close();
  }
}

async function deleteOneOrderItem(id: string) {
  try {
    await invoke("delete_inventory", { id });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`ERROR DELETE ORDER ITEM: ${err.error}`);
    }
  }
}

function deleteOrderItem(index: number) {
  const item = order.items?.splice(index, 1)[0];
  if (item?.inventory_id)
    deleteOneOrderItem(item.inventory_id);
}
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle>
        {{ t("titles.orders.update") }} N° {{ identifier }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("fields.full-name") }}
            </Label>
            <SearchableItems
              v-if="order.fullName"
              :default-value="order.fullName"
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on:select="(id) => (order.clientId = id)"
            />
          </div>
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="status">
              {{ t("fields.status") }}
            </Label>
            <Select v-model="order.status">
              <SelectTrigger>
                <SelectValue
                  class="text-muted-foreground"
                  :placeholder="t('select-status')"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="status in ORDER_STATUSES"
                  :key="status"
                  :value="status"
                >
                  {{ t(`status.${status.toLowerCase()}`) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addOrderItem">
            {{ t("buttons.add-product") }}
          </Button>
          <div
            class="w-full pt-1 grid grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in order.items" :key="index">
              <SearchableItems
                :default-value="item.name"
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on:select="
                  (id, price) => ((item.product_id = id), (item.price = price))
                "
              />
              <Input
                v-model="item.quantity"
                class="border-r-0"
                :placeholder="t('fields.quantity')"
                type="number"
              >
                <template #unite>
                  {{ t("fields.item") }}
                </template>
              </Input>
              <Input
                v-model="item.price"
                class="border-r-0"
                :placeholder="t('fields.price')"
                type="number"
              >
                <template #unite>
                  DH
                </template>
              </Input>
              <Trash2
                class="cursor-pointer m-auto"
                :size="20"
                @click="deleteOrderItem(index)"
              />
            </template>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="close">
        {{ t("buttons.cancel") }}
      </Button>
      <Button class="col-span-2" @click="updateTheOrder">
        {{ t("buttons.confirme") }}
      </Button>
    </CardFooter>
  </Card>
</template>
