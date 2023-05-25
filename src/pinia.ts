import type Database from "tauri-plugin-sql-api";
import database from "@/database/db";
import { createPinia } from "pinia";

const pinia = createPinia();

// pinia.use(({ store }) => {
//   database()
//     .then((dbObject) => (store.db = dbObject.db))
//     .catch((er) => console.log(er));
// });

// declare module "pinia" {
//   interface PiniaCustomProperties {
//     db: Database;
//   }
// }

export default pinia;
