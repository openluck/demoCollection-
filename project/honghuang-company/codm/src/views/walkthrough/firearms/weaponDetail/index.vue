<template>
  <!-- 武器详情页面 -->
  <div class="weapondetails-page">
    <h2 class="top-nav">
      <span class="title">
        武器详情
      </span>
    </h2>
    <div
      v-if="detail"
      class="content"
    >
      <div class="weapondetails-left">
        <div class="weapons">
          <p class="weapon-name">
            {{ detail.wqmc1a }}
          </p>
          <div class="wq-box">
            <img :src="detail.wqlhxqyFb">
          </div>
          <i class="line" />
        </div>
        <div class="weapon-data">
          <h3>数值介绍</h3>
          <div class="data-box">
            <RadarChart :data="detail.wqszd3b[0]" />
            <!-- 直方图 -->
            <BarChart :detail="detail.wqszd3b[0]" />
          </div>
        </div>
        <div
          v-if="detail.wqpjicon8e && detail.wqpjicon8e.length > 0"
          class="parts"
        >
          <h3>推荐配件</h3>
          <ul class="parts-ul">
            <li
              v-for="(item, index) in detail.wqpjicon8e"
              :key="index"
              class="parts-li"
            >
              <img :src="item.wqpjicon8e">
              <span>{{ item.wqpjmcF2 }}</span>
            </li>
          </ul>
        </div>
        <div class="word">
          <h3>一句话攻略</h3>
          <p class="word-desc">
            {{ detail.wqyjhglEb }}
          </p>
        </div>
      </div>
      <div class="weapondetails-right">
        <h3>玩法攻略</h3>
        <div class="rank-box">
          <V4VideoCardList
            :v4-id="v4Id"
            :report-id="['arms.arms-content', detail.wqmc1a]"
          />
        </div>
      </div>
    </div>
    <Loading v-else />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.weapondetails-page {
  .top-nav {
    .mx-top-nav;
    justify-content: center;
  }

  .nav-bg-img {
    width: 100%;
    .mx-nav-bg-img;
  }

  .content {
    .mx-size(100%, calc(100vh - 0.77rem));
    display: flex;
    justify-content: space-between;
    padding-top: 0.2rem;
    box-sizing: border-box;
  }

  .weapondetails-left {
    .mx-size(38%, 100%);
    overflow-y: scroll;
    padding-bottom: 0.2rem;
    box-sizing: border-box;

    .weapon-name {
      color: #ffed57;
      font-size: 0.4rem;
      text-align: left;
      position: absolute;
      left: 0.1rem;
      top: 0.1rem;
    }

    .weapons {
      // .mx-size(100%, auto);
      .mx-size(100%, 1.9rem);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url(~@assets/img/walkthough/wq-box.png) no-repeat center/cover;

      .wq-box {
        .mx-size(100%, 100%);
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          .mx-size(90%, auto);
        }
      }

      .line {
        position: absolute;
        left: 0;
        bottom: -0.11rem;

        &::before {
          content: '';
          .mx-size(1.5%, 100%);
          background-color: #fff;
          position: absolute;
          top: 0;
          left: 0;
        }

        &::after {
          content: '';
          .mx-size(1.5%, 100%);
          background-color: #fff;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }

    .weapon-data {
      // .mx-size(100%, 35%);
      .mx-size(100%, auto);

      h3 {
        margin-top: 7%;
      }

      .data-box {
        // .mx-size(100%, 87%);
        .mx-size(100%, 1.9rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .parts {
      h3 {
        margin-top: 2%;
      }

      .parts-ul {
        .mx-size(100%, 0.87rem);
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        margin-top: 3%;

        .parts-li {
          .mx-size(0.87rem, 100%);
          display: inline-block;
          position: relative;
          margin-right: 0.18rem;
          vertical-align: text-top;

          img {
            .mx-size(100%, 100%);
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
          }

          span {
            width: 100%;
            color: #f4f4f4;
            display: block;
            font-size: 0.16rem;
            position: absolute;
            bottom: 0.02rem;
            text-align: center;
            .single-line();
          }
        }
      }
    }

    .word {
      h3 {
        margin-top: 3%;
      }

      .word-desc {
        color: #bdbfc1;
        font-size: 0.2rem;
        text-align: left;
        // .single-line();
      }
    }
  }

  .weapondetails-right {
    .mx-size(60%, calc(100vh - 0.77rem));

    .rank-box {
      .mx-size(100%, calc(100% - 0.55rem));
      overflow-y: scroll;
      margin-top: 0.2rem;

      /deep/ .rank-ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: 0;
        padding-bottom: 0.3rem;
        box-sizing: border-box;

        .rank-li {
          width: 49%;
          margin-right: 0;
        }

        .rank-li:nth-child(3n + 3) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
