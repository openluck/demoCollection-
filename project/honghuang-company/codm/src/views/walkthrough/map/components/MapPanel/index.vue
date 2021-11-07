<template>
  <div class="map-left">
    <!-- 地图 -->
    <div
      id="mapid"
      class="map-wrap"
    />
    <!-- 进度条 -->
    <div
      class="map-range"
      @click.stop="nothing"
    >
      <span
        v-report="'map-resource.zoom-btn'"
        class="hd zoom-in"
        @click.stop="handlezoomIn"
      />
      <VueSlider
        v-model="zoomValue"
        direction="btt"
        :height="'3.64rem'"
        :width="'0.05rem'"
        :contained="true"
        @change="handleRangeChange"
      />
      <span
        class="hd zoom-out"
        @click.stop="handleZoomOut"
      />
    </div>
    <div
      v-if="loading"
      class="loading"
    >
      <img
        src="@/assets/img/loading.gif"
      >
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">

.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.map-left {
  width: 48%;
  height: 90%;
  overflow: auto;
  position: relative;
  background: url(~@assets/img/found/map_left.png) no-repeat center/6.28rem 6.36rem;
  margin-right: 0.2rem;

  .map-wrap {
    width: 100%;
    height: 100%;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      display: block;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }

  .point {
    position: absolute;
    width: 6.28rem;
    height: 6.36rem;
    display: block;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    .icon {
      width: 0.48rem;
      height: 0.67rem;
      display: block;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .bor {
      width: 0.76rem;
      height: 0.76rem;
      display: block;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.map-range {
  position: absolute;
  height: 4.8rem;
  right: 0.3rem;
  top: 0;
  bottom: 0;
  z-index: 500;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  /deep/ .vue-slider {
    margin: 0 auto;
    padding: 0 !important;
    position: relative;
    display: flex;
    align-items: center;

    .vue-slider-dot-tooltip {
      display: none;
    }

    .vue-slider-rail {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0;
      height: 96%;
    }

    .vue-slider-process {
      border-radius: 0;
      background-color: #9599a2;
    }

    .vue-slider-dot-handle {
      border-color: #fff;
    }

    .vue-slider-dot-handle-focus {
      box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.3);
    }

    &:hover {
      .vue-slider-rail {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  .zoom-in {
    display: inline-block;
    width: 0.43rem;
    height: 0.43rem;
    background: url(~@/assets/img/found/zoom_in.png) no-repeat center/cover;
  }

  .zoom-out {
    display: inline-block;
    width: 0.43rem;
    height: 0.43rem;
    background: url(~@/assets/img/found/zoom_out.png) no-repeat center/cover;
  }
}

</style>
