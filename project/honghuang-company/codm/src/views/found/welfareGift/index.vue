<template>
  <!-- 礼包页面 -->
  <div class="gift-page">
    <div class="title">
      福利站
    </div>
    <div class="content">
      <h3>
        物资兑换中心
        <!-- <span class="points-record">积分记录</span> -->
        <span
          class="exchange-record"
          @click.stop="handleJump"
        >兑换记录</span>
      </h3>
      <Loading v-if="loading" />
      <sui-scroll
        v-if="!noData || !loading"
        style="height: calc(100vh - 1.2rem);"
        @reach-end="handleScrollLoadMore"
      >
        <ul class="wz-ul">
          <li
            v-for="item in giftList"
            :key="item.goodsId"
            class="wz-li"
          >
            <span class="wz-name">{{ item.goodsName }}</span>
            <div class="wz-box">
              <div class="wz-img">
                <img :src="item.cover">
              </div>
              <div class="dh-num">
                <p>{{ item.price }}积分</p>
                <p>
                  <span>限量</span>
                  <span class="num">{{ item.userBuyCount }}</span>
                  <span class="num">/</span>
                  <span class="num">{{ item.userBuyLimit }}</span>
                </p>
              </div>
            </div>
            <i class="icon icon1" />
            <i class="icon icon2" />
            <!-- 积分按钮 -->
            <div
              v-if="userInfo.pointBalance < item.price && item.userBuyCount !== item.userBuyLimit"
              class="jfbz-btn"
            >
              积分不足
            </div>
            <div
              v-else-if="item.userBuyCount === item.userBuyLimit"
              class="ydh-btn"
            >
              已兑换
            </div>
            <div
              v-else
              class="dh-btn"
              @click.stop="handleExchangeBtnTap(item.goodsId)"
            >
              兑换
            </div>
          </li>
          <li
            v-for="index in (4 - giftList.length % 4)"
            :key="index"
            class="wz-li hide"
          />
        </ul>
      </sui-scroll>
      <!-- 福利兑换弹窗 -->
      <div
        v-if="showConfirmExchangeDialog"
        class="dh-pop"
      >
        <div class="dh-dialog">
          <div class="dh-con">
            <h4 class="dh-tit">
              确认兑换如下奖励吗?
            </h4>
            <div class="wx-bg">
              <div class="wq">
                <img :src="currentGift.cover">
              </div>
            </div>
            <p class="wq-name">
              {{ currentGift.goodsName }}
            </p>
            <i class="pop-line" />
            <div class="dh-btn">
              <div
                v-report="['points.exchange-welfare', currentGift.goodsName]"
                class="dhbtn-bg"
                @click.stop="handleExchangeConfrimTap"
              >
                确定兑换
              </div>
              <div
                class="dhbtn-xx"
                @click.stop="handleCloseExchangeConfrimDialog"
              >
                我在想想
              </div>
            </div>
          </div>
          <div
            class="dhpop-close"
            @click.stop="handleCloseExchangeConfrimDialog"
          >
            <img
              :src="convertImgExt('found/dhpop-close.png')"
            >
          </div>
        </div>
      </div>

      <!-- 兑换成功 -->
      <div
        v-if="showExchangeSuccDialog"
        class="dh-pop"
      >
        <div class="dh-dialog">
          <div class="dh-con">
            <h4 class="dh-tit">
              温馨提示
            </h4>
            <p class="tips">
              兑换成功
            </p>
            <i class="pop-line" />
            <div
              class="sure"
              @click.stop="handleTapExchangeSuccDialogCloseBtn"
            >
              确定
            </div>
          </div>
          <div
            class="dhpop-close"
            @click.stop="handleTapExchangeSuccDialogCloseBtn"
          >
            <img :src="convertImgExt('found/dhpop-close.png')">
          </div>
        </div>
      </div>

      <!-- 余额不足 -->
      <div
        v-if="showTipsDialog"
        class="dh-pop"
      >
        <div class="dh-dialog">
          <div class="dh-con">
            <h4 class="dh-tit">
              温馨提示
            </h4>
            <p class="tips">
              {{ tips }}
            </p>
            <i class="pop-line" />
            <div
              class="sure"
              @click.stop="handleTipsCloseBtn"
            >
              确定
            </div>
          </div>
          <div
            class="dhpop-close"
            @click.stop="handleTipsCloseBtn"
          >
            <img :src="convertImgExt('found/dhpop-close.png')">
          </div>
        </div>
      </div>
      <sui-load
        v-if="!noData"
        :more="loading"
      />
      <Empty v-if="noData" />
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';
@import 'styles/dialog.less';

.gift-page {
  // padding: 0.21rem 0.17rem 0 0.17rem;
  // margin-top: 0.15rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  .mx-size(100%);

  .title {
    color: #fff;
    font-size: 0.26rem;
    margin-top: 0.23rem;
  }

  .content {
    padding: 0 0.2rem 0 0.2rem;
    box-sizing: border-box;
    margin-top: 0.4rem;

    h3 {
      position: relative;

      // .points-record,
      .exchange-record {
        text-align: center;
        position: absolute;
        color: #fff;
        font-size: 0.2rem;
        border: 1px solid #646d7a;
        padding: 0.04rem 0.3rem;
        font-weight: normal;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
      }
      // .points-record {
      //   right: 1.6rem;
      // }
    }

    .top-nav {
      .mx-top-nav;
      justify-content: center;
    }

    .wz-ul {
      .mx-size(100%);
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.1rem;
      justify-content: space-between;
      margin-bottom: 0.35rem;

      .wz-li {
        // .mx-size(3.11rem, 2.71rem);
        width: 24%;
        height: 2.71rem;
        // background: url(https://gzhcos.qq.com/codm/found/wq-bg.png) no-repeat center/cover;
        color: #fff;
        font-size: 0.2rem;
        margin-bottom: 0.2rem;
        border: 1px solid #464f5b;
        box-sizing: border-box;
        position: relative;

        .icon {
          width: 0.05rem;
          height: 0.05rem;
          background: #fff;
          position: absolute;

          &.icon1 {
            left: 0;
            top: 0;
          }

          &.icon2 {
            right: 0;
            top: 0;
          }
        }

        .wz-name {
          color: #fff;
          font-size: 0.24rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #474f5a;
          .mx-size(100%, 0.36rem);
        }

        .wz-box {
          // .mx-size(1.28rem, auto);
          background: url(~@assets/img/found/wz-bg.jpg) no-repeat center/100% 1.79rem;
          .mx-size(100%, 1.79rem);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .wz-img {
            max-width: 1.89rem;
            height: 1.17rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }

          img {
            .mx-size(100%);
            // object-fit: contain;
          }
        }

        .dh-num {
          width: 100%;
          color: #fff;
          font-size: 0.2rem;
          display: flex;
          justify-content: space-between;
          margin-top: 0.2rem;
          padding: 0 0.1rem;
          box-sizing: border-box;
          position: absolute;
          bottom: 0;

          span:first-child {
            margin-right: 0.1rem;
          }

          .num {
            color: #ffed57;
          }
        }

        .dh-btn {
          color: #000;
          background-color: #ffed57;
          .mx-size(100%, 0.52rem);
          font-size: 0.28rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .jfbz-btn {
          background-color: #b4b7bd;
          color: #000;
          .mx-size(100%, 0.52rem);
          font-size: 0.28rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ydh-btn {
          color: #fff;
          .mx-size(100%, 0.52rem);
          font-size: 0.28rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    // 兑换成功的样式
    .tips {
      color: #fff;
      font-size: 0.26rem;
      margin-top: 1.1rem;
    }
  }
}

.hide {
  opacity: 0;
}

</style>
