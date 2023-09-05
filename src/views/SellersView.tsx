import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { SellersTable } from "@/components/SellersTable";
import { UiButton } from "@/components/ui/UiButton";
import { useModalStore } from "@/stores/modalStore";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import { invoke } from "@tauri-apps/api";
import type { sellerT } from "@/types";

export const SellersView = defineComponent({
  name: "Sellers",
  components: { SellersTable, UiButton, UiInput, UiIcon },
  setup() {
    const modalStore = useModalStore();
    const sellers = ref<sellerT[]>([]);
    const searchQuery = ref<string>("");
    onBeforeMount(async () => {
      try {
        const res = await invoke<sellerT[]>("get_sellers", { page: 1 });
        if (res.length) {
          sellers.value = res;
        }
      } catch (error) {
        console.log(error);
      }
    });
    const updateModal = (name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
    };

    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 my-1">
              <div class="w-1/3">
                <UiInput
                  IsEmpty={false}
                  OnInputChange={(value) =>
                    (searchQuery.value =
                      typeof value !== "string"
                        ? JSON.stringify(value)
                        : value.toLocaleLowerCase())
                  }
                  Type="text"
                  PlaceHolder={globalTranslate("Global.search")}
                >
                  <UiIcon
                    class=" fill-gray-400 cursor-default hover:bg-white"
                    name="search"
                  />
                </UiInput>
              </div>
              <div class="w-1/4 flex gap-2">
                <UiButton
                  colorTheme="a"
                  Click={() => updateModal("SellerCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Sellers.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>
          <Transition appear>
            <SellersTable
              FilterParam={searchQuery.value}
              Sellers={sellers.value}
            />
          </Transition>
        </div>
      </main>
    );
  },
});
