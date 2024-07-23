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
  DRAFT: "bg-gray-100 border-gray-500 text-gray-900",
  SENT: "bg-blue-100 border-blue-500 text-blue-900",
  PAID: "bg-green-100 border-green-500 text-green-900",
  PARTIALLY_PAID: "bg-teal-100 border-teal-500 text-teal-900",
  OVERDUE: "bg-orange-100 border-orange-500 text-orange-900",
  CANCELLED: "bg-red-100 border-red-500 text-red-900",
} as const;

const STATUSES = [
  "DRAFT",
  "SENT",
  "PAID",
  "PARTIALLY_PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

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

const updateInvoiceStatus = async (id: string, status: string) => {
  try {
    await invoke("update_invoice_status", {
      invoice: {
        id,
        status,
      },
    });
    //
    info(
      `UPDATE INVOICE STATUS: ${JSON.stringify({
        id,
        status,
      })}`
    );
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
          <th class="w-24"></th>
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.items") }}</th>
          <th class="w-fit">{{ t("g.fields.status") }}</th>
          <th class="w-56">{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th>{{ t("g.fields.paid") }}</th>
          <th class="w-20">{{ t("g.fields.actions") }}</th>
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
                <ScrollArea
                  :class="invoiceProducts.length > 16 ? 'h-[400px]' : 'h-fit'"
                >
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
                </ScrollArea>
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
              <PopoverContent class="min-w-40 w-fit p-1 flex flex-col gap-1">
                <Button
                  v-for="status in STATUSES"
                  type="button"
                  variant="secondary"
                  size="sm"
                  :class="cn('border text-nowrap px-2', STATUS_COLORS[status])"
                  @click="() => updateInvoiceStatus(invoice.id as string, status)"
                >
                  {{ t(`g.status.` + status.toLowerCase()) }}
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
