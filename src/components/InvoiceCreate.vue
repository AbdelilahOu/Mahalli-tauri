<script setup lang="ts">
import { INVOICE_CREATE, INVOICE_ITEM_CREATE } from "@/constants/defaultValues";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newInvoiceT, newInvoiceItemT, invoiceT } from "@/types";
import { useI18n } from "vue-i18n";
import { ref, reactive, onBeforeMount } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import Button from "./ui/button/Button.vue";
import { invoke } from "@tauri-apps/api";
import Input from "./ui/input/Input.vue";
import { Checkbox } from "./ui/checkbox";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { z } from "zod";
import UiModalCard from "./ui/UiModalCard.vue";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

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
      hideModal();
    }
    return;
  }
  isLoading.value = false;
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 relative rounded-[4px] h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ t("Invoices.create.title") }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="client_id">
            {{ t("Invoices.create.details.client.title") }}
          </Label>
          <span id="client_id">
            <ComboBox
              :label="t('Invoices.create.details.client.select')"
              v-model="newInvoice.client_id"
              :items="clients"
            />
          </span>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="status">
            {{ t("Invoices.create.details.invoice.title") }}
          </Label>
          <div id="status" class="w-full h-full flex flex-col mb-1 gap-1">
            <div class="flex justify-between w-full">
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status-1"
                  @update:checked="() => (newInvoice.status = 'delivered')"
                />
                <Label for="status-1">{{ t("Orders.status.delivered") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
              >
                <Checkbox
                  id="status-2"
                  @update:checked="() => (newInvoice.status = 'pending')"
                />
                <Label for="status-2">{{ t("Orders.status.pending") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status-3"
                  @update:checked="() => (newInvoice.status = 'canceled')"
                />
                <Label for="status-3">{{ t("Orders.status.canceled") }}</Label>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ t("Invoices.create.details.invoice.add") }}
          </Button>
          <div
            class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in invoice_items" :key="index">
              <ComboBox
                :label="t('Invoices.create.details.invoice.select')"
                v-model="item.product_id"
                :items="products"
              />
              <Input
                :placeHolder="
                  t('Invoices.create.details.invoice.placeholder[0]')
                "
                type="number"
                v-model="item.quantity"
              >
                <template #unite> Item </template>
              </Input>
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
    </template>
    <template #footer>
      <div class="grid grid-cols-3 gap-2">
        <Button
          :disabled="isLoading"
          class="col-span-2"
          @click="createNewInvoice"
        >
          {{ t("Invoices.create.button") }}
        </Button>
        <Button @click="hideModal" variant="outline"> Cancel </Button>
      </div>
    </template>
  </UiModalCard>
</template>
