import { useClientStore } from "@/stores/clientStore";
import { defineComponent, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { ClientCard } from "@/components/ClientCard";
import { ChartBar } from "@/components/ChartBart";
import { useStatsStore } from "@/stores/statsStore";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { generateColor } from "@/utils/generateColor";
import type { clientT } from "@/types";
import { useModalStore } from "@/stores/modalStore";

export const ClientDetails = defineComponent({
  name: "ClientDetails",
  setup() {
    const id = useRoute().params.id;
    const clientStore = useClientStore();
    const { client } = storeToRefs(clientStore);
    onBeforeMount(() => clientStore.getOneClient(Number(id)));

    const [data, dates, products] = useStatsStore().getOrderedProduct(
      Number(id),
      storeToRefs(useInvoiceStore()).invoices.value
    );

    const toggleThisClient = (client: clientT | null, name: string) => {
      useModalStore().updateModal({ key: "show", value: true });
      useModalStore().updateModal({ key: "name", value: name });
      useModalStore().updateClientRow(client);
    };

    return () => (
      <main class="w-full h-full px-3 pt-1">
        <div class="w-full h-full text-black flex flex-col print:pr-12">
          <div class="w-full grid-cols-[400px_1fr] grid-rows-1 grid">
            <div class="w-full h-full">
              <ClientCard
                updateClient={() => {
                  toggleThisClient(client.value, "ClientUpdate");
                }}
                client={client.value}
              />
              <div class="w-full h-full"></div>
            </div>
          </div>
          <div class=" my-3  border-b-2 border-b-gray-200"></div>
          <h1>Products baught last three months</h1>
          <ChartBar
            id="stock-mouvements-for-past-three-months"
            chartData={{
              labels: dates,
              datasets: products.map((product) => {
                const color = generateColor();
                return {
                  label: product,
                  backgroundColor: color,
                  borderColor: color.replace("0.2", "0.5"),
                  data: data[product],
                  borderWidth: 2,
                };
              }),
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
                    lineWidth: 0,
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
