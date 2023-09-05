import {
  defineComponent,
  reactive,
  onBeforeUnmount,
  ref,
  onBeforeMount,
} from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiUpdateSelect } from "./ui/UiUpdateSelect";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { updateInvoiceT } from "@/types";
import { UiCheckBox } from "./ui/UiCheckBox";
import { UiButton } from "./ui/UiButton";
import { storeToRefs } from "pinia";
import UiIcon from "./ui/UiIcon.vue";
import { invoke } from "@tauri-apps/api";

export const InvoiceUpdate = defineComponent({
  name: "InvoiceUpdate",
  components: { UiButton, UiUpdateInput, UiIcon, UiUpdateSelect, UiCheckBox },
  setup() {
    const modalStore = useModalStore();
    const clients = ref<{ name: string; id: number }[]>([]);
    const products = ref<{ name: string; id: number }[]>([]);
    const { invoice: invoiceRow } = storeToRefs(modalStore);

    const invoice: updateInvoiceT = {
      id: undefined,
      total: undefined,
      client_id: undefined,
      invoiceItems: [],
    };

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

    //
    const updateInvoice = reactive<updateInvoiceT>(
      invoiceRow.value ? invoiceRow.value : invoice
    );
    //
    const updateTheInvoice = async () => {
      if (updateInvoice.id) {
        try {
          await invoke("update_invoice", {
            invoice: updateInvoice,
            id: updateInvoice.id,
          });
        } catch (error) {
          console.log(error);
        } finally {
          modalStore.updateModal({ key: "show", value: false });
        }
      }
    };

    async function deleteOneinvoiceItem(id: number) {
      try {
        await invoke("delete_invoice_items", { id });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeUnmount(() => modalStore.updateInvoiceRow(null));

    return () => (
      <div class="w-5/6 lg:w-1/2 rounded-md relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold  text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Invoices.update.title")}
          N° {updateInvoice.id}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Invoices.update.details.client.title")}
            </h1>
            <UiUpdateSelect
              Value={updateInvoice.client?.fullname ?? "select a client"}
              items={clients.value.map((client: any) => ({
                name: client.name,
                id: client.id,
              }))}
              onSelect={(id: number) => (updateInvoice.client_id = id)}
            >
              {globalTranslate("Invoices.update.details.client.select")}
            </UiUpdateSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">invoice details</h1>
            <div class="w-full  h-full flex flex-col gap-1">
              <UiButton
                Click={() =>
                  updateInvoice.invoiceItems?.push({
                    product_id: 0,
                    quantity: 0,
                  })
                }
              >
                {globalTranslate("Invoices.update.details.invoice.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {updateInvoice.invoiceItems?.map((item, index) => (
                    <UiUpdateSelect
                      Value={item.product?.name ?? "select a product"}
                      items={products.value.map((product: any) => ({
                        name: product.name,
                        id: product.id,
                      }))}
                      onSelect={(id: number) => (item.product_id = id)}
                    >
                      {globalTranslate(
                        "Invoices.create.details.invoice.select"
                      )}
                    </UiUpdateSelect>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateInvoice.invoiceItems?.map((item, index) => (
                    <div class="h-full w-full items-center relative">
                      <UiUpdateInput
                        Value={item.quantity}
                        PlaceHolder="Product quantity"
                        Type="number"
                        OnInputChange={(value) =>
                          (item.quantity = Number(value))
                        }
                      >
                        {{
                          unite: () => (
                            <span class="h-full text-gray-400 rounded-md px-2  flex items-center justify-center">
                              Item
                            </span>
                          ),
                        }}
                      </UiUpdateInput>
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateInvoice.invoiceItems?.map((item, index) => (
                    <div
                      onClick={() => {
                        updateInvoice.invoiceItems?.splice(index, 1);
                        if (item.id) deleteOneinvoiceItem(item.id);
                      }}
                      class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-md items-center w-full h-full"
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
          <UiButton colorTheme="a" Click={() => updateTheInvoice()}>
            {globalTranslate("Invoices.update.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
