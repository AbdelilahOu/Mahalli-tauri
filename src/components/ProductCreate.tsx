import { defineComponent, reactive, ref } from "vue";
import { useProductStore } from "@/stores/productStore";
import type { newProductT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";
import { useModalStore } from "@/stores/modalStore";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiUploader } from "./ui/UiUploader";
import { ImagesFiles } from "@/constants/FileTypes";

export const ProductCreate = defineComponent({
  name: "ProductCreate",
  components: { UiButton, UiInput },
  setup() {
    const isFlash = ref<boolean>(false);
    const Product = reactive<newProductT>({
      name: "",
      price: 0,
      quantity: 0,
      description: "aaaaaaaaa",
      tva: 0,
    });
    const createNewProduct = () => {
      isFlash.value = true;
      if (Product.name !== "") {
        useProductStore().createOneProduct(Product);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Products.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (Product.image = image)}
            />
          </div>
          <UiInput
            IsEmpty={isFlash.value && Product["name"] == ""}
            OnInputChange={(value) =>
              (Product["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Products.create.placeholders[0]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Product["price"] == 0}
            OnInputChange={(value) => (Product["price"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Product["tva"] == 0}
            OnInputChange={(value) => (Product["tva"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[3]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Product["quantity"] == 0}
            OnInputChange={(value) => (Product["quantity"] = Number(value))}
            Type="Number"
            PlaceHolder={globalTranslate("Products.create.placeholders[4]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Product["description"] == ""}
            OnInputChange={(value) =>
              (Product["description"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="textarea"
            PlaceHolder={globalTranslate("Products.create.placeholders[5]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewProduct()}>
            {globalTranslate("Products.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
