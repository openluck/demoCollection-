<template>
  <router-link
    v-report="reportId"
    :to="`/walkthrough/weapon_detail/${gunId}`"
    class="weapon-li"
    role="li"
  >
    <div class="weapon-box">
      <img
        v-if="data.name"
        :src="data.img"
      >
      <img
        v-else
        :src="data.img"
        class="placeholder-img"
      >
    </div>
    <span class="wq-name">{{ data.name }}</span>
    <i class="icon icon1" />
    <i class="icon icon2" />
    <i class="icon icon3" />
    <i class="icon icon4" />
  </router-link>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';

.weapon-li {
  .mx-size(24.3%, 1.6rem);
  background: url(https://gzhcos.qq.com/codm/walkthrough/wq-bg.png) no-repeat center/cover;
  margin-right: 0.93%;
  margin-bottom: 0.18rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .weapon-box {
    .mx-size(auto, 1.06rem);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1rem;

    img {
      height: 100%;
      object-fit: contain;
    }
  }

  .wq-name {
    width: 100%;
    color: #fff;
    font-size: 0.26rem;
    text-align: left;
    padding-left: 0.3rem;
    box-sizing: border-box;
    position: relative;

    &::before {
      content: '';
      .mx-size(0, 0);
      border-left: 0.11rem solid #fff;
      border-top: 0.07rem solid transparent;
      border-right: 0.11rem solid transparent;
      border-bottom: 0.07rem solid transparent;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0.12rem;
    }
  }

  .icon {
    width: 0.05rem;
    height: 0.05rem;
    background: #fff;
    position: absolute;
    z-index: 2;

    &.icon1 {
      left: 0;
      top: 0;
    }

    &.icon2 {
      right: 0;
      top: 0;
    }

    &.icon3 {
      right: 0;
      bottom: 0;
    }

    &.icon4 {
      left: 0;
      bottom: 0;
    }
  }

  &:nth-child(4n) {
    margin-right: 0;
  }
}

.placeholder-img {
  .mx-size(1.34rem, 0.62rem);
}
</style>
