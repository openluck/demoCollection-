<template>
  <sui-scroll
    :pull-down="!noData"
    style="height: 100%;"
    @refresh="handlerRefresh"
    @reach-end="handleScrollLoadMore"
  >
    <div class="rank-ul">
      <template
        v-for="item in list"
      >
        <V4CardItem
          :key="item.iId"
          :report-id="reportId"
          :src="chooseCover(item, '370*190')"
          :s-title="item.sTitle"
          :s-idx-time="item.sIdxTime | timeFormat"
          :i-total-play="item.iTotalPlay"
          :i-id="item.iId"
          :s-desc="item.sDesc"
          :type="item.iInfoType === 1 ? 'article': 'video'"
        />
      </template>
    </div>
    <sui-load
      v-if="!noData"
      :more="!noMoreData"
    />
    <Empty
      v-if="noData"
      :msg="'暂时没有数据哦'"
    />
  </sui-scroll>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less">
@import "styles/mixin.less";

.rank-ul {
  // .mx-size(100%, 100%);
  display: flex;
  flex-wrap: wrap;
}

</style>
