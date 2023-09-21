<script setup lang="ts">
import { ref } from "vue";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newSellerT } from "@/types";
import UiUploader from "./ui/UiUploader.vue";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { saveFile } from "@/utils/fs";
import { globalTranslate } from "@/utils/globalTranslate";
import { SELLER_CREATE } from "@/constants/defaultValues";
import { invoke } from "@tauri-apps/api";
import { store } from "@/store";
import { ImagesFiles } from "@/constants/FileTypes";

const { updateQueryParams } = useUpdateRouteQueryParams();
const isFlash = ref<boolean>(false);

const seller = ref<newSellerT>(SELLER_CREATE);

const createNewSeller = async () => {
  isFlash.value = true;
  if (seller.value.name !== "") {
    try {
      let image: string = await saveFile(seller.value.image as string, "Image");
      await invoke("insert_seller", { seller: { ...seller.value, image } });
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

const saveImage = (image: string) => {
  seller.value.image = image;
};
</script>

<template>
  <div
    class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ globalTranslate("Sellers.create.title") }}
    </h1>
    <div class="h-full w-full flex flex-col gap-2">
      <div class="w-full h-fit flex justify-center">
        <UiUploader name="Image" :extensions="ImagesFiles" @save="saveImage" />
      </div>
      <Input
        v-model="seller.name"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[0]')"
      />
      <Input
        v-model="seller.email"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[1]')"
      />
      <Input
        v-model="seller.phone"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[2]')"
      />
      <Input
        v-model="seller.address"
        type="text"
        :placeHolder="globalTranslate('Sellers.create.placeholders[3]')"
      />
    </div>
    <div class="flex">
      <Button class="w-full" @click="createNewSeller">
        {{ globalTranslate("Sellers.create.button") }}
      </Button>
    </div>
  </div>
</template>
