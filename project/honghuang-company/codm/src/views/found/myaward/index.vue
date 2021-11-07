<template>
  <div class="myaward-page">
    <div class="title">
      福利站
    </div>
    <div class="content">
      <h3>我的奖励</h3>
      <IntegralRecordList :type="'exchange'" />
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.myaward-page {
  margin-top: 0.15rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  .mx-size(100%);

  .title {
    color: #fff;
    font-size: 0.26rem;
  }

  .content {
    padding: 0 0.2rem 0 0.2rem;
    box-sizing: border-box;
    margin-top: 0.3rem;
    .mx-size(100%, calc(100vh - 0.77rem));
  }
}
</style>
