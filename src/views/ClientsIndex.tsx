import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const ClientsIndex = defineComponent({
  name: "ClientsIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
