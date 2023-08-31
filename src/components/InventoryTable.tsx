import { defineComponent, ref, type PropType } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiPagination } from "./ui/UiPagination";
import { formatDate } from "@/utils/formatDate";
import type { inventoryMvmT } from "@/types";
import { RouterLink } from "vue-router";
import UiIconVue from "./ui/UiIcon.vue";

export const InventoryTable = defineComponent({
  name: "InventoryTable",
  props: {
    Inventory: {
      type: Array as PropType<inventoryMvmT[]>,
      required: true,
    },
    FilterParam: {
      type: String,
      required: true,
      default: "",
    },
  },
  components: { UiPagination },
  setup(props) {
    const pagination = ref<number>(0);
    return () => (
      <div class="flex flex-col w-full h-fit">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9 font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                <th class="p-2 first:rounded-l-md last:rounded-r-md">
                  <div class="font-semibold text-left ">
                    {globalTranslate(`Inventory.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Inventory.filter((c) =>
              // @ts-ignore
              JSON.stringify(Object.values(c))
                .toLocaleLowerCase()
                .includes(props.FilterParam)
            )
              .slice(pagination.value * 17, pagination.value * 17 + 17)
              .map((mvm, index) => (
                <tr v-fade={index} key={mvm.id}>
                  <td class="p-2">
                    <div class="text-left font-medium">{mvm.product?.name}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">
                      {mvm.product?.price?.toFixed(2)} DH
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">
                      {mvm.orderItem?.price && mvm.orderItem?.price > 0
                        ? mvm.orderItem?.price?.toFixed(2)
                        : mvm.product?.price?.toFixed(2)}{" "}
                      DH
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{Math.abs(mvm.quantity)}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left font-medium">
                      {mvm.orderItem?.order_id ? (
                        <RouterLink
                          to={{
                            name: "OrdersDetails",
                            params: { id: mvm.orderItem?.order_id },
                          }}
                        >
                          <span
                            class={`px-2 py-[1px] h-full flex w-fit items-center gap-2 rounded-full bg-sky-300/60 text-sky-800 `}
                          >
                            # {mvm.orderItem?.order_id} <span>order</span>
                          </span>
                        </RouterLink>
                      ) : mvm.invoiceItem?.invoice_id ? (
                        <RouterLink
                          class="w-full"
                          to={{
                            name: "InvoiceDetails",
                            params: { id: mvm.invoiceItem?.invoice_id },
                          }}
                        >
                          <span
                            class={`px-2 py-[1px] h-full flex w-fit items-center gap-2 rounded-full bg-sky-300/60 text-sky-800 `}
                          >
                            # {mvm.invoiceItem?.invoice_id} <span>invoice</span>
                          </span>
                        </RouterLink>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{formatDate(mvm.date)}</div>
                  </td>
                  <td class="p-2">
                    <div class="flex  justify-start gap-3 font-bold text-xl h-8 p-1">
                      {mvm.model == "IN" ? (
                        <UiIconVue name="chartUp" />
                      ) : (
                        <UiIconVue name="chartDown" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div>
          <UiPagination
            goBack={() => pagination.value--}
            goForward={() => pagination.value++}
            itemsNumber={props.Inventory.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
