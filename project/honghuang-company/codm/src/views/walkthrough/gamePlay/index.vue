<template>
  <div class="gameplay-page">
    <ul class="firearms-ul">
      <!-- 加on选中 -->
      <li
        v-report="['mp.mp-tab', '模式攻略']"
        :class="['firearms-li', tab === 'mode' ? 'on': '']"
        @click.stop="handleClickTabTap('mode')"
      >
        <span class="weapon">模式攻略</span>
      </li>
      <li
        v-report="['mp.mp-tab', '地图攻略']"
        :class="['firearms-li', tab === 'map' ? 'on': '']"
        @click.stop="handleClickTabTap('map')"
      >
        <span class="weapon">地图攻略</span>
      </li>
      <li
        v-report="['mp.mp-tab', '终极技能']"
        :class="['firearms-li', tab === 'skill' ? 'on': '']"
        @click.stop="handleClickTabTap('skill')"
      >
        <span class="weapon">终极技能</span>
      </li>
    </ul>
    <Loading v-if="loading" />
    <div class="scroll-box">
      <GuideCardList
        v-if="tab === 'skill'"
        :list="data"
        :tab="'skill'"
        :report-id="'mp.final-skill'"
      />
      <GuideCardList
        v-else-if="tab === 'map'"
        :list="data"
        :tab="'map'"
        :report-id="'mp.map'"
      />
      <GuideCardList
        v-else
        :list="data"
        :tab="'mode'"
        :report-id="'mp.pattern'"
      />
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="less" scoped>

@import 'styles/mixin.less';
@import 'styles/common.less';

.gameplay-page {
  .mx-size(100%, calc(100vh - 0.77rem));

  .firearms-ul {
    .comfirearms-ul();
  }
}

.scroll-box {
  height: calc(100% - 0.55rem);
  overflow-y: scroll;
}
</style>
