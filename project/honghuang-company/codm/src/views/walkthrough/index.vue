<template>
  <div class="walkthrough-page">
    <ul
      v-if="!$route.meta.hideTwoLevelNav"
      class="walkthrough-ul"
    >
      <router-link
        v-for="(item, index) in tabArr"
        :key="index"
        :to="item.routerName"
        :class="['walkthrough-li', getCurrentPath() === item.routerName ? 'on' : '']"
      >
        {{ item.name }}
      </router-link>
    </ul>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.walkthrough-page {
  // .mx-size(calc(100vw - 0.77rem), 100%);
  .mx-size(100%, 100%);
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;
  // background: red;
  .walkthrough-ul {
    .mx-size(100%, 0.77rem);
    display: flex;
    align-items: center;

    .walkthrough-li {
      .tab-li();
    }
  }
}
</style>
