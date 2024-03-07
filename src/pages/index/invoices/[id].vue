<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button";
import { error } from "tauri-plugin-log-api";

const { t, d } = useI18n();
const id = useRoute().params.id;
const invoice = ref<any | null>(null);

onBeforeMount(async () => {
  try {
    const res = await invoke<any>("get_invoice", {
      id,
    });
    if (res.id) {
      invoice.value = res;
    }
  } catch (err: any) {
    error("Error creating client : " + err.error);
  }
});

const print = () => window.print();
</script>

<template>
  <main class="w-full h-full">
    <!-- <div class="w-full h-full flex justify-center text-black print:pr-12">
      <div
        class="w-full h-full max-w-4xl grid-rows-[230px_1fr] grid grid-cols-2"
      >
        <div class="w-full h-full flex-col flex">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("id.d.i.title") }}
          </h1>
          <table class="table-auto rounded-md overflow-hidden w-full">
            <tbody class="text-sm divide-y divide-gray-100">
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("id.d.i.date") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ d(new Date(invoice?.created_at ?? new Date()), "long") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="w-full h-full flex flex-col">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("id.d.c.title") }}
          </h1>
          <table class="table-auto rounded-md overflow-hidden w-full">
            <tbody class="text-sm divide-y divide-gray-100">
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("id.d.c.name") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ invoice?.client.fullname }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("id.d.c.phone") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ invoice?.client.phone }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("id.d.c.email") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ invoice?.client.email }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]"
                >
                  <span class="h-full w-full grid">
                    {{ t("id.d.c.address") }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    {{ invoice?.client.address }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="w-full h-full col-span-2 row-span-2 text-black">
          <h1 class="uppercase font-semibold mb-1">
            {{ t("id.d.i.title") }}
          </h1>
          <table class="table-auto rounded-md overflow-hidden w-full">
            <thead
              class="text-xs h-9 rounded-md font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300"
            >
              <tr>
                <th></th>
                <th v-for="index in 5" :key="index" class="p-2">
                  <div class="font-semibold text-left">
                    {{ t(`id.d.it.fields[${index - 1}]`) }}
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100">
              <tr v-for="item in invoice?.invoice_items" :key="item.id">
                <td class="p-2">
                  <span class="h-full w-full grid"></span>
                </td>
                <td class="p-2">
                  <span class="h-full w-full grid">{{
                    item.product.name
                  }}</span>
                </td>
                <td class="p-2">
                  <div
                    class="font-medium text-gray-800 max-w-[120px] overflow-hidden"
                  >
                    {{ item.product.description }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left">{{ item.quantity }}</div>
                </td>
                <td class="p-2">
                  <div class="text-left">
                    {{ item.product.price.toFixed(2) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-start gap-3">
                    {{ (item.product.price * item.quantity).toFixed(2) }} DH
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-start gap-3"></div>
                </td>
              </tr>
              <tr>
                <td v-for="index in 5" :key="index"></td>
                <td class="p-2 font-semibold">
                  {{
                    // (invoice?.invoice_items.reduce(
                    //   (acc, curr) =>
                    //     (acc +=
                    //       curr.quantity *
                    //       curr.product.price *
                    //       (curr.product.tva / 100)),
                    //   0
                    // ) ?? 0) +
                    (
                      invoice?.invoice_items.reduce(
                        (acc, curr) =>
                          (acc += curr.quantity * curr.product.price),
                        0,
                      ) ?? 0
                    ).toFixed(2)
                  }}
                  DH
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center">
            <div class="w-1/3 flex justify-center">
              <Button @click="print">
                {{ t("id.d.button") }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </main>
</template>
