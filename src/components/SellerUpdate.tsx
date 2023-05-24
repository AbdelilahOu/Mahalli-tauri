import { defineComponent, reactive, onBeforeUnmount } from "vue";
import { useSellerStore } from "@/stores/sellerStore";
import { useModalStore } from "@/stores/modalStore";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { updateSellerT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";

export const SellerUpdate = defineComponent({
  name: "SellerUpdate",
  components: { UiButton, UiUpdateInput },
  setup() {
    const modalStore = useModalStore();
    const { seller: SellerRow } = storeToRefs(modalStore);
    const Seller = {
      id: undefined,
      name: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
    };
    const updateSeller = reactive<updateSellerT>(
      SellerRow.value ? SellerRow.value : Seller
    );
    const updateTheSeller = () => {
      if (updateSeller?.id) {
        useSellerStore().updateOneSeller(updateSeller.id, updateSeller);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateSellerRow(null));

    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Sellers.update.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiUpdateInput
            Value={SellerRow.value?.name}
            OnInputChange={(value) =>
              (updateSeller["name"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[0]")}
          />
          <UiUpdateInput
            Value={SellerRow.value?.email}
            OnInputChange={(value) =>
              (updateSeller["email"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[1]")}
          />
          <UiUpdateInput
            Value={SellerRow.value?.phone}
            OnInputChange={(value) =>
              (updateSeller["phone"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[2]")}
          />
          <UiUpdateInput
            Value={SellerRow.value?.address}
            OnInputChange={(value) =>
              (updateSeller["address"] =
                typeof value == "string" ? value : JSON.stringify(value))
            }
            Type="text"
            PlaceHolder={globalTranslate("Sellers.create.placeholders[3]")}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => updateTheSeller()}>
            {globalTranslate("Sellers.update.button")}
            {updateSeller.name}
          </UiButton>
        </div>
      </div>
    );
  },
});
