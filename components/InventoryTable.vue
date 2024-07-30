<script setup lang="ts">
import type { InventoryT } from "@/schemas/inventory.schema";

defineProps<{
  inventory: InventoryT[];
}>();

const { t, d, locale, n } = useI18n();
</script>

<template>
  <div class="w-full">
    <Table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead>{{ t("g.fields.name") }}</TableHead>
          <TableHead>{{ t("g.fields.price") }}</TableHead>
          <TableHead>{{ t("g.fields.quantity") }}</TableHead>
          <TableHead>{{ t("g.fields.status") }}</TableHead>
          <TableHead class="w-56">{{ t("g.fields.date") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(transaction, index) in inventory"
          :key="transaction.id"
          v-fade="index"
        >
          <TableCell class="p-2 font-medium">
            {{ transaction?.name }}
          </TableCell>
          <TableCell class="p-2">
            {{ n(transaction?.price, "decimal") }}
            DH
          </TableCell>
          <TableCell class="p-2">
            {{
              transaction.quantity +
              " " +
              t("g.plrz.i", { n: Math.ceil(transaction.quantity) })
            }}
          </TableCell>
          <TableCell class="p-2">
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
          </TableCell>
          <TableCell class="p-2">
            {{ d(new Date(transaction.createdAt), "long") }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination />
  </div>
</template>
