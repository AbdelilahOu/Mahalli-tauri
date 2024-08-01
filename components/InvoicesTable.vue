<script setup lang="ts">
import type { InvoiceProductT, InvoiceT } from "@/schemas/invoice.schema";
import { invoke } from "@tauri-apps/api";
import { FilePenLine, GripHorizontal, Printer, Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
// @ts-ignore
import { InvoiceUpdate, InvoiceDelete } from "#components";

const { updateQueryParams } = useUpdateRouteQueryParams();
const modal = useModal();
const { t, d, locale, n } = useI18n();
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

const toggleThisInvoice = (invoice: InvoiceT, name: "delete" | "update") => {
  if (name == "delete") {
    modal.open(InvoiceDelete, {
      id: invoice.id,
      identifier: invoice.identifier,
    });
  } else {
    modal.open(InvoiceUpdate, {
      id: invoice.id,
      identifier: invoice.identifier,
    });
  }
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
  <div class="w-full">
    <Table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead class="w-24"></TableHead>
          <TableHead>{{ t("g.fields.fullname") }}</TableHead>
          <TableHead>{{ t("g.fields.items") }}</TableHead>
          <TableHead class="w-24">{{ t("g.fields.status") }}</TableHead>
          <TableHead>{{ t("g.fields.date") }}</TableHead>
          <TableHead>{{ t("g.fields.total") }}</TableHead>
          <TableHead>{{ t("g.fields.paid") }}</TableHead>
          <TableHead class="w-20">{{ t("g.fields.actions") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(invoice, index) in invoices"
          :key="invoice.id"
          v-fade="index"
          :class="{
            'animate-highlight-row':
              invoice.id == $route.query.id && $route.query.highlight == 'true',
          }"
        >
          <TableCell class="p-2 text-nowrap font-medium">
            {{ invoice.identifier }}
          </TableCell>
          <TableCell class="p-2 font-medium">
            {{ invoice.fullname }}
          </TableCell>
          <TableCell class="p-2">
            <Popover v-if="invoice.products && invoice.products > 0">
              <PopoverTrigger as-child>
                <Button
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                  @mouseenter.passive="previewProducts(invoice.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                >
                  {{
                    invoice.products +
                    " " +
                    t("g.plrz.p", { n: Math.ceil(invoice.products) })
                  }}
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
                        <td class="min-w-1/4 w-20 text-end text-nowrap">
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
              {{
                (invoice.products == 0 ? "" : invoice.products) +
                " " +
                t("g.plrz.p", { n: Math.ceil(invoice.products ?? 0) })
              }}
            </template>
          </TableCell>
          <TableCell class="p-2">
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
                  v-for="status in STATUSES"
                  type="button"
                  variant="secondary"
                  size="sm"
                  :class="cn('border', STATUS_COLORS[status])"
                  @click="() => updateInvoiceStatus(invoice.id as string, status)"
                >
                  {{ t(`g.status.` + status.toLowerCase()) }}
                </Button>
              </PopoverContent>
            </Popover>
          </TableCell>
          <TableCell class="p-2">
            {{ d(new Date(invoice.createdAt!), "long") }}
          </TableCell>
          <TableCell class="p-2">
            {{ n(invoice.total!, "decimal") }}
            DH
          </TableCell>
          <TableCell class="p-2">
            {{ n(invoice.paidAmount, "decimal") }}
            DH
          </TableCell>
          <TableCell class="p-2">
            <div class="flex justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent class="rtl:ml-6 ltr:mr-6">
                  <DropdownMenuItem
                    @click="toggleThisInvoice(invoice, 'update')"
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="toggleThisInvoice(invoice, 'delete')"
                  >
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination />
  </div>
</template>
