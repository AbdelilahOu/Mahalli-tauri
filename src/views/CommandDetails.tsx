import { globalTranslate } from "@/utils/globalTranslate";
import { useCommandStore } from "@/stores/commandStore";
import { defineComponent, onBeforeMount } from "vue";
import { UiButton } from "@/components/ui/UiButton";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

export const CommandDetails = defineComponent({
  name: "CommandDetails",
  setup() {
    const id = useRoute().params.id;

    const commandStore = useCommandStore();

    const { command } = storeToRefs(commandStore);

    onBeforeMount(() => commandStore.getOneCommand(Number(id)));

    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full text-black flex justify-center print:pr-12">
          <div class="w-full h-full max-w-4xl grid-rows-[230px_1fr] grid grid-cols-2">
            <div class="w-full h-full flex-col flex">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("CommandDetails.details.command.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <tbody class="text-sm divide-y divide-gray-100">
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.command.id")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.command.date")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {new Date(
                          command.value?.created_at ?? new Date()
                        ).toLocaleDateString("fr-fr", {
                          month: "2-digit",
                          year: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate(
                          "CommandDetails.details.command.status"
                        )}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full h-full flex flex-col">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("CommandDetails.details.seller.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <tbody class="text-sm divide-y divide-gray-100">
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.seller.id")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.seller.id}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.seller.name")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.seller.name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.seller.phone")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.seller.phone}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate("CommandDetails.details.seller.email")}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.seller.email}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-2 bg-gray-300 font-semibold uppercase text-[rgba(25,23,17,0.6)]">
                      <span class="h-full w-full grid ">
                        {globalTranslate(
                          "CommandDetails.details.seller.addresse"
                        )}
                      </span>
                    </td>
                    <td class="p-2">
                      <span class="h-full w-full grid">
                        {command.value?.seller.addresse}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full h-full col-span-2 row-span-2 text-black">
              <h1 class="uppercase font-semibold mb-1">
                {globalTranslate("CommandDetails.details.items.title")}
              </h1>
              <table class="table-auto rounded-md overflow-hidden w-full">
                <thead class="text-xs h-9 rounded-md font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
                  <tr>
                    <th></th>
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                      <th class="p-2">
                        <div class="font-semibold text-left">
                          {globalTranslate(
                            `CommandDetails.details.items.fields[${index}]`
                          )}
                        </div>
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-100">
                  {command.value?.commandItems.map((item) => (
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
                        <div class="font-medium text-gray-800">
                          {item.product_id}
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="font-medium text-gray-800 max-w-[120px] overflow-hidden">
                          {item.product?.description}
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="text-left"> {item.quantity} </div>
                      </td>
                      <td class="p-2">
                        <div class="text-left">
                          {item.price === 0
                            ? item.product.price.toFixed(2)
                            : item.price.toFixed(2)}{" "}
                          DH
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex  justify-start gap-3">
                          {(item.price === 0
                            ? item.product.price * item.quantity
                            : item.price * item.quantity
                          ).toFixed(2)}{" "}
                          DH
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex  justify-start gap-3"></div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="p-2 font-semibold">
                      {command.value?.commandItems
                        .reduce(
                          (acc, curr) =>
                            (acc +=
                              curr.price === 0
                                ? curr.quantity * curr.product.price
                                : curr.quantity * curr.price),
                          0
                        )
                        .toFixed(2)}{" "}
                      DH
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="w-full flex items-center justify-center">
                <div class="w-1/3">
                  <UiButton Click={() => window.print()} colorTheme="A">
                    {globalTranslate("CommandDetails.details.button")}
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
