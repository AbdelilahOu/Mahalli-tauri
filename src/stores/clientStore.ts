import type { clientT, clientState, updateClientT, newClientT } from "@/types";
import { saveFile } from "@/utils/fs";
import { defineStore } from "pinia";
// import database from "@/database/db";

export const useClientStore = defineStore("ClientStore", {
  state: (): clientState => {
    return {
      clients: [],
      client: null,
    };
  },
  actions: {
    getAllClients: async function () {
      try {
        const allClients: clientT[] = await this.db.select(
          "SELECT * FROM clients ORDER BY id DESC"
        );
        this.clients = allClients;
      } catch (error) {
        console.log(error);
      }
    },
    getOneClient: async function (id: number) {
      this.client = this.clients.find((cli: clientT) => cli.id === id) ?? null;
      if (!this.client) {
        try {
          const client: clientT = await this.db.select(
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
        let image: string = await saveFile(Client.image as string, "Image");
        await this.db.execute(
          "INSERT INTO clients (name,email,phone,address,image) VALUES ($1,$2,$3,$4,$5)",
          [Client.name, Client.email, Client.phone, Client.address, image]
        );
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneClient: async function (id: number) {
      try {
        await this.db.execute("DELETE FROM clients WHERE id = $1", [id]);
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneClient: async function (id: number, Client: updateClientT) {
      try {
        await this.db.execute(
          "UPDATE clients SET name = $1,email = $2,phone = $3,address = $4 WHERE id = $5",
          [Client.name, Client.email, Client.phone, Client.address, Client.id]
        );
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
