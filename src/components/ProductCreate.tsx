import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, reactive, ref } from "vue";
import { ImagesFiles } from "@/constants/FileTypes";
import { UiUploader } from "./ui/UiUploader";
import type { newProductT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { saveFile } from "@/utils/fs";
import { store } from "@/store";
import { PRODUCT_CREATE } from "@/constants/defaultValues";

export const ProductCreate = defineComponent({
  name: "ProductCreate",
  components: { Button, Input },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();
    const isFlash = ref<boolean>(false);

    const product = reactive<newProductT>(PRODUCT_CREATE);

    const createNewProduct = async () => {
      isFlash.value = true;
      if (product.name !== "") {
        try {
          let image: string = await saveFile(product.image as string, "Image");
          await invoke("insert_product", { product: { ...product, image } });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-create-" + Math.random() * 9999,
          });
        } catch (error) {
          console.log(error);
        } finally {
          store.setters.updateStore({ key: "show", value: false });
          return;
        }
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Products.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (product.image = image)}
            />
          </div>
          <Input
            // IsEmpty={isFlash.value && product["name"] == ""}
            // OnInputChange={(value) =>
            //   (product["name"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            modelValue={product.name}
            type="text"
            placeHolder={globalTranslate("Products.create.placeholders[0]")}
          />
          <Input
            // IsEmpty={isFlash.value && product["price"] == 0}
            // OnInputChange={(value) => (product["price"] = Number(value))}
            type="Number"
            modelValue={product.price}
            placeHolder={globalTranslate("Products.create.placeholders[2]")}
          />
          <Input
            // IsEmpty={isFlash.value && product["tva"] == 0}
            // OnInputChange={(value) => (product["tva"] = Number(value))}
            type="Number"
            modelValue={product.tva}
            placeHolder={globalTranslate("Products.create.placeholders[3]")}
          />
          <Input
            // IsEmpty={isFlash.value && product["quantity"] == 0}
            // OnInputChange={(value) => (product["quantity"] = Number(value))}
            type="Number"
            modelValue={product.quantity}
            placeHolder={globalTranslate("Products.create.placeholders[4]")}
          />
          <Input
            // IsEmpty={isFlash.value && product["description"] == ""}
            // OnInputChange={(value) =>
            //   (product["description"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            type="textarea"
            modelValue={product.description}
            placeHolder={globalTranslate("Products.create.placeholders[5]")}
          />
        </div>
        <div class="flex">
          <Button onClick={() => createNewProduct()}>
            {globalTranslate("Products.create.button")}
          </Button>
        </div>
      </div>
    );
  },
});
