<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { invoke } from "@tauri-apps/api";
import { useForm } from "vee-validate";
import { z } from "zod";
import type { SupplierT } from "@/schemas/supplier.schema";
import type { Res } from "@/types";
import { error, info } from "tauri-plugin-log-api";
import { toast } from "vue-sonner";

const { updateQueryParams } = useUpdateRouteQueryParams();
const { toggleModal } = useStore();
const { t } = useI18n();
const route = useRoute();
const isLoading = ref<boolean>(false);

const supplierSchema = toTypedSchema(
  z.object({
    fullname: z
      .string()
      .min(2)
      .max(50)
      .default(route.query.fullname as string),
    email: z.string().default((route.query.email as string) ?? ""),
    phoneNumber: z.string().default((route.query.phoneNumber as string) ?? ""),
    address: z.string().default((route.query.address as string) ?? ""),
    image: z.string().default((route.query.image as string) ?? ""),
  })
);

const form = useForm({
  validationSchema: supplierSchema,
});

const updateTheSupplier = async (supplier: SupplierT) => {
  try {
    await invoke<Res<any>>("update_supplier", {
      supplier: {
        id: route.query.id,
        full_name: supplier.fullname,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
        address: supplier.address,
        image: supplier.image,
      },
    });
    //
    info(
      `UPDATE SUPPLIER: ${JSON.stringify({
        id: route.query.id,
        full_name: supplier.fullname,
        email: supplier.email,
        phone_number: supplier.phoneNumber,
        address: supplier.address,
        image: supplier.image,
      })}`
    );
    //
    toast.success(
      t("notifications.supplier.updated", { name: supplier.fullname }),
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
    error("UPDATE SUPPLIER: " + err.error);
  } finally {
    hideModal();
  }
};

const hideModal = () => toggleModal(false);

const onSubmit = form.handleSubmit((values) => {
  updateTheSupplier(values);
});
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("s.u.title") }}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
          {{ t("g.b.u", { name: $route.query.fullname }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
