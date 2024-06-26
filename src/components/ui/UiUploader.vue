<script setup lang="ts">
import { getBytesArray, getFileBytes } from "@/utils/fs";
import { open } from "@tauri-apps/api/dialog";
import { downloadDir, pictureDir } from "@tauri-apps/api/path";
import { useDropZone } from "@vueuse/core";
import { Trash2 } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { name, extensions } = defineProps<{
  extensions: string[];
  name: string;
}>();

const emits = defineEmits<{
  (e: "save:base64", image: string): void;
}>();

const { t } = useI18n();
const dropZone = ref<HTMLDivElement>();

async function onDrop(files: File[] | null) {
  if (files) {
    const imagePath = await getBytesArray(files[0]);
    if (imagePath) {
      let base64 = btoa(String.fromCharCode(...imagePath));
      emits("save:base64", base64);
      selectedFile.value = base64;
    }
  }
}

const { isOverDropZone } = useDropZone(dropZone, onDrop);

const selectedFile = ref<string | null>();
const OpenDialog = async () => {
  try {
    let imagePath = (await open({
      multiple: false,
      filters: [{ name, extensions }],
      defaultPath: name == "Image" ? await pictureDir() : await downloadDir(),
    })) as string | null;

    if (imagePath) {
      if (name === "Image") {
        let base64 = await getFileBytes(imagePath);
        if (base64) {
          emits("save:base64", base64);
          selectedFile.value = base64;
        }
      }
      return;
    }
  } catch (err: any) {
    error("ERROR PDF-LIB: " + err);
  }
};
</script>

<template>
  <div
    class="w-full relative h-36 flex-col rounded-md flex text-black justify-center items-center"
  >
    <span
      @click="selectedFile = null"
      v-if="selectedFile"
      class="absolute w-8 h-8 bg-white rounded-bl-md rounded-tr-md hover:bg-gray-100 cursor-pointer transition-all duration-150 -top-0 flex items-center justify-center -right-0 z-[90]"
    >
      <Trash2 :size="20" />
    </span>
    <img
      v-if="name == 'Image' && selectedFile"
      class="absolute top-0 border border-gray-300 rounded-md object-cover w-full h-full"
      :src="`data:image/png;base64,${selectedFile}`"
    />
    <div
      v-else
      ref="dropZone"
      :class="[
        'w-full relative h-full rounded-md transition-all duration-200 transform z-50 border-2 border-dashed border-spacing-4 flex items-center justify-center',

        isOverDropZone
          ? 'fill-sky-500 border-sky-500 bg-sky-200'
          : 'fill-gray-400 border-gray-300 bg-white',
      ]"
    >
      <button
        type="button"
        @mouseenter="isOverDropZone = true"
        @mouseleave="isOverDropZone = false"
        @click="OpenDialog"
        :class="[
          'w-full h-full flex flex-col gap-2 justify-center items-center',
          isOverDropZone ? 'text-sky-500' : 'text-gray-400',
        ]"
      >
        <span> {{ t("g.dropZone") }} </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 256 256"
        >
          <path
            fill="currentColor"
            d="m213.7 82.3l-56-56A8.1 8.1 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8.1 8.1 0 0 0-2.3-5.7Zm-53.7-31L188.7 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48v120Zm-40-64a8 8 0 0 1-8 8h-16v16a8 8 0 0 1-16 0v-16h-16a8 8 0 0 1 0-16h16v-16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 8 8Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
