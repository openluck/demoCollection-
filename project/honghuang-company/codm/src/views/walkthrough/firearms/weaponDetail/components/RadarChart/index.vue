<template>
  <div
    ref="chartBox"
    class="canvas"
  />
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.canvas {
  .mx-size(48%, 87%);
  font-size: 0.18rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ canvas {
    transform: scale(0.5);
  }
}
</style>
