<script setup lang="ts">
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
</script>

<template>
  <SheetContent
    @close-auto-focus="(e) => e.preventDefault()"
    class="w-1/2 max-w-[540px]"
  >
    <SheetHeader>
      <SheetTitle>Are you sure absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</template>
