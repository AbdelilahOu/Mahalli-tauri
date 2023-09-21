import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, ref, type PropType } from "vue";
import { store } from "@/store";
import { UiPagination } from "./ui/UiPagination";
import { Checkbox } from "./ui/checkbox";
import { RouterLink } from "vue-router";
import type { invoiceT } from "@/types";
import UiIcon from "./ui/UiIcon.vue";

export const InvoicesTable = defineComponent({
  name: "InvoicesTable",
  props: {
    Invoices: {
      type: Array as PropType<invoiceT[]>,
      required: true,
    },
  },
  components: { UiIcon, Checkbox, UiPagination },
  setup(props) {
    const checkedInvoices = ref<number[]>([]);

    const checkThisInvoice = (IsIncluded: boolean, id: number) => {
      IsIncluded
        ? checkedInvoices.value.push(id)
        : checkedInvoices.value.splice(checkedInvoices.value.indexOf(id), 1);
    };
    const pagination = ref(0);

    const toggleThisInvoice = (Invoice: invoiceT, name: string) => {
      store.setters.updateStore({ key: "row", value: Invoice });
      store.setters.updateStore({ key: "name", value: name });
      store.setters.updateStore({ key: "show", value: true });
    };
    return () => (
      <div class="flex flex-col w-full h-full">
        <table class="table-auto  w-full">
          <thead class="text-xs h-9  font-semibold uppercase text-[rgba(25,23,17,0.6)] bg-gray-300">
            <tr>
              <th class="rounded-l-[4px]"></th>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <th class="p-2 w-fit last:rounded-r-[4px]">
                  <div class="font-semibold text-left">
                    {globalTranslate(`Invoices.index.feilds[${index}]`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            {props.Invoices.map((Invoice, index) => (
              <tr v-fade={index} key={Invoice.id}>
                <td class="p-2">
                  <span class="h-full w-full grid">
                    <Checkbox
                    // onCheck={(check) => checkThisInvoice(check, Invoice.id)}
                    />
                  </span>
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
                      {Invoice.client.fullname}
                    </RouterLink>
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left whitespace-nowrap overflow-ellipsis">
                    {Invoice.invoice_items?.length ? (
                      <span>
                        {Invoice.invoice_items?.length}{" "}
                        {Invoice.invoice_items?.length == 1
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
                    <div class="grid grid-cols-2 grid-rows 1 gap-2 w-full">
                      <span>{Invoice.total?.toFixed(2) ?? 0}</span>
                      <span class="w-full text-start">DH</span>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left font-medium uppercase whitespace-nowrap overflow-ellipsis">
                    {Invoice.status ? (
                      <span
                        class={`px-2 py-[1px] rounded-full ${
                          Invoice.status == "pending"
                            ? "bg-yellow-300/60 text-yellow-800"
                            : Invoice.status == "delivered"
                            ? "bg-green-300/60 text-green-800"
                            : "bg-red-300/60 text-red-800"
                        }`}
                      >
                        {globalTranslate(
                          `Orders.status.${Invoice.status.toLowerCase()}`
                        )}
                      </span>
                    ) : (
                      <span class="text-red-400">No status</span>
                    )}
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
                    <span
                      onClick={() =>
                        toggleThisInvoice(Invoice, "InvoiceDelete")
                      }
                    >
                      <UiIcon name={"delete"} />
                    </span>
                    <span
                      onClick={() =>
                        toggleThisInvoice(Invoice, "InvoiceUpdate")
                      }
                    >
                      <UiIcon name={"edit"} />
                    </span>
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
          <UiPagination />
        </div>
      </div>
    );
  },
});
