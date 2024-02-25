<script setup lang="ts">
import { RouterView } from "vue-router";
import { Transition } from "vue";
// import "vue3-lottie/dist/style.css";
</script>

<template>
  <div class="w-screen overflow-x-hidden h-screen bg-slate-50">
    <RouterView v-slot="{ Component }">
      <Transition name="router" :appear="true">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
