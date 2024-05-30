<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-vue-next";
import { Input } from "./ui/input";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useRoute } from "vue-router";
import type { Res } from "@/types";
import type { QuoteForUpdateT } from "@/schemas/quote.schema";
import SearchableItems from "./ui/UISearchableItems.vue";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
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

const addQuoteItem = () => {
  quote.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const updateTheQuotes = async () => {
  try {
    await invoke<Res<String>>("update_quote", {
      quote: {
        id: quote.id,
        client_id: quote.clientId,
      },
    });
    for await (const item of quote.items) {
      if (!item.id) {
        await invoke<Res<string>>("create_quote_item", {
          item: {
            quote_id: quote.id,
            quantity: item.quantity,
            product_id: item.product_id,
            price: item.price,
          },
        });
      } else {
        await invoke<Res<string>>("update_quote_item", {
          item: {
            id: item.id,
            quote_id: quote.id,
            quantity: item.quantity,
            product_id: item.product_id,
            price: item.price,
          },
        });
      }
    }
    //
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
    error("UPDATE QUOTE: " + err);
  } finally {
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

async function deleteOneQuoteItem(id: string) {
  try {
    await invoke("delete_quote_item", { id });
  } catch (err: any) {
    error("ERROR DELETE QUOTE ITEM : " + err);
  }
}

const deleteQuoteItem = (index: number) => {
  const item = quote.items?.splice(index, 1)[0];
  if (item?.id) deleteOneQuoteItem(item.id);
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title> {{ t("q.u.title") }} N° {{ quote?.id }} </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("q.u.d.o.title") }}
            </Label>
            <SearchableItems
              v-if="quote.fullname"
              :defaultValue="quote.fullname"
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
                :defaultValue="item.name"
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on:select="
                  (id, price) => ((item.product_id = id), (item.price = price))
                "
              />
              <Input
                v-model="item.quantity"
                class="order-r-0"
                :placeHolder="t('o.c.d.o.placeholder[0]')"
                type="number"
              >
                <template #unite> Item </template>
              </Input>
              <Input
                v-model="item.price"
                class="order-r-0"
                :placeHolder="t('o.c.d.o.placeholder[1]')"
                type="number"
              >
                <template #unite> DH </template>
              </Input>
              <Trash2
                @click="deleteQuoteItem(index)"
                class="cursor-pointer m-auto"
                :size="20"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="outline" @click="hideModal">
          {{ t("g.b.no") }}
        </Button>
        <Button class="col-span-2" @click="updateTheQuotes">
          {{ t("g.b.d") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
