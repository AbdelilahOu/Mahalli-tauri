<script setup lang="ts">
import type { InvoiceProductT, InvoiceT } from "@/schemas/invoice.schema";
import { invoke } from "@tauri-apps/api";
import { FilePenLine, GripHorizontal, Printer, Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t, d } = useI18n();
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
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const updateInvoiceStatus = async (invoice: any) => {
  try {
    await invoke("update_invoice", {
      invoice,
    });
    //
    info(`UPDATE INVOICE STATUS: ${JSON.stringify(invoice)}`);
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("UPDATE INVOICE STATUS: " + err.error);
  }
};
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
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
          v-fade="index"
          :key="invoice.id"
          :class="{ 'animate-highlight-row': invoice.id == $route.query.id }"
        >
          <td class="p-2">
            <NuxtLink
              class="font-medium"
              :to="{
                path: '/clients/' + invoice.clientId,
              }"
            >
              {{ invoice.fullname }}
            </NuxtLink>
          </td>
          <td class="p-2">
            <Popover v-if="invoice.products && invoice.products > 0">
              <PopoverTrigger as-child>
                <Button
                  @mouseenter.passive="previewProducts(invoice.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                >
                  {{ t("g.plrz.p", { n: invoice.products }) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="min-w-[13rem] p-2">
                <table class="w-full not-default">
                  <thead>
                    <tr>
                      <th v-for="index in 3" :key="index"></th>
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
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        client_id: invoice.clientId,
                        status: 'PAID',
                        paid_amount: invoice.paidAmount,
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-green-100 w-full border-green-500 text-green-900"
                >
                  {{ t(`g.status.paid`) }}
                </Button>
                <Button
                  type="button"
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        client_id: invoice.clientId,
                        status: 'PENDING',
                        paid_amount: invoice.paidAmount,
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-yellow-100 w-full border-yellow-500 text-yellow-900"
                >
                  {{ t(`g.status.pending`) }}
                </Button>
                <Button
                  type="button"
                  @click="
                    () =>
                      updateInvoiceStatus({
                        id: invoice.id,
                        client_id: invoice.clientId,
                        status: 'CANCELED',
                        paid_amount: invoice.paidAmount,
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-red-100 w-full border-red-500 text-red-900"
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
