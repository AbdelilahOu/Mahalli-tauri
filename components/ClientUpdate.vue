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
const { close } = useModal();
const route = useRoute();

const isUpdating = ref<boolean>(false);

const props = defineProps<{
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
}>();

const clientSchema = toTypedSchema(
  z.object({
    fullname: z
      .string()
      .min(2)
      .max(50)
      .default(props.fullname as string),
    email: z.string().default((props.email as string) ?? ""),
    phoneNumber: z.string().default((props.phoneNumber as string) ?? ""),
    address: z.string().default((props.address as string) ?? ""),
  })
);

const form = useForm({
  validationSchema: clientSchema,
});

const updateTheClient = async (client: ClientT) => {
  try {
    await invoke<Res<any>>("update_client", {
      client: {
        id: props.id,
        full_name: client.fullname,
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
        full_name: client.fullname,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
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
    if (typeof err == "object" && "error" in err) {
      error("UPDATE CLIENT: " + err.error);
      return;
    }
    error("UPDATE CLIENT: " + err);
  } finally {
    close();
  }
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
          @click="close"
        >
          {{ t("g.b.no") }}</Button
        >
        <Button :disabled="isUpdating" type="submit" class="col-span-2">
          {{ t("g.b.u", { name: fullname }) }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
