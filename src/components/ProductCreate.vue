<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { ImagesFiles } from "@/constants/FileTypes";
import UiUploader from "./ui/UiUploader.vue";
import type { newProductT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { saveFile } from "@/utils/fs";
import { store } from "@/store";
import { PRODUCT_CREATE } from "@/constants/defaultValues";

const isFlash = ref<boolean>(false);

const product = reactive<newProductT>(PRODUCT_CREATE);

const { updateQueryParams } = useUpdateRouteQueryParams();

const createNewProduct = async () => {
  isFlash.value = true;
  if (product.name !== "") {
    try {
      let image: string = await saveFile(product.image as string, "Image");
      await invoke("insert_product", { product: { ...product, image } });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (error) {
      console.log(error);
    } finally {
      store.setters.updateStore({ key: "show", value: false });
      return;
    }
  }
  setTimeout(() => {
    isFlash.value = false;
  }, 1000);
};

const setImage = (image: string) => {
  product.image = image;
};
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Products.create.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <div class="w-full h-fit flex justify-center">
        <UiUploader
          name="Image"
          :extensions="ImagesFiles"
          @on:save="setImage"
        />
      </div>
      <Input
        :v-model="product.name"
        type="text"
        :placeHolder="globalTranslate('Products.create.placeholders[0]')"
      />
      <Input
        :v-model="product.price"
        type="Number"
        :placeHolder="globalTranslate('Products.create.placeholders[2]')"
      />
      <Input
        :v-model="product.tva"
        type="Number"
        :placeHolder="globalTranslate('Products.create.placeholders[3]')"
      />
      <Input
        :v-model="product.quantity"
        type="Number"
        :placeHolder="globalTranslate('Products.create.placeholders[4]')"
      />
      <Input
        :v-model="product.description"
        type="textarea"
        :placeHolder="globalTranslate('Products.create.placeholders[5]')"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="createNewProduct">
        {{ globalTranslate("Products.create.button") }}
      </Button>
    </div>
  </div>
</template>
