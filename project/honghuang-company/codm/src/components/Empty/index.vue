<template>
  <div class="empty-box">
    <div class="inner">
      <img
        src="@/assets/img/empty.svg"
      >
      <span class="text">{{ msg }}</span>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">

.empty-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
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
