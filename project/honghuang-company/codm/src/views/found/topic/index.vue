<template>
  <div class="topic-page">
    <!-- 发布按钮 -->
     <div class="total-title">
      <span>选择话题</span>
      <!-- 发布成功之后，加on 类名 -->
      <span class="publish-btn">发布</span>
    </div>
    <!-- 话题 -->
    <TopicList :handle-topic-item-click="handleTopicClick" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.topic-page {
  .mx-size(100%, 100%);
   padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;


  .total-title {
    .mx-size(100%,0.77rem);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    span {
      color: #fff;
      font-size: 0.26rem;
      text-align: center;
    }

    .publish-btn {
      display: inline-block;
      .mx-size(1rem,0.35rem);
      background: #9a9a9a;
      color: d1d1d1;
      font-size: 0.22rem;
      text-align: center;
      line-height: 0.35rem;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);

      &.on {
        background: #ffed57;
        color: #000;
      }
    }
  }

  .talk-con {
    display: flex;
    .mx-size(100%, 12%);
    .mx-horn(0.1rem, #9fa2a8);

    margin-bottom: 0.16rem;
    flex-wrap: wrap;

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

        .talk-tit {
          display: flex;
          align-items: center;

          .topic-tit {
            display: inline-block;
            width: 2.19rem;
            .single-line();
          }
        }

        &.on {
          color: #feed57;
        }
      }
    }
  }
}
</style>
