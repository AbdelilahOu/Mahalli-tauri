import { computed, defineComponent, ref, withModifiers } from "vue";
import { onBeforeRouteUpdate, RouterView } from "vue-router";
import Xcomponent from "@/components/Xcomponent.vue";
import { Navigation } from "@/components/Navigation";
import { SideBar } from "@/components/SideBar";
import { store } from "@/store";

export const IndexView = defineComponent({
  name: "Index",
  components: { Xcomponent, Navigation, SideBar },
  setup() {
    const show = computed(() => store.getters.getModalVisibility());
    const name = computed(() => store.getters.getModalName());
    const IsCollapse = ref<boolean>(true);

    const hideModal = () => {
      store.setters.updateStore({ key: "show", value: false });
    };

    onBeforeRouteUpdate(hideModal);
    return () => (
      <main
        class={`w-screen h-screen relative overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-transparent  flex `}
      >
        <div
          class={`transition-all print:hidden sticky top-0 border-r-2 border-slate-100 z-50 flex justify-center duration-200 transform ${
            IsCollapse.value ? "w-12 min-w-[48px]" : "w-52 min-w-[12rem]"
          }`}
        >
          <SideBar
            IsCollapse={IsCollapse.value}
            Collapse={() => (IsCollapse.value = !IsCollapse.value)}
          />
        </div>
        <div class="grid grid-rows-[50px_1fr] w-full">
          <Navigation />
          <div class="w-full h-full flex flex-col border-t-2 border-slate-100 items-center justify-center">
            {show.value && (
              <div
                onClick={withModifiers(hideModal, ["self"])}
                class="w-full h-full flex items-center justify-center absolute bg-gray-400 z-50 top-0 left-0  bg-opacity-10"
              >
                <Xcomponent name={name.value} />
              </div>
            )}
            <div class="w-full bg-white p-2 rounded-[4px] h-full">
              <RouterView></RouterView>
            </div>
          </div>
        </div>
      </main>
    );
  },
});
