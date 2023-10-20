<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { PRODUCT_CREATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";
import { ImagesFiles } from "@/constants/FileTypes";
import UiUploader from "./ui/UiUploader.vue";
import type { newProductT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { saveFile } from "@/utils/fs";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import { Textarea } from "./ui/textarea";

import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";

const isLoading = ref<boolean>(false);

const image = ref<string>();

const productSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    price: z.number().min(0),
    description: z.string().min(2).max(50),
    quantity: z.number().min(0),
    tva: z.number().min(0).max(100),
  })
);

const form = useForm({
  validationSchema: productSchema,
});

const { updateQueryParams } = useUpdateRouteQueryParams();

const createNewProduct = async (product: newProductT) => {
  isLoading.value = true;
  if (product.name !== "") {
    try {
      let image: string = await saveFile(product.image as string, "Image");
      await invoke("insert_product", {
        product: {
          image,
          ...product,
          price: Number(product.price),
          tva: Number(product.tva),
          quantity: Number(product.quantity),
        },
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
      {{ globalTranslate("Products.create.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <UiUploader
          name="Image"
          :extensions="ImagesFiles"
          @on:save="setImage"
        />
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
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
            <FormLabel>Price</FormLabel>
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
        <FormField v-slot="{ componentField }" name="tva">
          <FormItem>
            <FormLabel>TVA</FormLabel>
            <FormControl>
              <Input type="text" placeHolder="tva" v-bind="componentField">
                <template #unite> % </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
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
            <FormLabel>Description</FormLabel>
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
            {{ globalTranslate("Clients.create.button") }}
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
