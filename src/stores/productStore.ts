import { selectProductsWithQuantity } from "@/database/dbQueryJson";
import type { productState, newProductT, updateProductT } from "@/types";
import { defineStore } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  state: (): productState => {
    return {
      products: [],
    };
  },
  actions: {
    getAllProducts: async function () {
      try {
        this.products = await this.db.select(selectProductsWithQuantity);
      } catch (error) {
        console.log(error);
      }
    },
    createOneProduct: async function (Product: newProductT) {
      try {
        const { name, description, price, tva } = Product;

        await this.db.execute(
          "INSERT INTO products (name,description,price,tva) VALUES ($1,$2,$3,$4)",
          [name, description, price, tva]
        );
        const id: { id: number }[] = await this.db.select(
          "SELECT max(id) as id FROM products"
        );

        await this.db.execute(
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
        const { name, tva, price, description } = Product;

        await this.db.execute(
          "UPDATE products SET name = $1,tva = $2,price = $3,description = $4 WHERE id = $5",
          [name, tva, price, description, id]
        );
        if (Product?.quantity && Product.quantity > 0) {
          await this.db.execute(
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
        await this.db.execute("DELETE FROM products WHERE id = $1", [id]);
        this.getAllProducts();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
