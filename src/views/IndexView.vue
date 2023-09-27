<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, onBeforeRouteUpdate } from "vue-router";
import Xcomponent from "@/components/Xcomponent.vue";
import Navigation from "@/components/Navigation.vue";
import SideBar from "@/components/SideBar.vue";
import { store } from "@/store";

const show = computed(() => store.getters.getModalVisibility());
const name = computed(() => store.getters.getModalName());
const isCollapse = ref<boolean>(true);

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

onBeforeRouteUpdate((to: any, from: any) => {
  if (to.path !== from.path) hideModal();
});
</script>

<template>
  <main
    class="w-screen h-screen relative overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-transparent flex"
  >
    <div
      class="transition-all print:hidden sticky top-0 border-r-2 border-slate-100 z-50 flex justify-center duration-200"
      :class="{
        'w-12 min-w-[48px]': isCollapse,
        'w-52 min-w-[12rem]': !isCollapse,
      }"
    >
      <SideBar
        :isCollapse="isCollapse"
        @toggle:collapse="isCollapse = !isCollapse"
      />
    </div>
    <div class="grid grid-rows-[50px_1fr] w-full">
      <Navigation />
      <div
        class="w-full h-full flex flex-col border-t-2 border-slate-100 items-center justify-center"
      >
        <div
          v-if="show"
          @click.self="hideModal"
          class="w-full h-full flex items-center justify-center absolute bg-gray-400 z-50 top-0 left-0 bg-opacity-10"
        >
          <Xcomponent :name="name" />
        </div>
        <div class="w-full bg-white p-2 rounded-[4px] h-full">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </main>
</template>
