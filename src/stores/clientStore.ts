import type { clientT, clientState, updateClientT, newClientT } from "@/types";
import database from "@/database/db";
import { defineStore } from "pinia";
export const useClientStore = defineStore("ClientStore", {
  state: (): clientState => {
    return {
      clients: [],
      client: null,
    };  
  },
  actions: {
    getAllClients: async function () {
      const { db } = await database();
      try {
        const allClients: clientT[] = await db.select(
          "SELECT * FROM clients ORDER BY id DESC"
        );
        this.clients = allClients;
      } catch (error) {
        console.log(error);
      }
    },
    getOneClient: async function (id: number) {
      this.client = this.clients.find((cli) => cli.id === id) ?? null;
      if (!this.client) {
        try {
          const { db } = await database();
          const client: clientT = await db.select(
            "SELECT * FROM clients WHERE id = $1",
            [id]
          );
          this.client = client;
        } catch (error) {
          console.log(error);
        }
      }
    },
    createOneClient: async function (Client: newClientT) {
      try {
        const { db } = await database();
        await db.execute(
          "INSERT INTO clients (name,email,phone,addresse) VALUES ($1,$2,$3,$4)",
          [Client.name, Client.email, Client.phone, Client.addresse]
        );
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneClient: async function (id: number) {
      try {
        const { db } = await database();
        await db.execute("DELETE FROM clients WHERE id = $1", [id]);
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneClient: async function (id: number, Client: updateClientT) {
      try {
        const { db } = await database();
        await db.execute(
          "UPDATE clients SET name = $1,email = $2,phone = $3,addresse = $4 WHERE id = $5",
          [Client.name, Client.email, Client.phone, Client.addresse, Client.id]
        );
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
