<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { toTypedSchema } from "@vee-validate/zod";
import { error, info } from "tauri-plugin-log-api";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { updateQueryParams } = useUpdateRouteQueryParams();
const { close } = useModal();

const clientSchema = toTypedSchema(CreateClientSchema);

const form = useForm({
  validationSchema: clientSchema,
});

const imagePath = ref<string>();

async function createNewClient(client: ClientT) {
  try {
    await invoke<Res<null>>("create_client", {
      client: {
        full_name: client.fullName,
        email: client.email,
        phone_number: client.phoneNumber,
        address: client.address,
        image: `data:image/png;base64,${imagePath.value}`,
      },
    });
    //
    info(
      `CREATE CLIENT: ${JSON.stringify({
        ...client,
        image: `data:image/png;base64,${imagePath.value}`,
      })}`,
    );
    //
    toast.success(
      t("notifications.client.created", { name: client.fullName }),
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
    if (typeof err === "object" && "error" in err) {
      error(`CREATE CLIENT: ${err.error}`);
      return;
    }
    error(`CREATE CLIENT: ${err}`);
  }
  finally {
    close();
  }
}

const onSubmit = form.handleSubmit((values) => {
  createNewClient(values);
});

function setImage(image: string) {
  imagePath.value = image;
}
</script>

<template>
  <form class="w-full flex justify-center" @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle> {{ t("titles.clients.create") }} </CardTitle>
      </CardHeader>
      <CardContent>
        <UiUploader
          name="Image"
          :extensions="['png', 'jpeg', 'webp']"
          @save:base64="setImage"
        />
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
          {{ t("buttons.add") }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
