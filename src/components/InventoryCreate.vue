<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { onBeforeMount, ref, reactive } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import type { newInventoryMvmT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";

const { updateQueryParams } = useUpdateRouteQueryParams();

const products = ref<{ label: string; value: string }[]>([]);
const isLoading = ref<boolean>(false);

const inventoryMvmSchema = toTypedSchema(
  z.object({
    product_id: z.string().uuid(),
    quantity: z.number().min(1),
  })
);

const form = useForm({
  validationSchema: inventoryMvmSchema,
});

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([invoke("get_all_products")]);
  if (res[0].status === "fulfilled") {
    // @ts-ignore
    products.value = res[0].value;
  }
});

const createNewInventory = async (inventoryMvm: newInventoryMvmT) => {
  isLoading.value = true;
  try {
    await invoke("insert_inventory_mvm", { inventory: inventoryMvm });
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
};

const onSubmit = form.handleSubmit((values) => {
  createNewInventory(values);
});

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>
<template>
  <UiModalCard>
    <template #title>
      {{ globalTranslate("Inventory.create.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="product_id">
          <FormItem>
            <FormLabel>Product</FormLabel>
            <FormControl>
              <ComboBox
                :label="globalTranslate('Inventory.create.select')"
                v-bind="componentField"
                :items="products"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeHolder="globalTranslate('Inventory.create.placeholder')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="w-full grid grid-cols-3 gap-2">
          <Button :disabled="isLoading" type="submit" class="w-full col-span-2">
            {{ globalTranslate("Inventory.create.button") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isLoading"
            variant="outline"
          >
            Cancel</Button
          >
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
