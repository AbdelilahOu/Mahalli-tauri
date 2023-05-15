import { defineComponent, reactive, ref } from "vue";
import { useSellerStore } from "@/stores/sellerStore";
import { useModalStore } from "@/stores/modalStore";
import type { newSellerT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { UiInput } from "./ui/UiInput";
import { globalTranslate } from "@/utils/globalTranslate";
export const SellerCreate = defineComponent({
  name: "sellerCreate",
  components: { UiButton, UiInput },
  setup() {
    const isFlash = ref<boolean>(false);
    const newseller = reactive<newSellerT>({
      name: "",
      email: "",
      phone: "",
      addresse: "",
    });
    const createNewseller = () => {
      isFlash.value = true;
      if (newseller.name !== "") {
        useSellerStore().createOneSeller(newseller);
        useModalStore().updateModal({ key: "show", value: false });
      }
      setTimeout(() => {
        isFlash.value = false;
      }, 1000);
    };
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Sellers.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiInput
            IsEmpty={isFlash.value && newseller["name"] == ""}
            OnInputChange={(value) =>
              (newseller["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[0]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newseller["email"] == ""}
            OnInputChange={(value) =>
              (newseller["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[1]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newseller["phone"] == ""}
            OnInputChange={(value) =>
              (newseller["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[2]")}
          />
          <UiInput
            IsEmpty={isFlash.value && newseller["addresse"] == ""}
            OnInputChange={(value) =>
              (newseller["addresse"] =
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
