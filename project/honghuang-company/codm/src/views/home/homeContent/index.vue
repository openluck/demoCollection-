<template>
  <div class="main-content">
    <div class="home-top">
      <Swiper />
      <QuickEntry />
    </div>
    <div class="home-bottom">
      <!-- note: 大神宝典 -->
      <WalkthroughLabel />
      <div class="home-zx">
        <div class="tit-box">
          <h3>最新资讯</h3>
        </div>
        <ul class="zx-ul">
          <sui-scroll
            class="scroll-wrapper"
            style="height: 100%;"
            :pull-down="!noData"
            @refresh="handlerRefresh"
            @reach-end="handleScrollLoadMore"
          >
            <template v-for="item in list">
              <V4ListItem
                :key="item.iId"
                :report-id="'index.news'"
                :src="chooseCover(item, '160*90')"
                :i-id="item.iId"
                :s-title="item.sTitle"
                :i-total-play="item.iTotalPlay"
                :s-idx-time="item.sIdxTime"
                :type="item.iInfoType == 1 ? 'article' : 'video'"
              />
            </template>
            <sui-load
              v-if="!noData"
              :more="!noMoreData"
            />
          </sui-scroll>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.main-content {
  padding: 0 0.24rem 0 0.2rem;
  margin-top: 0.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 0.77rem);
}

.home-top {
  .mx-size(100%, 41%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  // min-height: 1.8rem;
}

.home-bottom {
  .mx-size(100%, 56%);
  display: flex;
  justify-content: space-between;
  min-height: 2.7rem;

  .home-zx {
    .mx-size(54.4%, 100%);

    .tit-box {
      .mx-size(100%, 0.61rem);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 0.26rem;
        color: #fff;
        padding-left: 0.12rem;
        box-sizing: border-box;
        position: relative;

        &::before {
          content: '';
          width: 0.04rem;
          height: 0.24rem;
          background-color: #f9e655;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }
    }

    .zx-ul {
      .mx-size(100%, 82%);
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;

      /deep/ .zx-li {
        margin-bottom: 1.6%;
      }

      /deep/ .sui-load {
        padding: 0 !important;
      }
    }
  }
}
</style>
