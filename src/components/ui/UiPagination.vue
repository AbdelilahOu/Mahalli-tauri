<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";

import { Button } from "./button";

const router = useRouter();
const route = useRoute();
const defaultPage = computed(() =>
  Number(router.currentRoute.value.query.page)
);

const rowsCount = inject<Ref<number>>("count");

const goBackward = () => {
  if (defaultPage.value > 1) {
    router.push({
      path: route.path,
      query: { page: defaultPage.value - 1 },
    });
  }
};

const goForward = () => {
  if (defaultPage.value < Math.ceil((rowsCount?.value ?? 1) / 17)) {
    router.push({
      path: route.path,
      query: { page: defaultPage.value + 1 },
    });
  }
};

const goToPage = (page: number) => {
  console.log(page);
  router.push({
    path: route.path,
    query: { page },
  });
};

const goToFirst = () => {
  router.push({
    path: route.path,
    query: { page: 1 },
  });
};

const goToLast = () => {
  if (rowsCount?.value) {
    router.push({
      path: route.path,
      query: { page: Math.ceil(rowsCount?.value / 17) },
    });
  }
};
</script>

<template>
  <div class="w-full flex items-center justify-center pt-1">
    <Pagination
      v-slot="{ page }"
      :total="rowsCount"
      :sibling-count="1"
      show-edges
      :default-page="defaultPage"
      :items-per-page="17"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst @click="goToFirst" />
        <PaginationPrev @click="goBackward" />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <Button
              @click="goToPage(item.value)"
              class="w-10 h-10 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext @click="goForward" />
        <PaginationLast @click="goToLast" />
      </PaginationList>
    </Pagination>
  </div>
</template>
