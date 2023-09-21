<script setup lang="ts">
import { INVOICE_CREATE, INVOICE_ITEM_CREATE } from "@/constants/defaultValues";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newInvoiceT, newInvoiceItemT, invoiceT } from "@/types";
import { ref, reactive, onBeforeMount } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";

const { updateQueryParams } = useUpdateRouteQueryParams();

const clients = ref<{ label: string; value: number }[]>([]);
const products = ref<{ label: string; value: number }[]>([]);
const newInvoice = reactive<newInvoiceT>(INVOICE_CREATE);
const InvoiceItems = ref<newInvoiceItemT[]>(INVOICE_ITEM_CREATE);
const isFlash = ref<boolean>(false);

onBeforeMount(async () => {
  const res = await Promise.allSettled([
    invoke<{ label: string; value: number }[]>("get_all_clients"),
    invoke<{ label: string; value: number }[]>("get_all_products"),
  ]);

  // @ts-ignore
  if ((res[0].status = "fulfilled")) clients.value = res[0].value;
  // @ts-ignore
  if ((res[1].status = "fulfilled")) products.value = res[1].value;
});

const addInvoiceItem = () => {
  InvoiceItems.value.push({ product_id: 0, quantity: 0 });
};

const removeInvoiceItem = (index: number) => {
  InvoiceItems.value.splice(index, 1);
};

const createNewInvoice = async () => {
  isFlash.value = true;
  newInvoice.invoice_items = InvoiceItems.value.filter(
    (item) => item.product_id !== 0 && item.quantity !== 0
  );
  if (newInvoice.client_id && newInvoice.invoice_items.length !== 0) {
    try {
      await invoke<invoiceT>("insert_invoice", {
        invoice: newInvoice,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }
  setTimeout(() => {
    isFlash.value = false;
  }, 1000);
};
</script>

<template>
  <div
    class="w-5/6 lg:w-1/2 relative rounded-[4px] h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Invoices.create.title") }}
    </h1>
    <div class="h-full w-full grid grid-cols-1 gap-2">
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Invoices.create.details.client.title") }}
        </h1>
        <ComboBox :items="clients">
          {{ globalTranslate("Invoices.create.details.client.select") }}
        </ComboBox>
      </div>
      <h1 class="font-medium">
        {{ globalTranslate("Invoices.create.details.invoice.title") }}
      </h1>
      <div class="w-full h-full flex flex-col mb-1 gap-1">
        <div class="flex justify-between w-full">
          <div
            class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
          >
            <Checkbox />
            <span>{{ globalTranslate("Orders.status.delivered") }}</span>
          </div>
          <div
            class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
          >
            <Checkbox />
            <span>{{ globalTranslate("Orders.status.pending") }}</span>
          </div>
          <div
            class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
          >
            <Checkbox />
            <span>{{ globalTranslate("Orders.status.canceled") }}</span>
          </div>
        </div>
      </div>
      <div class="w-full h-full flex flex-col gap-1">
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ globalTranslate("Invoices.create.details.invoice.add") }}
          </Button>
          <div
            class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in InvoiceItems" :key="index">
                <ComboBox :items="products">
                  {{
                    globalTranslate("Invoices.create.details.invoice.select")
                  }}
                </ComboBox>
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in InvoiceItems" :key="index">
                <div class="h-full w-full items-center relative">
                  <Input
                    :placeHolder="
                      globalTranslate(
                        'Invoices.create.details.invoice.placeholder[0]'
                      )
                    "
                    type="number"
                    v-model="item.quantity"
                  >
                    <!-- {{
                      unite: () => (
                        <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                          Item
                        </span>
                      ),
                    }} -->
                  </Input>
                </div>
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <template v-for="(item, index) in InvoiceItems" :key="index">
                <div
                  @click="removeInvoiceItem(index)"
                  class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                >
                  <UiIcon name="delete" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Button class="w-full" @click="createNewInvoice">
        {{ globalTranslate("Invoices.create.button") }}
      </Button>
    </div>
  </div>
</template>
