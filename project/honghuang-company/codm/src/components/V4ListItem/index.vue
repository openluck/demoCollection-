<template>
  <router-link
    :to="link"
    class="zx-li"
    tag="li"
  >
    <span
      v-report="reportId"
      class="inner"
    >
      <img
        :src="src | convertHttps"
        class="zx-img"
      >
      <img
        v-if="type === 'video'"
        :src="convertImgExt('walkthrough/play-btn.png')"
        class="icon"
      >
    </span>
    <div
      v-report="reportId"
      class="zx-cont"
    >
      <p class="zx-desc">
        {{ sTitle }}
      </p>
      <div class="zx-info">
        <span>{{ sIdxTime }}</span>
        <img
          :src="convertImgExt('home/see.png')"
          class="see-num"
        >
        <span>{{ iTotalPlay }}</span>
      </div>
    </div>
    <i class="zx-line" />
    <slot />
  </router-link>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less">
@import "styles/mixin.less";
@import "styles/common.less";

.zx-li {
  position: relative;
  .mx-size(100%, auto);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 0.8rem;

  .inner {
    position: relative;
    .mx-size(1.59rem, 0.9rem);
  }

  .icon {
    width: 0.4rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .zx-img {
    .mx-size(1.59rem, 0.9rem);
    object-fit: cover;
  }

  .zx-cont {
    // flex: 1;
    width: 75%;
    min-height: 0.8rem;
    color: #aeb1b3;
    font-size: 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 0.05rem;
    box-sizing: border-box;

    .zx-desc {
      width: 98%;
      text-align: left;
      .single-line();
    }

    .zx-info {
      span {
        color: #91959a;
        font-size: 0.18rem;
        margin-right: 0.3rem;
      }

      .see-num {
        .mx-size(0.26rem, 0.12rem);
        margin-right: 0.08rem;
      }
    }
  }

  .zx-line {
    .mx-size(100%, 1px);
    background-color: #454f59;
    position: absolute;
    bottom: -9%;
    left: 0;

    &::before {
      content: '';
      .mx-size(1.5%, 100%);
      background-color: #a2a6ac;
      position: absolute;
      top: 0;
      left: 0;
    }

    &::after {
      content: '';
      .mx-size(1.5%, 100%);
      background-color: #a2a6ac;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

</style>
