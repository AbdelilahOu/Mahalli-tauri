import { defineComponent } from "vue";

export const ClientPayment = defineComponent({
  name: "ClientPayment",
  setup(props) {
    return () => (
      <div>
        <h1>Payment</h1>
      </div>
    );
  },
});
