import { defineComponent } from "vue";

export const ClientAdditional = defineComponent({
  name: "ClientAdditional",
  setup() {
    return () => (
      <div class="w-full h-full xl:sticky xl:top-[264px] z-20 bg-gray-200"></div>
    );
  },
});
