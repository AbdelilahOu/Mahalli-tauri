<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";
import { z } from "zod";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const CreateSupplierSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2).max(50),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

const supplierSchema = toTypedSchema(CreateSupplierSchema);

const imagePath = ref<string>();

const form = useForm({
  validationSchema: supplierSchema,
});

async function createNewSupplier(supplier: SupplierT) {
  try {
    await invoke<Res<string>>("create_supplier", {
      supplier: {
        full_name: supplier.full_name,
        email: supplier.email,
        phone_number: supplier.phone_number,
        address: supplier.address,
        image: `data:image/png;base64,${imagePath.value}`,
      },
    });
    //
    info(
      `CREATE SUPPLIER: ${JSON.stringify({
        ...supplier,
        image: `data:image/png;base64,${imagePath.value}`,
      })}`
    );
    //
    toast.success(
      t("notifications.supplier.created", { name: supplier.full_name }),
      {
        closeButton: true,
      }
    );
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
      error(`CREATE SUPPLIER: ${err.error}`);
      return;
    }
    error(`CREATE SUPPLIER: ${err}`);
  } finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  createNewSupplier(values);
});

function saveImage(image: string) {
  imagePath.value = image;
}
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card class="w-4/6 lg:w-1/2">
      <CardHeader>
        <CardTitle>
          {{ t("titles.suppliers.create") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @save:base64="saveImage"
        />
        <FormField v-slot="{ componentField }" name="full_name">
          <FormItem>
            <FormLabel>{{ t("fields.full-name") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('fields.full-name')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ t("fields.email") }}</FormLabel>
            <FormControl>
              <Input placeholder="example@gmail.com" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone_number">
          <FormItem>
            <FormLabel>{{ t("fields.phone") }}</FormLabel>
            <FormControl>
              <Input placeholder="+2126********" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel>{{ t("fields.address") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('fields.address')"
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
