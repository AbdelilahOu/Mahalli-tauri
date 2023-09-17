import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import type { newInvoiceT, newInvoiceItemT, invoiceT } from "@/types";
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiCheckBox } from "./ui/UiCheckBox";
import { invoke } from "@tauri-apps/api";
import { UiButton } from "./ui/UiButton";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import UiIcon from "./ui/UiIcon.vue";
import { store } from "@/store";
import { INVOICE_CREATE } from "@/constants/defaultValues";

export const InvoiceCreate = defineComponent({
  name: "InvoiceCreate",
  components: { UiButton, UiCheckBox, UiIcon, UiInput, UiSelect },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();

    const isFlash = ref<boolean>(false);

    const clients = ref<{ name: string; id: number }[]>([]);
    const products = ref<{ name: string; id: number }[]>([]);

    const newInvoice = reactive<newInvoiceT>(INVOICE_CREATE);

    const InvoiceItems = ref<newInvoiceItemT[]>([
      {
        product_id: 0,
        quantity: 0,
      },
    ]);

    onBeforeMount(async () => {
      const res = await Promise.allSettled([
        invoke<{ name: string; id: number }[]>("get_all_clients"),
        invoke<{ name: string; id: number }[]>("get_all_products"),
      ]);

      // @ts-ignore
      if ((res[0].status = "fulfilled")) clients.value = res[0].value;
      // @ts-ignore
      if ((res[1].status = "fulfilled")) products.value = res[1].value;
    });

    const createNewInvoice = async () => {
      isFlash.value = true;
      newInvoice.invoice_items = InvoiceItems.value.filter(
        (item) => item.product_id !== 0 && item.quantity !== 0
      );
      if (newInvoice.client_id && newInvoice.invoice_items.length !== 0) {
        try {
          await invoke<invoiceT>("insert_invoice", {
            invoice: newInvoice,
          });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-create-" + Math.random() * 9999,
          });
        } catch (error) {
          console.log(error);
        } finally {
          store.setters.updateStore({ key: "show", value: false });
        }
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-5/6 lg:w-1/2 relative rounded-[4px] h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Invoices.create.title")}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Invoices.create.details.client.title")}
            </h1>
            <UiSelect
              items={clients.value}
              onSelect={(id: number) => (newInvoice.client_id = id)}
            >
              {globalTranslate("Invoices.create.details.client.select")}
            </UiSelect>
          </div>
          <h1 class="font-medium">
            {globalTranslate("Invoices.create.details.invoice.title")}
          </h1>
          <div class="w-full  h-full flex flex-col mb-1 gap-1">
            <div class="flex justify-between w-full">
              <div class="h-full w-full flex flex-row flex-nowrap items-center gap-2">
                <UiCheckBox
                  onCheck={(check) =>
                    check
                      ? (newInvoice.status = "delivered")
                      : (newInvoice.status = "")
                  }
                />
                <span>{globalTranslate("Orders.status.delivered")}</span>
              </div>
              <div class="h-full w-full flex flex-row flex-nowrap items-center justify-center gap-2">
                <UiCheckBox
                  onCheck={(check) =>
                    check
                      ? (newInvoice.status = "pending")
                      : (newInvoice.status = "")
                  }
                />
                <span>{globalTranslate("Orders.status.pending")}</span>
              </div>
              <div class="h-full w-full flex flex-row justify-end flex-nowrap items-center gap-2">
                <UiCheckBox
                  onCheck={(check) =>
                    check
                      ? (newInvoice.status = "canceled")
                      : (newInvoice.status = "")
                  }
                />
                <span>{globalTranslate("Orders.status.canceled")}</span>
              </div>
            </div>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <div class="w-full  h-full flex flex-col gap-1">
              <UiButton
                Click={() =>
                  InvoiceItems.value.push({ product_id: 0, quantity: 0 })
                }
              >
                {globalTranslate("Invoices.create.details.invoice.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {InvoiceItems.value.map((item, _index) => (
                    <UiSelect
                      items={products.value}
                      onSelect={(id: number) => (item.product_id = id)}
                    >
                      {globalTranslate(
                        "Invoices.create.details.invoice.select"
                      )}
                    </UiSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {InvoiceItems.value.map((item, _index) => (
                    <div class="h-full w-full items-center relative">
                      <UiInput
                        IsEmpty={isFlash.value && item.quantity == 0}
                        PlaceHolder={globalTranslate(
                          "Invoices.create.details.invoice.placeholder[0]"
                        )}
                        Type="number"
                        OnInputChange={(value) =>
                          (item.quantity = Number(value))
                        }
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-[4px] px-2  flex items-center justify-center">
                              Item
                            </span>
                          ),
                        }}
                      </UiInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {InvoiceItems.value.map((_item, index) => (
                    <div
                      onClick={() => InvoiceItems.value.splice(index, 1)}
                      class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-[4px] items-center w-full h-full"
                    >
                      <UiIcon name="delete" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewInvoice()}>
            {globalTranslate("Invoices.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
