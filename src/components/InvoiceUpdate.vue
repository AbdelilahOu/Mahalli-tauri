<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import type { invoiceT, updateInvoiceT } from "@/types";
import { ComboBox } from "./ui/combobox";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { onBeforeUnmount, onBeforeMount, computed, reactive, ref } from "vue";
import { INVOICE_UPDATE } from "@/constants/defaultValues";

const { updateQueryParams } = useUpdateRouteQueryParams();

const clients = ref<{ label: string; value: number }[]>([]);
const products = ref<{ label: string; value: number }[]>([]);
const invoiceRow = computed(() => store.getters.getSelectedRow<invoiceT>());

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([
    invoke<{ label: string; value: number }[]>("get_all_clients"),
    invoke<{ label: string; value: number }[]>("get_all_products"),
  ]);

  // @ts-ignore
  if ((res[0].status = "fulfilled")) clients.value = res[0].value;
  // @ts-ignore
  if ((res[1].status = "fulfilled")) products.value = res[1].value;
});

const updateInvoice = reactive<updateInvoiceT>(
  invoiceRow.value ? invoiceRow.value : INVOICE_UPDATE
);

async function deleteOneinvoiceItem(id: number) {
  try {
    await invoke("delete_invoice_items", { id });
  } catch (error) {
    console.log(error);
  }
}

onBeforeUnmount(() => store.setters.updateStore({ key: "row", value: null }));

const updateTheInvoice = async () => {
  if (updateInvoice.id) {
    try {
      console.log(updateInvoice);
      await invoke("update_invoice", {
        invoice: updateInvoice,
        id: updateInvoice.id,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-update-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
    }
  }
};

const addInvoiceItem = () => {
  updateInvoice.invoice_items?.push({ product_id: 0, quantity: 0 });
};

const deleteInvoiceItem = (index: number) => {
  const item = updateInvoice.invoice_items?.splice(index, 1)[0];
  if (item?.id) deleteOneinvoiceItem(item.id);
};
</script>

<template>
  <div
    class="w-5/6 lg:w-1/2 rounded-[4px] relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Invoices.update.title") }}
      N° {{ updateInvoice.id }}
    </h1>
    <div class="h-full w-full grid grid-cols-1 gap-2">
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">
          {{ globalTranslate("Invoices.update.details.client.title") }}
        </h1>
        <ComboBox :items="clients" v-model="updateInvoice.client_id">
          {{ globalTranslate("Invoices.update.details.client.select") }}
        </ComboBox>
      </div>
      <div class="w-full h-full flex flex-col gap-1">
        <h1 class="font-medium">invoice details</h1>
        <div class="w-full h-full flex flex-col mb-1 gap-1">
          <div class="flex justify-between w-full">
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
            >
              <Checkbox v-model="updateInvoice.status" value="delivered" />
              <span>{{ globalTranslate("Invoices.status.delivered") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
            >
              <Checkbox v-model="updateInvoice.status" value="pending" />
              <span>{{ globalTranslate("Invoices.status.pending") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
            >
              <Checkbox v-model="updateInvoice.status" value="canceled" />
              <span>{{ globalTranslate("Invoices.status.canceled") }}</span>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ globalTranslate("Invoices.update.details.invoice.add") }}
          </Button>
          <div
            class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <div class="flex flex-col gap-2">
              <ComboBox
                v-for="(item, index) in updateInvoice.invoice_items"
                :key="index"
                :items="products"
                v-model="item.product_id"
              >
                {{ globalTranslate("Invoices.create.details.invoice.select") }}
              </ComboBox>
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(item, index) in updateInvoice.invoice_items"
                :key="index"
                class="h-full w-full items-center relative"
              >
                <Input
                  placeHolder="Product quantity"
                  type="number"
                  v-model="item.quantity"
                >
                  <template #unite>
                    <span
                      class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
                    >
                      Item
                    </span>
                  </template>
                </Input>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(item, index) in updateInvoice.invoice_items"
                :key="index"
                class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                @click="deleteInvoiceItem(index)"
              >
                <UiIcon isStyled name="delete" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Button class="w-full" @click="updateTheInvoice">
        {{ globalTranslate("Invoices.update.button") }}
      </Button>
    </div>
  </div>
</template>
