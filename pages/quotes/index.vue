<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Calendar as CalendarIcon, PlusCircleIcon } from "lucide-vue-next";
import type { QuoteProductT, QuoteT } from "@/schemas/quote.schema";
import type { Res, QueryParams } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const route = useRoute();
const { t, d } = useI18n();
const { toggleModal, setModalName } = useStore();
const { updateQueryParams } = useUpdateRouteQueryParams();

const quotes = ref<QuoteT[]>([]);
const totalRows = ref<number>(0);
const quoteProducts = ref<QuoteProductT[]>([]);

const searchQuery = ref<string>(route.query.search);
const createdAt = ref<string | number | undefined>(route.query.created_at);

const LIMIT = 25;
provide("count", totalRows);
provide("itemsPerPage", LIMIT);

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
  created_at: route.query.created_at,
}));

const fetchQuotes = async () => {
  try {
    const res: Res<any> = await invoke("list_quotes", {
      args: {
        page: Number(queryParams.value.page) ?? 1,
        search: queryParams.value.search ?? "",
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
        created_at: queryParams.value.created_at,
      },
    });
    quotes.value = res.data.quotes;
    totalRows.value = res.data.count;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST QUOTES: " + err.error);
      return;
    }
    error("LIST QUOTES: " + err);
  }
};

watch(queryParams, fetchQuotes, { deep: true });

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

watch(createdAt, () => {
  updateQueryParams({
    created_at: createdAt.value
      ? new Date(createdAt.value).toISOString()
      : undefined,
  });
});

onMounted(fetchQuotes);

const listQuoteProduct = async (id?: string) => {
  try {
    const res = await invoke<Res<any>>("list_quote_products", {
      id,
    });
    quoteProducts.value = res.data;
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("LIST QUOTE PRODUCTS: " + err.error);
      return;
    }
    error("LIST QUOTE PRODUCTS: " + err);
  }
};

const updateModal = (name: string) => {
  setModalName(name);
  toggleModal(true);
};
</script>
<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-2/3 lg:max-w-[50%] grid grid-cols-3 gap-2">
          <Input v-model="searchQuery" type="text" :placeholder="t('g.s')" />
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
                  createdAt ? d(new Date(createdAt), "short") : t("g.pick-date")
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
        :quotes="quotes"
        :quote-products="quoteProducts"
        @list-quote-products="listQuoteProduct"
      />
    </div>
  </main>
</template>
