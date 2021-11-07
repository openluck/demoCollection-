<template>
  <ul class="sell-ul">
    <own-route-link
      v-for="item in entryList"
      :key="item.id"
      v-report="['index.quick-entry',item.title]"
      :to="parserUrl(item.url, {title: encodeURIComponent(item.title), back: '1'})"
      class="sell-li"
      role="li"
    >
      <sui-image
        :src="item.imgUrl"
      />
    </own-route-link>
  </ul>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import "styles/mixin.less";

.sell-ul {
  .mx-size(54.4%, 100%);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: flex-start;

  .sell-li {
    .mx-size(48.8%, 47.5%);
    margin-bottom: 2%;

    img {
      .mx-size(100%);
      display: block;
    }

    &:nth-child(3) {
      margin-bottom: 0;
    }

    &:nth-child(4) {
      margin-bottom: 0;
    }
  }
}

.sell-li {
  /deep/ .sui-image {
    .sui--container {
      background-position: left;
    }
  }
}
</style>
