<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView } from "vue-router";
import ModalComponentsRenderer from "@/components/ModalComponentsRenderer.vue";
import Navigation from "@/components/Navigation.vue";
import SideBar from "@/components/SideBar.vue";
import { store } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/shadcn";

const show = computed(() => store.getters.getModalVisibility());
const name = computed(() => store.getters.getModalName());
const isCollapse = ref<boolean>(true);

const hideModal = () =>
  store.setters.updateStore({ key: "show", value: false });

// onBeforeRouteUpdate((to: any, from: any) => {
//   if (to.path !== from.path) hideModal();
// });
</script>

<template>
  <main class="w-screen h-screen relative bg-white flex">
    <div
      :class="
        cn(
          'transition-all print:hidden sticky top-0 border-r-2 border-slate-100 z-50 flex justify-center duration-200',
          isCollapse ? 'w-12 min-w-[48px]' : 'w-52 min-w-[12rem]',
        )
      "
    >
      <SideBar v-model:collapse="isCollapse" />
    </div>
    <div class="grid grid-rows-[50px_1fr] w-full">
      <Navigation />
      <ScrollArea
        class="w-full h-[calc(100vh-50px)] flex flex-col border-t-2 border-slate-100 items-center justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-transparent"
      >
        <!-- @click.self="hideModal" -->
        <div
          v-if="show"
          class="w-full h-full flex items-center justify-center fixed bg-zinc-900 z-50 top-0 left-0 bg-opacity-20"
        >
          <ModalComponentsRenderer :name="name" />
        </div>
        <div class="w-full bg-white p-2 rounded-md h-full">
          <RouterView></RouterView>
        </div>
      </ScrollArea>
    </div>
  </main>
</template>
