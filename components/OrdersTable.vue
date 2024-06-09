<script setup lang="ts">
import type {
  OrderForUpdateT,
  OrderProductT,
  OrderT,
} from "@/schemas/order.schema";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import {
  FilePenLine,
  Printer,
  Trash2,
  GripHorizontal,
  NotepadText,
} from "lucide-vue-next";
import type { Res } from "@/types";
import { toast } from "vue-sonner";
//@ts-ignore
import { NuxtLink } from "#components";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t, d } = useI18n();
const localePath = useLocalePath();

defineProps<{ orders: OrderT[]; orderProducts: OrderProductT[] }>();
const emits = defineEmits<{
  (e: "listOrderProducts", id?: string): void;
}>();

const STATUS_COLORS = {
  CANCELED: "bg-red-100 border-red-500 text-red-900",
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  DELIVERED: "bg-green-100 border-green-500 text-green-900",
} as const;

let previewProductsTimer: any;
const previewProducts = (id: string) => {
  clearTimeout(previewProductsTimer);
  previewProductsTimer = setTimeout(() => {
    emits("listOrderProducts", id);
  }, 400);
};
const cancelPreviewProducts = () => clearTimeout(previewProductsTimer);

const toggleThisOrders = (Order: OrderT, name: string) => {
  updateQueryParams({
    id: Order.id,
  });
  store.setters.updateStore({ key: "name", value: name });
  store.setters.updateStore({ key: "show", value: true });
};

const updateOrderStatus = async (order: any) => {
  try {
    await invoke("update_order", {
      order,
    });
    //
    info(`UPDATE ORDER STATUS: ${JSON.stringify(order)}`);
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("UPDATE ORDER STATUS: " + err);
  }
};

const createInvoiceFromOrder = async (id: string) => {
  try {
    const res = await invoke<Res<OrderForUpdateT>>("get_order", {
      id: id,
    });
    if (!res.error) {
      const invoiceRes = await invoke<Res<String>>("create_invoice", {
        invoice: {
          client_id: res.data.clientId,
          status: "PAID",
          paid_amount: 0,
          order_id: id,
        },
      });
      //
      for await (const item of res.data.items) {
        const invRes = await invoke<Res<string>>("create_inventory", {
          mvm: {
            mvm_type: "OUT",
            product_id: item.product_id,
            quantity: item.quantity,
          },
        });

        await invoke<Res<string>>("create_invoice_item", {
          item: {
            invoice_id: invoiceRes.data,
            inventory_id: invRes.data,
            price: item.price,
          },
        });
      }
      info(`CREATE INVOICE FROM ORDER: ${id}`);
      //
      toast.success(t("notifications.invoice.created"), {
        closeButton: true,
        description: h(NuxtLink, {
          to: localePath("/invoices/?page=1&id=" + invoiceRes.data),
          class: "underline",
          innerHTML: "go to invoice",
        }),
      });
    }
  } catch (err: any) {
    error("GET ORDER FOR INVOICE: " + err);
  }
};
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.items") }}</th>
          <th class="small">{{ t("g.fields.status") }}</th>
          <th>{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th class="small">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in orders"
          v-fade="index"
          :key="order.id"
          :class="{ 'animate-highlight-row': order.id == $route.query.id }"
        >
          <td class="p-2">
            <NuxtLink
              class="font-medium"
              :to="{
                path: '/clients/' + order.clientId,
              }"
            >
              {{ order.fullname }}
            </NuxtLink>
          </td>
          <td class="p-2">
            <Popover v-if="order.products && order.products > 0">
              <PopoverTrigger as-child>
                <Button
                  @mouseenter.passive="previewProducts(order.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                >
                  {{ t("g.plrz.p", { n: order.products }) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="min-w-[13rem] p-2">
                <table class="w-full not-default">
                  <thead>
                    <tr>
                      <th v-for="index in 3" :key="index"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(orderProduct, index) in orderProducts"
                      :key="index"
                      class="space-y-1 text-sm flex justify-between w-full items-center"
                    >
                      <td class="underline w-1/2">{{ orderProduct.name }}</td>
                      <td class="w-1/4 text-end">
                        {{ orderProduct.price }} Dh
                      </td>
                      <td class="w-1/4 text-slate-700 text-end">
                        <i> x{{ orderProduct.quantity }} </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </PopoverContent>
            </Popover>
            <template v-else>
              {{ t("g.plrz.p", { n: order.products }) }}
            </template>
          </td>
          <td class="p-2">
            <Popover>
              <PopoverTrigger as-child>
                <Badge
                  variant="outline"
                  :class="
                    cn(
                      'cursor-pointer whitespace-nowrap',
                      STATUS_COLORS[order.status]
                    )
                  "
                >
                  {{ t(`g.status.${order.status.toLowerCase()}`) }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-40 p-1 flex flex-col gap-1">
                <Button
                  type="button"
                  @click="
                    () =>
                      updateOrderStatus({
                        id: order.id,
                        client_id: order.clientId,
                        status: 'DELIVERED',
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-green-100 w-full border-green-500 text-green-900"
                >
                  {{ t(`g.status.delivered`) }}
                </Button>
                <Button
                  type="button"
                  @click="
                    () =>
                      updateOrderStatus({
                        id: order.id,
                        client_id: order.clientId,
                        status: 'PENDING',
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-yellow-100 w-full border-yellow-500 text-yellow-900"
                >
                  {{ t(`g.status.pending`) }}
                </Button>
                <Button
                  type="button"
                  @click="
                    () =>
                      updateOrderStatus({
                        id: order.id,
                        client_id: order.clientId,
                        status: 'CANCELED',
                      })
                  "
                  variant="secondary"
                  size="sm"
                  class="border bg-red-100 w-full border-red-500 text-red-900"
                >
                  {{ t(`g.status.canceled`) }}
                </Button>
              </PopoverContent>
            </Popover>
          </td>
          <td class="p-2">
            {{ order.createdAt ? d(new Date(order.createdAt), "long") : "" }}
          </td>
          <td class="p-2">{{ order.total?.toFixed(2) }} DH</td>
          <td class="p-2">
            <div class="flex justify-center items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    @click="toggleThisOrders(order, 'OrderDelete')"
                  >
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("g.actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="toggleThisOrders(order, 'OrderUpdate')"
                  >
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NuxtLink
                      :to="
                        localePath({
                          path: '/orders/' + order.id,
                        })
                      "
                    >
                      <Printer
                        :size="20"
                        class="text-slate-800 inline mr-2"
                      />{{ t("g.actions.print") }}
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="createInvoiceFromOrder(order.id!)">
                    <NotepadText
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />{{ t("g.actions.toInvoice") }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination />
  </div>
</template>
