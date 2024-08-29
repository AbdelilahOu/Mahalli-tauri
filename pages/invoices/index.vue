<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Calendar as CalendarIcon, Plus } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { InvoiceCreate } from "#components";
import { INVOICE_STATUSES } from "@/consts/status";

const route = useRoute();
const { t, d } = useI18n();
const modal = useModal();
const { updateQueryParams } = useUpdateRouteQueryParams();

const invoiceProducts = ref<InvoiceProductT[]>([]);

const searchQuery = ref<string>(route.query.search as any);
const status = ref<string | undefined>(route.query.status as any);
const createdAt = ref<string | number | undefined>(
  route.query.created_at as any,
);

const LIMIT = 25;

const queryParams = computed<QueryParams>(() => ({
  search: route.query.search,
  page: route.query.page,
  refresh: route.query.refresh,
  limit: route.query.limit,
  status: route.query.status,
  created_at: route.query.created_at,
}));

async function fetchInvoices() {
  try {
    const res: Res<any> = await invoke("list_invoices", {
      args: {
        page: Number(queryParams.value.page) ?? 1,
        search: queryParams.value.search ?? "",
        limit: queryParams.value.limit
          ? Number(queryParams.value.limit)
          : LIMIT,
        status: queryParams.value.status,
        created_at: queryParams.value.created_at,
      },
    });
    return res.data;
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`LIST INVOICESS: ${err.error}`);
    }
    else {
      error(`LIST INVOICESS: ${err}`);
    }
    throw err;
  }
}

const { data: invoicesData } = await useAsyncData("invoices", fetchInvoices, {
  watch: [queryParams],
});

const invoices = computed<InvoiceT[]>(() => invoicesData.value?.invoices ?? []);
const totalRows = computed<number>(() => invoicesData.value?.count ?? 0);

provide("count", totalRows);
provide("itemsPerPage", LIMIT);

watch(queryParams, fetchInvoices, { deep: true });

const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: searchQuery.value });
}, 500);

watch(searchQuery, debouncedSearch);

watch([status, createdAt], () => {
  updateQueryParams({
    status: status.value,
    created_at: createdAt.value
      ? new Date(createdAt.value).toISOString()
      : undefined,
    page: 1,
  });
});

async function listInvoiceProduct(id?: string) {
  try {
    const res = await invoke<Res<any>>("list_invoice_products", {
      id,
    });
    invoiceProducts.value = res.data;
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`ERROR LIST INVOICES PRODUCTS: ${err.error}`);
      return;
    }
    error(`ERROR LIST INVOICES PRODUCTS: ${err}`);
  }
}

const openCreateInvoiceModal = () => modal.open(InvoiceCreate, {});
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col items-start justify-start">
      <div class="flex justify-between w-full gap-9 mb-2">
        <div class="w-2/3 lg:max-w-[50%] flex gap-2">
          <Input
            v-model="searchQuery"
            name="search"
            type="text"
            :placeholder="t('search')"
          />
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !createdAt && 'text-muted-foreground',
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span class="text-nowrap">{{
                  createdAt ? d(new Date(createdAt), "short") : t("pick-date")
                }}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="createdAt" />
            </PopoverContent>
          </Popover>
          <Select v-model="status" name="status">
            <SelectTrigger>
              <SelectValue
                class="text-muted-foreground"
                :placeholder="t('select-status')"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="invoiceStatus in INVOICE_STATUSES"
                :key="invoiceStatus"
                :value="invoiceStatus"
              >
                {{ t(`status.${invoiceStatus.toLowerCase()}`) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="w-fit flex gap-1">
          <Button class="gap-2 text-nowrap" @click="openCreateInvoiceModal()">
            <Plus :size="20" />
            {{ t("buttons.toggle-create-invoice") }}
          </Button>
        </div>
      </div>
      <InvoicesTable
        :invoices="invoices"
        :invoice-products="invoiceProducts"
        @list-invoice-products="listInvoiceProduct"
      />
    </div>
  </main>
</template>
