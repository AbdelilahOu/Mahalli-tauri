<script setup lang="ts">
import type { ClientT } from "@/schemas/client.schema";
import type { Res } from "@/types";
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const route = useRoute();

const isUpdating = ref<boolean>(false);

const clientSchema = toTypedSchema(
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
  validationSchema: clientSchema,
});

const updateTheClient = async (client: ClientT) => {
  try {
    await invoke<Res<any>>("update_client", {
      client: {
        id: route.query.id,
        full_name: client.fullname,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image: client.image,
      },
    });
    //
    info(
      `UPDATE CLIENT: ${JSON.stringify({
        id: route.query.id,
        full_name: client.fullname,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image: client.image,
      })}`
    );
    //
    toast.success(
      t("notifications.client.updated", { name: client.fullname }),
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
    error("UPDATE CLIENT: " + err.error);
  } finally {
    hideModal();
  }
};

const hideModal = () => {
  store.setters.updateStore({ key: "show", value: false });
};

const onSubmit = form.handleSubmit((values) => {
  updateTheClient(values);
});
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("c.u.title") }}
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
          :disabled="isUpdating"
          variant="outline"
          @click="hideModal"
        >
          {{ t("g.b.no") }}</Button
        >
        <Button :disabled="isUpdating" type="submit" class="col-span-2">
          {{ t("g.b.u", { name: $route.query.fullname }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
