import { globalTranslate } from "@/utils/globalTranslate";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import { defineComponent, onMounted } from "vue";
import { RouterLink } from "vue-router";
import {invoke} from "@tauri-apps/api"
import { open } from "@tauri-apps/api/dialog";

export const HomeView = defineComponent({
  name: "Home",
  components: { UiButton, UiInput },
  setup() {
    const Pages: { image: string; text: string; path: string }[] = [
      {
        image: "/clients.jpg",
        text: "Clients",
        path: "/Clients/all",
      },
      {
        image: "/products.jpg",
        text: "Products",
        path: "/Products",
      },
      {
        image: "/sellers.jpeg",
        text: "Sellers",
        path: "/Sellers/all",
      },
      {
        image: "/orders.jpg",
        text: "Orders",
        path: "/Orders/all",
      },
      {
        image: "/invoices.jpg",
        text: "Invoices",
        path: "/Invoices/all",
      },
      {
        image: "/stock.jpg",
        text: "Stock",
        path: "/Stocks",
      },
      {
        image: "/stats.jpg",
        text: "Statistics",
        path: "/Stats",
      },
      {
        image: "/credi.webp",
        text: "Payment",
        path: "/Payment",
      },
    ];


    onMounted(async ()=>{

      const a = await open({
        multiple: false,
      });

    console.log(
      await invoke("command_name", {
        csvPath: String(
          a
        ),
      })
    );
    })


    return () => (
      <main class="w-full h-full px-3">
        <div class="w-full h-full flex justify-center items-center flex-col">
          <div class="grid grid-rows-[1fr_46px] max-w-3xl max-h-[48rem] w-full h-full grid-cols-[1fr_48px]">
            <div class="md:h-[700px] w-full h-full p-3 gap-3 grid-cols-3 grid-rows-3 grid">
              {Pages.map((page, index) => (
                <div v-fade={index + 1} class="w-full h-full">
                  <RouterLink to={page.path}>
                    <div class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-md items-center bg-gray-400">
                      <img
                        class="absolute top-0 left-0 w-full opacity-20 group-hover:opacity-60 h-full transition-all duration-250"
                        src={page.image}
                        alt=""
                      />
                      <span class="text-center text-xl text-gray-900 font-bold bg-white rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250">
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
