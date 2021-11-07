<template>
  <div class="loading">
    <img
      src="@/assets/img/loading.gif"
    >
    <span class="text">{{ msg }}</span>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.loading {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  .text {
    display: inline-block;
    margin-top: 15px;
    font-size: 0.2rem;
    color: #bdbbbb;
  }
}
</style>
