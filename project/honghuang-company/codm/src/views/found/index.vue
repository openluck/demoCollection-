<template>
  <div class="found-page">
    <ul
      v-if="!$route.meta.hideSecNav"
      class="found-ul"
    >
      <router-link
        :to="'/found/square'"
        :class="$route.name === 'found-square' ? 'found-li on' : 'found-li'"
      >
        动态广场
      </router-link>
      <router-link
        :to="'/found/welfare'"
        :class="$route.name === 'found-welfare' ? 'found-li on' : 'found-li'"
      >
        <span
          v-if="hasIntegralPick"
          id="red-dot"
        />
        福利站
      </router-link>
      <router-link
        v-if="showCalendar"
        :to="'/found/calendar'"
        :class="$route.name === 'found-calendar' ? 'found-li on' : 'found-li'"
      >
        活动日历
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

.found-page {
  // .mx-size(calc(100vw - 0.77rem), 100%);
  // padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;
  // background: red;
  .mx-size(100%);

  .found-ul {
    .mx-size(100%, 0.77rem);
    display: flex;
    align-items: center;
    padding-left: 0.2rem;
    box-sizing: border-box;

    .found-li {
      .tab-li();
      position: relative;
    }
  }

  #red-dot {
    top: 0.11rem;
    right: 0.15rem;
  }
}
</style>
