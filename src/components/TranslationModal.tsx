import { globalTranslate } from "@/utils/globalTranslate";
import { Button } from "./ui/button";
import { computed, defineComponent } from "vue";
import UiIcon from "./ui/UiIcon.vue";
import { useI18n } from "vue-i18n";
import { store } from "@/store";

export const TranslationModal = defineComponent({
  name: "TranslationModal",
  components: { UiIcon, Button },
  setup() {
    const availableLocals = computed(() => store.getters.getLocales());

    const i18n = useI18n();

    const ChangeLocale = (local: { key: string; text: string }) => {
      i18n.locale.value = local.key;
      store.setters.updateStore({ key: "currentLocale", value: local });
      store.setters.updateStore({ key: "show", value: false });
    };

    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Global.translationTitle")}
        </h1>
        <div class="grid grid-cols-2 gap-2 ">
          {availableLocals.value.map((item) => (
            <Button Click={() => ChangeLocale(item)}>
              <span class="w-3/5 items-center h-full text-start flex justify-center gap-2">
                <span class="py-2">
                  <UiIcon IsStyled={true} name={item.key} />
                </span>
                {item.text}
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  },
});
