import type {
  productT,
  productState,
  newProductT,
  updateProductT,
} from "@/types";
import { defineStore } from "pinia";
import database from "@/database/db";

export const useProductStore = defineStore("ProductStore", {
  state: (): productState => {
    return {
      products: [],
    };
  },
  actions: {
    getAllProducts: async function () {
      try {
        const { db } = await database();
        const allProducts: productT[] = await db.select(
          "SELECT products.* FROM products ORDER BY id DESC"
        );
        const productStock: { quantity: number; product_id: number }[] =
          await db.select(
            "SELECT stock_mouvements.quantity,stock_mouvements.product_id FROM stock_mouvements"
          );

        this.products = allProducts.map((product) => ({
          ...product,
          quantity: productStock
            .filter((stock) => stock.product_id == product.id)
            .reduce((a, b) => a + b.quantity, 0),
        }));
      } catch (error) {
        console.log(error);
      }
    },
    createOneProduct: async function (Product: newProductT) {
      try {
        const { db } = await database();
        const { name, description, price, tva } = Product;

        await db.execute(
          "INSERT INTO products (name,description,price,tva) VALUES ($1,$2,$3,$4)",
          [name, description, price, tva]
        );
        const id: { id: number }[] = await db.select(
          "SELECT max(id) as id FROM products"
        );

        await db.execute(
          "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
          [Product.quantity, "IN", id[0].id]
        );
        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
    updateOneProduct: async function (id: number, Product: updateProductT) {
      try {
        const { db } = await database();
        const { name, tva, price, description } = Product;

        await db.execute(
          "UPDATE products SET name = $1,tva = $2,price = $3,description = $4 WHERE id = $5",
          [name, tva, price, description, id]
        );
        if (Product?.quantity && Product.quantity > 0) {
          await db.execute(
            "INSERT INTO stock_mouvements (quantity,model,product_id) VALUES ($1,$2,$3)",
            [Product.quantity, "IN", id]
          );
        }
        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
    deleteOneProduct: async function (id: number) {
      try {
        const { db } = await database();

        await db.execute("DELETE FROM products WHERE id = $1", [id]);
        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
