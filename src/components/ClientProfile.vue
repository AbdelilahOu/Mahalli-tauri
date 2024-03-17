<script setup lang="ts">
import { SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, Phone, MapPin } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
</script>

<template>
  <SheetContent
    @close-auto-focus="(e) => e.preventDefault()"
    class="w-1/2 max-w-[540px] min-w-[540px] p-0"
  >
    <ScrollArea class="h-screen">
      <div class="w-full h-fit flex px-2">
        <div class="w-full h-48 flex items-center justify-center border-b">
          <Avatar size="lg">
            <AvatarImage
              :src="($route.query.image as string) ?? ''"
              alt="@shadcn"
            />
            <AvatarFallback class="text-sm">
              {{ $route.query.fullname }}
            </AvatarFallback>
          </Avatar>
        </div>
        <div class="w-full grid grid-cols-1 p-2 py-6 gap-1 border-b">
          <div class="flex gap-2 w-full">
            <User :size="22" />{{ $route.query.fullname }}
          </div>
          <div class="flex gap-2 w-full">
            <Mail :size="22" />{{ $route.query.email }}
          </div>
          <div class="flex gap-2 w-full">
            <Phone :size="22" />{{ $route.query.phoneNumber }}
          </div>
          <div class="flex gap-2 w-full">
            <MapPin :size="22" />{{ $route.query.address }}
          </div>
        </div>
      </div>
    </ScrollArea>
  </SheetContent>
</template>
