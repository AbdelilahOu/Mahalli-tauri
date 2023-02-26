import { useClientStore } from "@/stores/clientStore";
import { defineComponent, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { ClientCard } from "@/components/ClientCard";
import { ChartBar } from "@/components/ChartBart";
import { globalTranslate } from "@/utils/globalTranslate";
import { useStatsStore } from "@/stores/statsStore";
import { useInvoiceStore } from "@/stores/invoiceStore";

export const ClientDetails = defineComponent({
  name: "ClientDetails",
  setup() {
    const id = useRoute().params.id;
    const clientStore = useClientStore();
    const { client } = storeToRefs(clientStore);
    onBeforeMount(() => clientStore.getOneClient(Number(id)));

    const ClientStats = useStatsStore().getOrderedProduct(
      Number(id),
      useInvoiceStore().invoices
    );

    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full text-black flex flex-col print:pr-12">
          <ClientCard client={client.value} />
          <ChartBar
            id="stock-mouvements-for-past-three-months"
            chartData={{
              labels: [],
              datasets: [
                {
                  label: globalTranslate("Stats.Labels[0]"),
                  backgroundColor: "rgba(255, 200, 0, 0.2)",
                  borderColor: "rgba(255, 200, 0,0.5)",
                  data: [100, 90],
                  borderWidth: 2,
                },
              ],
            }}
            chartOptions={{
              responsive: true,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "rgba(25,23,17,0.6)",
                    textStrokeWidth: 10,
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    lineWidth: 1,
                    drawBorder: false,
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </main>
    );
  },
});
