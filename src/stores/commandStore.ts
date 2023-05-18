import type { commandState, newCommandT, updateCommandT } from "@/types";
import { commandDetailsJoins, commandsJoins } from "@/constants/dbQueryJson";
import { defineStore } from "pinia";
import database from "@/database/db";

export const useCommandStore = defineStore("CommandStore", {
  state: (): commandState => {
    return {
      commands: [],
      command: null,
    };
  },
  actions: {
    getAllCommands: async function () {
      try {
        const { db } = await database();
        const result = (await db.select(commandsJoins)) as { data: string }[];
        this.commands = result.map((c) => JSON.parse(c.data));
      } catch (error) {
        console.log(error);
      }
    },
    getOneCommand: async function (id: number) {
      try {
        const { db } = await database();

        const result = (await db.select(commandDetailsJoins, [id])) as any[];

        this.command = JSON.parse(result[0].data);
      } catch (error) {
        console.log(error);
      }
    },
    createOneCommand: async function (Command: newCommandT) {
      try {
        const { db } = await database();
        const { seller_id, status, commandItems } = Command;
        await db.execute(
          "INSERT INTO commands (seller_id,status) VALUES ($1,$2)",
          [seller_id, status]
        );
        const id: { id: number }[] = await db.select(
          "SELECT max(id) as id FROM commands"
        );
        for await (const { quantity, product_id, price } of commandItems) {
          await db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [quantity, "IN", product_id]
          );
          const stock_id: { id: number }[] = await db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );
          await db.execute(
            "INSERT INTO command_items (quantity,product_id,command_id,stock_id,price) VALUES ($1,$2,$3,$4,$5)",
            [quantity, product_id, id[0].id, stock_id[0].id, price]
          );
        }
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneCommand: async function (id: number, Command: updateCommandT) {
      try {
        const { db } = await database();
        const { status, seller_id, commandItems } = Command;
        await db.execute(
          "UPDATE commands SET status = $1 , seller_id = $2 WHERE id = $3",
          [status, seller_id, id]
        );
        for await (const item of commandItems) {
          if (item.id) {
            await db.execute(
              "UPDATE command_items SET product_id = $1 , quantity = $2 ,price = $3 WHERE id = $4",
              [item.product_id, item.quantity, item.price, item.id]
            );
            await db.execute(
              "UPDATE stock_mouvements SET quantity = $1 WHERE id = $2",
              [item.quantity, item.stock_id]
            );
            continue;
          }
          await db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [item.quantity, "IN", item.product_id]
          );
          const stock_id: { id: number }[] = await db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );
          await db.execute(
            "INSERT INTO command_items (quantity,product_id,command_id,stock_id,price) VALUES ($1,$2,$3,$4,$5)",
            [item.quantity, item.product_id, id, stock_id[0].id, item.price]
          );
        }
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneCommand: async function (id: number) {
      try {
        const { db } = await database();
        await db.execute("DELETE FROM commands WHERE id = $1", [id]);
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneCommandItem: async function (id: number) {
      try {
        const { db } = await database();
        await db.execute("DELETE FROM command_items WHERE id = $1", [id]);
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
