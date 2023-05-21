import { defineComponent, ref, type PropType } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiPagination } from "./ui/UiPagination";
import { formatDate } from "@/utils/formatDate";
import type { stockMvmT } from "@/types";
import { RouterLink } from "vue-router";
import UiIconVue from "./ui/UiIcon.vue";

export const StockTable = defineComponent({
  name: "StockTable",
  props: {
    Stock: {
      type: Array as PropType<stockMvmT[]>,
      required: true,
    },
    sortBy: {
      type: Function as PropType<(by: string) => void>,
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
              <th class="p-2 rounded-l-md"></th>
              {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                <th class="p-2 last:rounded-r-md">
                  <div class="font-semibold text-left ">
                    {globalTranslate(`Stocks.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Stock.filter((c) =>
              JSON.stringify(c).toLocaleLowerCase().includes(props.FilterParam)
            )
              .slice(pagination.value * 15, pagination.value * 15 + 15)
              .map((mvm, index) => (
                <tr v-fade={index} key={mvm.id}>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{mvm.id}</div>
                  </td>

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
                      {mvm.commandItem?.price?.toFixed(2) ??
                        mvm.product?.price?.toFixed(2)}{" "}
                      DH
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{Math.abs(mvm.quantity)}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left font-medium">
                      {mvm.commandItem?.command_id ? (
                        <RouterLink
                          to={{
                            name: "CommandDetails",
                            params: { id: mvm.commandItem?.command_id },
                          }}
                        >
                          <span
                            class={`px-2 py-[1px] h-full flex w-fit items-center gap-2 rounded-full bg-green-300/60 text-green-800 `}
                          >
                            # {mvm.commandItem?.command_id} <span>command</span>
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
                            class={`px-2 py-[1px] h-full flex w-fit items-center gap-2 rounded-full bg-green-300/60 text-green-800 `}
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
            itemsNumber={props.Stock.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
