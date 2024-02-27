<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { toTypedSchema } from "@vee-validate/zod";
import UiModalCard from "./ui/UiModalCard.vue";
import UiUploader from "./ui/UiUploader.vue";
import { invoke } from "@tauri-apps/api";
import { Textarea } from "./ui/textarea";
import { useForm } from "vee-validate";
// import { saveFile } from "@/utils/fs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useI18n } from "vue-i18n";
import { store } from "@/store";
import { ref } from "vue";
import type { Res } from "@/types";
import { CreateProductSchema, type ProductT } from "@/schemas/products.schema";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();

const isCreating = ref<boolean>(false);
const image = ref<string>();
const quantity = ref<string>("");

const productSchema = toTypedSchema(CreateProductSchema);
const form = useForm({
  validationSchema: productSchema,
});

const createNewProduct = async (product: ProductT) => {
  isCreating.value = true;
  try {
    // let image: string = await saveFile(product.image as string, "Image");
    let createRes = await invoke<Res<string>>("create_product", {
      product: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        min_quantity: product.minQuantity,
        image: "",
      },
    });
    if (!createRes.error) {
      await invoke("create_inventory", {
        mvm: {
          mvm_type: "IN",
          product_id: createRes.data,
          quantity: Number(quantity.value),
        },
      });
    }
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-create-" + Math.random() * 9999,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isCreating.value = false;
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  createNewProduct(values);
});

const setImage = (path: string) => {
  image.value = path;
};
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("p.c.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @on:save="setImage"
        />
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("g.fields.name") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.name')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>{{ t("g.fields.price") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.price')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="">
          <FormItem>
            <FormLabel>{{ t("g.fields.init-quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.init-quantity')"
                v-model="quantity"
              >
                <template #unite> Item </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="minQuantity">
          <FormItem>
            <FormLabel>{{ t("g.fields.min-quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.min-quantity')"
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
              {{ t("g.fields.description") }}
            </FormLabel>
            <FormControl>
              <Textarea
                :placeholder="t('g.fields.description')"
                v-bind="componentField"
              ></Textarea>
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button
            :disabled="isCreating"
            type="submit"
            class="w-full col-span-2"
          >
            {{ t("g.b.c") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isCreating"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
