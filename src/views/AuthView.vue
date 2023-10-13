<script setup lang="ts">
// import data from "@/animations/66291-meditative-business-man.json";
import { onBeforeMount, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { globalTranslate } from "@/utils/globalTranslate";
import { login } from "@/utils/Oauth";
// import { Vue3Lottie } from "vue3-lottie";

const checkForAuth = ref(
  useRouter().currentRoute.value.query.checkAuth === "true"
);
const shouldLogIn = ref(false);
const isflash = ref(false);

const User = reactive({
  username: "",
  email: "",
  password: "",
});

// const updateUserField = (field, value) => {
//   User[field] = typeof value === "number" ? JSON.stringify(value) : value;
// };

const router = useRouter();

const loginWithGoogle = () => {
  login();
};

const logIn = () => {
  if (User.username === "test") {
    router.push({ name: "Home" });
  }
};

// onBeforeMount(async () => {
//   const isAuthenticated = await getCurrentUser();
//   if (isAuthenticated) {
//     router.push({ name: 'Home' });
//     return;
//   }
//   shouldLogIn.value = true;
// });
</script>

<template>
  <main class="w-screen h-screen bg-white">
    <div class="w-full h-full flex justify-center items-center flex-col">
      <div
        :style="{
          gridTemplateColumns: checkForAuth && !shouldLogIn ? '1fr' : '1fr 1fr',
        }"
        class="w-full h-full grid gap-4 grid-rows-1 transition-all transform duration-200"
      >
        <div class="w-full h-full">
          <!-- <Vue3Lottie
            class="fill-gray-100"
            height="100%"
            width="100%"
            :animationData="data"
          /> -->
        </div>
        <div
          v-if="shouldLogIn"
          class="w-full h-full flex bg-gray-white flex-col justify-center items-center"
        >
          <div
            class="lg:w-1/2 w-full h-fit z-50 gap-3 flex flex-col bg-transparent p-4 min-w-[350px]"
          >
            <div class="w-full flex flex-col gap-2 pb-4">
              <h1 class="font-semibold text-4xl">Welcome 👋</h1>
              <h2 class="font-normal text-1xl">Log in with</h2>
            </div>
            <div class="w-full h-12">
              <button
                @click="loginWithGoogle"
                class="w-full h-12 flex gap-1 items-center justify-center rounded-[4px] border-2"
              >
                <UiIcon
                  :isStyled="false"
                  class="h-fit w-fit flex items-center justify-center scale-[0.6]"
                  name="Google"
                />
                Google
              </button>
            </div>
            <div
              class="w-full flex items-center justify-center h-fit my-1 text-gray-400"
            >
              or
            </div>
            <div
              class="h-full w-full grid grid-cols-1 grid-rows-[repeat(3,2.5rem)] gap-2"
            >
              <Input
                type="text"
                v-model="User.email"
                :placeHolder="globalTranslate('Auth.email')"
                :isEmpty="User.email !== '' && isflash"
              />
              <Input
                type="text"
                v-model="User.username"
                :placeHolder="globalTranslate('Auth.username')"
                :isEmpty="User.username !== '' && isflash"
              />
              <Input
                type="password"
                v-model="User.password"
                :placeHolder="globalTranslate('Auth.password')"
                :isEmpty="User.password !== '' && isflash"
              />
            </div>
            <div class="flex h-[2.5rem]">
              <Button @click="logIn">{{
                globalTranslate("Auth.title")
              }}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
