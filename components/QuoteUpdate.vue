<script setup lang="ts">
import type { QuoteForUpdateT } from "@/schemas/quote.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();
const { t } = useI18n();
const route = useRoute();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const quote = reactive<QuoteForUpdateT>({
  id: "",
  clientId: "",
  fullname: "",
  createdAt: "",
  items: [],
});

onBeforeMount(async () => {
  // @ts-ignore
  const res = await invoke<Res<QuoteForUpdateT>>("get_quote", {
    id: route.query.id,
  });

  if (!res.error) {
    quote.id = res.data.id;
    quote.clientId = res.data.clientId;
    quote.createdAt = res.data.createdAt;
    quote.fullname = res.data.fullname;
    quote.items = res.data.items;
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

const addQuoteItem = () => {
  quote.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const updateTheQuotes = async () => {
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
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("UPDATE QUOTE: " + err.error);
      return;
    }
    error("UPDATE QUOTE: " + err);
  } finally {
    hideModal();
  }
};

const hideModal = () => toggleModal(false);

async function deleteOneQuoteItem(id: string) {
  try {
    await invoke("delete_quote_item", { id });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("ERROR DELETE QUOTE ITEM : " + err.error);
      return;
    }
  }
}

const deleteQuoteItem = (index: number) => {
  const item = quote.items?.splice(index, 1)[0];
  if (item?.id) deleteOneQuoteItem(item.id);
};
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle>
        {{ t("q.u.title") }} N° {{ $route.query?.identifier }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("g.fields.fullname") }}
            </Label>
            <SearchableItems
              v-if="quote.fullname"
              :default-value="quote.fullname"
              :items="clients"
              @update:items="(s) => searchClients(s)"
              @on:select="(id) => (quote.clientId = id)"
            />
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addQuoteItem">
            {{ t("q.u.d.o.add") }}
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
                :placeholder="t('o.c.d.o.placeholder[0]')"
                type="number"
              >
                <template #unite> {{ t("g.fields.item") }} </template>
              </Input>
              <Input
                v-model="item.price"
                class="order-r-0"
                :placeholder="t('o.c.d.o.placeholder[1]')"
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
      <Button variant="outline" @click="hideModal">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="updateTheQuotes">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
