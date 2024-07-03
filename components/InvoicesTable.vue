<script setup lang="ts">
import type { InvoiceProductT, InvoiceT } from "@/schemas/invoice.schema";
import { invoke } from "@tauri-apps/api";
import { FilePenLine, GripHorizontal, Printer, Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { setModalName, toggleModal } = useStore();
const { t, d, locale } = useI18n();
const localePath = useLocalePath();

defineProps<{ invoices: InvoiceT[]; invoiceProducts: InvoiceProductT[] }>();
const emits = defineEmits<{
  (e: "listInvoiceProducts", id?: string): void;
}>();

const STATUS_COLORS = {
  CANCELED: "bg-red-100 border-red-500 text-red-900",
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  PAID: "bg-green-100 border-green-500 text-green-900",
} as const;

let previewProductsTimer: any;
const previewProducts = (id: string) => {
  clearTimeout(previewProductsTimer);
  previewProductsTimer = setTimeout(() => {
    emits("listInvoiceProducts", id);
  }, 400);
};
const cancelPreviewProducts = () => clearTimeout(previewProductsTimer);

const toggleThisInvoices = (Invoice: InvoiceT, name: string) => {
  updateQueryParams({
    id: Invoice.id,
    identifier: Invoice.identifier,
    highlight: false,
  });
  setModalName(name);
  toggleModal(true);
};

const updateInvoiceStatus = async (invoice: any) => {
  try {
    await invoke("update_invoice_status", {
      invoice,
    });
    //
    info(`UPDATE INVOICE STATUS: ${JSON.stringify(invoice)}`);
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
      error("UPDATE INVOICE STATUS: " + err.error);
      return;
    }
    error("UPDATE INVOICE STATUS: " + err);
  }
};
</script>

<template>
  <div>
    <table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <thead>
        <tr>
          <th class="small"></th>
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.items") }}</th>
          <th class="small">{{ t("g.fields.status") }}</th>
          <th>{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th>{{ t("g.fields.paid") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(invoice, index) in invoices"
          :key="invoice.id"
          v-fade="index"
          :class="{
            'animate-highlight-row':
              invoice.id == $route.query.id && $route.query.highlight == 'true',
          }"
        >
          <td class="p-2 text-nowrap font-medium">
            {{ invoice.identifier }}
          </td>
          <td class="p-2 font-medium">
            {{ invoice.fullname }}
          </td>
          <td class="p-2">
            <Popover v-if="invoice.products && invoice.products > 0">
              <PopoverTrigger as-child>
                <Button
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                  @mouseenter.passive="previewProducts(invoice.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                >
                  {{ t("g.plrz.p", { n: invoice.products }) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="min-w-[13rem] p-2">
                <table class="w-full not-default">
                  <thead>
                    <tr>
                      <th v-for="index in 3" :key="index" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(invoiceProduct, index) in invoiceProducts"
                      :key="index"
                      class="space-y-1 text-sm flex justify-between w-full items-center"
                    >
                      <td class="underline w-1/2">
                        {{ invoiceProduct.name }}
                      </td>
                      <td class="w-1/4 text-end">
                        {{ invoiceProduct.price }} Dh
                      </td>
                      <td class="w-1/4 text-slate-700 text-end">
                        <i> x{{ invoiceProduct.quantity }} </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </PopoverContent>
            </Popover>
            <template v-else>
              {{ t("g.plrz.p", { n: invoice.products }) }}
            </template>
          </td>
          <td class="p-2">
            <Popover>
              <PopoverTrigger as-child>
                <Badge
                  variant="outline"
                  :class="
                    cn(
                      'cursor-pointer whitespace-nowrap',
                      STATUS_COLORS[invoice?.status!],
                    )
                  "
                >
                  {{ t(`g.status.${invoice.status.toLowerCase()}`) }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-40 p-1 flex flex-col gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  class="border bg-green-100 w-full border-green-500 text-green-900"
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        status: 'PAID',
                      })
                  "
                >
                  {{ t(`g.status.paid`) }}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  class="border bg-yellow-100 w-full border-yellow-500 text-yellow-900"
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        status: 'PENDING',
                      })
                  "
                >
                  {{ t(`g.status.pending`) }}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  class="border bg-red-100 w-full border-red-500 text-red-900"
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        status: 'CANCELED',
                      })
                  "
                >
                  {{ t(`g.status.canceled`) }}
                </Button>
              </PopoverContent>
            </Popover>
          </td>
          <td class="p-2">
            {{
              invoice.createdAt ? d(new Date(invoice.createdAt), "long") : ""
            }}
          </td>
          <td class="p-2">{{ invoice.total?.toFixed(2) }} DH</td>
          <td class="p-2">{{ invoice.paidAmount?.toFixed(2) }} DH</td>
          <td class="p-2">
            <div class="flex justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <!-- <DropdownMenuLabel>My Account</DropdownMenuLabel> -->
                  <DropdownMenuItem
                    @click="toggleThisInvoices(invoice, 'InvoiceDelete')"
                  >
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisInvoices(invoice, 'InvoiceUpdate')"
                  >
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NuxtLink
                      :to="
                        localePath({
                          path: '/invoices/' + invoice.id,
                        })
                      "
                    >
                      <Printer
                        :size="20"
                        class="text-slate-800 inline mr-2"
                      />{{ t("g.actions.print") }}
                    </NuxtLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination />
  </div>
</template>
