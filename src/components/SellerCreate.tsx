import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { SELLER_CREATE } from "@/constants/defaultValues";
import { globalTranslate } from "@/utils/globalTranslate";
import { defineComponent, reactive, ref } from "vue";
import { ImagesFiles } from "@/constants/FileTypes";
import { UiUploader } from "./ui/UiUploader";
import type { newSellerT } from "@/types";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api";
import { Input } from "./ui/input";
import { saveFile } from "@/utils/fs";
import { store } from "@/store";

export const SellerCreate = defineComponent({
  name: "sellerCreate",
  components: { Button, Input, UiUploader },
  setup() {
    const { updateQueryParams } = useUpdateRouteQueryParams();
    const isFlash = ref<boolean>(false);

    const seller = reactive<newSellerT>(SELLER_CREATE);

    const createNewseller = async () => {
      isFlash.value = true;
      if (seller.name !== "") {
        try {
          let image: string = await saveFile(seller.image as string, "Image");
          await invoke("insert_seller", { seller: { ...seller, image } });
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
          {globalTranslate("Sellers.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (seller.image = image)}
            />
          </div>
          <Input
            // IsEmpty={isFlash.value && seller["name"] == ""}
            // OnInputChange={(value) =>
            //   (seller["name"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            modelValue={seller.name}
            type="text"
            placeHolder={globalTranslate("Sellers.create.placeholders[0]")}
          />
          <Input
            // IsEmpty={isFlash.value && seller["email"] == ""}
            // OnInputChange={(value) =>
            //   (seller["email"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            modelValue={seller.email}
            type="text"
            placeHolder={globalTranslate("Sellers.create.placeholders[1]")}
          />
          <Input
            // IsEmpty={isFlash.value && seller["phone"] == ""}
            // OnInputChange={(value) =>
            //   (seller["phone"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            modelValue={seller.phone}
            type="text"
            placeHolder={globalTranslate("Sellers.create.placeholders[2]")}
          />
          <Input
            // IsEmpty={isFlash.value && seller["address"] == ""}
            // OnInputChange={(value) =>
            //   (seller["address"] =
            //     typeof value == "string" ? value : JSON.stringify(value))
            // }
            modelValue={seller.address}
            type="text"
            placeHolder={globalTranslate("Sellers.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <Button onClick={() => createNewseller()}>
            {globalTranslate("Sellers.create.button")}
          </Button>
        </div>
      </div>
    );
  },
});
