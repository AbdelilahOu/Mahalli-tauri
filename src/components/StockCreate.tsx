import { globalTranslate } from "@/utils/globalTranslate";
import { useProductStore } from "@/stores/productStore";
import { useModalStore } from "@/stores/modalStore";
import { useStockStore } from "@/stores/InventoryStore";
import { defineComponent, reactive } from "vue";
import { UiButton } from "./ui/UiButton";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import { storeToRefs } from "pinia";

export const StockCreate = defineComponent({
  name: "StockCreate",
  components: { UiButton, UiInput, UiSelect },
  setup() {
    const { products } = storeToRefs(useProductStore());
    const inventoryMvm = reactive({
      productId: 0,
      quantity: 0,
      model: "IN",
    });
    const createNewStock = () => {
      if (inventoryMvm.productId !== 0 && inventoryMvm.quantity !== 0) {
        useStockStore().createStockMouvement(inventoryMvm);
        useModalStore().updateModal({ key: "show", value: false });
      }
    };
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Inventory.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiSelect
            items={products.value.map((product) => ({
              name: product.name,
              id: product.id,
            }))}
            onSelect={(id: number) => (inventoryMvm.productId = id)}
          >
            {globalTranslate("Inventory.create.select")}
          </UiSelect>
          <UiInput
            Type="number"
            PlaceHolder={globalTranslate("Inventory.create.placeholder")}
            IsEmpty={false}
            OnInputChange={(input) => (inventoryMvm.quantity = Number(input))}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewStock()}>
            {globalTranslate("Inventory.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
