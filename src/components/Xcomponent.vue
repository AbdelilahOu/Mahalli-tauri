<!-- we load all the components which slows the app  -->
<!-- looking for better ways using defineAsyncComponent -->
<script lang="ts">
import { TranslationModal } from "./TranslationModal";
import { OrderCreate } from "./OrderCreate";
import { OrderDelete } from "./OrderDelete";
import { OrderUpdate } from "./OrderUpdate";
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
import { StockCreate } from "./StockCreate";
import { PaymentCreate } from "./PaymentCreate";
import { PaymentDelete } from "./PaymentDelete";
import { CsvUploader } from "./CsvUploader";
export default {
  components: {
    TranslationModal,
    OrderCreate,
    OrderDelete,
    OrderUpdate,
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
    StockCreate,
    PaymentCreate,
    PaymentDelete,
    CsvUploader,
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
