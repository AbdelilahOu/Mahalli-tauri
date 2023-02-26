<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { onBeforeMount, Transition } from "vue";
import { useClientStore } from "./stores/clientStore";
import { useSellerStore } from "./stores/sellerStore";
import { useProductStore } from "./stores/productStore";
import database from "@/database/db";
const router = useRouter();

onBeforeMount(async () => {
  const { main, drop } = await database();
  useClientStore().getAllClients();
  useSellerStore().getAllSellers();
  useProductStore().getAllProducts();
  await main();
  // await drop();
  router.push("/Home");
});
</script>

<template>
  <div class="w-screen overflow-x-hidden h-screen bg-white">
    <RouterView v-slot="{ Component }">
      <Transition name="router" :appear="true">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
