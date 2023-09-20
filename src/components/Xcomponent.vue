<!-- we load all the components which slows the app  -->
<!-- looking for better ways using defineAsyncComponent -->
<script lang="ts">
import { TranslationModal } from "./TranslationModal";
import { InventoryCreate } from "./InventoryCreate";
import { ProductCreate } from "./ProductCreate";
import { ProductDelete } from "./ProductDelete";
import { ProductUpdate } from "./ProductUpdate";
import { InvoiceCreate } from "./InvoiceCreate";
import { InvoiceDelete } from "./InvoiceDelete";
import { InvoiceUpdate } from "./InvoiceUpdate";
import { SellerCreate } from "./SellerCreate";
import { SellerDelete } from "./SellerDelete";
import { SellerUpdate } from "./SellerUpdate";
import { ClientDelete } from "./ClientDelete";
import { ClientUpdate } from "./ClientUpdate";
import { ClientCreate } from "./ClientCreate";
import { OrderCreate } from "./OrderCreate";
import { OrderDelete } from "./OrderDelete";
import { OrderUpdate } from "./OrderUpdate";
import { CsvUploader } from "./CsvUploader";
import { Sittings } from "./Sittings";
export default {
  components: {
    TranslationModal,
    InventoryCreate,
    ProductUpdate,
    ProductDelete,
    ProductCreate,
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceDelete,
    SellerCreate,
    SellerDelete,
    SellerUpdate,
    ClientDelete,
    ClientUpdate,
    ClientCreate,
    OrderCreate,
    OrderDelete,
    OrderUpdate,
    CsvUploader,
    Sittings,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return {
      name: props.name,
    };
  },
};
</script>

<template>
  <component :is="name" />
</template>
