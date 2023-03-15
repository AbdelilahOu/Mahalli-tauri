import { useModalStore } from "@/stores/modalStore";
import type { invoiceT } from "@/types";
import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, ref, type PropType } from "vue";
import { RouterLink } from "vue-router";
import { UiCheckBox } from "./ui/UiCheckBox";
import UiIcon from "./ui/UiIcon.vue";
import { UiPagination } from "./ui/UiPagination";

export const InvoiceTable = defineComponent({
  props: {
    Invoices: {
      type: Array as PropType<invoiceT[]>,
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
  components: { UiIcon, UiCheckBox, UiPagination },
  setup(props) {
    const modalStore = useModalStore();

    const checkedInvoices = ref<number[]>([]);

    const checkThisInvoice = (IsIncluded: boolean, id: number) => {
      IsIncluded
        ? checkedInvoices.value.push(id)
        : checkedInvoices.value.splice(checkedInvoices.value.indexOf(id), 1);
    };
    const pagination = ref(0);

    const toggleThisInvoice = (Invoice: invoiceT, name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
      modalStore.updateInvoiceRow(Invoice);
    };
    return () => (
      <div class="flex flex-col w-full h-full">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9  font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th class="rounded-l-md"></th>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <th class="p-2 w-fit ">
                  <div class="font-semibold last:rounded-r-md text-left">
                    {globalTranslate(`Invoices.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Invoices.filter((c) =>
              JSON.stringify(c).toLocaleLowerCase().includes(props.FilterParam)
            )
              .slice(pagination.value * 15, pagination.value * 15 + 15)
              .map((Invoice, index) => (
                <tr v-slide={index}>
                  <td class="p-2">
                    <span class="h-full w-full grid">
                      <UiCheckBox
                        onCheck={(check) => checkThisInvoice(check, Invoice.id)}
                      />
                    </span>
                  </td>
                  <td class="p-2">
                    <div class="font-medium text-gray-800">{Invoice.id}</div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      <RouterLink
                        to={{
                          name: "ClientDetails",
                          params: {
                            id: Invoice.client_id,
                          },
                        }}
                      >
                        {Invoice.client_id}
                      </RouterLink>
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Invoice.invoiceItems?.length ? (
                        <span>
                          {Invoice.invoiceItems?.length}{" "}
                          {Invoice.invoiceItems?.length == 1
                            ? " Product"
                            : " Products"}
                        </span>
                      ) : (
                        <span class="text-red-400">No products</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left font-medium flex justify-between uppercase whitespace-nowrap overflow-ellipsis">
                      {Invoice.total.toFixed(2) ?? 0}{" "}
                      <span class="w-full text-center">DH</span>
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="text-left whitespace-nowrap overflow-ellipsis">
                      {Invoice.created_at ?? (
                        <span class="text-red-400">No date</span>
                      )}
                    </div>
                  </td>
                  <td class="p-2">
                    <div class="flex  justify-start gap-3">
                      <UiIcon
                        onClick={() =>
                          toggleThisInvoice(Invoice, "InvoiceDelete")
                        }
                        name={"delete"}
                      />
                      <UiIcon
                        onClick={() =>
                          toggleThisInvoice(Invoice, "InvoiceUpdate")
                        }
                        name={"edit"}
                      />
                      <RouterLink
                        to={{
                          name: "InvoiceDetails",
                          params: { id: Invoice.id },
                        }}
                      >
                        <UiIcon name={"print"} />
                      </RouterLink>
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
            itemsNumber={props.Invoices.length}
            page={pagination.value}
          />
        </div>
      </div>
    );
  },
});
