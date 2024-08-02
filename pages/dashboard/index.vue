<script setup lang="ts">
import type { Res, groupedTransaction, transactionsT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { GroupedBar } from "@unovis/ts";
import {
  VisAxis,
  VisGroupedBar,
  VisBulletLegend,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";
import { DollarSign, NotepadText, Truck } from "lucide-vue-next";
import { error } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { t, d, n } = useI18n();

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 border-gray-500 text-gray-900",
  SENT: "bg-blue-100 border-blue-500 text-blue-900",
  PAID: "bg-green-100 border-green-500 text-green-900",
  PARTIALLY_PAID: "bg-teal-100 border-teal-500 text-teal-900",
  OVERDUE: "bg-orange-100 border-orange-500 text-orange-900",
  CANCELLED: "bg-red-100 border-red-500 text-red-900",
  PENDING: "bg-yellow-100 border-yellow-500 text-yellow-900",
  PROCESSING: "bg-blue-100 border-blue-500 text-blue-900",
  SHIPPED: "bg-indigo-100 border-indigo-500 text-indigo-900",
  DELIVERED: "bg-green-100 border-green-500 text-green-900",
} as const;

const transactionsLabels = ref<string[]>([]);
const tickFormatToDate = (i: number) => {
  return transactionsLabels.value[i]
    ? d(transactionsLabels.value[i], "monthOnly")
    : "";
};

const barQuantityTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedTransaction[string], i: number) => {
    const transactionType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    const quantity = d[transactionType].quantity;
    return (
      n(quantity, "decimal") + " " + t("g.plrz.i", { n: Math.ceil(quantity) })
    );
  },
};
const barPriceTriggers = {
  [GroupedBar.selectors.bar]: (d: groupedTransaction[string], i: number) => {
    const transactionType = (i % 2 == 0 ? "IN" : "OUT") as "IN" | "OUT";
    return n(d[transactionType].price, "decimal") + " DH";
  },
};

const { data: inventoryTransactions } = useAsyncData(
  "inventoryTransactions",
  async () => {
    try {
      const res = await invoke<Res<transactionsT[]>>("list_inventory_stats");
      console.log(res);
      const result = res.data.reduce((acc, item) => {
        const { createdAt: date, transactionType, quantity, price } = item;
        const createdAt = new Date(date).toISOString().split("T")[0];
        if (!acc[createdAt]) {
          acc[createdAt] = {
            IN: { quantity: 0, price: 0 },
            OUT: { quantity: 0, price: 0 },
          };
        }
        acc[createdAt][transactionType].quantity += quantity;
        acc[createdAt][transactionType].price += price;
        return acc;
      }, {} as groupedTransaction);

      const transactionLabelsSet = new Set<string>(Object.keys(result));
      transactionsLabels.value = [...transactionLabelsSet];
      return result;
    } catch (err: any) {
      handleError(err, "STATS INVENTORY MOUVEMENTS");
      return {};
    }
  }
);

const { data: bestClients } = useAsyncData("bestClients", async () => {
  try {
    const res = await invoke<Res<any[]>>("list_top_clients");
    return res.data;
  } catch (err: any) {
    handleError(err, "STATS BEST CLIENTS");
    return [];
  }
});

const { data: bestProducts } = useAsyncData("bestProducts", async () => {
  try {
    const res = await invoke<Res<any[]>>("list_top_products");
    return res.data;
  } catch (err: any) {
    handleError(err, "STATS BEST PRODUCTS");
    return [];
  }
});

const { data: statusCounts } = useAsyncData("statusCounts", async () => {
  try {
    const res = await invoke<Res<any>>("list_status_count");
    return res.data;
  } catch (err: any) {
    handleError(err, "STATS STATUS COUNT");
    return null;
  }
});

const { data: financials } = useAsyncData("financialMetrices", async () => {
  try {
    const res = await invoke<Res<any>>("list_financial_metrices");
    return res.data;
  } catch (err: any) {
    handleError(err, "STATS EXPENSES");
    return {};
  }
});

function handleError(err: any, context: string) {
  toast.error(t("notifications.error.title"), {
    description: t("notifications.error.description"),
    closeButton: true,
  });
  if (typeof err == "object" && "error" in err) {
    error(`${context}: ${err.error}`);
  } else {
    error(`${context}: ${err}`);
  }
}
</script>

<template>
  <main class="w-full h-full">
    <div class="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-2">
      <div class="grid grid-cols-1 lg:grid-cols-2 col-span-2 gap-2">
        <Card class="h-fit w-full">
          <CardHeader
            class="flex border-b-0 flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("dashboard.i.revenue") }}
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-0">
            <div class="text-2xl font-bold">
              {{ n(financials?.current_revenue || 0, "decimal") }}
              DH
            </div>
            <p class="text-xs text-muted-foreground">
              {{
                t("dashboard.i.growth", {
                  n: n(financials?.revenue_growth_percentage || 0, {
                    style: "percent",
                  }),
                })
              }}
            </p>
          </CardContent>
        </Card>
        <Card class="h-fit w-full lg:order-3">
          <CardHeader
            class="flex border-b-0 flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("dashboard.i.expenses") }}
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-0">
            <div class="text-2xl font-bold">
              {{ n(financials?.current_expenses || 0, "decimal") }}
              DH
            </div>
            <p class="text-xs text-muted-foreground">
              {{
                t("dashboard.i.growth", {
                  n: n(financials?.expenses_growth_percentage || 0, {
                    style: "percent",
                  }),
                })
              }}
            </p>
          </CardContent>
        </Card>
        <Card class="w-full">
          <CardHeader
            class="flex flex-row border-b-0 items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("g.r.Orders") }}</CardTitle
            >
            <Truck class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="flex justify-start flex-row gap-2 py-3">
            <Badge
              v-for="(status, index) in statusCounts?.orders"
              :key="index"
              variant="secondary"
              :class="
                // @ts-ignore
                cn('rounded-sm h-8 w-full', STATUS_COLORS[status.status])
              "
            >
              {{ status.status_count }}
              {{ t("g.status." + status.status.toLowerCase()) }}
            </Badge>
          </CardContent>
        </Card>
        <Card class="lg:order-4 w-full">
          <CardHeader
            class="flex flex-row items-center justify-between border-b-0 space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">
              {{ t("g.r.Invoices") }}
            </CardTitle>
            <NotepadText class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="flex flex-row justify-start gap-2 py-3">
            <Badge
              v-for="(status, index) in statusCounts?.invoices"
              :key="index"
              variant="secondary"
              :class="
                // @ts-ignore
                cn('rounded-sm h-8 w-full', STATUS_COLORS[status.status])
              "
            >
              {{ status.status_count }}
              {{ t("g.status." + status.status.toLowerCase()) }}
            </Badge>
          </CardContent>
        </Card>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="bestClients"
              :data="bestClients"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="(d: any) => d.price"
              />
              <VisAxis
                type="x"
                :tick-format="
                  (i: number) => (bestClients ? bestClients[i].Fullname : i)
                "
              />
              <VisAxis type="y" :label="t('g.fields.price') + ' (DH)'" />
              <VisTooltip
                :triggers="{
                  [GroupedBar.selectors.bar]: (d: any) => {
                    return n(d.price, 'decimal') +' DH';
                  },
                }"
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.b3c") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="bestProducts"
              :data="bestProducts"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="(d: any) => d.quantity"
              />
              <VisAxis
                type="x"
                :tick-format="
                  (i: number) => (bestProducts ? bestProducts[i].name : i)
                "
              />
              <VisAxis type="y" :label="t('g.fields.quantity')" />
              <VisTooltip
                :triggers="{
                  [GroupedBar.selectors.bar]: (d: any) => {
                    return (
                      d.name +
                      ': ' +
                      n(d.quantity, 'decimal')
                      + ' ' +
                      t('g.plrz.i', { n: Math.ceil(d.quantity) })
                    );
                  },
                }"
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.bp") }}</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="inventoryTransactions"
              :data="Object.values(inventoryTransactions)"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.quantity, (d: any) => d.OUT.quantity]"
              />
              <VisAxis type="x" :tick-format="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.quantity')" />
              <VisTooltip :triggers="barQuantityTriggers" />
              <VisBulletLegend
                class="my-2 m-auto w-fit"
                :items="
                  ['in', 'out'].map((a) => ({
                    name: t('g.status.' + a),
                  }))
                "
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.title") }} ({{ t("g.fields.item") }})</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
      <div class="w-full h-fit">
        <ChartHolder>
          <template #default>
            <VisXYContainer
              v-if="inventoryTransactions"
              :data="Object.values(inventoryTransactions)"
              :height="500"
            >
              <VisGroupedBar
                :bar-padding="0.1"
                :x="(d: any, index: number) => index"
                :y="[(d: any) => d.IN.price, (d: any) => d.OUT.price]"
              />
              <VisAxis type="x" :tick-format="tickFormatToDate" />
              <VisAxis type="y" :label="t('g.fields.price') + ' (DH)'" />
              <VisTooltip :triggers="barPriceTriggers" />
              <VisBulletLegend
                class="my-2 m-auto w-fit"
                :items="
                  ['in', 'out'].map((a) => ({
                    name: t('g.status.' + a),
                  }))
                "
              />
            </VisXYContainer>
          </template>
          <template #title>
            <h1 class="m-2 w-full text-center text-base font-medium">
              <i>{{ t("dashboard.i.title") }} (DH)</i>
            </h1>
          </template>
        </ChartHolder>
      </div>
    </div>
  </main>
</template>
