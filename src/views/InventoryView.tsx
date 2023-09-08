import { defineComponent, onBeforeMount, ref, Transition } from "vue";
import { globalTranslate } from "@/utils/globalTranslate";
import { InventoryTable } from "@/components/InventoryTable";
import { useModalStore } from "@/stores/modalStore";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import UiIcon from "@/components/ui/UiIcon.vue";
import type { inventoryMvmT } from "@/types";
import { invoke } from "@tauri-apps/api";

export const InventoryView = defineComponent({
  name: "Inventory",
  components: {
    InventoryTable,
    UiButton,
    UiInput,
    UiIcon,
  },
  setup() {
    //
    const modalStore = useModalStore();
    const inventoryMouvements = ref<inventoryMvmT[]>([]);
    const searchQuery = ref<string>("");

    onBeforeMount(async () => {
      try {
        inventoryMouvements.value = await invoke("get_inventory_mvms", {
          page: 1,
        });
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
                  Click={() => updateModal("InventoryCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Inventory.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>

          <Transition appear>
            <InventoryTable
              FilterParam={searchQuery.value}
              Inventory={inventoryMouvements.value}
            />
          </Transition>
        </div>
      </main>
    );
  },
});
