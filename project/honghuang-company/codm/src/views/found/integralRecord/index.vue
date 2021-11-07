<template>
  <div class="integral-record-page">
    <div class="title">
      福利站
    </div>
    <div class="content">
      <h3>积分记录</h3>
      <IntegralRecordList :type="'integralLog'" />
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.integral-record-page {
  // margin-top: 0.15rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  .mx-size(100%);

  .title {
    color: #fff;
    font-size: 0.26rem;
    margin-top: 0.23rem;
  }

  .content {
    padding: 0 0.2rem 0 0.2rem;
    box-sizing: border-box;
    .mx-size(100%, calc(100vh - 0.77rem));
    margin-top: 0.4rem;
  }
  // padding: 0.21rem 0.17rem 0 0.17rem;
}
</style>
