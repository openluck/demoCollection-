<template>
  <div class="swiper">
    <sui-swiper
      v-if="swiperList.length> 0"
      key-name="id"
      :list="swiperList"
      auto-play
      @change="handleSwiperChange"
    >
      <template #default="{ item }">
        <own-route-link
          :to="item.url"
          :report-id="['index.rotation-banner', item.title]"
        >
          <sui-image
            :src="item.imgUrl"
          />
        </own-route-link>
      </template>
    </sui-swiper>
    <div class="swiper-tit">
      <p>{{ title }}</p>
      <div class="swiper-icon">
        <span
          v-for="item in swiperList.length"
          :key="item"
          :class="item === index ? 'on': ''"
        />
      </div>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>


<style lang="less" scoped>
@import "styles/mixin.less";

.swiper {
  .mx-size(43.7%, 100%);
  position: relative;

  img {
    .mx-size(100%, 100%);
    display: block;
  }

  .swiper-tit {
    .mx-size(100%,0.38rem);
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.05rem;
    box-sizing: border-box;

    p {
      color: #fff;
      font-size: 0.2rem;
    }
  }

  .swiper-icon {
    // .mx-size(auto, 100%);
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      .mx-size(0.38rem, 0.04rem);
      background-color: #979595;
      margin-left: 0.04rem;

      &.on {
        background-color: #f9e655;
      }
    }
  }
}

</style>
