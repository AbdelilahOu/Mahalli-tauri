// import { SellerAdditional } from "@/components/SellerAdditional";
import { defineComponent, onBeforeMount, reactive } from "vue";
import { chartOptions, optionsWoTicks } from "@/constants/chartOptions";
import { ChartHolder } from "@/components/ChartHolder";
import { useSellerStore } from "@/stores/sellerStore";
import { generateColor } from "@/utils/generateColor";
import { useStatsStore } from "@/stores/statsStore";
import { useModalStore } from "@/stores/modalStore";
import { ChartBar } from "@/components/ChartBar";
import { UiCard } from "@/components/ui/UiCard";
import type { sellerT } from "@/types";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { ChartLine } from "@/components/ChartLine";

export const SellerDetails = defineComponent({
  name: "SellerDetails",
  components: { UiCard, ChartHolder, ChartBar },
  setup() {
    const id = useRoute().params.id;
    const SellerStore = useSellerStore();
    const statsStore = useStatsStore();
    const { seller } = storeToRefs(SellerStore);

    const ProductsStats = reactive({
      products: [] as string[],
      dates: [] as string[],
      data: {} as { [key: string]: number[] },
    });

    const DailyStats = reactive({
      data: [] as number[],
      keys: [] as string[],
    });

    onBeforeMount(async () => {
      const productStats = await statsStore.getProductPerMonth(
        Number(id),
        false
      );
      const dailyStats = await statsStore.getDailyExpenses(Number(id), false);

      DailyStats.keys = dailyStats.keys;
      DailyStats.data = dailyStats.values;

      console.log(dailyStats);

      ProductsStats.data = productStats.data;
      ProductsStats.dates = productStats.dates;
      ProductsStats.products = productStats.products;
    });
    const toggleThisSeller = (seller: sellerT | null, name: string) => {
      useModalStore().updateModal({ key: "show", value: true });
      useModalStore().updateModal({ key: "name", value: name });
      useModalStore().updateSellerRow(seller);
    };

    onBeforeMount(() => SellerStore.getOneSeller(Number(id)));

    return () => (
      <main class="w-full h-full px-3 py-1">
        <div class="w-full h-full text-black grid gap-4 xl:grid-cols-[400px_2px_1fr] xl:grid-rows-1 grid-rows-[260px_2px_1fr] grid-cols-1 print:pr-12">
          <div class="w-full grid-cols-[400px_1fr] xl:grid-rows-[258px_1fr] xl:grid-cols-1 items-start justify-start gap-3 grid">
            <UiCard
              title="seller information"
              updateItem={() => {
                toggleThisSeller(seller.value, "SellerUpdate");
              }}
              item={seller.value}
            />
            <div class="w-full flex items-end xl:items-start h-full">
              <ChartLine
                id="sjdlsdksd"
                chartData={{
                  labels: DailyStats.keys,
                  datasets: [
                    {
                      label: "daily expenses",
                      backgroundColor: generateColor(),
                      borderColor: generateColor().replace("0.2", "0.5"),
                      data: DailyStats.data,
                      borderWidth: 2,
                      lineTension: 0.4,
                      pointRadius: 1,
                    },
                  ],
                }}
                chartOptions={optionsWoTicks}
              />
            </div>
          </div>
          <div class="xl:border-l-2 border-b-2"></div>
          <div class="w-full">
            <ChartHolder>
              {{
                default: () => (
                  <ChartBar
                    id="stock-mouvements-for-past-three-months"
                    chartData={{
                      labels: ProductsStats.dates,
                      datasets: ProductsStats.products.map((product) => {
                        const color = generateColor();
                        return {
                          label: product,
                          backgroundColor: color,
                          borderColor: color.replace("0.2", "0.5"),
                          data: ProductsStats.data[product],
                          borderWidth: 2,
                        };
                      }),
                    }}
                    chartOptions={chartOptions}
                  />
                ),
                title: () => (
                  <h1 class="m-2 w-full text-center text-base font-medium">
                    <i>Products baught last three months</i>
                  </h1>
                ),
              }}
            </ChartHolder>
          </div>
        </div>
      </main>
    );
  },
});
