import products from "../../assets/images/products.jpg";
import commands from "../../assets/images/commands.jpg";
import invoices from "../../assets/images/invoices.jpg";
import sellers from "../../assets/images/sellers.jpeg";
import clients from "../../assets/images/clients.jpg";
import stock from "../../assets/images/stock.jpg";
import stats from "../../assets/images/stats.jpg";
import credi from "../../assets/images/credi.webp";

import { globalTranslate } from "@/utils/globalTranslate";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export const HomeView = defineComponent({
  name: "Home",
  components: { UiButton, UiInput },
  setup() {
    const Pages: { image: string; text: string; path: string }[] = [
      {
        image: clients,
        text: "Clients",
        path: "/Clients/all",
      },
      {
        image: products,
        text: "Products",
        path: "/Products",
      },
      {
        image: sellers,
        text: "Sellers",
        path: "/Sellers/all",
      },
      {
        image: commands,
        text: "Commands",
        path: "/Commands/all",
      },
      {
        image: invoices,
        text: "Invoices",
        path: "/Invoices/all",
      },
      {
        image: stock,
        text: "Stock",
        path: "/Stocks",
      },
      {
        image: stats,
        text: "Statistics",
        path: "/Stats",
      },
      {
        image: credi,
        text: "Credi",
        path: "/Credi",
      },
    ];
    return () => (
      <main class="w-screen h-screen">
        <div class="w-full h-full flex justify-center items-center flex-col">
          <div class="grid grid-rows-[1fr_46px] max-w-3xl max-h-[48rem] w-full h-full grid-cols-[1fr_48px]">
            <div class="md:h-[700px] w-full h-full p-3 gap-3 grid-cols-3 grid-rows-3 grid">
              {Pages.map((page) => (
                <div class="w-full h-full">
                  <RouterLink to={page.path}>
                    <div class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-sm items-center bg-gray-400">
                      <img
                        class="absolute top-0 left-0 w-full opacity-20 group-hover:opacity-60 h-full transition-all duration-250"
                        src={page.image}
                        alt=""
                      />
                      <span class="text-center text-xl text-gray-900 font-bold bg-white rounded-sm px-4 z-20 py-2 flex justify-center items-center transition-all duration-250">
                        {globalTranslate(`Global.routes.${page.text}`)}
                      </span>
                    </div>
                  </RouterLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  },
});
