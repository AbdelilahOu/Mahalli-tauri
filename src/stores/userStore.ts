import { invoke } from "@tauri-apps/api";
import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      User: null,
    } as { User: any | null };
  },
  actions: {
    setUser: function (user: any) {
      this.User = user;
    },
    createUser: async function (user: User) {
      try {
        await invoke("insert_user", {
          user,
        });
      } catch (error) {
        console.log(error);
      }
    },
    getUser: async function (email: string) {
      try {
        const res = await invoke("get_user", { email });
        return res;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

interface User {
  username: string;
  email: string;
  password: string;
}
