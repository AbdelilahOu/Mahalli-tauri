import { defineComponent, ref, type PropType } from "vue";
import type { stockMvmT } from "@/types";
import { UiPagination } from "./ui/UiPagination";
import { RouterLink } from "vue-router";
import { formatDate } from "@/utils/formatDate";
import { globalTranslate } from "@/utils/globalTranslate";
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
    console.log(props.Stock);
    const pagination = ref<number>(0);
    return () => (
      <div class="flex flex-col w-full h-fit">
        <table class="table-auto rounded-sm overflow-hidden w-full">
          <thead class="text-xs h-9 rounded-sm font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <th class="p-2">
                  <div class="font-semibold text-left">
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
              .map((mvm) => (
                <tr>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{mvm.id}</div>
                  </td>

                  <td class="p-2">
                    <div class="text-left font-medium">{mvm.product?.name}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{mvm.product?.price.toFixed(2)}</div>
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
                          {mvm.commandItem?.command_id}
                        </RouterLink>
                      ) : (
                        "-------"
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left font-medium">
                      {mvm.invoiceItem?.invoice_id ? (
                        <RouterLink
                          to={{
                            name: "InvoiceDetails",
                            params: { id: mvm.invoiceItem?.invoice_id },
                          }}
                        >
                          {mvm.invoiceItem?.invoice_id}
                        </RouterLink>
                      ) : (
                        "-------"
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left">{formatDate(mvm.date)}</div>
                  </td>
                  <td class="p-2">
                    <div class="flex  justify-start gap-3 font-bold text-xl h-8 p-1">
                      {mvm.model == "IN" ? "📈" : "📉"}
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
