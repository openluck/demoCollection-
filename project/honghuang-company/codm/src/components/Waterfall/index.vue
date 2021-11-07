<template>
  <waterfall
    v-if="list.length>0"
    :data="list"
    :col="list.length === 1 ? 1 : 2"
    :class="list.length === 1 ? 'half' : ''"
  >
    <template v-for="(item, index) in list">
      <slot
        :item="item"
        :index="index"
      />
    </template>
  </waterfall>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>

.igc-waterfall {
  position: relative;
  width: 100%;
  height: 100%;

  .ig--scroll--column--item {
    position: absolute;
    box-sizing: border-box;
    opacity: 0;
    width: 100%;
    transition: opacity 1s;
  }

  .ig--sui--waterfall--load {
    position: absolute;
    width: 100%;
    color: #40270b !important;
    font-size: 0.8rem;
  }

  .box {
    width: 100%;
    height: 0.2rem;
    position: absolute;
    bottom: 0;
  }

  .sui-load {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
