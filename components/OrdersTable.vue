<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { error, info } from "tauri-plugin-log-api";
import {
  FilePenLine,
  GripHorizontal,
  NotepadText,
  Printer,
  Trash2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { NuxtLink, OrderDelete, OrderUpdate } from "#components";
import { ORDER_STATUSES, STATUS_COLORS } from "@/consts/status";

defineProps<{ orders: OrderT[]; orderProducts: OrderProductT[] }>();
const emits = defineEmits<{
  (e: "listOrderProducts", id?: string): void;
}>();
const { updateQueryParams } = useUpdateRouteQueryParams();
const modal = useModal();
const { t, d, locale, n } = useI18n();
const localePath = useLocalePath();

let previewProductsTimer: any;
function previewProducts(id: string) {
  clearTimeout(previewProductsTimer);
  previewProductsTimer = setTimeout(() => {
    emits("listOrderProducts", id);
  }, 400);
}
const cancelPreviewProducts = () => clearTimeout(previewProductsTimer);

function toggleThisOrder(order: OrderT, name: "delete" | "update") {
  if (name === "delete") {
    modal.open(OrderDelete, {
      id: order.id!,
      identifier: order.identifier,
    });
  }
  else {
    modal.open(OrderUpdate, {
      id: order.id!,
      identifier: order.identifier,
    });
  }
}

async function updateOrderStatus(id: string, status: string) {
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
      refresh: `refresh-update-${Math.random() * 9999}`,
    });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`UPDATE ORDER STATUS: ${err.error}`);
      return;
    }
    error(`UPDATE ORDER STATUS: ${err}`);
  }
}

async function createInvoiceFromOrder(id: string) {
  try {
    const res = await invoke<Res<OrderForUpdateT>>(
      "create_invoice_from_order",
      {
        id,
      },
    );
    //
    info(`CREATE INVOICE FROM ORDER: ${id}`);
    //
    toast.success(t("notifications.invoice.created"), {
      closeButton: true,
      description: h(NuxtLink, {
        to: localePath(`/invoices/?page=1&highlight=true&id=${res.data}`),
        class: "underline",
        innerHTML: "go to invoice",
      }),
    });
  }
  catch (err: any) {
    if (typeof err === "object" && "error" in err) {
      error(`GET ORDER FOR INVOICE: ${err.error}`);
      return;
    }
    error(`GET ORDER FOR INVOICE: ${err}`);
  }
}
</script>

<template>
  <div class="w-full">
    <Table :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead class="w-24" />
          <TableHead>{{ t("fields.full-name") }}</TableHead>
          <TableHead>{{ t("fields.items") }}</TableHead>
          <TableHead class="w-fit">
            {{ t("fields.status") }}
          </TableHead>
          <TableHead class="w-56">
            {{ t("fields.date") }}
          </TableHead>
          <TableHead>{{ t("fields.total") }}</TableHead>
          <TableHead class="w-20">
            {{ t("fields.actions") }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(order, index) in orders"
          :key="order.id"
          v-fade="index"
          :class="{
            'animate-highlight-row':
              order.id === $route.query.id && $route.query.highlight === 'true',
          }"
        >
          <TableCell class="p-2 text-nowrap font-medium">
            {{ order.identifier }}
          </TableCell>
          <TableCell class="p-2 font-medium">
            {{ order.fullName }}
          </TableCell>
          <TableCell class="p-2">
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
                    `${order.products} ${t("plrz.p", {
                      n: Math.ceil(order.products),
                    })}`
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
                        <th v-for="i in 3" :key="i" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(product, i) in orderProducts"
                        :key="i"
                        class="text-sm"
                      >
                        <td class="underline">
                          {{ product.name }}
                        </td>
                        <td class="text-slate-700 text-end">
                          <i> x{{ product.quantity }} </i>
                        </td>
                        <td class="text-nowrap text-end">
                          {{ n(product.price, "decimal") }}
                          <span class="text-xs text-slate-700"> MAD </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <template v-else>
              {{
                `${order.products} ${t("plrz.p", {
                  n: Math.ceil(order.products ?? 0),
                })}`
              }}
            </template>
          </TableCell>
          <TableCell class="p-2">
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
                  {{ t(`status.${order.status.toLowerCase()}`) }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-40 p-1 flex flex-col gap-1">
                <Button
                  v-for="status in ORDER_STATUSES"
                  :key="status"
                  type="button"
                  variant="secondary"
                  size="sm"
                  :class="cn('border', STATUS_COLORS[status])"
                  @click="() => updateOrderStatus(order.id as string, status)"
                >
                  {{ t(`status.${status.toLowerCase()}`) }}
                </Button>
              </PopoverContent>
            </Popover>
          </TableCell>
          <TableCell class="p-2">
            {{ d(new Date(order.createdAt!), "long") }}
          </TableCell>
          <TableCell class="p-2">
            {{ n(order.total!, "currency") }}
          </TableCell>
          <TableCell class="p-2">
            <div class="flex justify-center items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent class="rtl:ml-6 ltr:mr-6">
                  <DropdownMenuItem @click="toggleThisOrder(order, 'update')">
                    <FilePenLine
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NuxtLink
                      :to="
                        localePath({
                          path: `/orders/${order.id}`,
                        })
                      "
                    >
                      <Printer
                        :size="20"
                        class="text-slate-800 inline mr-2"
                      />{{ t("actions.print") }}
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="createInvoiceFromOrder(order.id!)">
                    <NotepadText
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />{{ t("actions.to-invoice") }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="toggleThisOrder(order, 'delete')">
                    <Trash2 :size="20" class="text-red-500 inline mr-2" />
                    <span class="text-red-500">
                      {{ t("actions.delete") }}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination />
  </div>
</template>
