<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import type { productT, updateProductT } from "@/types";
import { computed, ref, onBeforeUnmount } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Textarea } from "./ui/textarea";
import { useForm } from "vee-validate";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { z } from "zod";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const ProductRow = computed(() => store.getters.getSelectedRow<productT>());

const isLoading = ref<boolean>(false);

const productSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50).default(ProductRow.value.name),
    price: z.number().min(0).default(ProductRow.value.price),
    description: z
      .string()
      .min(2)
      .default(ProductRow.value.description ?? ""),
    quantity: z.number().min(0).default(0),
    min_quantity: z
      .number()
      .min(0)
      .default(ProductRow.value.min_quantity ?? 0),
  }),
);

const form = useForm({
  validationSchema: productSchema,
});

const updateTheProduct = async (product: updateProductT) => {
  if (ProductRow.value.id) {
    try {
      await invoke("update_product", {
        product: {
          ...product,
          image: ProductRow.value.image,
          id: ProductRow.value.id,
        },
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

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  updateTheProduct(values);
});

onBeforeUnmount(() => {
  store.setters.updateStore({ key: "row", value: null });
});
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("p.u.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("p.p.a") }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeHolder="Product name"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>{{ t("p.p.b") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeHolder="Product price"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>{{ t("p.p.d") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeHolder="Quantity"
                v-bind="componentField"
              >
                <template #unite> Item </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="min_quantity">
          <FormItem>
            <FormLabel>{{ t("p.p.d") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeHolder="Quantity"
                v-bind="componentField"
              >
                <template #unite> Item </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              {{ t("p.p.e") }}
            </FormLabel>
            <FormControl>
              <Textarea
                type="text"
                placeholder="Description"
                v-bind="componentField"
              ></Textarea>
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button :disabled="isLoading" type="submit" class="w-full col-span-2">
            {{ t("g.b.u", { name: ProductRow.name }) }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isLoading"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
