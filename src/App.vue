<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { onBeforeMount, Transition } from "vue";
// import { invoke } from "@tauri-apps/api";
onBeforeMount(() => useRouter().push("/Home"));

// (async () => {
//   await invoke("seed_db");
// })();
//
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
