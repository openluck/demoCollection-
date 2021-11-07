<template>
  <div class="dh-pop">
    <div class="dh-dialog">
      <div class="dh-con">
        <h4 class="dh-tit">
          活动规则
        </h4>
        <div class="rules rules-top">
          <p class="dh-rules">
            1.完成任务可领取积分；
          </p>
          <p class="dh-rules">
            2.使用积分可在兑换中心兑换福利道具；
          </p>
          <p class="dh-rules">
            3.兑换中心奖励每月有兑换次数限制，奖励会不定期更新；
          </p>
          <p class="dh-rules">
            4.兑换的奖励道具直接发送至账号邮箱，请前往邮箱查收；
          </p>
          <p class="dh-rules">
            5.如因系统延迟未收到奖励，需重新登录游戏领取。
          </p>
        </div>
        <i class="pop-line" />
        <div
          class="sure"
          @click.stop="handleCloseTap"
        >
          关闭
        </div>
      </div>
      <div
        class="dhpop-close"
        @click.stop="handleCloseTap"
      >
        <img
          :src="convertImgExt('found/dhpop-close.png')"
        >
      </div>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import "styles/mixin.less";
@import 'styles/dialog.less';

// 兑换规则的样式
.dh-rules {
  color: #fff;
  font-size: 0.22rem;
  text-align: left;
  padding-left: 0.3rem;
  line-height: 0.33rem;
}

.rules {
  height: 55%;
  overflow-y: scroll;
}

.rules-top {
  margin-top: 0.3rem;
}

</style>
