import { defineComponent, reactive, ref, type PropType } from "vue";
import { useProductStore } from "@/stores/productStore";
import type { newProductT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";
import { useModalStore } from "@/stores/modalStore";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiSelect } from "./ui/UiSelect";

export const ProductCreate = defineComponent({
  name: "ProductCreate",
  components: { UiButton, UiInput },
  setup() {
    const isFlash = ref<boolean>(false);
    const newProduct = reactive<newProductT>({
      name: "",
      price: 0,
      quantity: 0,
      description: "aaaaaaaaa",
      tva: 0,
      type: "",
    });
    const createNewProduct = () => {
      isFlash.value = true;
      if (newProduct.name !== "") {
        useProductStore().createOneProduct(newProduct);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Products.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiInput
            IsEmpty={isFlash.value && newProduct["name"] == ""}
            OnInputChange={(value) =>
              (newProduct["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Products.create.placeholders[0]")}
          />
          <UiSelect
            IsClickedOuside={false}
            items={[
              {
                id: 1,
                name: "Produit",
              },
              {
                id: 2,
                name: "Service",
              },
            ]}
            onSelect={(val) =>
              (newProduct.type = val == 1 ? "Produit" : "Service")
            }
          >
            {globalTranslate("Products.create.placeholders[1]")}
          </UiSelect>
          <UiInput
            IsEmpty={isFlash.value && newProduct["price"] == 0}
            OnInputChange={(value) => (newProduct["price"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newProduct["tva"] == 0}
            OnInputChange={(value) => (newProduct["tva"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[3]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newProduct["quantity"] == 0}
            OnInputChange={(value) => (newProduct["quantity"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[4]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newProduct["description"] == ""}
            OnInputChange={(value) =>
              (newProduct["description"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="textarea"
            PlaceHolder={globalTranslate("Products.create.placeholders[5]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" onClick={() => createNewProduct()}>
            {globalTranslate("Products.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
