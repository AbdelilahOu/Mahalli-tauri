import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const OrdersIndex = defineComponent({
  name: "OrdersIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
