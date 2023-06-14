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
    createUser: async function (User: User) {
      try {
        await this.db.execute(
          "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
          [User.username, User.email, User.password]
        );
      } catch (error) {
        console.log(error);
      }
    },
    getUser: async function (email: string) {
      try {
        const res = await this.db.execute(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
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
