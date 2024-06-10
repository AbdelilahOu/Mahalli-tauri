<script setup lang="ts">
import type { QuoteProductT, QuoteT } from "@/schemas/quote.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Calendar as CalendarIcon, PlusCircleIcon } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { type WatchStopHandle } from "vue";

const { t } = useI18n();
const route = useRoute();
const { updateQueryParams } = useUpdateRouteQueryParams();
//
const searchQuery = ref<string>("");
const page = computed(() => Number(route.query.page));
const refresh = computed(() => route.query.refresh);
const quotes = ref<QuoteT[]>([]);
const totalRows = ref<number>(0);
const createdAt = ref<string | number | undefined>(undefined);
const quoteProducts = ref<QuoteProductT[]>([]);
//
const LIMIT = 25;
provide("count", totalRows);
provide("itemsCount", LIMIT);
//
onUnmounted(() => {
  if (unwatch) unwatch();
});

let timer: any;
let unwatch: WatchStopHandle | null = null;
onMounted(() => {
  unwatch = watch(
    [searchQuery, page, refresh, createdAt],
    ([search, p], [oldSearch]) => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          if (p && p > 0) getQuotes(search, p);
        },
        search != oldSearch && oldSearch ? 500 : 0
      );
    },
    {
      immediate: true,
    }
  );
});

const getQuotes = async (search: string, page = 1) => {
  try {
    const res = await invoke<Res<any>>("list_quotes", {
      args: {
        page,
        search,
        limit: LIMIT,
        created_at: createdAt.value
          ? new Date(createdAt.value).toISOString().slice(0, 10)
          : null,
      },
    });

    quotes.value = res.data.quotes;
    totalRows.value = res.data.count;
  } catch (err: any) {
    error("LIST ORDERS: " + err.error);
  }
};

const listQuoteProduct = async (id?: string) => {
  try {
    const res = await invoke<Res<any>>("list_quote_products", {
      id,
    });
    //
    quoteProducts.value = res.data;
  } catch (err: any) {
    error("LIST ORDER PRODUCTS: " + err.error);
  }
};

const uploadCSV = () => {
  store.setters.updateStore({ key: "name", value: "CsvUploader" });
  store.setters.updateStore({ key: "show", value: true });
  updateQueryParams({ table: "quotes" });
};

const updateModal = (name: string) => {
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-2/3 lg:max-w-[50%] grid grid-cols-3 gap-2">
          <Input v-model="searchQuery" type="text" :placeHolder="t('g.s')" />
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
                  createdAt
                    ? new Date(createdAt).toLocaleDateString("fr-fr")
                    : t("g.pick-date")
                }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="createdAt" />
            </PopoverContent>
          </Popover>
        </div>
        <div class="w-fit flex gap-1">
          <Button class="gap-2 text-nowrap" @click="updateModal('QuoteCreate')">
            <PlusCircleIcon :size="20" />

            {{ t("q.i.addButton") }}
          </Button>
        </div>
      </div>
      <QuotesTable
        @listQuoteProducts="listQuoteProduct"
        :quotes="quotes"
        :quoteProducts="quoteProducts"
      />
    </div>
  </main>
</template>
