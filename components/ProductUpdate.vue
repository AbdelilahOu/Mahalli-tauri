<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const props = defineProps<{
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;
  minQuantity: number;
}>();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const productSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .default(props.name as string),
    purchasePrice: z
      .number()
      .min(0)
      .default(Number(props.purchasePrice ?? 0)),
    sellingPrice: z
      .number()
      .min(0)
      .default(Number(props.sellingPrice ?? 0)),
    description: z
      .string()
      .min(2)
      .default((props.description as string) ?? ""),
    minQuantity: z.number().default(Number(props.minQuantity) ?? 0),
  }),
);

const form = useForm({
  validationSchema: productSchema,
});

async function updateTheProduct(product: ProductT) {
  try {
    const id = props.id;
    await invoke<Res<string>>("update_product", {
      product: {
        name: product.name,
        selling_price: Number(product.sellingPrice),
        purchase_price: Number(product.purchasePrice),
        description: product.description,
        min_quantity: Number(product.minQuantity),
        image: "",
        id,
      },
    });

    info(
      `UPDATE PRODUCT: ${JSON.stringify({
        name: product.name,
        selling_price: Number(product.sellingPrice),
        purchase_price: Number(product.purchasePrice),
        description: product.description,
        min_quantity: Number(product.minQuantity),
        id,
      })}`,
    );
    //
    toast.success(t("notifications.product.updated", { name: product.name }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-update-${Math.random() * 9999}`,
    });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`UPDATE PRODUCT: ${err.error}`);
      return;
    }
    error(`UPDATE PRODUCT: ${err}`);
  }
  finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  updateTheProduct(values);
});
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("titles.products.update") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("fields.name") }}</FormLabel>
            <FormControl>
              <Input :placeholder="t('fields.name')" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="purchasePrice">
          <FormItem>
            <FormLabel>{{ t("fields.purchase-price") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                :placeholder="t('fields.purchase-price')"
                v-bind="componentField"
              >
                <template #unite>
                  DH
                </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="sellingPrice">
          <FormItem>
            <FormLabel>{{ t("fields.selling-price") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                :placeholder="t('fields.selling-price')"
                v-bind="componentField"
              >
                <template #unite>
                  DH
                </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="minQuantity">
          <FormItem>
            <FormLabel>{{ t("fields.min-quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                :placeholder="t('fields.min-quantity')"
                v-bind="componentField"
              >
                <template #unite>
                  {{ t("fields.item") }}
                </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              {{ t("fields.description") }}
            </FormLabel>
            <FormControl>
              <Textarea
                :placeholder="t('fields.description')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" @click="close">
          {{ t("buttons.cancel") }}
        </Button>
        <Button type="submit" class="col-span-2">
          {{ t("buttons.update", { name }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
