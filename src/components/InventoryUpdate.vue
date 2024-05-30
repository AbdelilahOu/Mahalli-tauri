<script setup lang="ts">
import { useUpdateRouteQueryParams } from "@/composables/useUpdateQuery";
import { store } from "@/store";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { z } from "zod";
import UiModalCard from "./ui/UiModalCard.vue";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const route = useRoute();

const isUpdating = ref<boolean>(false);

const stock = z.object({
  quantity: z.number().default(0),
});

const stockSchema = toTypedSchema(stock);

const form = useForm({
  validationSchema: stockSchema,
});

const updateTheProduct = async ({ quantity }: z.infer<typeof stock>) => {
  try {
    const id = route.query.id;
    await invoke<Res<any>>("create_inventory", {
      mvm: {
        mvm_type: quantity > 0 ? "IN" : "OUT",
        product_id: id,
        quantity: Number(Math.abs(quantity)),
      },
    });
    info(
      `UPDATE PRODUCT STOCK: ${JSON.stringify({
        id,
        quantity: Number(quantity),
      })}`,
    );
    //
    toast.success(
      t("notifications.product.updated", { name: route.query.name }),
      {
        closeButton: true,
      },
    );
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("UPDATE PRODUCT: " + err);
  } finally {
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  updateTheProduct(values);
});
</script>

<template>
  <UiModalCard>
    <template #title>
      {{ t("p.u.title") }}
    </template>
    <template #content>
      <form class="h-full w-full flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>{{ t("g.fields.quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.quantity')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <div class="w-full grid grid-cols-3 gap-2">
          <Button
            @click="hideModal"
            type="button"
            :disabled="isUpdating"
            variant="outline"
          >
            {{ t("g.b.no") }}
          </Button>
          <Button
            :disabled="isUpdating"
            type="submit"
            class="w-full col-span-2"
          >
            {{ t("g.b.u", { name: $route.query.name }) }}
          </Button>
        </div>
      </form>
    </template>
  </UiModalCard>
</template>
