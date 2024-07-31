<script setup lang="ts">
import type { InvoiceForUpdateT } from "@/schemas/invoice.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Trash2 } from "lucide-vue-next";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const clients = ref<{ label: string; value: string }[]>([]);
const products = ref<{ label: string; value: string }[]>([]);
const invoice = reactive<InvoiceForUpdateT>({
  id: "",
  clientId: "",
  paidAmount: 0,
  fullname: "",
  createdAt: "",
  status: "",
  items: [],
});

const props = defineProps<{
  id: string;
  identifier: string;
}>();

onBeforeMount(async () => {
  // @ts-ignore
  const res = await invoke<Res<InvoiceForUpdateT>>("get_invoice", {
    id: props.id,
  });

  if (!res.error) {
    invoice.id = res.data.id;
    invoice.clientId = res.data.clientId;
    invoice.paidAmount = res.data.paidAmount;
    invoice.createdAt = res.data.createdAt;
    invoice.status = res.data.status;
    invoice.fullname = res.data.fullname;
    invoice.items = res.data.items;
  }
});

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

const addInvoiceItem = () => {
  invoice.items?.push({
    product_id: undefined,
    quantity: undefined,
    price: undefined,
  });
};

const updateTheInvoices = async () => {
  try {
    await invoke<Res<string>>("update_invoice", {
      invoice: {
        id: invoice.id,
        client_id: invoice.clientId,
        status: invoice.status,
        paid_amount: invoice.paidAmount,
        items: invoice.items,
      },
    });
    //
    info(`UPDATE INVOICE: ${JSON.stringify(invoice)}`);
    //
    toast.success(t("notifications.invoice.updated"), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    if (typeof err == "object" && "error" in err) {
      error("UPDATE INVOICE: " + err.error);
      return;
    }
    error("UPDATE INVOICE: " + err);
  } finally {
    close();
  }
};

async function deleteOneInvoiceItem(id: string) {
  try {
    await invoke("delete_inventory", { id });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("ERROR DELETE INVOICE ITEM: " + err.error);
      return;
    }
  }
}

const deleteInvoiceItem = (index: number) => {
  const item = invoice.items?.splice(index, 1)[0];
  if (item?.inventory_id) deleteOneInvoiceItem(item.inventory_id);
};
</script>

<template>
  <Card
    class="w-5/6 lg:w-1/2 relative h-fit rounded-md z-50 gap-3 flex flex-col bg-white min-w-[350px]"
  >
    <CardHeader>
      <CardTitle> {{ t("i.u.title") }} N° {{ identifier }} </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-full w-full grid grid-cols-1 gap-2">
        <div class="flex w-full h-fit gap-1">
          <div class="w-full h-full flex flex-col gap-1">
            <Label for="client_id">
              {{ t("g.fields.fullname") }}
            </Label>
            <SearchableItems
              v-if="invoice.fullname"
              :default-value="invoice.fullname"
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
                <SelectItem value="DRAFT">
                  {{ t("g.status.draft") }}
                </SelectItem>
                <SelectItem value="SENT">
                  {{ t("g.status.sent") }}
                </SelectItem>
                <SelectItem value="PAID">
                  {{ t("g.status.paid") }}
                </SelectItem>
                <SelectItem value="PARTIALLY_PAID">
                  {{ t("g.status.partially_paid") }}
                </SelectItem>
                <SelectItem value="OVERDUE">
                  {{ t("g.status.overdue") }}
                </SelectItem>
                <SelectItem value="CANCELLED">
                  {{ t("g.status.cancelled") }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="w-full h-full flex flex-col gap-1">
          <Label for="paid">
            {{ t("g.fields.paid") }}
          </Label>
          <Input v-model="invoice.paidAmount" placeholder="" type="number" />
        </div>
        <Separator />
        <div class="w-full h-full flex flex-col gap-1">
          <Button @click="addInvoiceItem">
            {{ t("i.u.d.i.add") }}
          </Button>
          <div
            class="w-full pt-1 grid items-center grid-cols-[1fr_1fr_1fr_36px] overflow-auto scrollbar-thin scrollbar-thumb-transparent max-h-64 gap-1"
          >
            <template v-for="(item, index) in invoice.items" :key="index">
              <SearchableItems
                :default-value="item.name"
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
      <Button variant="outline" @click="close">
        {{ t("g.b.no") }}
      </Button>
      <Button class="col-span-2" @click="updateTheInvoices">
        {{ t("g.b.d") }}
      </Button>
    </CardFooter>
  </Card>
</template>
