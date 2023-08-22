import { orderDetailsJoins, ordersJoins } from "@/database/dbQueryJson";
import type { orderState, newOrdersT, updateOrdersT } from "@/types";
import { defineStore } from "pinia";

export const useOrdersStore = defineStore("OrdersStore", {
  state: (): orderState => {
    return {
      orders: [],
      order: null,
    };
  },
  actions: {
    getAllOrders: async function () {
      try {
        const result = (await this.db.select(ordersJoins)) as {
          data: string;
        }[];
        this.orders = result.map((c) => JSON.parse(c.data));
      } catch (error) {
        console.log(error);
      }
    },
    getOneOrders: async function (id: number) {
      try {
        const result = (await this.db.select(orderDetailsJoins, [id])) as any[];
        this.order = JSON.parse(result[0].data);
      } catch (error) {
        console.log(error);
      }
    },
    createOneOrders: async function (Orders: newOrdersT) {
      try {
        const { seller_id, status, orderItems } = Orders;

        await this.db.execute(
          "INSERT INTO orders (seller_id,status) VALUES ($1,$2)",
          [seller_id, status]
        );
        const id: { id: number }[] = await this.db.select(
          "SELECT max(id) as id FROM orders"
        );
        for await (const { quantity, product_id, price } of orderItems) {
          await this.db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [quantity, "IN", product_id]
          );
          const inventory_id: { id: number }[] = await this.db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );

          await this.db.execute(
            "INSERT INTO order_items (quantity,product_id,order_id,inventory_id,price) VALUES ($1,$2,$3,$4,$5)",
            [quantity, product_id, id[0].id, inventory_id[0].id, price]
          );
        }
        this.getAllOrders();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneOrders: async function (id: number, Orders: updateOrdersT) {
      try {
        const { status, seller_id, orderItems } = Orders;

        await this.db.execute(
          "UPDATE orders SET status = $1 , seller_id = $2 WHERE id = $3",
          [status, seller_id, id]
        );
        for await (const item of orderItems) {
          if (item.id) {
            await this.db.execute(
              "UPDATE order_items SET product_id = $1 , quantity = $2 ,price = $3 WHERE id = $4",
              [item.product_id, item.quantity, item.price, item.id]
            );

            await this.db.execute(
              "UPDATE stock_mouvements SET quantity = $1 WHERE id = $2",
              [item.quantity, item.inventory_id]
            );
            continue;
          }

          await this.db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [item.quantity, "IN", item.product_id]
          );
          const inventory_id: { id: number }[] = await this.db.select(
            "SELECT max(id) as id FROM stock_mouvements"
          );

          await this.db.execute(
            "INSERT INTO order_items (quantity,product_id,order_id,inventory_id,price) VALUES ($1,$2,$3,$4,$5)",
            [item.quantity, item.product_id, id, inventory_id[0].id, item.price]
          );
        }
        this.getAllOrders();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrders: async function (id: number) {
      try {
        await this.db.execute("DELETE FROM orders WHERE id = $1", [id]);
        this.getAllOrders();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneOrdersItem: async function (id: number) {
      try {
        await this.db.execute("DELETE FROM order_items WHERE id = $1", [id]);
        this.getAllOrders();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
