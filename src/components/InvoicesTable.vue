<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
// import { ref } from "vue";
import type { InvoiceT } from "@/schemas/invoice.schema";
import { Badge } from "./ui/badge";
import { cn } from "@/utils/shadcn";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";

const { updateQueryParams } = useUpdateRouteQueryParams();

defineProps<{ invoices: InvoiceT[] }>();

const { t, d } = useI18n();
// const checkedInvoices = ref<string[]>([]);

// const _ = (IsIncluded: boolean, id: string) => {
//   IsIncluded
//     ? checkedInvoices.value.push(id)
//     : checkedInvoices.value.splice(checkedInvoices.value.indexOf(id), 1);
// };

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
          <th
            v-for="index in [1, 2, 3, 4, 5, 6, 7]"
            :key="index"
            class="p-2 w-fit first:rounded-l-[4px] text-left last:rounded-r-[4px]"
          >
            {{ t(`i.i.feilds[${index}]`) }}
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
              <span>
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
