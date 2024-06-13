<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

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
      `UPDATE PRODUCT INVENTORY: ${JSON.stringify({
        id,
        quantity: Number(quantity),
      })}`
    );
    //
    toast.success(
      t("notifications.product.updated", { name: route.query.name }),
      {
        closeButton: true,
      }
    );
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    error("UPDATE PRODUCT INVENTORY: " + err.error);
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
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("p.u.title") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem>
            <FormLabel>{{ t("g.fields.quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.quantity')"
                v-bind="componentField"
              >
                <template #unite> {{ t("g.fields.item") }} </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          :disabled="isUpdating"
          variant="outline"
          @click="hideModal"
        >
          {{ t("g.b.no") }}
        </Button>
        <Button :disabled="isUpdating" type="submit" class="col-span-2">
          {{ t("g.b.u", { name: $route.query.name }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
