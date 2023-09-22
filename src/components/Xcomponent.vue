<!-- we load all the components which slows the app  -->
<!-- looking for better ways using defineAsyncComponent -->
<!-- <script lang="ts">
import TranslationModal from "./TranslationModal.vue";
import InventoryCreate from "./InventoryCreate.vue";
import ProductCreate from "./ProductCreate.vue";
import ProductDelete from "./ProductDelete.vue";
import ProductUpdate from "./ProductUpdate.vue";
import InvoiceCreate from "./InvoiceCreate.vue";
import InvoiceDelete from "./InvoiceDelete.vue";
import InvoiceUpdate from "./InvoiceUpdate.vue";
import SellerCreate from "./SellerCreate.vue";
import SellerDelete from "./SellerDelete.vue";
import SellerUpdate from "./SellerUpdate.vue";
import ClientDelete from "./ClientDelete.vue";
import ClientUpdate from "./ClientUpdate.vue";
import ClientCreate from "./ClientCreate.vue";
import OrderCreate from "./OrderCreate.vue";
import OrderDelete from "./OrderDelete.vue";
import OrderUpdate from "./OrderUpdate.vue";
import CsvUploader from "./CsvUploader.vue";
import Sittings from "./Sittings.vue";
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
</script> -->

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import ModalLoading from "./ModalLoading.vue";
import Error from "./Error.vue";

const { name } = defineProps<{ name: string }>();

const component = defineAsyncComponent({
  loader: () => import(`../componentsx/${name}.vue`),
  loadingComponent: ModalLoading,
  errorComponent: Error,
});
</script>

<template>
  <component :is="component" />
</template>
