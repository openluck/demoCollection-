<template>
  <div class="dynamic-page">
    <SystemSafeguardHint v-if="isExperienceEnv" />
    <DynamicWaterfall
      v-if="$route.name.includes('central') && !isExperienceEnv"
      :key="'central'"
      :hide-topic="true"
      :tab="'own'"
    />
  </div>
</template>

<script  src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
// @import 'index.less';
.dynamic-page {
  .mx-size(100%,calc(100vh - 0.77rem));
  margin-top: 0.22rem;

  /deep/ .central-dtul {
    height: 100%;
  }
}

</style>
