import { defineComponent, onBeforeUnmount, type PropType } from "vue";
import { useCrediStore } from "@/stores/crediStore";
import { useModalStore } from "@/stores/modalStore";
import { storeToRefs } from "pinia";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";

export const CrediDelete = defineComponent({
  name: "CrediDelete",
  components: { UiButton },
  setup() {
    const modalStore = useModalStore();
    const { credi } = storeToRefs(modalStore);
    const deleteTheCredi = () => {
      if (credi.value?.id) {
        useCrediStore().deleteOneCredi(credi.value?.id);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updateCrediRow(null));
    return () => (
      <div class="w-1/2 h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Credis.delete.title")} N° {credi.value?.id} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" onClick={() => deleteTheCredi()}>
            {globalTranslate("Credis.delete.yes")}
          </UiButton>
          <UiButton
            onClick={() =>
              modalStore.updateModal({ key: "show", value: false })
            }
          >
            {globalTranslate("Credis.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
