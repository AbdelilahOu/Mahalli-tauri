import {
  defineComponent,
  reactive,
  onBeforeUnmount,
  ref,
  withModifiers,
} from "vue";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import { UiButton } from "./ui/UiButton";
import type { updateInvoiceT } from "@/types";
import { storeToRefs } from "pinia";
import { UiUpdateSelect } from "./ui/UiUpdateSelect";
import { useClientStore } from "@/stores/clientStore";
import { UiCheckBox } from "./ui/UiCheckBox";
import { useProductStore } from "@/stores/productStore";
import UiIcon from "./ui/UiIcon.vue";
import { globalTranslate } from "@/utils/globalTranslate";

export const InvoiceUpdate = defineComponent({
  name: "InvoiceUpdate",
  components: { UiButton, UiUpdateInput, UiIcon, UiUpdateSelect, UiCheckBox },
  setup() {
    //
    const productStore = useProductStore();
    const clientStore = useClientStore();
    const modalStore = useModalStore();
    //
    const { invoice: invoiceRow } = storeToRefs(modalStore);

    const { products } = storeToRefs(productStore);
    const { clients } = storeToRefs(clientStore);
    const IsClicked = ref<boolean>(false);
    //
    const invoice: updateInvoiceT = {
      id: undefined,
      total: undefined,
      client_id: undefined,
      invoiceItems: [],
    };
    //
    const updateInvoice = reactive<updateInvoiceT>(
      invoiceRow.value ? invoiceRow.value : invoice
    );
    //
    const updateTheInvoice = () => {
      if (updateInvoice.id) {
        useInvoiceStore().updateOneInvoice(updateInvoice.id, updateInvoice);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateInvoiceRow(null));

    return () => (
      <div
        onClick={withModifiers(
          () => (IsClicked.value = !IsClicked.value),
          ["self"]
        )}
        class="w-5/6 lg:w-1/2 relative h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
      >
        <h1
          onClick={withModifiers(
            () => (IsClicked.value = !IsClicked.value),
            ["self"]
          )}
          class="font-semibold  text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
        >
          {globalTranslate("Invoices.update.title")}
          N° {updateInvoice.id}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Invoices.update.details.client.title")}
            </h1>
            <UiUpdateSelect
              Value={
                clients.value.find((cli) => updateInvoice.client_id === cli.id)
                  ?.name ?? ""
              }
              items={clients.value.map((client) => ({
                name: client.name,
                id: client.id,
              }))}
              onSelect={(id: number) => (updateInvoice.client_id = id)}
              IsClickedOuside={IsClicked.value}
            >
              {globalTranslate("Invoices.update.details.client.select")}
            </UiUpdateSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">invoice details</h1>
            <div
              onClick={withModifiers(
                () => (IsClicked.value = !IsClicked.value),
                ["self"]
              )}
              class="w-full  h-full flex flex-col gap-1"
            >
              <UiButton
                onClick={() =>
                  updateInvoice.invoiceItems?.push({
                    product_id: 0,
                    quantity: 0,
                  })
                }
              >
                {globalTranslate("Invoices.update.details.invoice.title")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {updateInvoice.invoiceItems?.map((item, index) => (
                    <UiUpdateSelect
                      Value={
                        products.value.find((pro) => pro.id == item.product_id)
                          ?.name ?? ""
                      }
                      items={products.value.map((product) => ({
                        name: product.name,
                        id: product.id,
                      }))}
                      onSelect={(id: number) => (item.product_id = id)}
                      IsClickedOuside={IsClicked.value}
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
                      />
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {updateInvoice.invoiceItems?.map((item, index) => (
                    <div class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-md items-center w-full h-full">
                      <UiIcon
                        onClick={() => {
                          updateInvoice.invoiceItems?.splice(index, 1);
                          if (item.id)
                            useInvoiceStore().deleteOneInvoiceItem(item.id);
                        }}
                        name="delete"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <UiButton colorTheme="a" onClick={() => updateTheInvoice()}>
            {globalTranslate("Invoices.update.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
