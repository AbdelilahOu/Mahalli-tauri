import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const SellersIndex = defineComponent({
  name: "SellersIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
