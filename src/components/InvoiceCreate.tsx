import { defineComponent, reactive, ref, withModifiers } from "vue";
import type { newInvoiceT, newInvoiceItemT } from "@/types";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useProductStore } from "@/stores/productStore";
import { useClientStore } from "@/stores/clientStore";
import { useModalStore } from "@/stores/modalStore";
import { UiCheckBox } from "./ui/UiCheckBox";
import { UiButton } from "./ui/UiButton";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import { storeToRefs } from "pinia";
import UiIcon from "./ui/UiIcon.vue";
import { globalTranslate } from "@/utils/globalTranslate";

export const InvoiceCreate = defineComponent({
  name: "InvoiceCreate",
  components: { UiButton, UiCheckBox, UiIcon, UiInput, UiSelect },
  setup() {
    const isFlash = ref<boolean>(false);
    const IsClicked = ref<boolean>(false);
    const { products } = storeToRefs(useProductStore());
    const { clients } = storeToRefs(useClientStore());
    const newInvoice = reactive<newInvoiceT>({
      client_id: 0,
      invoiceItems: [],
    });
    const InvoiceItems = ref<newInvoiceItemT[]>([
      {
        product_id: 0,
        quantity: 0,
      },
    ]);
    const createNewInvoice = () => {
      isFlash.value = true;
      newInvoice.invoiceItems = InvoiceItems.value.filter(
        (item) => item.product_id !== 0 && item.quantity !== 0
      );
      if (newInvoice.client_id && newInvoice.invoiceItems.length !== 0) {
        useInvoiceStore().createOneInvoice(newInvoice);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
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
          class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
        >
          {globalTranslate("Invoices.create.title")}
        </h1>
        <div class="h-full  w-full grid grid-cols-1 gap-2">
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Invoices.create.details.client.title")}
            </h1>
            <UiSelect
              items={clients.value.map((client) => ({
                name: client.name,
                id: client.id,
              }))}
              onSelect={(id: number) => (newInvoice.client_id = id)}
              IsClickedOuside={IsClicked.value}
            >
              {globalTranslate("Invoices.create.details.client.select")}
            </UiSelect>
          </div>
          <div class="w-full  h-full flex flex-col gap-1">
            <h1 class="font-medium">
              {globalTranslate("Invoices.create.details.invoice.title")}
            </h1>
            <div
              onClick={withModifiers(
                () => (IsClicked.value = !IsClicked.value),
                ["self"]
              )}
              class="w-full  h-full flex flex-col gap-1"
            >
              <UiButton
                onClick={() =>
                  InvoiceItems.value.push({ product_id: 0, quantity: 0 })
                }
              >
                {globalTranslate("Invoices.create.details.invoice.add")}
              </UiButton>
              <div class="w-full grid grid-cols-[1fr_1fr_36px] pb-10 overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1">
                <div class="flex flex-col gap-2">
                  {InvoiceItems.value.map((item, _index) => (
                    <UiSelect
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
                      />
                    </div>
                  ))}
                </div>
                <div class="flex flex-col gap-2">
                  {InvoiceItems.value.map((_item, index) => (
                    <div class="flex justify-center bg-gray-100 hover:bg-gray-300 transition-all duration-200  rounded-md items-center w-full h-full">
                      <UiIcon
                        onClick={() => InvoiceItems.value.splice(index, 1)}
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
          <UiButton colorTheme="a" onClick={() => createNewInvoice()}>
            {globalTranslate("Invoices.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
