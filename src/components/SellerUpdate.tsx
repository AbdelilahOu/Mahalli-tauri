import { defineComponent, reactive, onBeforeUnmount, computed } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { store } from "@/store";
import { UiUpdateInput } from "./ui/UiUpdateInput";
import type { sellerT, updateSellerT } from "@/types";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";

import { useRoute, useRouter } from "vue-router";

export const SellerUpdate = defineComponent({
  name: "SellerUpdate",
  components: { UiButton, UiUpdateInput },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const SellerRow = computed(() => store.getters.getSelectedRow<sellerT>());

    const Seller = {
      id: undefined,
      name: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
      image: undefined,
    };

    const updateSeller = reactive<updateSellerT>(
      SellerRow.value ? SellerRow.value : Seller
    );

    const updateQueryParams = (query: Record<any, any>) => {
      router.push({
        path: route.path,
        params: { ...route.params },
        query: { ...route.query, ...query },
      });
    };

    const updateTheSeller = async () => {
      if (updateSeller?.id) {
        try {
          await invoke("update_seller", {
            seller: updateSeller,
            id: updateSeller.id,
          });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-update-" + Math.random() * 9999,
          });
        } catch (error) {
          console.log(error);
        } finally {
          store.setters.updateStore({ key: "show", value: false });
        }
      }
    };

    onBeforeUnmount(() =>
      store.setters.updateStore({ key: "row", value: null })
    );

    return () => (
      <div class="w-1/2 h-fit rounded-[4px] z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
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
