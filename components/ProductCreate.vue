<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

const imagePath = ref<string>();
const quantity = ref<number>(0);

const productSchema = toTypedSchema(CreateProductSchema);
const form = useForm({
  validationSchema: productSchema,
});

async function createNewProduct(product: ProductT) {
  try {
    const createRes = await invoke<Res<string>>("create_product", {
      product: {
        name: product.name,
        selling_price: Number(product.sellingPrice),
        purchase_price: Number(product.purchasePrice),
        description: product.description,
        min_quantity: product.minQuantity,
        image: `data:image/png;base64,${imagePath.value}`,
      },
    });
    await invoke<Res<string>>("create_inventory", {
      transaction: {
        transaction_type: "IN",
        product_id: createRes.data,
        quantity: Number(quantity.value),
      },
    });
    info(
      `CREATE PRODUCT: ${JSON.stringify({
        ...product,
        image: `data:image/png;base64,${imagePath.value}`,
        quantity: quantity.value,
      })}`
    );
    //
    toast.success(t("notifications.product.created", { name: product.name }), {
      closeButton: true,
    });
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-create-${Math.random() * 9999}`,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`CREATE PRODUCT: ${err.error}`);
      return;
    }
    error(`CREATE PRODUCT: ${err}`);
  } finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  createNewProduct(values);
});

function setImage(image: string) {
  imagePath.value = image;
}
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("titles.products.create") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @save:base64="setImage"
        />
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
                :placeholder="t('fields.purchase-price')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
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
                :placeholder="t('fields.selling-price')"
                v-bind="componentField"
              >
                <template #unite> DH </template>
              </Input>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="">
          <FormItem>
            <FormLabel>{{ t("fields.init-quantity") }}</FormLabel>
            <FormControl>
              <Input
                v-model="quantity"
                type="number"
                :placeholder="t('fields.init-quantity')"
              >
                <template #unite>
                  {{ t("fields.item") }}
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
          {{ t("buttons.add") }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
