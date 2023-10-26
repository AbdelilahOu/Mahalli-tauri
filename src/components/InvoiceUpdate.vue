<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import type { invoiceT, updateInvoiceT } from "@/types";
import ComboBox from "./ui/combobox/ComboBox.vue";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { onBeforeUnmount, onBeforeMount, computed, reactive, ref } from "vue";
import { INVOICE_UPDATE } from "@/constants/defaultValues";
import UiModalCard from "./ui/UiModalCard.vue";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const invoiceRow = computed(() => store.getters.getSelectedRow<invoiceT>());

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

const updateInvoice = reactive<updateInvoiceT>(
  invoiceRow.value ? invoiceRow.value : INVOICE_UPDATE
);

async function deleteOneinvoiceItem(id: string) {
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
      hideModal();
    }
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const addInvoiceItem = () => {
  updateInvoice.invoice_items?.push({
    product_id: undefined,
    quantity: undefined,
  });
};

const deleteInvoiceItem = (index: number) => {
  const item = updateInvoice.invoice_items?.splice(index, 1)[0];
  if (item?.id) deleteOneinvoiceItem(item.id);
};
</script>

<template>
  <UiModalCard
    class="w-5/6 lg:w-1/2 rounded-[4px] relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <template #title>
      {{ t("i.u.title") }}
      N° {{ updateInvoice.id }}
    </template>
    <template #content>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="client_id">
            {{ t("i.u.d.c.title") }}
          </Label>
          <span id="client_id">
            <ComboBox
              :label="t('i.u.d.c.select')"
              :items="clients"
              v-model="updateInvoice.client_id"
            />
          </span>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="status">
            {{ t("i.u.d.i.title") }}
          </Label>
          <div id="status" class="w-full h-full flex flex-col mb-1 gap-1">
            <div class="flex justify-between w-full">
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status-1"
                  :checked="updateInvoice.status === 'delivered'"
                  @update:checked="() => (updateInvoice.status = 'delivered')"
                />
                <Label for="status-1">{{ t("o.s.delivered") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2"
              >
                <Checkbox
                  id="status-2"
                  :checked="updateInvoice.status === 'pending'"
                  @update:checked="() => (updateInvoice.status = 'pending')"
                />
                <Label for="status-2">{{ t("o.s.pending") }}</Label>
              </div>
              <div
                class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2"
              >
                <Checkbox
                  id="status-3"
                  :checked="updateInvoice.status === 'canceled'"
                  @update:checked="() => (updateInvoice.status = 'canceled')"
                />
                <Label for="status-3">{{ t("o.s.canceled") }}</Label>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ t("i.u.d.i.add") }}
          </Button>
          <div
            class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template
              v-for="(item, index) in updateInvoice.invoice_items"
              :key="index"
            >
              <ComboBox
                :label="t('i.c.d.i.select')"
                :items="products"
                v-model="item.product_id"
              />
              <Input
                placeHolder="Product quantity"
                type="number"
                v-model="item.quantity"
              >
                <template #unite> Item </template>
              </Input>
              <div
                class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-[4px] items-center w-full h-full"
                @click="deleteInvoiceItem(index)"
              >
                <UiIcon isStyled name="delete" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="w-full grid grid-cols-3 gap-2">
        <Button class="col-span-2" @click="updateTheInvoice">
          {{ t("g.b.u") }}
        </Button>
        <Button @click="hideModal" variant="outline">
          {{ t("g.b.no") }}
        </Button>
      </div>
    </template>
  </UiModalCard>
</template>
