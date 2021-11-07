<template>
  <div class="rank-page">
    <V4VideoCardList
      v-report="'rank.rank-content'"
      :v4-id="v4Id"
    />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style lang="less" scoped>
@import "styles/mixin.less";

.rank-page {
  .mx-size(100%,calc(100vh - 0.77rem));
  // overflow-y: scroll;
}
</style>
