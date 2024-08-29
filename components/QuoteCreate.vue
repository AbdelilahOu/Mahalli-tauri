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
const quote = reactive<QuoteForCreateT>({
  clientId: "",
  items: [
    {
      product_id: undefined,
      quantity: undefined,
      price: undefined,
    },
  ],
});

function addQuoteItem() {
  quote.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
}

function deleteQuoteItem(index: number) {
  quote.items?.splice(index, 1);
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

async function createQuote() {
  isPosting.value = true;
  try {
    await invoke<Res<string>>("create_quote", {
      quote: {
        client_id: quote.clientId,
        items: quote.items,
      },
    });
    info(`CREATE QUOTE: ${JSON.stringify(quote)}`);
    //
    toast.success(t("notifications.quote.created"), {
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
      error(`CREATE QUOTE: ${err.error}`);
      return;
    }
    error(`CREATE QUOTE: ${err}`);
  }
  finally {
    isPosting.value = false;
    close();
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
        {{ t("titles.quotes.create") }}
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
            class="products w-full grid pt-1 grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in quote.items" :key="index">
              <SearchableItems
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
      <Button class="col-span-2" @click="createQuote()">
        {{ t("buttons.add") }}
      </Button>
    </CardFooter>
  </Card>
</template>
