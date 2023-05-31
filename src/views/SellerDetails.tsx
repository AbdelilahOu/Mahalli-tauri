// import { SellerAdditional } from "@/components/SellerAdditional";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useSellerStore } from "@/stores/sellerStore";
import { generateColor } from "@/utils/generateColor";
import { useStatsStore } from "@/stores/statsStore";
import { useModalStore } from "@/stores/modalStore";
import { ChartBar } from "@/components/ChartBart";
import { UiCard } from "@/components/ui/UiCard";
import type { sellerT } from "@/types";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

export const SellerDetails = defineComponent({
  name: "SellerDetails",
  components: { UiCard },
  setup() {
    const id = useRoute().params.id;
    const SellerStore = useSellerStore();
    const { seller } = storeToRefs(SellerStore);

    const products = ref<string[]>([]);
    const dates = ref<string[]>([]);
    const data = ref<{ [key: string]: number[] }>({});

    onBeforeMount(async () => {
      const stats = await useStatsStore().getProductPerMonth(Number(id), false);
      data.value = stats.data;
      dates.value = stats.dates;
      products.value = stats.products;
    });

    const toggleThisSeller = (Seller: sellerT | null, name: string) => {
      useModalStore().updateModal({ key: "show", value: true });
      useModalStore().updateModal({ key: "name", value: name });
      useModalStore().updateSellerRow(Seller);
    };

    onBeforeMount(() => SellerStore.getOneSeller(Number(id)));

    return () => (
      <main class="w-full h-full px-3 py-1">
        <div class="w-full h-full text-black grid gap-4 xl:grid-cols-[400px_2px_1fr] xl:grid-rows-1 grid-rows-[250px_2px_1fr] grid-cols-1 print:pr-12">
          <div class="w-full grid-cols-[400px_1fr] xl:grid-rows-[200px_1fr] xl:grid-cols-1 items-start justify-start gap-3 grid">
            <UiCard
              title="Seller information"
              updateItem={() => {
                toggleThisSeller(seller.value, "SellerUpdate");
              }}
              item={seller.value}
            />
            {/* <SellerAdditional */}
          </div>
          <div class="xl:border-l-2 border-b-2"></div>
          <div class="w-full">
            <h1>Products baught last three months</h1>
            <ChartBar
              id="stock-mouvements-for-past-three-months"
              chartData={{
                labels: dates.value,
                datasets: products.value.map((product) => {
                  const color = generateColor();
                  return {
                    label: product,
                    backgroundColor: color,
                    borderColor: color.replace("0.2", "0.5"),
                    data: data.value[product],
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
                      color: "rgba(25,23,17,0.9)",
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
                      display: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    );
  },
});
