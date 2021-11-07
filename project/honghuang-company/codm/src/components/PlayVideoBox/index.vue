<template>
  <div
    class="play-box"
  >
    <div
      class="mark"
    />
    <div
      class="inner"
    >
      <div
        v-if="loading"
        class="box"
      >
        <img
          :src="poster"
          class="poster"
        >
        <img
          src="@/assets/img/loading.gif"
          class="loading"
        >
      </div>

      <div
        id="my-video"
        class="video-box"
      />
      <img
        :src="convertImgExt('found/close-topic.png')"
        class="icon"
        @click.stop="handleClosePlayBox"
      >
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">

.play-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;

  .mark {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }

  img.icon {
    width: 0.4rem;
    height: 0.4rem;
    // position: absolute;
    // top: 0;
    // right: 0;
    // margin-left: 0.1rem;
    z-index: 99999;
  }

  .inner {
    width: 8.8rem;
    height: 5rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    // align-items: center;

    img.poster {
      width: 8rem;
      height: 5rem;
      position: absolute;
      top: 0;
      left: 0;
    }

    img.loading {
      width: 1rem;
    }
  }

  .video-box {
    width: 8rem;
    height: 5rem;
    // position: absolute;
    // left: 0;
  }
}
</style>
