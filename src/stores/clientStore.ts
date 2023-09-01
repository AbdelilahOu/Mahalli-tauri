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
    getAllClients: async function () {},
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
    createOneClient: async function (client: newClientT) {
      try {
        let image: string = await saveFile(client.image as string, "Image");
        await invoke("insert_client", { client });
        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneClient: async function (id: number) {
      try {
        await invoke("delete_client", { id });

        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneClient: async function (id: number, client: updateClientT) {
      try {
        await invoke("update_client", { client, id });

        this.getAllClients();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
