<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { invoke } from "@tauri-apps/api";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button";

const { t, d } = useI18n();

const id = useRoute().params.id;
const order = ref<any | null>(null);

onBeforeMount(async () => {
  try {
    const res = await invoke<any>("get_order", {
      id,
    });
    if (res?.id) {
      order.value = res;
    }
  } catch (error) {
    console.log(error);
  }
});

const print = () => window.print();
</script>

<template>
  <main class="w-full h-full">
    <!-- <div class="w-full h-full text-black flex justify-center print:pr-12">
      <div
        class="w-full h-full max-w-4xl grid-rows-[230px_1fr] grid grid-cols-2"
      >
        <div class="w-full h-full flex-col flex">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("od.d.o.title") }}
          </h1>
          <table class="table-auto rounded-[4px] overflow-hidden w-full">
            <tbody class="text-sm divide-y divide-gray-100">
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.o.date") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ d(new Date(order?.created_at ?? new Date()), "long") }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.o.status") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ order?.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="w-full h-full flex flex-col">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("od.d.s.title") }}
          </h1>
          <table class="table-auto rounded-[4px] overflow-hidden w-full">
            <tbody class="text-sm divide-y divide-gray-100">
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.s.name") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ order?.seller.name }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.s.phone") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ order?.seller.phone }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.s.email") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ order?.seller.email }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("od.d.s.address") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ order?.seller.address }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="w-full h-full col-span-2 row-span-2 text-black">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("od.d.i.title") }}
          </h1>
          <table class="table-auto rounded-[4px] overflow-hidden w-full">
            <thead
              class="text-xs h-9 rounded-[4px] font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
            >
              <tr>
                <th></th>
                <th v-for="index in 5" :key="index" class="p-2">
                  <div class="font-semibold text-left">
                    {{ t(`od.d.i.fields[${index - 1}]`) }}
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100">
              <tr v-for="item in order?.order_items" :key="item.id">
                <td class="p-2">
                  <span class="h-full w-full grid"></span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ item.product.name }}
                  </span>
                </td>
                <td class="p-2">
                  <div
                    class="font-medium text-gray-800 max-w-[120px] overflow-hidden"
                  >
                    {{ item.product?.description }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left">{{ item.quantity }}</div>
                </td>
                <td class="p-2">
                  <div class="text-left">
                    {{
                      item.price
                        ? item.price?.toFixed(2)
                        : item.product.price?.toFixed(2)
                    }}
                    DH
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-start gap-3">
                    {{
                      (item.price
                        ? item.price * item.quantity
                        : item.product.price * item.quantity
                      ).toFixed(2)
                    }}
                    DH
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-start gap-3"></div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="p-2 font-semibold">
                  {{
                    order?.order_items
                      .reduce(
                        (acc, curr) =>
                          (acc +=
                            curr.price === 0
                              ? curr.quantity * curr.price
                              : curr.quantity * curr.product.price),
                        0,
                      )
                      .toFixed(2)
                  }}
                  DH
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center">
            <div class="w-1/3 flex items-center justify-center">
              <Button @click="print">
                {{ t("od.d.button") }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </main>
</template>
