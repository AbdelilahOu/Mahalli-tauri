<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> Error </CardTitle>
    </CardHeader>
    <CardContent>
      {{ error }}
    </CardContent>
  </Card>
</template>
