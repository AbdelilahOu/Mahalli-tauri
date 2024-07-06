<script setup lang="ts">
const { isShowModal, modalName } = useStore();
const isCollapse = ref<boolean>(true);
</script>

<template>
  <main class="w-screen h-screen fixed top-0 left-0 bg-[#FFFAFA] flex">
    <SideBar v-model:collapse="isCollapse" />
    <div class="grid grid-rows-[50px_1fr] w-full">
      <Navigation />
      <ScrollArea
        class="w-full scroll-smooth flex flex-col border-t border-slate-100"
      >
        <div class="w-full bg-[#FFFAFA] p-2 rounded-md h-full">
          <slot />
        </div>
      </ScrollArea>
    </div>
    <div
      v-if="isShowModal"
      class="w-full h-full flex items-center justify-center fixed bg-black z-50 top-0 left-0 bg-opacity-30"
    >
      <ModalComponentsRenderer :name="modalName" />
    </div>
    <Toaster position="top-center" />
  </main>
</template>
