import { defineComponent, reactive, ref } from "vue";
import { useSellerStore } from "@/stores/sellerStore";
import { useModalStore } from "@/stores/modalStore";
import type { newSellerT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";
import { globalTranslate } from "@/utils/globalTranslate";
import { UiUploader } from "./ui/UiUploader";
import { ImagesFiles } from "@/constants/FileTypes";
export const SellerCreate = defineComponent({
  name: "sellerCreate",
  components: { UiButton, UiInput, UiUploader },
  setup() {
    const isFlash = ref<boolean>(false);
    const Seller = reactive<newSellerT>({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    const createNewseller = () => {
      isFlash.value = true;
      if (Seller.name !== "") {
        useSellerStore().createOneSeller(Seller);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Sellers.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <div class="w-full h-fit flex justify-center">
            <UiUploader
              name="Image"
              extensions={ImagesFiles}
              onSave={(image) => (Seller.image = image)}
            />
          </div>
          <UiInput
            IsEmpty={isFlash.value && Seller["name"] == ""}
            OnInputChange={(value) =>
              (Seller["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[0]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Seller["email"] == ""}
            OnInputChange={(value) =>
              (Seller["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[1]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Seller["phone"] == ""}
            OnInputChange={(value) =>
              (Seller["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && Seller["address"] == ""}
            OnInputChange={(value) =>
              (Seller["address"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewseller()}>
            {globalTranslate("Sellers.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
