import { globalTranslate } from "@/utils/globalTranslate";
import { UiButton } from "@/components/ui/UiButton";
import { UiInput } from "@/components/ui/UiInput";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Vue3Lottie } from "vue3-lottie";
import data from "@/animations/66291-meditative-business-man.json";
export const AuthView = defineComponent({
  name: "Auth",
  components: { UiButton, UiInput, Vue3Lottie },
  setup() {
    const correctLogIn: [string, string] = ["stockmanagement", "12345"];
    const isflash = ref<boolean>(false);

    const User = reactive({
      username: "",
      email: "",
      password: "",
    });

    const router = useRouter();
    const LogIn = () => {
      if (User.username == "test") return router.push({ name: "Home" });
      isflash.value = true;
      if (User.password == correctLogIn[1]) {
        router.push({ name: "Home" });
        return;
      }
      setTimeout(() => {
        isflash.value = false;
      }, 1000);
    };
    return () => (
      <main class="w-screen h-screen bg-white">
        <div class="w-full h-full flex justify-center items-center flex-col">
          <div class="w-full h-full grid grid-cols-2 gap-4 grid-rows-1">
            <div class="w-full h-full">
              <Vue3Lottie
                class="fill-gray-100"
                height="100%"
                width="100%"
                animationData={data}
              />
            </div>
            <div class="w-full h-full flex bg-gray-white flex-col justify-center items-center">
              <div class="lg:w-1/2 w-full h-fit z-50 gap-3 flex flex-col bg-transparent p-2 min-w-[350px]">
                <h1 class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center">
                  {globalTranslate("Auth.title")}
                </h1>
                <div class="h-full w-full flex flex-col gap-2">
                  <UiInput
                    Type="text"
                    PlaceHolder={globalTranslate("Auth.email")}
                    IsEmpty={User.email !== correctLogIn[0] && isflash.value}
                    OnInputChange={(input) =>
                      (User.email =
                        typeof input == "number"
                          ? JSON.stringify(input)
                          : input)
                    }
                  />
                  <UiInput
                    Type="text"
                    PlaceHolder={globalTranslate("Auth.username")}
                    IsEmpty={User.username !== correctLogIn[0] && isflash.value}
                    OnInputChange={(input) =>
                      (User.username =
                        typeof input == "number"
                          ? JSON.stringify(input)
                          : input)
                    }
                  />
                  <UiInput
                    Type="password"
                    PlaceHolder={globalTranslate("Auth.password")}
                    IsEmpty={User.password !== correctLogIn[1] && isflash.value}
                    OnInputChange={(input) =>
                      (User.password =
                        typeof input == "number"
                          ? JSON.stringify(input)
                          : input)
                    }
                  />
                </div>
                <div class="flex">
                  <UiButton colorTheme="a" Click={() => LogIn()}>
                    {globalTranslate("Auth.title")}
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  },
});
