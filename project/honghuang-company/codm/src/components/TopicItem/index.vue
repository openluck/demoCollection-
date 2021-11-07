<template>
  <div
    class="sle-talk"
    :report-id="['dynamic.topic', data.name]"
    @click="handleClick()"
  >
    <img
      v-if="deleteTopic"
      class="close-icon"
      src="@/assets/img/close.svg"
      @click.stop="deleteTopicItem"
    >
    <div class="talk-img">
      <img
        :src="data.img"
        alt="图片"
      >
    </div>
    <!-- 话题选中加'on' -->
    <div :class="active ? 'talk-ht on' : 'talk-ht'">
      <div class="talk-tit">
        <span>#</span>
        <span
          v-report="['dynamic.topic',data.topicid]"
          class="topic-tit"
        >{{ data.name }}</span>
        <span>#</span>
      </div>
      <div class="talk-num">
        <span>{{ data.contentCnt }}</span>
        <span>讨论</span>
      </div>
    </div>
    <i class="horn1 horn" />
    <i class="horn2 horn" />
    <i class="horn3 horn" />
    <i class="horn4 horn" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.sle-talk {
  .mx-size(31%, 0.8rem);
  padding: 0.09rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: left;
  position: relative;
  background-color: #2a313b;
  border: 1px solid #464f5b;
  margin-right: 0.25rem;
  margin-top: 0.16rem;

  .close-icon {
    .mx-size(0.16rem);
    position: absolute;
    top: -0.25rem;
    right: -0.2rem;
  }

  .mx-horn(0.05rem, #9fa2a8);

  .talk-img {
    .mx-size(0.61rem, 0.61rem);
    margin-right: 0.2rem;
    display: flex;

    img {
      display: inline-block;
      .mx-size(100%, 100%);
    }
  }

  .talk-ht {
    color: #ddd;
    font-size: 0.18rem;
    // display: flex;

    .talk-tit {
      display: flex;
      align-items: center;

      .topic-tit {
        display: inline-block;
        // width: 2.19rem;
        .single-line();
        margin-left: 0.05rem;
        max-width: 2.19rem;
      }
    }

    &.on {
      color: #feed57;
    }
  }
}
</style>
