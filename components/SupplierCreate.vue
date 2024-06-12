<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import {
  CreateSupplierSchema,
  type SupplierT,
} from "@/schemas/supplier.schema";
import { error, info } from "tauri-plugin-log-api";
import type { Res } from "@/types";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { t } = useI18n();
const isLoading = ref<boolean>(false);

const supplierSchema = toTypedSchema(CreateSupplierSchema);

const imagePath = ref<string>();

const form = useForm({
  validationSchema: supplierSchema,
});

const createNewSupplier = async (supplier: SupplierT) => {
  isLoading.value = true;
  try {
    await invoke<Res<string>>("create_supplier", {
      supplier: {
        full_name: supplier.fullname,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
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
      t("notifications.supplier.created", { name: supplier.fullname }),
      {
        closeButton: true,
      }
    );
    // toggle refresh
    updateQueryParams({
      refresh: "refresh-create-" + Math.random() * 9999,
    });
  } catch (err: any) {
    error("CREATE SUPPLIER: " + err.error);
  } finally {
    isLoading.value = false;
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  createNewSupplier(values);
});

const saveImage = (image: string) => {
  imagePath.value = image;
};
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("s.c.title") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @save:base64="saveImage"
        />
        <FormField v-slot="{ componentField }" name="fullname">
          <FormItem>
            <FormLabel>{{ t("g.fields.fullname") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.fullname')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ t("g.fields.email") }}</FormLabel>
            <FormControl>
              <Input placeholder="example@gmail.com" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormLabel>{{ t("g.fields.phone") }}</FormLabel>
            <FormControl>
              <Input placeholder="+2126********" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel>{{ t("g.fields.address") }}</FormLabel>
            <FormControl>
              <Input
                :placeholder="t('g.fields.address')"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          :disabled="isLoading"
          variant="outline"
          @click="hideModal"
        >
          {{ t("g.b.no") }}
        </Button>
        <Button :disabled="isLoading" type="submit" class="col-span-2">
          {{ t("g.b.c") }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
