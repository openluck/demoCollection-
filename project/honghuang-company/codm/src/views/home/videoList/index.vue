<template>
  <div class="video-list-page">
    <V4VideoCardList :v4-id="v4Id" />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">
@import 'styles/mixin.less';

.video-list-page {
  .mx-size(100%, calc(100vh - 0.77rem));
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;
}
</style>
