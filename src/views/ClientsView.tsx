import { globalTranslate } from "@/utils/globalTranslate";
import { ClientsTable } from "@/components/ClientsTable";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import type { clientT, withCount } from "@/types";
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

export const ClientsView = defineComponent({
  name: "Clients",
  components: { ClientsTable, UiButton, UiInput, UiIcon },
  setup() {
    const router = useRouter();
    //
    const clients = ref<clientT[]>([]);
    const searchQuery = ref<string>("");
    const page = computed(() => Number(router.currentRoute.value.query.page));
    const refresh = computed(() => router.currentRoute.value.query.refresh);

    const totalRows = ref<number>(0);

    let unwatch: WatchStopHandle | null = null;

    provide("count", totalRows);

    onBeforeMount(() => getClients(page.value));

    onMounted(() => {
      unwatch = watch([page, refresh], ([p]) => {
        if (p && p > 0) getClients(p);
      });
    });

    onUnmounted(() => {
      if (unwatch) unwatch();
    });

    const getClients = async (page: number = 1) => {
      try {
        const res = await invoke<withCount<clientT[]>>("get_clients", {
          page,
        });
        if (res?.data.length) {
          clients.value = res.data;
          totalRows.value = res.count;
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    //
    const updateModal = (name: string) => {
      store.setters.updateStore({ key: "show", value: true });
      store.setters.updateStore({ key: "name", value: name });
    };
    //

    return () => (
      <main class="w-full h-full">
        <div class="w-full h-full flex flex-col items-start justify-start">
          <Transition appear>
            <div class="flex justify-between w-full gap-9 mb-1">
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
                  Click={() => updateModal("ClientCreate")}
                >
                  <UiIcon
                    class=" fill-gray-900 cursor-default hover:bg-transparent"
                    name="add"
                  />{" "}
                  {globalTranslate("Clients.index.addButton")}
                </UiButton>
              </div>
            </div>
          </Transition>

          <Transition appear>
            <ClientsTable Clients={clients.value} />
          </Transition>
        </div>
      </main>
    );
  },
});
