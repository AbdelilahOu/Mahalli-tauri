<script setup lang="ts">
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const props = defineProps<{
  id: string;
  name: string;
}>();

const isUpdating = ref<boolean>(false);

const inventory = z.object({
  quantity: z.number().default(0),
});

const inventorySchema = toTypedSchema(inventory);

const form = useForm({
  validationSchema: inventorySchema,
});

const updateTheProduct = async ({ quantity }: z.infer<typeof inventory>) => {
  try {
    const id = props.id;
    await invoke<Res<any>>("create_inventory", {
      transaction: {
        transaction_type: "IN",
        product_id: id,
        quantity: Number(quantity),
      },
    });
    //INFO
    console.info(
      `UPDATE PRODUCT INVENTORY: ${JSON.stringify({
        id,
        quantity: Number(quantity),
      })}`
    );
    //
    toast.success(t("notifications.product.updated", { name: props.name }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-update-" + Math.random() * 9999,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err == "object" && "error" in err) {
      console.error("UPDATE PRODUCT INVENTORY: " + err.error);
      return;
    }
    console.error("UPDATE PRODUCT INVENTORY: " + err);
  } finally {
    close();
  }
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
          @click="close"
        >
          {{ t("g.b.no") }}
        </Button>
        <Button :disabled="isUpdating" type="submit" class="col-span-2">
          {{ t("g.b.u", { name: name }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
