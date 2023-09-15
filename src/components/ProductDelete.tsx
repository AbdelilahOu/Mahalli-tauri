import { globalTranslate } from "@/utils/globalTranslate";
import { computed, defineComponent, onBeforeUnmount } from "vue";
import { store } from "@/store";
import { UiButton } from "./ui/UiButton";
import { invoke } from "@tauri-apps/api";

import { useRoute, useRouter } from "vue-router";
import type { productT } from "@/types";

export const ProductDelete = defineComponent({
  name: "ProductDelete",
  components: { UiButton },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const product = computed(() => store.getters.getSelectedRow<productT>());

    const updateQueryParams = (query: Record<any, any>) => {
      router.push({
        path: route.path,
        params: { ...route.params },
        query: { ...route.query, ...query },
      });
    };

    const deleteTheProduct = async () => {
      let id = product.value?.id;
      if (id) {
        try {
          await invoke("delete_product", { id });
          // toggle refresh
          updateQueryParams({
            refresh: "refresh-delete-" + Math.random() * 9999,
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
          {globalTranslate("Products.delete.title")} {product.value?.name} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteTheProduct()}>
            {globalTranslate("Products.delete.yes")}
          </UiButton>
          <UiButton
            Click={() =>
              store.setters.updateStore({ key: "show", value: false })
            }
          >
            {globalTranslate("Products.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
