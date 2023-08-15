import type { clientT, clientState, updateClientT, newClientT } from "@/types";
import { saveFile } from "@/utils/fs";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";

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
        this.clients = await invoke("get_clients", { page: 1 });
      } catch (error) {
        console.log(error);
      }
    },
    getOneClient: async function (id: number) {
      this.client = this.clients.find((cli: clientT) => cli.id === id) ?? null;
      if (!this.client) {
        try {
          const client: clientT = await invoke("get_client", { id });
          this.client = client;
        } catch (error) {
          console.log(error);
        }
      }
    },
    createOneClient: async function (Client: newClientT) {
      try {
        let image: string = await saveFile(Client.image as string, "Image");
        await invoke("insert_client", { new_client: Client });
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
