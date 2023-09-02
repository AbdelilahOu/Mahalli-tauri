import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, onBeforeMount, ref } from "vue";
import { UiButton } from "@/components/ui/UiButton";
import { useRoute } from "vue-router";
import type { invoiceDetailsT } from "@/types";
import { invoke } from "@tauri-apps/api";

export const InvoiceDetails = defineComponent({
  name: "InvoiceDetails",
  components: { UiButton },
  setup() {
    const id = useRoute().params.id;
    const invoice = ref<invoiceDetailsT>();

    onBeforeMount(async () => {
      try {
        const res = await invoke<invoiceDetailsT>("get_invoice", { id });
        if (res.id) {
          invoice.value = res;
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full flex justify-center text-black print:pr-12">
          <div class="w-full h-full max-w-4xl grid-rows-[230px_1fr] grid grid-cols-2">
            <div class="w-full h-full flex-col flex">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("InvoiceDetails.details.invoice.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <tbody class="text-sm divide-y divide-gray-100">
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid">
                        {globalTranslate("InvoiceDetails.details.invoice.id")}
                      </span>
                    </td>
                    <td class="p-2 ">
                      <span class="h-full w-full grid">
                        {invoice.value?.id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid">
                        {globalTranslate("InvoiceDetails.details.invoice.date")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {new Date(
                          invoice.value?.created_at ?? new Date()
                        ).toLocaleDateString("en-us", {
                          month: "2-digit",
                          year: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full h-full flex flex-col">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("InvoiceDetails.details.client.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <tbody class="text-sm divide-y divide-gray-100">
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("InvoiceDetails.details.client.id")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {invoice.value?.client.id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("InvoiceDetails.details.client.name")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {invoice.value?.client.fullname}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("InvoiceDetails.details.client.phone")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {invoice.value?.client.phone}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("InvoiceDetails.details.client.email")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {invoice.value?.client.email}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate(
                          "InvoiceDetails.details.client.address"
                        )}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {invoice.value?.client.address}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full h-full col-span-2 row-span-2 text-black">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("InvoiceDetails.details.items.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <thead class="text-xs h-9 rounded-md font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
                  <tr>
                    <th></th>
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                      <th class="p-2">
                        <div class="font-semibold text-left">
                          {globalTranslate(
                            `InvoiceDetails.details.items.fields[${index}]`
                          )}
                        </div>
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-100">
                  {invoice.value?.invoiceItems.map((item) => (
                    <tr>
                      <td class="p-2">
                        <span class="h-full w-full grid"></span>
                      </td>
                      <td class="p-2">
                        <span class="h-full w-full grid">
                          {item.product.name}
                        </span>
                      </td>
                      <td class="p-2">
                        <div class="font-medium text-gray-800 max-w-[120px] overflow-hidden">
                          {item.product.description}
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="text-left"> {item.quantity} </div>
                      </td>
                      <td class="p-2">
                        <div class="text-left">
                          {item.product.price.toFixed(2)}
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="text-left">
                          {item.product.tva.toFixed(2)} %
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex  justify-start gap-3">
                          {(
                            item.product.price *
                            (item.product.tva / 100) *
                            item.quantity
                          ).toFixed(2)}{" "}
                          DH
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex  justify-start gap-3">
                          {(item.product.price * item.quantity).toFixed(2)} DH
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex  justify-start gap-3"></div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    {Array(6)
                      .fill(0)
                      .map(() => (
                        <td></td>
                      ))}
                    <td class="p-2 font-semibold">
                      {invoice.value?.invoiceItems
                        .reduce(
                          (acc, curr) =>
                            (acc +=
                              curr.quantity *
                              curr.product.price *
                              (curr.product.tva / 100)),
                          0
                        )
                        .toFixed(2)}{" "}
                      DH
                    </td>
                    <td class="p-2 font-semibold">
                      {invoice.value?.invoiceItems
                        .reduce(
                          (acc, curr) =>
                            (acc += curr.quantity * curr.product.price),
                          0
                        )
                        .toFixed(2)}{" "}
                      DH
                    </td>
                  </tr>
                  <tr>
                    {Array(7)
                      .fill(0)
                      .map(() => (
                        <td></td>
                      ))}
                    <td class="p-2 font-semibold">
                      {(
                        (invoice.value?.invoiceItems.reduce(
                          (acc, curr) =>
                            (acc +=
                              curr.quantity *
                              curr.product.price *
                              (curr.product.tva / 100)),
                          0
                        ) ?? 0) +
                        (invoice.value?.invoiceItems.reduce(
                          (acc, curr) =>
                            (acc += curr.quantity * curr.product.price),
                          0
                        ) ?? 0)
                      ).toFixed(2)}{" "}
                      DH
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="w-full flex items-center justify-center">
                <div class="w-1/3">
                  <UiButton Click={() => window.print()} colorTheme="A">
                    {globalTranslate("InvoiceDetails.details.button")}
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  },
});
