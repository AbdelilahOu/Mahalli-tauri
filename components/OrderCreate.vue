<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const isPosting = ref<boolean>(false);

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

function addOrderItem() {
  order.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
}

function deleteOrderItem(index: number) {
  order.items?.splice(index, 1);
}

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

async function createOrder() {
  isPosting.value = true;
  if (order?.clientId && order.items?.length !== 0) {
    try {
      await invoke<Res<string>>("create_order", {
        order: {
          client_id: order.clientId,
          status: "PENDING",
          items: order.items,
        },
      });
      //
      info(`CREATE ORDER: ${JSON.stringify(order)}`);
      //
      toast.success(t("notifications.order.created"), {
        closeButton: true,
      });
      // toggle refresh
      updateQueryParams({
        refresh: `refresh-create-${Math.random() * 9999}`,
      });
    }
    catch (err: any) {
      toast.error(t("notifications.error.title"), {
        description: t("notifications.error.description"),
        closeButton: true,
      });
      if (typeof err === "object" && "error" in err) {
        error(`CREATE ORDER: ${err.error}`);
        return;
      }
      error(`CREATE ORDER: ${err}`);
    }
    finally {
      isPosting.value = false;
      close();
    }
    return;
  }

  isPosting.value = false;
}
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 rounded-md relative h-fit z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle>
        {{ t("titles.orders.create") }}
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
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on-select="(id) => (order.clientId = id)"
            />
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addOrderItem">
            {{ t("buttons.add-product") }}
          </Button>
          <div
            class="products w-full grid pt-1 grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in order.items" :key="index">
              <SearchableItems
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on-select="
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
      <Button class="col-span-2" @click="createOrder()">
        {{ t("buttons.add") }}
      </Button>
    </CardFooter>
  </Card>
</template>
