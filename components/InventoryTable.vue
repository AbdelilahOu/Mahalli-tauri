<script setup lang="ts">
import type { InventoryT } from "@/schemas/inventory.schema";

defineProps<{
  inventory: InventoryT[];
}>();

const { t, d, locale, n } = useI18n();
</script>

<template>
  <div>
    <table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <thead>
        <tr>
          <th>{{ t("g.fields.name") }}</th>
          <th>{{ t("g.fields.price") }}</th>
          <th>{{ t("g.fields.quantity") }}</th>
          <th>{{ t("g.fields.status") }}</th>
          <th class="w-56">{{ t("g.fields.date") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(transaction, index) in inventory"
          :key="transaction.id"
          v-fade="index"
        >
          <td class="p-2 font-medium">
            {{ transaction?.name }}
          </td>
          <td class="p-2">
            {{ n(transaction?.price, "decimal") }}
            DH
          </td>
          <td class="p-2">
            {{
              transaction.quantity +
              " " +
              t("g.plrz.i", { n: Math.ceil(transaction.quantity) })
            }}
          </td>
          <td class="p-2">
            <Badge
              variant="outline"
              :class="
                cn(
                  'cursor-pointer whitespace-nowrap',
                  transaction?.transactionType == 'OUT'
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : 'bg-sky-100 border-sky-500 text-sky-900'
                )
              "
            >
              {{ t("g.status." + transaction?.transactionType.toLowerCase()) }}
            </Badge>
          </td>
          <td class="p-2">
            {{ d(new Date(transaction.createdAt), "long") }}
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination />
  </div>
</template>
