import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { StockTable } from "@/components/StockTable";
import { useStockStore } from "@/stores/stockStore";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modalStore";
import { globalTranslate } from "@/utils/globalTranslate";

export const StockView = defineComponent({
  name: "Stocks",
  components: {
    StockTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    //
    const modalStore = useModalStore();
    const stockStore = useStockStore();
    const { stockMouvements } = storeToRefs(stockStore);

    const searchQuery = ref<string>("");

    onBeforeMount(() => {
      stockStore.getAllStockMouvements();
    });

    const updateModal = (name: string) => {
      modalStore.updateModal({ key: "show", value: true });
      modalStore.updateModal({ key: "name", value: name });
    };
    return () => {
      return (
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
                          ? JSON.stringify(value).toLocaleLowerCase()
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
                    onClick={() => updateModal("StockCreate")}
                  >
                    <UiIcon
                      class=" fill-gray-900 cursor-default hover:bg-transparent"
                      name="add"
                    />{" "}
                    {globalTranslate("Stocks.index.addButton")}
                  </UiButton>
                </div>
              </div>
            </Transition>

            <Transition appear>
              <StockTable
                FilterParam={searchQuery.value}
                Stock={stockMouvements.value}
              />
            </Transition>
          </div>
        </main>
      );
    };
  },
});
