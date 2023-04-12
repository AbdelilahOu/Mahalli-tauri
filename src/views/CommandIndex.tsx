import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const CommandIndex = defineComponent({
  name: "CommandIndex",
  setup() {
    return () => (
      <div class="w-full h-full">
        <RouterView></RouterView>
      </div>
    );
  },
});
