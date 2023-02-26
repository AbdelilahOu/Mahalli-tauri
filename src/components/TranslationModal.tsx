import { useModalStore } from "@/stores/modalStore";
import { useTranslationStore } from "@/stores/translationStore";
import { globalTranslate } from "@/utils/globalTranslate";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { UiButton } from "./ui/UiButton";
import UiIcon from "./ui/UiIcon.vue";

export const TranslationModal = defineComponent({
  name: "TranslationModal",
  setup() {
    const { availableLocals } = storeToRefs(useTranslationStore());

    const i18n = useI18n();

    const ChangeLocale = (local: { key: string; text: string }) => {
      i18n.locale.value = local.key;
      useTranslationStore().changeLocale(local);
      useModalStore().updateModal({ key: "show", value: false });
    };

    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Global.translationTitle")}
        </h1>
        <div class="grid grid-cols-2 gap-2 ">
          {availableLocals.value.map((item) => (
            <UiButton onClick={() => ChangeLocale(item)}>
              <span class="w-3/5 items-center h-full text-start flex justify-center gap-2">
                <span class="py-2">
                  <UiIcon IsStyled={true} name={item.key} />
                </span>
                {item.text}
              </span>
            </UiButton>
          ))}
        </div>
      </div>
    );
  },
});
