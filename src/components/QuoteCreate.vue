<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { QuoteForCreateT } from "@/schemas/quote.schema";
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

const addQuoteItem = () => {
  quote.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const deleteQuoteItem = (index: number) => {
  quote.items?.splice(index, 1);
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

const createQuote = async () => {
  isLoading.value = true;
  try {
    const quoteRes = await invoke<Res<String>>("create_quote", {
      quote: {
        client_id: quote.clientId,
      },
    });
    for await (const item of quote.items) {
      await invoke<Res<string>>("create_quote_item", {
        item: {
          quote_id: quoteRes.data,
          price: item.price,
          quantity: item.quantity,
          product_id: item.product_id,
        },
      });
    }
    //
    info(`CREATE QUOTE: ${JSON.stringify(quote)}`);
    //
    toast.success(t("notifications.quote.created"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-create-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("CREATE QUOTE: " + err);
  } finally {
    isLoading.value = false;
    hideModal();
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
      {{ t("q.c.title") }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("q.c.d.s.title") }}
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
          <Label for="products">
            {{ t("q.c.d.o.products") }}
          </Label>
          <Button @click="addQuoteItem">
            {{ t("q.c.d.o.add") }}
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
      <div class="grid w-full grid-cols-3 gap-2">
        <Button @click="hideModal" variant="outline">
          {{ t("g.b.no") }}
        </Button>
        <Button class="col-span-2" @click="createQuote()">
          {{ t("g.b.c") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
