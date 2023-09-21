import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const InvoicesIndex = defineComponent({
  name: "InvoicesIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
