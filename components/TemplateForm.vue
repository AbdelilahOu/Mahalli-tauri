<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { ORDER_STATUSES, INVOICE_STATUSES, CLIENT_FIELDS } from "~/consts";

const { t } = useI18n();

const ConfigSchema = z.object({
  template: z.object({
    name: z.string().nullable(),
    bytes: z.instanceof(Uint8Array).nullable(),
  }),
  marginTop: z.number().min(0).max(100),
  marginBottom: z.number().min(0).max(100),
  fields: z.object({
    status: z.boolean(),
    full_name: z.boolean(),
    email: z.boolean(),
    phone_number: z.boolean(),
    address: z.boolean(),
  }),
  documentValues: z.object({
    status: z.enum([...INVOICE_STATUSES, ...ORDER_STATUSES]).optional(),
    client: z.object({
      full_name: z.string().optional(),
      email: z.string().email().optional(),
      phone_number: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
});

type ConfigSchemaT = z.infer<typeof ConfigSchema>;

const props = defineProps<{
  statues: typeof INVOICE_STATUSES | typeof ORDER_STATUSES | undefined;
  config: any;
  document: any;
}>();

const emits = defineEmits<{
  (e: "updateConfig", payload: ConfigSchemaT): void;
  (e: "saveConfig"): void;
}>();

const configSchema = toTypedSchema(ConfigSchema);

// Form setup
const { handleSubmit, values, setFieldValue } = useForm<ConfigSchemaT>({
  validationSchema: configSchema,
  initialValues: {
    ...props.config,
    documentValues: {
      status: props.document.status,
      client: props.document.client,
    },
  },
});

// File handling
const handleFileBytesUpload = (bytes: Uint8Array, name: string) => {
  setFieldValue("template.bytes", bytes);
  setFieldValue("template.name", name);
};

const onSubmit = handleSubmit(async (values) => {
  emits("updateConfig", values);
});
</script>

<template>
  <form class="w-1/2 md:w-1/3 min-w-[500px]" @submit="onSubmit">
    <Card class="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>{{ t("fields.configuration") }}</CardTitle>
      </CardHeader>
      <CardContent class="flex-1">
        <FormField name="template.name">
          <FormItem>
            <FormLabel>{{ t("fields.template") }}</FormLabel>
            <FormControl>
              <UiUploader
                name="Pdf"
                :extensions="['pdf']"
                @save-bytes="handleFileBytesUpload"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="marginTop">
          <FormItem>
            <FormLabel>{{ t("fields.top-margin") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="marginBottom">
          <FormItem>
            <FormLabel>{{ t("fields.bottom-margin") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" />
            </FormControl>
          </FormItem>
        </FormField>

        <Separator class="my-2" />

        <div class="flex flex-col gap-2">
          <FormField v-slot="{ componentField }" name="fields.status">
            <FormItem class="flex justify-between items-center">
              <FormLabel>{{ t("fields.status") }}</FormLabel>
              <FormControl>
                <Switch
                  :default-checked="componentField.modelValue"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="documentValues.status">
            <FormItem>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue
                    class="text-muted-foreground"
                    :placeholder="t('select-status')"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="status in INVOICE_STATUSES"
                      :key="status"
                      :value="status"
                    >
                      {{ t(`status.${status.toLowerCase()}`) }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
        </div>

        <Separator class="my-2" />

        <div
          v-for="item in CLIENT_FIELDS"
          :key="item.field"
          class="flex flex-col gap-2"
        >
          <FormField v-slot="{ componentField }" :name="`fields.${item.field}`">
            <FormItem class="flex justify-between items-center">
              <FormLabel>{{ t(`fields.${item.label}`) }}</FormLabel>
              <FormControl>
                <Switch
                  :default-checked="componentField.modelValue"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            :name="`documentValues.client.${item.field}`"
          >
            <FormItem>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" type="button" @click="$emit('saveConfig')">
          {{ t("buttons.save") }}
        </Button>
        <Button type="submit" class="col-span-2">
          {{ t("buttons.update") }}
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
