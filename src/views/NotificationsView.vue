import { defineComponent } from "vue";

export const NotificationsView = defineComponent({
  name: "Notifications",
  setup() {
    return () => (
      <main class="w-full h-full flex items-center justify-center px-3 py-1"></main>
    );
  },
});
