<template>
  <div class="message-page">
    <ul
      v-if="!isExperienceEnv"
      class="firearms-ul"
    >
      <li
        :class="`firearms-li ${tab === 'reply' ? 'on' : ''}`"
        @touchend.stop="handleTabTap('reply')"
      >
        <span
          v-if="replyMsgCount > 0"
          id="red-dot"
        />
        <span class="weapon">评论消息</span>
      </li>
      <i />
      <li
        :class="`firearms-li ${tab === 'like' ? 'on' : ''}`"
        @touchend.stop="handleTabTap('like')"
      >
        <span
          v-if="likeMsgCount > 0"
          id="red-dot"
        />
        <span class="weapon">点赞消息</span>
      </li>
    </ul>
    <ReplyLikeMessage
      v-if="tab === 'reply' && !isExperienceEnv"
      :key="'reply'"
      :type="'reply'"
    />
    <ReplyLikeMessage
      v-else-if="!isExperienceEnv"
      :key="'like'"
      :type="'like'"
    />
    <SystemSafeguardHint v-if="isExperienceEnv" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';
// @import 'index.less';
.firearms-li {
  position: relative;

  #red-dot {
    right: -5px;
    top: -1px;
  }
}

.message-page {
  .mx-size(100%, calc(100vh - 0.97rem));

  .firearms-ul {
    .comfirearms-ul();
  }
}
</style>
