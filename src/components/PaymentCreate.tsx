import { defineComponent, reactive, ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { usePaymentStore } from "@/stores/paymentStore";
import { UiButton } from "./ui/UiButton";
import { UiSelect } from "./ui/UiSelect";
import { UiInput } from "./ui/UiInput";
import { storeToRefs } from "pinia";
import { globalTranslate } from "@/utils/globalTranslate";
// import { useClientStore } from "@/stores/clientStore";
import type { clientT, newPaymentT } from "@/types";

export const PaymentCreate = defineComponent({
  name: "PaymentCreate",
  components: { UiButton, UiInput, UiSelect },
  setup() {
    // const { clients } = storeToRefs(useClientStore());
    const Paymentstore = usePaymentStore();

    const clients = ref<clientT[]>([]);

    const Payment = reactive<newPaymentT>({
      clientId: 0,
      price: 0,
    });
    const createNewPayment = () => {
      console.log(Payment);
      if (Payment.clientId !== 0 && Payment.price !== 0) {
        Paymentstore.createPayment(Payment);
        useModalStore().updateModal({ key: "show", value: false });
      }
    };
    return () => (
      <div class="w-1/2 rounded-md h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]">
        <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
          {globalTranslate("Payments.create.title")}
        </h1>
        <div class="h-full w-full flex flex-col gap-2">
          <UiSelect
            items={clients.value.map((client: any) => ({
              name: client.name,
              id: client.id,
            }))}
            onSelect={(id: number) => (Payment.clientId = id)}
          >
            {globalTranslate("Payments.create.select")}
          </UiSelect>
          <UiInput
            Type="number"
            PlaceHolder={globalTranslate("Payments.create.placeholder")}
            IsEmpty={false}
            OnInputChange={(input) => (Payment.price = Number(input))}
          />
        </div>
        <div class="flex">
          <UiButton colorTheme="a" Click={() => createNewPayment()}>
            {globalTranslate("Payments.create.button")}
          </UiButton>
        </div>
      </div>
    );
  },
});
