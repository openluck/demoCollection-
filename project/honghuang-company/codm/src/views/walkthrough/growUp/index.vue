<template>
  <div class="grow-up-page">
    <ul class="firearms-ul">
      <!-- 加on选中 -->
      <li
        v-report="['growth-book.growth-book-tab', '新手入门']"
        :class="['firearms-li', tab === 'new' ? 'on': '']"
        @click.stop="handleClickTabTap('new')"
      >
        <span class="weapon">新手入门</span>
      </li>
      <li
        v-report="['growth-book.growth-book-tab', '键位设置']"
        :class="['firearms-li', tab === 'keybroad' ? 'on': '']"
        @click.stop="handleClickTabTap('keybroad')"
      >
        <span class="weapon">键位设置</span>
      </li>
      <li
        v-report="['growth-book.growth-book-tab', '灵敏度']"
        :class="['firearms-li', tab === 'sensitivity' ? 'on': '']"
        @click.stop="handleClickTabTap('sensitivity')"
      >
        <span class="weapon">灵敏度</span>
      </li>
      <!-- <li
        :class="['firearms-li', tab === 'rank' ? 'on': '']"
        @click.stop="handleClickTabTap('rank')"
      >
        <span class="weapon">排位攻略</span>
      </li>
      <li
        :class="['firearms-li', tab === 'paly' ? 'on': '']"
        @click.stop="handleClickTabTap('paly')"
      >
        <span class="weapon">玩法心得</span>
      </li> -->
    </ul>
    <V4VideoCardList
      v-if="tab === 'new'"
      :report-id="'growth-book.beginner-content'"
      :v4-id="v4IdMap['new']"
    />
    <V4VideoCardList
      v-else-if="tab === 'sensitivity'"
      :report-id="'growth-book.sensitivity-content'"
      :v4-id="v4IdMap['sensitivity']"
    />
    <V4VideoCardList
      v-else
      :report-id="'growth-book.key-layout-content'"
      :v4-id="v4IdMap['keybroad']"
    />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

.grow-up-page {
  .mx-size(100%, calc(100vh - 0.77rem));

  .firearms-ul {
    .comfirearms-ul();
  }
}
</style>
