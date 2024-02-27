<script setup lang="ts">
import type { InvoiceProductT, InvoiceT } from "@/schemas/invoice.schema";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";
import { useI18n } from "vue-i18n";
import { store } from "@/store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/utils/shadcn";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t, d } = useI18n();

defineProps<{ invoices: InvoiceT[]; invoiceProducts: InvoiceProductT[] }>();
defineEmits<{
  (e: "listInvoiceProducts", id?: string): void;
  (e: "cancelInvoiceProducts"): void;
}>();

const toggleThisInvoices = (Invoice: InvoiceT, name: string) => {
  updateQueryParams({
    id: Invoice.id,
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <table class="table-auto w-full">
      <thead
        class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
      >
        <tr>
          <th class="rounded-l-[4px] p-2 w-fit font-semibold text-left">
            {{ t("g.fields.fullname") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.items") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.status") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.date") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.total") }}
          </th>
          <th class="p-2 w-fit font-semibold text-left">
            {{ t("g.fields.paid") }}
          </th>
          <th class="rounded-r-[4px]">
            {{ t("g.fields.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          v-for="(invoice, index) in invoices"
          v-fade="index"
          :key="invoice.id"
        >
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <RouterLink
                :to="{
                  name: 'ClientDetails',
                  params: { id: invoice.clientId },
                }"
              >
                {{ invoice.fullname }}
              </RouterLink>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <HoverCard v-if="invoice.products && invoice.products > 0">
                <HoverCardTrigger as-child>
                  <Button
                    @mouseenter="$emit('listInvoiceProducts', invoice.id)"
                    @mouseleave="$emit('cancelInvoiceProducts')"
                    size="sm"
                    variant="link"
                    class="underline px-0"
                  >
                    {{ t("g.plrz.p", { n: invoice.products }) }}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent class="min-w-[13rem] p-2">
                  <table class="w-full">
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
                </HoverCardContent>
              </HoverCard>
              <span v-else>
                {{ t("g.plrz.p", { n: invoice.products }) }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div
              class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis"
            >
              <Badge
                variant="outline"
                :class="
                  cn(
                    invoice?.status == 'CANCELED'
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : invoice?.status == 'PENDING'
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
                        : invoice?.status == 'PAID'
                          ? 'bg-green-100 border-green-500 text-green-900'
                          : '',
                  )
                "
              >
                {{ t(`i.s.${invoice.status.toLowerCase()}`) }}
              </Badge>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="invoice.createdAt">
                {{ d(new Date(invoice.createdAt), "long") }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span> {{ invoice.total?.toFixed(2) }} DH </span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span> {{ invoice.paidAmount?.toFixed(2) }} DH </span>
            </div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3">
              <span @click="toggleThisInvoices(invoice, 'InvoiceDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisInvoices(invoice, 'InvoiceUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
              <RouterLink
                :to="{
                  name: 'InvoiceDetails',
                  params: { id: invoice.id },
                }"
              >
                <UiIcon name="print" />
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pt-12">
      <UiPagination />
    </div>
  </div>
</template>
