<script setup lang="ts">
import { pictureDir, downloadDir } from "@tauri-apps/api/path";
import { defineComponent, ref, type PropType } from "vue";
import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import type { FileNames } from "@/types";
import UiIcon from "./UiIcon.vue";

const { name, extensions } = defineProps<{
  extensions: string[];
  name: string;
}>();

const emits = defineEmits<{
  (e: "on:save", image: string): void;
}>();

const selectedFile = ref<string | null>();
const OpenDialog = async () => {
  try {
    selectedFile.value = (await open({
      multiple: false,
      filters: [{ name, extensions }],
      defaultPath: name == "Image" ? await pictureDir() : await downloadDir(),
      // C:\Users\abdel\AppData\Roaming\tauriApp
    })) as string | null;

    if (selectedFile.value) {
      emits("on:save", selectedFile.value);
      if (name === "Image") {
        selectedFile.value = convertFileSrc(selectedFile.value);
      }
      return;
    }
  } catch (error) {
    console.log("sth went wrong reading the file");
  }
};

const getpath = (src: string) => new URL(src, import.meta.url).toString();
</script>

<template>
  <div
    class="w-36 relative h-36 bg-gray-300 rounded-[4px] overflow-hidden flex text-black justify-center items-center"
  >
    <img
      v-if="name == 'Image'"
      class="absolute top-0 rounded-[4px] object-cover w-full h-full"
      :src="selectedFile ?? '/clients.jpg'"
    />
    <div
      class="w-full bg-white/40 transition-all duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full"
    >
      <button
        @click="OpenDialog"
        class="w-full text-gray-500 transition-all duration-200 hover:scale-125 h-full grid hover:text-black justify-center items-center"
      >
        <UiIcon :name="name === 'Image' ? 'addDoc' : 'addDoc'" />
      </button>
    </div>
  </div>
</template>
