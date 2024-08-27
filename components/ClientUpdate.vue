<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const props = defineProps<{
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}>();
const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();
const route = useRoute();

const clientSchema = toTypedSchema(
  z.object({
    fullName: z
      .string()
      .min(2)
      .max(50)
      .default(props.fullName as string),
    email: z.string().default((props.email as string) ?? ""),
    phoneNumber: z.string().default((props.phoneNumber as string) ?? ""),
    address: z.string().default((props.address as string) ?? ""),
  })
);

const form = useForm({
  validationSchema: clientSchema,
});

async function updateTheClient(client: ClientT) {
  try {
    await invoke<Res<any>>("update_client", {
      client: {
        id: props.id,
        full_name: client.fullName,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image: "",
      },
    });
    //
    info(
      `UPDATE CLIENT: ${JSON.stringify({
        id: props.id,
        full_name: client.fullName,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
      })}`
    );
    //
    toast.success(
      t("notifications.client.updated", { name: client.fullName }),
      {
        closeButton: true,
      }
    );
    // toggle refresh
    updateQueryParams({
      refresh: `refresh-update-${Math.random() * 9999}`,
    });
  } catch (err: any) {
    toast.error(t("notifications.error.title"), {
      description: t("notifications.error.description"),
      closeButton: true,
    });
    if (typeof err === "object" && "error" in err) {
      error(`UPDATE CLIENT: ${err.error}`);
      return;
    }
    error(`UPDATE CLIENT: ${err}`);
  } finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  updateTheClient(values);
});
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t("titles.clients.update") }}
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
