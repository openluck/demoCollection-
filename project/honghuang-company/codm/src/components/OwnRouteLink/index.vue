<template>
  <span
    v-report="reportId"
    @click.stop="handleNavgate"
  >
    <slot />
  </span>
</template>

<script lang="ts" src="./index.ts"></script>
