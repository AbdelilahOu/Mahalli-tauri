import { defineComponent, type PropType } from "vue";
import { RouteLinks } from "@/stores/routeNames";
import { UiSideLink } from "./ui/UiSideLink";
import { useModalStore } from "@/stores/modalStore";
import { globalTranslate } from "@/utils/globalTranslate";
import { useTranslationStore } from "@/stores/translationStore";
export const SideBar = defineComponent({
  name: "SideBar",
  props: {
    Collapse: {
      type: Function as PropType<() => void>,
      required: true,
    },
    IsCollapse: {
      type: Boolean,
      required: true,
    },
  },
  components: { UiSideLink },
  setup(props) {
    return () => (
      <aside class="w-full rounded-md h-full sticky top-0 z-50 bg-sky-200">
        <div class="w-full h-screen print:hidden sticky top-0 z-50 grid grid-rows-[46px_1fr] gap-1">
          <div class="w-full bg-gray-300/10  h-full px-1 grid grid-cols-1 items-center justify-start">
            <span
              class={`font-medium  text-black flex items-center px-1 ${
                props.IsCollapse ? "justify-around" : "justify-between"
              }`}
            >
              {props.IsCollapse ? (
                ""
              ) : (
                <span class="whitespace-nowrap pl-2 text-primary overflow-hidden">
                  The Stocker
                </span>
              )}
              <span
                onClick={() => props.Collapse()}
                class={`transition-all duration-200 cursor-pointer transform hover:fill-gray-800 fill-primary ${
                  props.IsCollapse ? "rotate-180" : ""
                }`}
              >
                <svg
                  viewBox="0 0 16 16"
                  style="width: 16px; height: 16px; display: block; flex-shrink: 0; backface-visibility: hidden;"
                >
                  <path d="M7.07031 13.8887C7.2207 14.0391 7.40527 14.1211 7.62402 14.1211C8.06836 14.1211 8.41699 13.7725 8.41699 13.3281C8.41699 13.1094 8.32812 12.9043 8.17773 12.7539L3.37207 8.05762L8.17773 3.375C8.32812 3.21777 8.41699 3.0127 8.41699 2.80078C8.41699 2.35645 8.06836 2.00781 7.62402 2.00781C7.40527 2.00781 7.2207 2.08984 7.07031 2.24023L1.73828 7.44922C1.56055 7.62012 1.46484 7.8252 1.46484 8.06445C1.46484 8.29688 1.55371 8.49512 1.73828 8.67969L7.07031 13.8887ZM13.1748 13.8887C13.3252 14.0391 13.5098 14.1211 13.7354 14.1211C14.1797 14.1211 14.5283 13.7725 14.5283 13.3281C14.5283 13.1094 14.4395 12.9043 14.2891 12.7539L9.4834 8.05762L14.2891 3.375C14.4395 3.21777 14.5283 3.0127 14.5283 2.80078C14.5283 2.35645 14.1797 2.00781 13.7354 2.00781C13.5098 2.00781 13.3252 2.08984 13.1748 2.24023L7.84961 7.44922C7.66504 7.62012 7.57617 7.8252 7.56934 8.06445C7.56934 8.29688 7.66504 8.49512 7.84961 8.67969L13.1748 13.8887Z"></path>
                </svg>
              </span>
            </span>
          </div>
          <div class="w-full px-1 h-full overflow-x-hidden grid grid-cols-1 gap-1 grid-rows-[1fr_36px] justify-between pb-[18px]">
            <div class="w-full h-full flex flex-col gap-1">
              {RouteLinks.map((link, index) => {
                return link.display ? (
                  <UiSideLink
                    v-motion
                    initial={{
                      opacity: 0,
                      // x: 100,
                    }}
                    enter={{
                      opacity: 1,
                      // x: 0,
                      transition: {
                        delay: (index + 1) * 80,
                      },
                    }}
                    IsText={!props.IsCollapse}
                    LinkPath={link.path}
                    LinkIcon={link.icon}
                    LinkText={globalTranslate(`Global.routes.${link.name}`)}
                  />
                ) : (
                  ""
                );
              })}
            </div>
            <UiSideLink
              v-motion
              initial={{
                opacity: 0,
                // x: 100,
              }}
              enter={{
                opacity: 1,
                // x: 0,
                transition: {
                  delay: 9 * 80,
                },
              }}
              IsText={!props.IsCollapse}
              LinkPath={"/Notifications"}
              LinkIcon={"🔔"}
              LinkText={"Notifications"}
            />

            <button
              v-motion
              initial={{
                opacity: 0,
                // x: 100,
              }}
              enter={{
                opacity: 1,
                // x: 0,
                transition: {
                  delay: 10 * 80,
                },
              }}
              onClick={() => {
                useModalStore().updateModal({ key: "show", value: true });
                useModalStore().updateModal({
                  key: "name",
                  value: "TranslationModal",
                });
              }}
              class={
                "w-full flex filter contrast-more:text-black h-9 whitespace-nowrap flex-nowrap overflow-hidden rounded-md items-center text-[rgba(25,23,17,0.6)] py-1 px-2 hover:bg-white transition-all duration-300"
              }
            >
              🌐{" "}
              {!props.IsCollapse
                ? useTranslationStore().currentLocale.text
                : ""}
            </button>
          </div>
        </div>
      </aside>
    );
  },
});
