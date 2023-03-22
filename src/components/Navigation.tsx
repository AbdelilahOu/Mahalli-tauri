import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { defineComponent, onMounted, ref } from "vue";
import { RouteLinks } from "@/stores/routeNames";
import { globalTranslate } from "@/utils/globalTranslate";
import UiIconVue from "./ui/UiIcon.vue";

export const Navigation = defineComponent({
  name: "Navigation",
  components: { UiIconVue },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const ActiveLink = ref<any>("");
    onMounted(() => {
      ActiveLink.value = RouteLinks.find(
        (link) => link.component === route.name
      );
    });
    onBeforeRouteUpdate((to) => {
      ActiveLink.value = RouteLinks.find((link) => link.component === to.name);
    });
    return () => (
      <header class="w-full h-full print:hidden pt-1 pr-1 sticky top-0 mb-2 z-50 overflow-hidden bg-gray-200">
        <div class="w-full h-full flex  items-center p-3 rounded-md  bg-white justify-between">
          <div class="text-black flex items-center justify-center gap-2">
            <span
              onClick={() => router.back()}
              class="flex items-center justify-center cursor-pointer fill-gray-700 hover:fill-gray-800 transform-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="m11.1 19.1-6.45-6.475q-.15-.125-.212-.288-.063-.162-.063-.337 0-.175.063-.338.062-.162.212-.287L11.1 4.9q.225-.2.525-.213.3-.012.525.213.225.225.237.525.013.3-.212.55l-5.3 5.275H18.5q.3 0 .525.212.225.213.225.538 0 .325-.225.537-.225.213-.525.213H6.875l5.3 5.3q.2.2.212.512.013.313-.212.538-.225.225-.537.225-.313 0-.538-.225Z" />
              </svg>
            </span>
            <span
              onClick={() => router.forward()}
              class="flex rotate-180 items-center justify-center cursor-pointer fill-gray-700 hover:fill-gray-800 transform-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="m11.1 19.1-6.45-6.475q-.15-.125-.212-.288-.063-.162-.063-.337 0-.175.063-.338.062-.162.212-.287L11.1 4.9q.225-.2.525-.213.3-.012.525.213.225.225.237.525.013.3-.212.55l-5.3 5.275H18.5q.3 0 .525.212.225.213.225.538 0 .325-.225.537-.225.213-.525.213H6.875l5.3 5.3q.2.2.212.512.013.313-.212.538-.225.225-.537.225-.313 0-.538-.225Z" />
              </svg>
            </span>
            <span class="pb-[3px] text-gray-700 flex items-center">
              <button onClick={() => router.push("/Home")}>
                <span class={"w-full h-full cursor-pointer  bg-white"}>
                  <UiIconVue
                    IsStyled={true}
                    class={"   text-gray-700"}
                    name={"Home"}
                  />
                </span>
              </button>{" "}
              {route.fullPath !== "/" ? (
                <span class="flex items-center">
                  <span class="flex items-center">
                    {ActiveLink.value && " /"}
                    {ActiveLink.value && (
                      <UiIconVue
                        IsStyled={false}
                        class={"min-w-[32px] max-w-[32px] ml-1 text-gray-700"}
                        name={ActiveLink.value.name}
                      />
                    )}
                    {ActiveLink.value &&
                      globalTranslate(
                        `Global.routes.${ActiveLink.value.name}`
                      )}{" "}
                    {route.params.id ? `/ n° ${route.params.id}` : ""}
                  </span>
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
        </div>
      </header>
    );
  },
});
