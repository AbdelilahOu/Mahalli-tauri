<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import type { InvoiceForCreateT } from "@/schemas/invoice.schema";
import type { Res } from "@/types";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();
const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const isLoading = ref<boolean>(false);
const invoice = reactive<InvoiceForCreateT>({
  clientId: "",
  paidAmount: 0,
  status: "",
  items: [
    {
      product_id: undefined,
      quantity: undefined,
      price: undefined,
    },
  ],
});

const addInvoiceItem = () => {
  invoice.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const deleteInvoiceItem = (index: number) => {
  invoice.items?.splice(index, 1);
};

const searchSuppliers = async (search: string | number) => {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_clients",
    {
      search,
    }
  );
  if (!res.error) {
    clients.value = res.data;
  }
};

const searchProducts = async (search: string | number) => {
  const res = await invoke<Res<{ label: string; value: string }[]>>(
    "search_products",
    {
      search,
    }
  );
  if (!res.error) {
    products.value = res.data;
  }
};

const createInvoice = async () => {
  isLoading.value = true;
  if (invoice?.clientId && invoice.items?.length !== 0) {
    try {
      const invoiceRes = await invoke<Res<string>>("create_invoice", {
        invoice: {
          client_id: invoice.clientId,
          status: invoice.status,
          paid_amount: invoice.paidAmount,
          items: invoice.items,
        },
      });
      //
      info(`CREATE INVOICE: ${JSON.stringify(invoice)}`);
      //
      toast.success(t("notifications.invoice.created"), {
        closeButton: true,
      });
      // toggle refresh
      updateQueryParams({
        refresh: "refresh-create-" + Math.random() * 9999,
      });
    } catch (err: any) {
      toast.error(t("notifications.error.title"), {
        description: t("notifications.error.description"),
        closeButton: true,
      });
      if (typeof err == "object" && "error" in err) {
        error("CREATE INVOICE: " + err.error);
        return;
      }
      error("CREATE INVOICE: " + err);
    } finally {
      isLoading.value = false;
      hideModal();
    }
    return;
  }

  isLoading.value = false;
};

const hideModal = () => toggleModal(false);
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 rounded-md relative h-fit z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle>
        {{ t("i.c.title") }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("g.fields.fullname") }}
            </Label>
            <SearchableItems
              :items="clients"
              @update:items="(s) => searchSuppliers(s)"
              @on:select="(id) => (invoice.clientId = id)"
            />
          </div>
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="status">
              {{ t("g.fields.status") }}
            </Label>
            <Select v-model="invoice.status">
              <SelectTrigger>
                <SelectValue
                  class="text-muted-foreground"
                  :placeholder="t('o.c.d.o.placeholder[2]')"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">
                  {{ t("g.status.paid") }}
                </SelectItem>
                <SelectItem value="CANCELED">
                  {{ t("g.status.canceled") }}
                </SelectItem>
                <SelectItem value="PENDING">
                  {{ t("g.status.pending") }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="status">
            {{ t("g.fields.paid") }}
          </Label>
          <Input v-model="invoice.paidAmount" placeholder="" type="number" />
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ t("i.c.d.i.add") }}
          </Button>
          <div
            class="w-full grid pt-1 grid-cols-[1fr_1fr_1fr_36px] items-center overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in invoice.items" :key="index">
              <SearchableItems
                :items="products"
                @update:items="(s) => searchProducts(s)"
                @on:select="
                  (id, price) => ((item.product_id = id), (item.price = price))
                "
              />
              <Input
                v-model="item.quantity"
                class="border-r-0"
                :placeholder="t('o.c.d.o.placeholder[0]')"
                type="number"
              >
                <template #unite> {{ t("g.fields.item") }} </template>
              </Input>
              <Input
                v-model="item.price"
                class="border-r-0"
                :placeholder="t('o.c.d.o.placeholder[1]')"
                type="number"
              >
                <template #unite> DH </template>
              </Input>
              <Trash2
                class="cursor-pointer m-auto"
                :size="20"
                @click="deleteInvoiceItem(index)"
              />
            </template>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" @click="hideModal">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="createInvoice()">
        {{ t("g.b.c") }}
      </Button>
    </CardFooter>
  </Card>
</template>
