<script setup lang="ts">
import type { ProductT } from "@/schemas/products.schema";
import {
  CalendarDays,
  FilePenLine,
  GripHorizontal,
  Info,
  PackagePlus,
  Trash2,
} from "lucide-vue-next";
// @ts-ignore
import { ProductUpdate, ProductDelete, InventoryUpdate } from "#components";

defineProps<{ products: ProductT[] }>();

const { t, d, locale, n } = useI18n();
const modal = useModal();

const toggleThisProduct = (product: ProductT, name: "delete" | "update") => {
  if (name == "delete") {
    modal.open(ProductDelete, {
      id: product.id,
      identifier: product.name,
    });
  } else {
    modal.open(ProductUpdate, {
      id: product.id,
      name: product.name,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      description: product.description,
      minQuantity: product.minQuantity,
    });
  }
};

const updateProductInventory = (id: string, name: string) => {
  modal.open(InventoryUpdate, {
    id,
    name,
  });
};
</script>

<template>
  <div class="w-full">
    <Table :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <TableHeader>
        <TableRow>
          <TableHead class="w-14" />
          <TableHead class="w-20">{{ t("g.fields.name") }}</TableHead>
          <TableHead class="w-fit">{{ t("g.fields.inventory") }}</TableHead>
          <TableHead>{{ t("g.fields.threshold") }}</TableHead>
          <TableHead>{{ t("g.fields.purchase-price") }}</TableHead>
          <TableHead>{{ t("g.fields.selling-price") }}</TableHead>
          <TableHead class="w-20">{{ t("g.fields.actions") }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(product, index) in products"
          :key="product.id"
          v-fade="index"
        >
          <TableCell class="p-2 flex justify-center">
            <Avatar>
              <AvatarImage :src="product.image ?? ''" />
              <AvatarFallback class="text-xs">
                {{ product.name.substring(0, 5) }}
              </AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell class="p-2">
            <span class="whitespace-nowrap flex justify-between gap-3">
              {{ product.name }}
              <HoverCard>
                <HoverCardTrigger as-child>
                  <Info class="cursor-pointer text-gray-800" :size="20" />
                </HoverCardTrigger>
                <HoverCardContent class="w-80">
                  <div class="flex justify-between space-x-4">
                    <div class="space-y-1">
                      <h4 class="text-sm font-semibold">
                        {{ product.name }}
                      </h4>
                      <p class="text-sm">
                        {{ product.description ?? "" }}
                      </p>
                      <div class="flex items-center pt-2">
                        <CalendarDays class="mr-2 h-4 w-4 opacity-70" />
                        <span class="text-xs text-muted-foreground">
                          Created at {{ d(product.createdAt!, "short") }}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </span>
          </TableCell>
          <TableCell class="p-2">
            <Badge
              variant="outline"
              :class="
                cn(
                  'whitespace-nowrap',
                  product.inventory != undefined
                    ? product?.inventory <= 0
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : product?.inventory < product.minQuantity
                      ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
                      : product?.inventory >= product.minQuantity
                      ? 'bg-green-100 border-green-500 text-green-900'
                      : ''
                    : ''
                )
              "
            >
              {{
                product?.inventory +
                " " +
                t("g.plrz.i", { n: Math.ceil(product?.inventory ?? 0) })
              }}
            </Badge>
          </TableCell>
          <TableCell class="p-2">
            {{
              product.minQuantity +
              " " +
              t("g.plrz.i", { n: Math.ceil(product.minQuantity ?? 0) })
            }}
          </TableCell>
          <TableCell class="p-2">
            {{ n(product.purchasePrice, "decimal") }}
            DH
          </TableCell>
          <TableCell class="p-2">
            {{ n(product.sellingPrice, "decimal") }}
            DH
          </TableCell>
          <TableCell class="p-2">
            <div class="flex justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <GripHorizontal class="text-slate-800 inline" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    @click="toggleThisProduct(product, 'update')"
                  >
                    <FilePenLine
                      class="text-slate-800 inline mr-2"
                      :size="20"
                    />
                    {{ t("g.actions.edit") }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="toggleThisProduct(product, 'delete')"
                  >
                    <Trash2 class="text-red-500 inline mr-2" :size="20" />
                    <span>
                      <span class="text-red-500">
                        {{ t("g.actions.delete") }}
                      </span>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="updateProductInventory(product.id!, product.name!)"
                  >
                    <PackagePlus
                      :size="20"
                      class="text-slate-800 inline mr-2"
                    />
                    {{ t("g.actions.inventoryUpdate") }}
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
