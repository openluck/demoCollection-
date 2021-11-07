<template>
  <li
    :key="item.id"
    class="tactics-li"
  >
    <h3>{{ item.name }}</h3>
    <div
      v-report="[reportId, item.name]"
      @click.stop="handleJumpBtn(item)"
    >
      <i class="line" />
      <div class="tactics-img">
        <img
          v-if="item.name"
          :src="item.img"
        >
        <img
          v-else
          :src="item.img"
          class="placeholder-img"
        >
      </div>
      <i class="line" />
      <div class="see-detail">
        <span class="text-span">查看详情</span>
      </div>
    </div>
  </li>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';

.tactics-li {
  .mx-size(32%, auto);
  // background: yellow;
  border: 1px solid #464f5b;
  padding: 0.16rem 0.08rem 0.08rem 0.08rem;
  box-sizing: border-box;
  margin-bottom: 0.14rem;
  background-color: #2a313b;
  margin-right: 0.1rem;
  margin-right: 1.85%;

  // &:nth-child(3n + 1) {
  //   margin-right: 0.1rem;
  // }

  &:nth-child(3n + 3) {
    margin-right: 0;
  }

  .tactics-tit {
    font-size: 0.26rem;
    font-weight: bold;
    color: #fff;
    position: relative;
    text-align: left;
    margin-left: 0.13rem;
    margin-bottom: 0.16rem;

    &::after {
      content: '';
      position: absolute;
      display: inline-block;
      width: 0.04rem;
      height: 0.24rem;
      background-color: #f9e655;
      top: 50%;
      transform: translateY(-50%);
      left: -0.12rem;
    }
  }

  .line {
    background-color: #555c64;
    width: 100%;
    height: 1px;
    display: block;
    position: relative;

    &::before {
      content: '';
      .mx-size(1.5%, 100%);
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
    }

    &::after {
      content: '';
      .mx-size(1.5%, 100%);
      background-color: #fff;
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .tactics-img {
    .mx-size(100%, 1.87rem);
    padding: 0.08rem 0;

    img {
      .mx-size(100%, 100%);
    }
  }

  .see-detail {
    margin: 0.07rem auto 0;
    // line-height: 0.35rem;
    display: flex;
    align-items: center;
    justify-content: center;

    span.text-span {
      font-weight: bold;
      font-size: 0.2rem;
      padding: 0 0.3rem;
      background-color: #ffed57;
    }
  }
}

h3 {
  margin-bottom: 0.1rem;
}

.placeholder-img {
  .mx-size(1.84rem, 0.93rem);
}
</style>
