<template>
  <div class="system-safeguard-box">
    <div class="inner">
      <img
        src="@/assets/img/empty.svg"
      >
      <span class="text">系统维护中，暂时无法使用，过几天再来看看吧～</span>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">

.system-safeguard-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 1.5rem;
    }

    .text {
      display: inline-block;
      margin-top: 15px;
      font-size: 0.2rem;
      color: #bdbbbb;
    }
  }
}

</style>
