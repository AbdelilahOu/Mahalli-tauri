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
const { setModalName, toggleModal } = useStore();
const { t, d, locale, n } = useI18n();
const localePath = useLocalePath();

defineProps<{ orders: OrderT[]; orderProducts: OrderProductT[] }>();
const emits = defineEmits<{
  (e: "listOrderProducts", id?: string): void;
}>();

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  PROCESSING: "bg-blue-100 border-blue-500 text-blue-900",
  SHIPPED: "bg-indigo-100 border-indigo-500 text-indigo-900",
  DELIVERED: "bg-green-100 border-green-500 text-green-900",
  CANCELLED: "bg-red-100 border-red-500 text-red-900",
} as const;

const STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

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
    identifier: Order.identifier,
    highlight: false,
  });
  setModalName(name);
  toggleModal(true);
};

const updateOrderStatus = async (id: string, status: string) => {
  try {
    await invoke("update_order_status", {
      order: {
        id,
        status,
      },
    });
    //
    info(`UPDATE ORDER STATUS: ${JSON.stringify({ id, status })}`);
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      error("UPDATE ORDER STATUS: " + err.error);
      return;
    }
    error("UPDATE ORDER STATUS: " + err);
  }
};

const createInvoiceFromOrder = async (id: string) => {
  try {
    const res = await invoke<Res<OrderForUpdateT>>(
      "create_invoice_from_order",
      {
        id: id,
      }
    );
    //
    info(`CREATE INVOICE FROM ORDER: ${id}`);
    //
    toast.success(t("notifications.invoice.created"), {
      closeButton: true,
      description: h(NuxtLink, {
        to: localePath("/invoices/?page=1&highlight=true&id=" + res.data),
        class: "underline",
        innerHTML: "go to invoice",
      }),
    });
  } catch (err: any) {
    if (typeof err == "object" && "error" in err) {
      error("GET ORDER FOR INVOICE: " + err.error);
      return;
    }
    error("GET ORDER FOR INVOICE: " + err);
  }
};
</script>

<template>
  <div>
    <table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <thead>
        <tr>
          <th class="w-24"></th>
          <th>{{ t("g.fields.fullname") }}</th>
          <th>{{ t("g.fields.items") }}</th>
          <th class="w-fit">{{ t("g.fields.status") }}</th>
          <th class="w-56">{{ t("g.fields.date") }}</th>
          <th>{{ t("g.fields.total") }}</th>
          <th class="w-20">{{ t("g.fields.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in orders"
          :key="order.id"
          v-fade="index"
          :class="{
            'animate-highlight-row':
              order.id == $route.query.id && $route.query.highlight == 'true',
          }"
        >
          <td class="p-2 text-nowrap font-medium">
            {{ order.identifier }}
          </td>
          <td class="p-2 font-medium">
            {{ order.fullname }}
          </td>
          <td class="p-2">
            <Popover v-if="order.products && order.products > 0">
              <PopoverTrigger as-child>
                <Button
                  size="sm"
                  variant="link"
                  class="underline px-0 h-fit"
                  @mouseenter.passive="previewProducts(order.id!)"
                  @mouseleave.passive="cancelPreviewProducts"
                >
                  {{
                    order.products +
                    " " +
                    t("g.plrz.p", { n: Math.ceil(order.products) })
                  }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="min-w-[13rem] p-2">
                <ScrollArea
                  :class="orderProducts.length > 16 ? 'h-[400px]' : 'h-fit'"
                >
                  <table class="w-full not-default">
                    <thead>
                      <tr>
                        <th v-for="index in 3" :key="index" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(orderProduct, index) in orderProducts"
                        :key="index"
                        class="space-y-1 text-sm flex justify-between w-full items-center"
                      >
                        <td class="underline w-1/2">{{ orderProduct.name }}</td>
                        <td class="min-w-1/4 w-20 text-end text-nowrap">
                          {{ orderProduct.price }} Dh
                        </td>
                        <td class="w-1/4 text-slate-700 text-end">
                          <i> x{{ orderProduct.quantity }} </i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <template v-else>
              {{
                order.products +
                " " +
                t("g.plrz.p", { n: Math.ceil(order.products ?? 0) })
              }}
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
                  v-for="status in STATUSES"
                  type="button"
                  variant="secondary"
                  size="sm"
                  :class="cn('border', STATUS_COLORS[status])"
                  @click="() => updateOrderStatus(order.id as string, status)"
                >
                  {{ t(`g.status.` + status.toLowerCase()) }}
                </Button>
              </PopoverContent>
            </Popover>
          </td>
          <td class="p-2">
            {{ d(new Date(order.createdAt!), "long") }}
          </td>
          <td class="p-2">
            {{ n(order.total!, "decimal") }}
            DH
          </td>
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
