import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import data from "@/animations/66291-meditative-business-man.json";
import { globalTranslate } from "@/utils/globalTranslate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UiIcon from "@/components/ui/UiIcon.vue";
import { getCurrentUser } from "vuefire";
import { Vue3Lottie } from "vue3-lottie";
import { useRouter } from "vue-router";
import { login } from "@/utils/Oauth";
// import { useUserStore } from "@/stores/userStore";

export const AuthView = defineComponent({
  name: "Auth",
  components: { Button, Input, Vue3Lottie, UiIcon },
  setup() {
    const checkForAuth = ref(
      useRouter().currentRoute.value.query.checkAuth === "true"
    );

    const shouldLogIn = ref(false);

    onBeforeMount(async () => {
      const isAuthenticated = await getCurrentUser();
      if (isAuthenticated) {
        // useUserStore().setUser(isAuthenticated);
        router.push({ name: "Home" });
        return;
      }
      shouldLogIn.value = true;
    });

    const isflash = ref<boolean>(false);

    const User = reactive({
      username: "",
      email: "",
      password: "",
    });

    const router = useRouter();

    const LogIn = () => {
      if (User.username == "test") return router.push({ name: "Home" });
      // isflash.value = true;
      // if (User.password == correctLogIn[1]) {
      //   router.push({ name: "Home" });
      //   return;
      // }
      // setTimeout(() => {
      //   isflash.value = false;
      // }, 1000);
    };
    return () => (
      <main class="w-screen h-screen bg-white">
        <div class="w-full h-full flex justify-center items-center flex-col">
          <div
            style={{
              gridTemplateColumns:
                checkForAuth.value && !shouldLogIn.value ? "1fr" : "1fr 1fr",
            }}
            class="w-full h-full grid gap-4 grid-rows-1 transition-all transform duration-200"
          >
            <div class="w-full h-full">
              <Vue3Lottie
                class="fill-gray-100"
                height="100%"
                width="100%"
                animationData={data}
              />
            </div>
            {shouldLogIn.value ? (
              <div
                v-fade={2}
                class="w-full h-full flex bg-gray-white flex-col justify-center items-center"
              >
                <div class="lg:w-1/2 w-full h-fit z-50 gap-3 flex flex-col bg-transparent p-4 min-w-[350px]">
                  <div class="w-full flex flex-col gap-2 pb-4">
                    <h1 class="font-semibold text-4xl">Welcome 👋</h1>
                    <h2 class="font-normal text-1xl">Log in with</h2>
                  </div>
                  <div class="w-full h-12">
                    <button
                      onClick={() => login()}
                      class="w-full h-12 flex gap-1 items-center justify-center rounded-[4px] border-2"
                    >
                      <UiIcon
                        IsStyled={false}
                        Class="h-fit w-fit flex items-center justify-center scale-[0.6]"
                        name="Google"
                      />
                      Google
                    </button>
                  </div>
                  <div class="w-full flex items-center justify-center h-fit my-1 text-gray-400">
                    or
                  </div>
                  <div class="h-full w-full grid grid-cols-1 grid-rows-[repeat(3,2.5rem)] gap-2">
                    <Input
                      type="text"
                      placeHolder={globalTranslate("Auth.email")}
                      IsEmpty={User.email !== "" && isflash.value}
                      OnInputChange={(input) =>
                        (User.email =
                          typeof input == "number"
                            ? JSON.stringify(input)
                            : input)
                      }
                    />
                    <Input
                      type="text"
                      placeHolder={globalTranslate("Auth.username")}
                      IsEmpty={User.username !== "" && isflash.value}
                      OnInputChange={(input) =>
                        (User.username =
                          typeof input == "number"
                            ? JSON.stringify(input)
                            : input)
                      }
                    />
                    <Input
                      type="password"
                      placeHolder={globalTranslate("Auth.password")}
                      IsEmpty={User.password !== "" && isflash.value}
                      OnInputChange={(input) =>
                        (User.password =
                          typeof input == "number"
                            ? JSON.stringify(input)
                            : input)
                      }
                    />
                  </div>
                  <div class="flex h-[2.5rem]">
                    <Button onClick={() => LogIn()}>
                      {globalTranslate("Auth.title")}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </main>
    );
  },
});
