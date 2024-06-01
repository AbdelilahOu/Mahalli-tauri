<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UiPagination from "./ui/UiPagination.vue";
import { RouterLink } from "vue-router";
import { store } from "@/store";
import type {
  OrderForUpdateT,
  OrderProductT,
  OrderT,
} from "@/schemas/order.schema";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/utils/shadcn";
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import {
  FilePenLine,
  Printer,
  Trash2,
  GripHorizontal,
  NotepadText,
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Res } from "@/types";
import { toast } from "vue-sonner";
import { h } from "vue";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t, d } = useI18n();

defineProps<{ orders: OrderT[]; orderProducts: OrderProductT[] }>();
defineEmits<{
  (e: "listOrderProducts", id?: string): void;
  (e: "cancelOrderProducts"): void;
}>();

const STATUS_COLORS = {
  CANCELED: "bg-red-100 border-red-500 text-red-900",
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  DELIVERED: "bg-green-100 border-green-500 text-green-900",
} as const;

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
        description: h(RouterLink, {
          to: "/invoices/?page=1&id=" + invoiceRes.data,
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
            <RouterLink
              class="font-medium"
              :to="{
                path: '/clients/' + order.clientId,
              }"
            >
              {{ order.fullname }}
            </RouterLink>
          </td>
          <td class="p-2">
            <HoverCard v-if="order.products && order.products > 0">
              <HoverCardTrigger as-child>
                <Button
                  @mouseenter.passive="$emit('listOrderProducts', order.id)"
                  @mouseleave.passive="$emit('cancelOrderProducts')"
                  size="sm"
                  variant="link"
                  class="underline px-0"
                >
                  {{ t("g.plrz.p", { n: order.products }) }}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent class="min-w-[13rem] p-2">
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
              </HoverCardContent>
            </HoverCard>
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
                      STATUS_COLORS[order.status],
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
                  <!-- <DropdownMenuLabel>My Account</DropdownMenuLabel> -->
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
                    <RouterLink
                      :to="{
                        path: '/orders/' + order.id,
                      }"
                    >
                      <Printer
                        :size="20"
                        class="text-slate-800 inline mr-2"
                      />{{ t("g.actions.print") }}
                    </RouterLink>
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
    <UiPagination />
  </div>
</template>
