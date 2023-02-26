import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const ClientIndex = defineComponent({
  name: "ClientIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
