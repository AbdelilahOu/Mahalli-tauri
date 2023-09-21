import { globalTranslate } from "@/utils/globalTranslate";
import { InventoryTable } from "@/components/InventoryTable";
import type { inventoryMvmT, withCount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UiIcon from "@/components/ui/UiIcon.vue";
import { store } from "@/store";
import { invoke } from "@tauri-apps/api";
import { useRouter } from "vue-router";
import {
  type WatchStopHandle,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  Transition,
  onMounted,
  computed,
  provide,
  watch,
  ref,
} from "vue";

export const InventoryView = defineComponent({
  name: "Inventory",
  components: {
    InventoryTable,
    Button,
    Input,
    UiIcon,
  },
  setup() {
    //

    const inventoryMouvements = ref<inventoryMvmT[]>([]);
    const searchQuery = ref<string>("");
    const router = useRouter();
    const page = computed(() => Number(router.currentRoute.value.query.page));
    const refresh = computed(() => router.currentRoute.value.query.refresh);

    let unwatch: WatchStopHandle | null = null;
    const totalRows = ref<number>(0);

    provide("count", totalRows);

    onBeforeMount(() => getInventory(page.value));

    onMounted(() => {
      unwatch = watch([page, refresh], ([p]) => {
        if (p && p > 0) getInventory(p);
      });
    });

    onUnmounted(() => {
      if (unwatch) unwatch();
    });

    async function getInventory(page: number = 1) {
      try {
        const res = await invoke<withCount<inventoryMvmT[]>>(
          "get_inventory_mvms",
          {
            page,
          }
        );

        if (res?.data.length) {
          inventoryMouvements.value = res.data;
          totalRows.value = res.count;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const updateModal = (name: string) => {
      store.setters.updateStore({ key: "show", value: true });
      store.setters.updateStore({ key: "name", value: name });
    };

    return () => (
      <main class="w-full h-full">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 mb-1">
              <div class="w-1/3">
                <Input
                  IsEmpty={false}
                  OnInputChange={(value) =>
                    (searchQuery.value =
                      typeof value !== "string"
                        ? JSON.stringify(value)
                        : value.toLocaleLowerCase())
                  }
                  type="text"
                  placeHolder={globalTranslate("Global.search")}
                >
                  <UiIcon
                    class=" fill-gray-400 cursor-default hover:bg-white"
                    name="search"
                  />
                </Input>
              </div>
              <div class="w-1/4 flex gap-2">
                <Button
                  colorTheme="a"
                  Click={() => updateModal("InventoryCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Inventory.index.addButton")}
                </Button>
              </div>
            </div>
          </Transition>

          <Transition appear>
            <InventoryTable Inventory={inventoryMouvements.value} />
          </Transition>
        </div>
      </main>
    );
  },
});
