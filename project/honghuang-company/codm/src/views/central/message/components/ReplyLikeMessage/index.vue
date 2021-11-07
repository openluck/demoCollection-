<template>
  <ul class="pl-ul">
    <sui-scroll
      v-if="!noData"
      style="height: 100%;"
      @reach-end="handleScrollLoadMore"
    >
      <template
        v-for="item in messageList"
      >
        <ReplyLikeMessageItem
          :key="item.tlistMsgId"
          :data="item"
          :type="type"
        />
      </template>
      <sui-load
        v-if="!noData"
        :more="loading"
      />
    </sui-scroll>
    <Empty
      v-if="noData"
      :msg="error ? '好像发生错误了哦, 您稍后再试试': '暂时还没有收到消息哦'"
    />
  </ul>
</template>

<script src="./index.ts" lang="ts">
</script>

<style lang="less" scoped>
.pl-ul {
  width: 100%;
  height: calc(100% - 0.6rem);
  overflow-y: scroll;
}

/deep/ .empty-box {
  .inner {
    margin-top: -20px;
  }
}
</style>
