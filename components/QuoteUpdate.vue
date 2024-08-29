<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const props = defineProps<{
  id: string;
  identifier: string;
}>();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const quote = reactive<QuoteForUpdateT>({
  id: "",
  clientId: "",
  fullName: "",
  createdAt: "",
  items: [],
});

onBeforeMount(async () => {
  const res = await invoke<Res<QuoteForUpdateT>>("get_quote", {
    id: props.id,
  });

  if (!res.error) {
    quote.id = res.data.id;
    quote.clientId = res.data.clientId;
    quote.createdAt = res.data.createdAt;
    quote.fullName = res.data.fullName;
    quote.items = res.data.items;
  }
});

async function searchClients(search: string | number) {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_clients",
    {
      search,
    }
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
    }
  );
  if (!res.error) {
    products.value = res.data;
  }
}

function addQuoteItem() {
  quote.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
}

async function updateTheQuotes() {
  try {
    await invoke<Res<string>>("update_quote", {
      quote: {
        id: quote.id,
        client_id: quote.clientId,
        items: quote.items,
      },
    });
    info(`UPDATE QUOTE: ${JSON.stringify(quote)}`);
    //
    toast.success(t("notifications.quote.updated"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-update-${Math.random() * 9999}`,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`UPDATE QUOTE: ${err.error}`);
      return;
    }
    error(`UPDATE QUOTE: ${err}`);
  } finally {
    close();
  }
}

async function deleteOneQuoteItem(id: string) {
  try {
    await invoke("delete_quote_item", { id });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`ERROR DELETE QUOTE ITEM : ${err.error}`);
    }
  }
}

function deleteQuoteItem(index: number) {
  const item = quote.items?.splice(index, 1)[0];
  if (item?.id) deleteOneQuoteItem(item.id);
}
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle>
        {{ t("titles.quotes.update") }} N° {{ identifier }}
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
              v-if="quote.fullName"
              :default-value="quote.fullName"
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on:select="(id) => (quote.clientId = id)"
            />
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addQuoteItem">
            {{ t("buttons.add-product") }}
          </Button>
          <div
            class="w-full pt-1 grid grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in quote.items" :key="index">
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
                class="order-r-0"
                :placeholder="t('fields.quantity')"
                type="number"
              >
                <template #unite>
                  {{ t("fields.item") }}
                </template>
              </Input>
              <Input
                v-model="item.price"
                class="order-r-0"
                :placeholder="t('fields.price')"
                type="number"
              >
                <template #unite> DH </template>
              </Input>
              <Trash2
                class="cursor-pointer m-auto"
                :size="20"
                @click="deleteQuoteItem(index)"
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
      <Button class="col-span-2" @click="updateTheQuotes">
        {{ t("buttons.confirme") }}
      </Button>
    </CardFooter>
  </Card>
</template>
