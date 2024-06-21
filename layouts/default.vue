<script setup lang="ts">
const { isShowModal, modalName } = useStore();
const isCollapse = ref<boolean>(true);
</script>

<template>
  <main class="w-screen h-screen fixed top-0 left-0 bg-[#FFFAFA] flex">
    <div
      :class="
        cn(
          'transition-all print:hidden sticky h-screen top-0 border-x border-slate-100 z-50 flex justify-center duration-200',
          isCollapse ? 'w-12 min-w-[48px]' : 'w-52 min-w-[12rem]'
        )
      "
    >
      <SideBar v-model:collapse="isCollapse" />
    </div>
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
