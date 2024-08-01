<script setup lang="ts">
const { isOpen } = useModal();
const isCollapse = ref<boolean>(true);
</script>

<template>
  <main class="w-screen h-screen fixed top-0 left-0 grainy-light flex">
    <SideBar v-model:collapse="isCollapse" />
    <div class="grid grid-rows-[50px_1fr] w-full">
      <Navigation />
      <ScrollArea
        class="w-full scroll-smooth flex flex-col border-t border-slate-100"
      >
        <div class="w-full grainy-light p-2 rounded-md h-full">
          <slot />
        </div>
      </ScrollArea>
    </div>
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="w-full h-full flex items-center justify-center fixed inset-0 transition-opacity bg-gray-200/75 z-50"
      >
        <Transition
          :appear="true"
          enter-active-class="delay-100 ease-out duration-300"
          enter-from-class="delay-100 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="delay-100 opacity-100 translate-y-0 sm:scale-100"
          leave-class="delay-100 ease-in duration-200"
          leave-from-class="delay-100 opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="delay-100 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Modals />
        </Transition>
      </div>
    </Transition>
    <Toaster position="top-center" />
  </main>
</template>
