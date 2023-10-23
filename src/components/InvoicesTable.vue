<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { Checkbox } from "./ui/checkbox/index";
import type { invoiceT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ref } from "vue";

defineProps<{ invoices: invoiceT[] }>();

const { t } = useI18n();

const checkedInvoices = ref<string[]>([]);

const checkThisInvoice = (IsIncluded: boolean, id: string) => {
  IsIncluded
    ? checkedInvoices.value.push(id)
    : checkedInvoices.value.splice(checkedInvoices.value.indexOf(id), 1);
};

const pagination = ref(0);

const toggleThisInvoice = (Invoice: invoiceT, name: string) => {
  store.setters.updateStore({ key: "row", value: Invoice });
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
          <th class="rounded-l-[4px]"></th>
          <th
            v-for="index in [1, 2, 3, 4, 5, 6]"
            class="p-2 w-fit last:rounded-r-[4px]"
          >
            <div class="font-semibold text-left">
              {{ t(`i.i.feilds[${index}]`) }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          v-fade="index"
          :key="Invoice.id"
          v-for="(Invoice, index) in invoices"
        >
          <td class="p-2">
            <span class="h-full w-full grid">
              <Checkbox @change="checkThisInvoice" />
            </span>
          </td>

          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <router-link
                :to="{
                  name: 'ClientDetails',
                  params: { id: Invoice.client_id },
                }"
              >
                {{ Invoice.client.fullname }}
              </router-link>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!Invoice.invoice_items?.length" class="text-red-400"
                >No products</span
              >
              <span v-else>
                {{
                  Invoice.invoice_items?.length
                    ? `${Invoice.invoice_items.length} ${
                        Invoice.invoice_items.length === 1
                          ? "Product"
                          : "Products"
                      }`
                    : ""
                }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div
              class="text-left font-medium flex justify-between uppercase whitespace-nowrap overflow-ellipsis"
            >
              <div class="grid grid-cols-2 grid-rows 1 gap-2 w-full">
                <span>{{ Invoice.total?.toFixed(2) ?? 0 }}</span>
                <span class="w-full text-start">DH</span>
              </div>
            </div>
          </td>
          <td class="p-2">
            <div
              class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis"
            >
              <span
                v-if="Invoice.status"
                :class="[
                  'px-2 py-[1px] rounded-full',
                  Invoice.status === 'pending'
                    ? 'bg-yellow-300/60 text-yellow-800'
                    : Invoice.status === 'delivered'
                    ? 'bg-green-300/60 text-green-800'
                    : 'bg-red-300/60 text-red-800',
                ]"
                >{{ t(`Orders.status.${Invoice.status.toLowerCase()}`) }}</span
              >
              <span v-else class="text-red-400">No status</span>
            </div>
          </td>
          <td class="p-2">
            <div class="text-left whitespace-nowrap overflow-ellipsis">
              <span v-if="!Invoice.created_at" class="text-red-400"
                >No date</span
              >
              <span v-else>
                {{ Invoice.created_at }}
              </span>
            </div>
          </td>
          <td class="p-2">
            <div class="flex justify-start gap-3">
              <span @click="toggleThisInvoice(Invoice, 'InvoiceDelete')">
                <UiIcon isStyled name="delete" />
              </span>
              <span @click="toggleThisInvoice(Invoice, 'InvoiceUpdate')">
                <UiIcon isStyled name="edit" />
              </span>
              <router-link
                :to="{ name: 'InvoiceDetails', params: { id: Invoice.id } }"
              >
                <UiIcon name="print" />
              </router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <UiPagination />
    </div>
  </div>
</template>
