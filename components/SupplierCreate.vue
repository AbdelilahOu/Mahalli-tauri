<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import * as Logger from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { t } = useI18n();

const { updateQueryParams } = useUpdateRouteQueryParams();

const { close } = useModal();

const CreateSupplierSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2).max(50),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  credit: z.number().optional(),
});

const supplierSchema = toTypedSchema(CreateSupplierSchema);

const form = useForm({
  validationSchema: supplierSchema,
});

const image = reactive({
  bytes: null as Uint8Array | null,
  name: null as string | null,
});

async function createNewSupplier(supplier: SupplierT) {
  try {
    let ImagePath: null | string = null;
    if (image.bytes && image.name) {
      const uploadedImagePath = await uploadFileToDataDir(
        "temp",
        image.bytes,
        image.name,
      );
      ImagePath = uploadedImagePath;
    }
    await invoke<Res<null>>("create_supplier", {
      supplier: {
        ...supplier,
        image: ImagePath,
      },
    });
    //
    Logger.info(
      `CREATE SUPPLIER: ${JSON.stringify({
        ...supplier,
        image: ImagePath,
      })}`,
    );
    //
    toast.success(
      t("notifications.supplier.created", { name: supplier.full_name }),
      {
        closeButton: true,
      },
    );
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-create-${Math.random() * 9999}`,
    });
  }
  catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    Logger.error(
      `ERROR CREATE SUPPLIER: ${err.error ? err.error : err.message}`,
    );
  }
  finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  createNewSupplier(values);
});

function setImage(bytes: Uint8Array, name: string) {
  image.bytes = bytes;
  image.name = name;
}

function cleanImage() {
  image.bytes = null;
  image.name = null;
}
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card class="w-4/6 lg:w-1/2">
      <CardHeader>
        <CardTitle> {{ t("titles.suppliers.create") }} </CardTitle>
      </CardHeader>
      <CardContent>
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp', 'jpg']"
          @clear="cleanImage"
          @save-bytes="setImage"
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
