<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import { store } from "@/store";
import type {
  QuoteForUpdateT,
  QuoteProductT,
  QuoteT,
} from "@/schemas/quote.schema";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/utils/shadcn";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import {
  FilePenLine,
  Printer,
  Trash2,
  GripHorizontal,
  NotepadText,
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Res } from "@/types";
import { toast } from "vue-sonner";
import { h } from "vue";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t, d } = useI18n();

defineProps<{ quotes: QuoteT[]; quoteProducts: QuoteProductT[] }>();
defineEmits<{
  (e: "listQuoteProducts", id?: string): void;
  (e: "cancelQuoteProducts"): void;
}>();

const toggleThisQuotes = (Quote: QuoteT, name: string) => {
  updateQueryParams({
    id: Quote.id,
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const createInvoiceFromQuote = async (id: string) => {
  try {
    const res = await invoke<Res<QuoteForUpdateT>>("get_quote", {
      id: id,
    });
    if (!res.error) {
      const invoiceRes = await invoke<Res<String>>("create_invoice", {
        invoice: {
          client_id: res.data.clientId,
          status: "PAID",
          paid_amount: 0,
          quote_id: id,
        },
      });
      //
      for await (const item of res.data.items) {
        const invRes = await invoke<Res<string>>("create_inventory", {
          mvm: {
            mvm_type: "OUT",
            product_id: item.product_id,
            quantity: item.quantity,
          },
        });

        await invoke<Res<string>>("create_invoice_item", {
          item: {
            invoice_id: invoiceRes.data,
            inventory_id: invRes.data,
            price: item.price,
          },
        });
      }
      info(`CREATE INVOICE FROM QUOTE: ${id}`);
      //
      toast.success(t("notifications.invoice.created"), {
        closeButton: true,
        description: h(RouterLink, {
          to: "/invoices/?page=1&id=" + invoiceRes.data,
          class: "underline",
          innerHTML: "go to invoice",
        }),
      });
    }
  } catch (err: any) {
    error("GET QUOTE FOR INVOICE: " + err.error);
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
          <th>{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(quote, index) in quotes" v-fade="index" :key="quote.id">
          <td class="p-2">
            <RouterLink
              class="font-medium"
              :to="{
                path: '/clients/' + quote.clientId,
              }"
            >
              {{ quote.fullname }}
            </RouterLink>
          </td>
          <td class="p-2">
            <HoverCard v-if="quote.products && quote.products > 0">
              <HoverCardTrigger as-child>
                <Button
                  @mouseenter.passive="$emit('listQuoteProducts', quote.id)"
                  @mouseleave.passive="$emit('cancelQuoteProducts')"
                  size="sm"
                  variant="link"
                  class="underline px-0"
                >
                  {{ t("g.plrz.p", { n: quote.products }) }}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent class="min-w-[13rem] p-2">
                <table class="w-full not-default">
                  <thead>
                    <tr>
                      <th v-for="index in 3" :key="index"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(quoteProduct, index) in quoteProducts"
                      :key="index"
                      class="space-y-1 text-sm flex justify-between w-full items-center"
                    >
                      <td class="underline w-1/2">{{ quoteProduct.name }}</td>
                      <td class="w-1/4 text-end">
                        {{ quoteProduct.price }} Dh
                      </td>
                      <td class="w-1/4 text-slate-700 text-end">
                        <i> x{{ quoteProduct.quantity }} </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </HoverCardContent>
            </HoverCard>
            <template v-else>
              {{ t("g.plrz.p", { n: quote.products }) }}
            </template>
          </td>
          <td class="p-2">
            {{ quote.createdAt ? d(new Date(quote.createdAt), "long") : "" }}
          </td>
          <td class="p-2">{{ quote.total?.toFixed(2) }} DH</td>
          <td class="p-2">
            <div class="flex justify-center items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <!-- <DropdownMenuLabel>My Account</DropdownMenuLabel> -->
                  <DropdownMenuItem
                    @click="toggleThisQuotes(quote, 'QuoteDelete')"
                  >
                    <Trash2 :size="20" class="text-slate-800 inline mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisQuotes(quote, 'QuoteUpdate')"
                  >
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RouterLink
                      :to="{
                        path: '/quotes/' + quote.id,
                      }"
                    >
                      <Printer
                        :size="20"
                        class="text-slate-800 inline mr-2"
                      />Print
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="createInvoiceFromQuote(quote.id!)">
                    <NotepadText
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />Create invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <UiPagination />
  </div>
</template>
