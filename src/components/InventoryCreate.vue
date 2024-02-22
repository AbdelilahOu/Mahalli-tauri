<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { useI18n } from "vue-i18n";
import { onBeforeMount, ref, reactive } from "vue";
import ComboBox from "./ui/combobox/ComboBox.vue";
import type { newInventoryMvmT } from "@/types";
import { invoke } from "@tauri-apps/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { store } from "@/store";
import UiModalCard from "./ui/UiModalCard.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { cn } from "@/utils/shadcn";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-vue-next";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();

const products = ref<{ label: string; value: string }[]>([]);
const isLoading = ref<boolean>(false);

const inventoryMvmSchema = toTypedSchema(
  z.object({
    product_id: z.string().uuid(),
    quantity: z.number().min(1),
  }),
);

const { handleSubmit, setValues, values } = useForm({
  validationSchema: inventoryMvmSchema,
});

onBeforeMount(async () => {
  // @ts-ignore
  const res = await Promise.allSettled([invoke("get_all_products")]);
  if (res[0].status === "fulfilled") {
    // @ts-ignore
    products.value = res[0].value;
  }
});

const createNewInventory = async (inventoryMvm: newInventoryMvmT) => {
  isLoading.value = true;
  try {
    await invoke("insert_inventory_mvm", {
      inventory: { ...inventoryMvm, model: "IN" },
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-create-" + Math.random() * 9999,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
    hideModal();
  }
};

const onSubmit = handleSubmit((values) => {
  createNewInventory(values);
});

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};
</script>
<template>
  <UiModalCard>
    <template #title>
      {{ t("im.c.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField name="product_id">
          <FormItem>
            <FormLabel>{{ t("im.c.l.a") }}</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    :class="
                      cn(
                        'w-full justify-between',
                        !values.product_id && 'text-muted-foreground',
                      )
                    "
                  >
                    {{
                      values.product_id
                        ? products.find(
                            (product) => product.value === values.product_id,
                          )?.label
                        : t("im.c.p.a")
                    }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-[200px] p-0">
                <Command>
                  <CommandGroup>
                    <CommandItem
                      v-for="product in products"
                      :key="product.value"
                      :value="product.label"
                      @select="
                        () => {
                          setValues({
                            product_id: product.value,
                          });
                        }
                      "
                    >
                      <Check
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            product.value === values.product_id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )
                        "
                      />
                      {{ product.label }}
                    </CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>{{ t("im.c.l.b") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeHolder="t('im.c.p.b')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="w-full grid grid-cols-3 gap-2">
          <Button :disabled="isLoading" type="submit" class="w-full col-span-2">
            {{ t("g.b.a") }}
          </Button>
          <Button
            @click="hideModal"
            type="button"
            :disabled="isLoading"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
