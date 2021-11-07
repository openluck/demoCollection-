<template>
  <div class="central-dtul">
    <sui-scroll
      style="height: 100%;"
      @reach-end="handleScrollLoadMore"
    >
      <!-- 话题 -->
      <TopicList
        v-if="!hideTopic"
        :handle-topic-item-click="handleTopicTabChange"
        :type="currentType"
      />
      <!-- 我的动态 -->
      <own-waterfall
        v-if="!noData || !loading || dynamicList.length>0"
        :key="currentType"
        :list="dynamicList"
      >
        <template v-slot="props">
          <DynamicCard
            :key="props.item.aid"
            :data="props.item"
            :dynamic-report-key="currentType"
          />
        </template>
      </own-waterfall>
      <sui-load
        v-if="!noData && loading"
        :more="loading"
      />
      <p
        v-if="!showMore && !noData && !loading"
        class="no-more-data"
      >
        --我也是有底线的哦--
      </p>
      <Empty
        v-if="noData"
        :msg="isError ? '好像发生错误了哦!': '暂时没有动态喔!'"
      />
    </sui-scroll>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
// 我的动态
.central-dtul {
  .mx-size(100%, calc(100% - 0.55rem));
  // overflow-y: scroll;

  /deep/ .sui--container {
    text-align: left;
    margin-bottom: 0.1rem;
  }
}
</style>
