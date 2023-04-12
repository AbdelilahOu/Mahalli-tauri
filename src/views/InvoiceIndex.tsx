import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const InvoiceIndex = defineComponent({
  name: "InvoiceIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
