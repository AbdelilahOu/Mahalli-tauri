import { onBeforeRouteUpdate, RouterView } from "vue-router";
import {
  defineComponent,
  ref,
  resolveDynamicComponent,
  Transition,
  withModifiers,
  type Component,
} from "vue";
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

    const slots = (view: { Component: Component }) => (
      <Transition appear={true}>
        {resolveDynamicComponent(view.Component)}
      </Transition>
    );

    return () => (
      <main
        class={`w-screen h-screen overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-transparent  flex `}
      >
        <div
          class={`transition-all sticky top-1 z-50 m-1 duration-200 transform ${
            IsCollapse.value ? "w-12 min-w-[48px]" : "w-52 min-w-[12rem]"
          }`}
        >
          <SideBar
            IsCollapse={IsCollapse.value}
            Collapse={() => (IsCollapse.value = !IsCollapse.value)}
          />
        </div>
        <div class="grid grid-rows-[46px_1fr]  w-full relative">
          <Navigation />
          <div class="w-full h-full flex flex-col items-center justify-center">
            {theModal.value.show && (
              <div
                onClick={withModifiers(
                  () => modalStore.updateModal({ key: "show", value: false }),
                  ["self"]
                )}
                class="w-full h-full flex items-center justify-center absolute bg-gray-400 z-50 top-0  bg-opacity-10"
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
