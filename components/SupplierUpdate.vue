<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { z } from "zod";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const props = defineProps<{
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}>();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const { t } = useI18n();

const supplierSchema = toTypedSchema(
  z.object({
    fullName: z
      .string()
      .min(2)
      .max(50)
      .default(props.fullName as string),
    email: z.string().default((props.email as string) ?? ""),
    phoneNumber: z.string().default((props.phoneNumber as string) ?? ""),
    address: z.string().default((props.address as string) ?? ""),
  }),
);

const form = useForm({
  validationSchema: supplierSchema,
});

async function updateTheSupplier(supplier: SupplierT) {
  try {
    await invoke<Res<any>>("update_supplier", {
      supplier: {
        id: props.id,
        full_name: supplier.fullName,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
        address: supplier.address,
        image: "",
      },
    });
    //
    info(
      `UPDATE SUPPLIER: ${JSON.stringify({
        id: props.id,
        full_name: supplier.fullName,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
        address: supplier.address,
      })}`,
    );
    //
    toast.success(
      t("notifications.supplier.updated", { name: supplier.fullName }),
      {
        closeButton: true,
      },
    );
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
      error(`UPDATE SUPPLIER: ${err.error}`);
      return;
    }
    error(`UPDATE SUPPLIER: ${err}`);
  }
  finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  updateTheSupplier(values);
});
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("titles.suppliers.update") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField v-slot="{ componentField }" name="fullName">
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
        <FormField v-slot="{ componentField }" name="phoneNumber">
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
          {{ t("buttons.update", { name: fullName }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
