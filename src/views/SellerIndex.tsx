import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const SellerIndex = defineComponent({
  name: "SellerIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
