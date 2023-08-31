import { onBeforeRouteUpdate, RouterView } from "vue-router";
import { defineComponent, ref, withModifiers } from "vue";
import Xcomponent from "@/components/Xcomponent.vue";
import { Navigation } from "@/components/Navigation";
import { useModalStore } from "@/stores/modalStore";
import { SideBar } from "@/components/SideBar";
import { storeToRefs } from "pinia";

export const IndexView = defineComponent({
  name: "Index",
  components: { Xcomponent, Navigation, SideBar },
  setup() {
    const modalStore = useModalStore();
    const { theModal } = storeToRefs(modalStore);
    const IsCollapse = ref<boolean>(true);

    onBeforeRouteUpdate(() => {
      modalStore.updateModal({ key: "show", value: false });
    });
    return () => (
      <main
        class={`w-screen h-screen relative overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-transparent  flex `}
      >
        <div
          class={`transition-all sticky top-0 border-r-2 border-slate-100 z-50 flex justify-center duration-200 transform ${
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
            {theModal.value.show && (
              <div
                onClick={withModifiers(
                  () => modalStore.updateModal({ key: "show", value: false }),
                  ["self"]
                )}
                class="w-full h-full flex items-center justify-center absolute bg-gray-400 z-50 top-0 left-0  bg-opacity-10"
              >
                <Xcomponent name={modalStore.theModal.name} />
              </div>
            )}
            <div class="w-full bg-white rounded-md h-full">
              <RouterView></RouterView>
            </div>
          </div>
        </div>
      </main>
    );
  },
});
