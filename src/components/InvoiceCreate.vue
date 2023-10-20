<script setup lang="ts">
import { INVOICE_CREATE, INVOICE_ITEM_CREATE } from "@/constants/defaultValues";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newInvoiceT, newInvoiceItemT, invoiceT } from "@/types";
import { globalTranslate } from "@/utils/globalTranslate";
import { ref, reactive, onBeforeMount } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import Button from "./ui/button/Button.vue";
import { invoke } from "@tauri-apps/api";
import Input from "./ui/input/Input.vue";
import { Checkbox } from "./ui/checkbox";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { ZodAny, z } from "zod";
import UiModalCard from "./ui/UiModalCard.vue";

const { updateQueryParams } = useUpdateRouteQueryParams();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const newInvoice = reactive<newInvoiceT>(Object.assign({}, INVOICE_CREATE));
const invoice_items = ref<newInvoiceItemT[]>(
  INVOICE_ITEM_CREATE.map((a) => Object.assign({}, a))
);
const isLoading = ref<boolean>(false);

const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  status: z.string().min(5),
  invoice_items: z.array(
    z.object({
      product_id: z.string().uuid(),
      price: z.number().min(0),
    })
  ),
});

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([
    invoke<{ label: string; value: string }[]>("get_all_clients"),
    invoke<{ label: string; value: string }[]>("get_all_products"),
  ]);

  // @ts-ignore
  if ((res[0].status = "fulfilled")) clients.value = res[0].value;
  // @ts-ignore
  if ((res[1].status = "fulfilled")) products.value = res[1].value;
});

const addInvoiceItem = () => {
  invoice_items.value.push({ product_id: undefined, quantity: undefined });
};

const removeInvoiceItem = (index: number) => {
  invoice_items.value.splice(index, 1);
};

const createNewInvoice = async () => {
  isLoading.value = true;
  newInvoice.invoice_items = invoice_items.value.filter(
    (item) => item.product_id && item.quantity
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
      isLoading.value = false;
      store.setters.updateStore({ key: "show", value: false });
    }
    return;
  }
  isLoading.value = false;
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 relative rounded-[4px] h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ globalTranslate("Invoices.create.title") }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="w-full h-full flex flex-col gap-1">
          <h1 class="font-medium">
            {{ globalTranslate("Invoices.create.details.client.title") }}
          </h1>
          <ComboBox
            :label="globalTranslate('Invoices.create.details.client.select')"
            v-model="newInvoice.client_id"
            :items="clients"
          />
        </div>
        <h1 class="font-medium">
          {{ globalTranslate("Invoices.create.details.invoice.title") }}
        </h1>
        <div class="w-full h-full flex flex-col mb-1 gap-1">
          <div class="flex justify-between w-full">
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
            >
              <Checkbox
                @update:checked="() => (newInvoice.status = 'delivered')"
              />
              <span>{{ globalTranslate("Orders.status.delivered") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
            >
              <Checkbox
                @update:checked="() => (newInvoice.status = 'pending')"
              />
              <span>{{ globalTranslate("Orders.status.pending") }}</span>
            </div>
            <div
              class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
            >
              <Checkbox
                @update:checked="() => (newInvoice.status = 'canceled')"
              />
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
                <template v-for="(item, _index) in invoice_items" :key="_index">
                  <ComboBox
                    :label="
                      globalTranslate('Invoices.create.details.invoice.select')
                    "
                    v-model="item.product_id"
                    :items="products"
                  />
                </template>
              </div>
              <div class="flex flex-col gap-2">
                <template v-for="(item, _index) in invoice_items" :key="_index">
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
                      <template #unite>
                        <span
                          class="h-full text-gray-400 rounded-[4px] px-2 flex items-center justify-center"
                        >
                          Item
                        </span>
                      </template>
                    </Input>
                  </div>
                </template>
              </div>
              <div class="flex flex-col gap-2">
                <template v-for="(_item, index) in invoice_items" :key="index">
                  <div
                    @click="removeInvoiceItem(index)"
                    class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                  >
                    <UiIcon isStyled name="delete" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button
          :disabled="isLoading"
          class="col-span-2"
          @click="createNewInvoice"
        >
          {{ globalTranslate("Invoices.create.button") }}
        </Button>
        <Button variant="outline"> Cancel </Button>
      </div>
    </template>
  </UiModalCard>
</template>
