import { defineComponent, onBeforeUnmount, type PropType } from "vue";
import { usePaymentStore } from "@/stores/paymentStore";
import { useModalStore } from "@/stores/modalStore";
import { storeToRefs } from "pinia";
import { UiButton } from "./ui/UiButton";
import { globalTranslate } from "@/utils/globalTranslate";

export const PaymentDelete = defineComponent({
  name: "PaymentDelete",
  components: { UiButton },
  setup() {
    const modalStore = useModalStore();
    const { credi } = storeToRefs(modalStore);
    const deleteThePayment = () => {
      if (credi.value?.id) {
        usePaymentStore().deleteOnePayment(credi.value?.id);
        modalStore.updateModal({ key: "show", value: false });
      }
    };
    onBeforeUnmount(() => modalStore.updatePaymentRow(null));
    return () => (
      <div class="w-1/2 h-fit rounded-md z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Payments.delete.title")} N° {credi.value?.id} ?
        </h1>
        <div class="flex gap-2">
          <UiButton colorTheme="a" Click={() => deleteThePayment()}>
            {globalTranslate("Payments.delete.yes")}
          </UiButton>
          <UiButton
            Click={() => modalStore.updateModal({ key: "show", value: false })}
          >
            {globalTranslate("Payments.delete.no")}
          </UiButton>
        </div>
      </div>
    );
  },
});
