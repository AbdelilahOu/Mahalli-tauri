<script setup lang="ts"></script>

<template>
  <span
    :class="
      cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        ($attrs.class as String) ?? '',
      )
    "
  >
    <slot />
  </span>
</template>
