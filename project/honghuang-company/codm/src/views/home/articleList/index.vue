<template>
  <div class="article-list-page">
    <sui-scroll
      class="item"
      :pull-down="!noData"
      @refresh="handlerRefresh"
      @reach-end="handleScrollLoadMore"
    >
      <V4ListItem
        v-for="item in list"
        :key="item.iId"
        :src="item.sIMG"
        :i-id="item.iId"
        :s-title="item.sTitle"
        :i-total-play="item.iTotalPlay"
        :s-idx-time="item.sIdxTime"
        :type="item.iInfoType == 1 ? 'article' : 'video'"
      />
    </sui-scroll>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">
@import "styles/mixin.less";

.article-list-page {
  .mx-size(100%);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    .mx-size(50%,100%);
  }
}
</style>
