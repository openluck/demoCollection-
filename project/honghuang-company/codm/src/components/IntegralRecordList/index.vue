<template>
  <div class="recode-con">
    <sui-scroll
      v-if="!noData"
      style="height: 100%;"
      @reach-end="handleScrollLoadMore"
    >
      <template v-for="item in recordList">
        <div
          v-if="type === 'integralLog'"
          :key="item.id"
          class="recode-ul"
        >
          <div class="recode-li">
            <span>{{ item.dealTime * 1000 | timeFormat("yyyy年MM月dd日") }}</span>
            <span>{{ item.dealDesc }}</span>
            <span class="jf-num">积分{{ item.dealType | convertDealTypeToText }}{{ item.dealAmount }}</span>
          </div>
          <i class="line" />
        </div>
        <div
          v-else
          :key="item.orderId"
          class="award-ul"
        >
          <div class="award-li">
            <div
              v-if="item.goodsList && item.goodsList.length > 0"
              class="name-box"
            >
              <p>{{ item.goodsList[0].goodsName }}</p>
            </div>
            <div class="award-left">
              <p>{{ item.dealMsg }}</p>
              <p>{{ item.logistics.statusTxt }}</p>
            </div>
            <div class="award-right">
              <p>{{ item.payAmount }}积分</p>
              <p>{{ item.orderTime * 1000 | timeFormat("yyyy年MM月dd日") }}</p>
            </div>
          </div>
          <i class="line" />
        </div>
      </template>
      <sui-load
        v-if="!noData"
        :more="loading"
      />
    </sui-scroll>
    <i class="horn1 horn" />
    <i class="horn2 horn" />
    <i class="horn3 horn" />
    <i class="horn4 horn" />
    <Empty v-if="noData" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.recode-con {
  position: relative;
  box-sizing: border-box;
  margin-top: 0.1rem;
  .mx-size(100%, calc(100vh - 1rem));
  background-color: rgba(44, 51, 62, 0.9);
  padding-bottom: 0.1rem;
  border: 1px solid #646d7a;

  .mx-horn(0.1rem, #9fa2a8);

  /deep/ .sui--container {
    height: 100%;
  }

  .recode-ul {
    padding: 0 0.2rem;
    height: 0.8rem;

    .recode-li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;

      span {
        color: #fff;
        font-size: 0.24rem;
        width: 33%;
      }

      .jf-num {
        color: #f9e655;
      }
    }
  }
}

.award-ul {
  padding: 0 0.2rem;
  height: 18%;

  .award-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    font-size: 0.2rem;
    color: #fff;
    text-align: left;

    .name-box {
      width: 20%;
    }

    .award-left {
      flex: 0.8;

      p:first-child {
        margin-bottom: 0.05rem;
      }
    }

    .award-right {
      flex: 0.3;

      p:first-child {
        color: #f9e655;
        margin-bottom: 0.05rem;
      }
    }
  }
}

</style>
