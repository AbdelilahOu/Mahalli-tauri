<script setup lang="ts">
import type {
  QuoteForUpdateT,
  QuoteProductT,
  QuoteT,
} from "@/schemas/quote.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import {
  FilePenLine,
  GripHorizontal,
  Printer,
  Trash2,
  Truck,
} from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
//@ts-ignore
import { NuxtLink } from "#components";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { setModalName, toggleModal } = useStore();
const { t, d, locale } = useI18n();
const localePath = useLocalePath();

defineProps<{ quotes: QuoteT[]; quoteProducts: QuoteProductT[] }>();
const emits = defineEmits<{
  (e: "listQuoteProducts", id?: string): void;
}>();

let previewProductsTimer: any;
const previewProducts = (id: string) => {
  clearTimeout(previewProductsTimer);
  previewProductsTimer = setTimeout(() => {
    emits("listQuoteProducts", id);
  }, 400);
};
const cancelPreviewProducts = () => clearTimeout(previewProductsTimer);

const toggleThisQuotes = (Quote: QuoteT, name: string) => {
  updateQueryParams({
    id: Quote.id,
    identifier: Quote.identifier,
  });
  setModalName(name);
  toggleModal(true);
};

const createOrderFromQuote = async (id: string) => {
  try {
    const res = await invoke<Res<QuoteForUpdateT>>("create_order_from_quote", {
      id: id,
    });
    info(`CREATE ORDER FROM QUOTE: ${id}`);
    //
    toast.success(t("notifications.order.created"), {
      closeButton: true,
      description: h(NuxtLink, {
        to: localePath("/orders/?page=1&highlight=true&id=" + res.data),
        class: "underline",
        innerHTML: "go to order",
      }),
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("GET QUOTE FOR ORDER: " + err.error);
      return;
    }
    error("GET QUOTE FOR ORDER: " + err);
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
          <th class="w-56">{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th class="w-20">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(quote, index) in quotes" :key="quote.id" v-fade="index">
          <td class="p-2 text-nowrap font-medium">
            {{ quote.identifier }}
          </td>
          <td class="p-2 font-medium">
            {{ quote.fullname }}
          </td>
          <td class="p-2">
            <Popover v-if="quote.products && quote.products > 0">
              <PopoverTrigger as-child>
                <Button
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                  @mouseenter.passive="previewProducts(quote.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                >
                  {{ t("g.plrz.p", { n: quote.products }) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="min-w-[13rem] p-2">
                <ScrollArea
                  :class="quoteProducts.length > 16 ? 'h-[400px]' : 'h-fit'"
                >
                  <table class="w-full not-default">
                    <thead>
                      <tr>
                        <th v-for="index in 3" :key="index" />
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
                </ScrollArea>
              </PopoverContent>
            </Popover>
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
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisQuotes(quote, 'QuoteUpdate')"
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
                          path: '/quotes/' + quote.id,
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
                  <DropdownMenuItem @click="createOrderFromQuote(quote.id!)">
                    <Truck :size="20" class="text-slate-800 inline mr-2" />
                    {{ t("g.actions.toOrder") }}
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
