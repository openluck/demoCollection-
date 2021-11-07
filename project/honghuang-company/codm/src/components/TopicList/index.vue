<template>
  <div
    v-if="topicList.length > 0"
    class="talk-con"
  >
    <template
      v-for="item in topicList"
    >
      <TopicItem
        :key="item.topicid"
        :on-click="handleClickTopic"
        :data="item"
        :active="currentTopicId === item.topicid"
      />
    </template>
  </div>
</template>

<script src="./index.ts" lang="ts">
</script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.talk-con {
  display: flex;
  .mx-size(100%, 12%);
  .mx-horn(0.05rem, #fff);
  flex-wrap: wrap;
  // margin-top: 0.16rem;
  margin-bottom: 0.16rem;
}

</style>
