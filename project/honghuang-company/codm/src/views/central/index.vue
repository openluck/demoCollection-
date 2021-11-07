<template>
  <div class="central-page">
    <ul class="central-ul">
      <router-link
        :to="'/central/dynamic'"
        :class="$route.name === 'central-dynamic' ? 'central-li on' : 'central-li'"
      >
        我的动态
      </router-link>
      <router-link
        :to="'/central/message'"
        :class="$route.name === 'central-message' ? 'central-li on' : 'central-li'"
      >
        <!-- 红点 -->
        <span
          v-if="messageCount > 0"
          id="red-dot"
        />
        消息中心
      </router-link>
      <router-link
        :to="'/central/test'"
        v-if="showTest"
        :class="$route.name === 'central-test' ? 'central-li on' : 'central-li'"
        style="opacity: 0;"
      >
        测试
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

.central-page {
  .mx-size(calc(100vw - 0.77rem), 100%);
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;
  // background: red;
  .central-ul {
    .mx-size(100%, 0.77rem);
    display: flex;
    align-items: center;

    .central-li {
      .tab-li();
      position: relative;

      #red-dot {
        top: 0.11rem;
        right: 0.15rem;
      }
    }
  }
}

.main-content {
  height: calc(100% - 0.77rem);
  overflow-y: scroll;
}
</style>
