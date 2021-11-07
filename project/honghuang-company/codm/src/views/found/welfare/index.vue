<template>
  <div
    class="welfare-page"
    style="color: #fff;"
  >
    <div
      v-if="!isExperienceEnv"
      id="index"
    >
      <div class="index-main">
        <div
          class="jf-box"
        >
          <div class="index-main-point-balance">
            <span class="now-jf">当前积分：</span>
            <span
              v-if="userInfo"
              class="jf"
            >{{ userInfo.pointBalance }}</span>
            <i class="horn1 horn" />
            <i class="horn2 horn" />
            <i class="horn3 horn" />
            <i class="horn4 horn" />
          </div>
          <router-link
            class="jf-frcord"
            :to="'/found/integral_record'"
          >
            积分记录
          </router-link>
          <span
            class="rule-box"
            @click.stop="handleRuleBtnTap"
          >
            积分规则
          </span>
        </div>

        <div class="index-mall-btn">
          <div
            v-for="index in 3"
            :key="index"
            class="gold-jfbox"
          >
            <img
              v-if="index == 1"
              src="@assets/img/found/gun.png"
            >
            <img
              v-else-if="index == 2"
              src="@assets/img/found/pendant.png"
            >
            <img
              v-else-if="index == 3"
              src="@assets/img/found/experience.png"
            >
            <i class="horn1 horn" />
            <i class="horn2 horn" />
            <i class="horn3 horn" />
            <i class="horn4 horn" />
          </div>
          <router-link
            v-report="'points.go-welfare-exchange'"
            :to="'/found/gift'"
            tag="span"
          >
            兑换福利
          </router-link>
        </div>
      </div>
      <MissionList />
    </div>
    <!-- note: 在关闭按钮上绑定 关闭积分规则的对话框的函数 [hideRuleDialog] -->
    <IntegralRuleDialog
      v-if="showRuleDialog"
      :close="hideRuleDialog"
    />
    <SystemSafeguardHint v-if="isExperienceEnv" />
    <Loading v-if="loading && !isExperienceEnv" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.welfare-page {
  .mx-size(100%, calc(100vh - 1rem));
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;

  #index {
    .mx-size(100%, 100%);
    box-sizing: border-box;

    .index-main-record-btn {
      border-radius: 0;
      top: 10%;
      right: 102%;
      transform: translateX(280%);
      font-size: 0.2rem;
      color: #fff;
      z-index: 9;
      text-align: center;
      width: 1.4rem;
      height: 0.44rem;
      line-height: 0.44rem;
      margin: 0.06rem;

      &::before {
        content: '\79ef\5206\8bb0\5f55';
        display: block;
      }
    }
  }

  .index-main {
    // background: url(../img/sc-bg.png) no-repeat center/100vw 0.68rem;
    width: 100%;
    height: 0.68rem;
    background-size: cover;
    position: relative;
    overflow: visible;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.22rem;
  }

  .jf-box {
    display: flex;
    align-items: center;
    .mx-size(65%, 100%);
    background: #353c48;
    position: relative;
    justify-content: flex-start;
    // background-color: #2a313b;

    .index-main-point-balance {
      // font-family: 'UltraBack';
      font-size: 0.35rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffed57;
      text-align: center;
      height: 0.68rem;
      padding: 0 0.1rem;
      position: relative;
      background: url(https://gzhcos.qq.com/codm/found/jf-box.png) no-repeat center/cover;

      .horn {
        position: absolute;
        .mx-size(0.05rem, 0.05rem);
        border: 1px solid @color;
      }

      .horn1 {
        border-bottom-color: transparent;
        border-left-color: transparent;
        right: 0.05rem;
        top: 0.05rem;
      }

      .horn2 {
        border-bottom-color: transparent;
        border-right-color: transparent;
        left: 0.05rem;
        top: 0.05rem;
      }

      .horn3 {
        border-top-color: transparent;
        border-right-color: transparent;
        left: 0.05rem;
        bottom: 0.05rem;
      }

      .horn4 {
        border-top-color: transparent;
        border-left-color: transparent;
        right: 0.05rem;
        bottom: 0.05rem;
      }

      .now-jf {
        font-size: 0.2rem;
        color: #fff;
      }
    }

    .jf-frcord {
      .mx-size(auto, 100%);
      font-size: 0.2rem;
      color: #fff;
      margin-left: 0.22rem;
      display: flex;
      align-items: center;
    }
  }

  .index-mall-btn {
    font-size: 0.2rem;
    letter-spacing: 0.01rem;
    color: #4b410f;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #353c48;
    .mx-size(30%, 100%);
    border: 1px solid #464f5b;

    .gold-jfbox {
      .mx-size(0.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .mx-horn(0.05rem, #9fa2a8);
      background-color: #2a313b;
      border: 1px solid #464f5b;
      margin-right: 0.1rem;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    span {
      background: url(https://gzhcos.qq.com/codm/found/dhfl-btn.png) no-repeat center/cover;
      width: 1.2rem;
      height: 0.34rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.rule-box {
  font-size: 0.2rem;
  position: absolute;
  right: 0;
  padding: 0.1rem;
}
</style>
