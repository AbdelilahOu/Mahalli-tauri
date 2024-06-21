<script setup lang="ts">
import type { ProductT } from "@/schemas/products.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();
const { t } = useI18n();
const route = useRoute();

const isUpdating = ref<boolean>(false);

const productSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2)
      .max(50)
      .default(route.query.name as string),
    purchasePrice: z
      .number()
      .min(0)
      .default(Number(route.query.purchasePrice ?? 0)),
    sellingPrice: z
      .number()
      .min(0)
      .default(Number(route.query.sellingPrice ?? 0)),
    description: z
      .string()
      .min(2)
      .default((route.query.description as string) ?? ""),
    image: z.string().default((route.query.image ?? "") as string),
    minQuantity: z.number().default(Number(route.query.minQuantity) ?? 0),
  })
);

const form = useForm({
  validationSchema: productSchema,
});

const updateTheProduct = async (product: ProductT) => {
  try {
    const id = route.query.id;
    await invoke<Res<string>>("update_product", {
      product: {
        name: product.name,
        selling_price: Number(product.sellingPrice),
        purchase_price: Number(product.purchasePrice),
        description: product.description,
        min_quantity: Number(product.minQuantity),
        image: product.image,
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
        image: product.image,
        id,
      })}`
    );
    //
    toast.success(t("notifications.product.updated", { name: product.name }), {
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
    if ("error" in err) {
      error("UPDATE PRODUCT: " + err.error);
      return;
    }
    error("UPDATE PRODUCT: " + err);
  } finally {
    hideModal();
  }
};

const hideModal = () => toggleModal(false);

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
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("g.fields.name") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.name')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="purchasePrice">
          <FormItem>
            <FormLabel>{{ t("g.fields.purchase-price") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.purchase-price')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="sellingPrice">
          <FormItem>
            <FormLabel>{{ t("g.fields.selling-price") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.selling-price')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="minQuantity">
          <FormItem>
            <FormLabel>{{ t("g.fields.min-quantity") }}</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('g.fields.min-quantity')"
                v-bind="componentField"
              >
                <template #unite> {{ t("g.fields.item") }} </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              {{ t("g.fields.description") }}
            </FormLabel>
            <FormControl>
              <Textarea
                :placeholder="t('g.fields.description')"
                v-bind="componentField"
              />
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
