import type {
  commandState,
  commandT,
  newCommandT,
  updateCommandT,
  commandItemT,
  sellerT,
  commandDetailsItemsT,
  productT,
} from "@/types";
import { formatDate } from "@/utils/formatDate";
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
      const { db } = await database();
      try {
        const commands: commandT[] = await db.select(
          "SELECT * FROM commands ORDER BY id DESC"
        );
        // console.log(commands);
        const commandsItems: commandItemT[] = await db.select(
          "SELECT * FROM command_items"
        );
        this.commands = commands.map((command) => ({
          ...command,
          commandItems: commandsItems.filter(
            (items) => items.command_id === command.id
          ),
          created_at: formatDate(command.created_at),
        }));
        console.log(this.commands);
      } catch (error) {
        console.log(error);
      }
    },
    getOneCommand: async function (id: number) {
      const { db } = await database();
      try {
        const command: commandT[] = await db.select(
          "SELECT * FROM commands WHERE id = $1",
          [id]
        );
        const seller: sellerT[] = await db.select(
          "SELECT * FROM sellers WHERE id = $1",
          [command[0].seller_id]
        );
        let commandItems: commandDetailsItemsT[] = await db.select(
          "SELECT * FROM command_items WHERE command_id = $1",
          [id]
        );
        for await (const item of commandItems) {
          let product: productT[] = await db.select(
            "SELECT * FROM products WHERE id = $1",
            [item.product_id]
          );
          commandItems[commandItems.indexOf(item)]["product"] = product[0];
        }
        this.command = {
          ...command[0],
          seller: seller[0],
          commandItems,
        };
      } catch (error) {
        console.log(error);
      }
    },
    createOneCommand: async function (Command: newCommandT) {
      const { db } = await database();
      try {
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
      const { db } = await database();
      try {
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
      const { db } = await database();
      try {
        await db.execute("DELETE FROM commands WHERE id = $1", [id]);
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneCommandItem: async function (id: number) {
      const { db } = await database();
      try {
        await db.execute("DELETE FROM command_items WHERE id = $1", [id]);
        this.getAllCommands();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
