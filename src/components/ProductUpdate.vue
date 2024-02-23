<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import { invoke } from "@tauri-apps/api";
import { Textarea } from "./ui/textarea";
import { useForm } from "vee-validate";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import { z } from "zod";
import type { ProductT } from "@/schemas/products.schema";
import type { Res } from "@/types";
import { useRoute } from "vue-router";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const route = useRoute();

const isUpdating = ref<boolean>(false);
const quantity = ref<number>(0);

const productSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .default(route.query.name as string),
    price: z
      .number()
      .min(0)
      .default(Number(route.query.price) ?? 0),
    description: z
      .string()
      .min(2)
      .default((route.query.description as string) ?? ""),
    image: z.string().default((route.query.image ?? "") as string),
    minQuantity: z.number().default(Number(route.query.minQuantity) ?? 0),
  }),
);

const form = useForm({
  validationSchema: productSchema,
});

const updateTheProduct = async (product: ProductT) => {
  try {
    const id = route.query.id;
    const _ = await invoke<Res<string>>("update_product", {
      product: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        min_quantity: Number(product.minQuantity),
        image: product.image,
        id,
      },
    });
    console.log(_);
    if (quantity.value > 0) {
      const createMvmRes = await invoke("create_inventory", {
        mvm: {
          mvm_type: "IN",
          product_id: id,
          quantity: Number(quantity.value),
        },
      });
      console.log(createMvmRes);
    }
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (error) {
    console.log(error);
  } finally {
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  updateTheProduct(values);
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
        <FormField name="">
          <FormItem>
            <FormLabel>{{ t("p.p.d") }}</FormLabel>
            <FormControl>
              <Input type="number" placeHolder="Quantity" v-model="quantity">
                <template #unite> Item </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="minQuantity">
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
          <Button
            :disabled="isUpdating"
            type="submit"
            class="w-full col-span-2"
          >
            {{ t("g.b.u", { name: $route.query.name }) }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isUpdating"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
