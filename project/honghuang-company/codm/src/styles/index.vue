<template>
  <div
    id="map"
    class="map-page"
  >
    <div class="map_left">
      <!-- 地图 -->
      <div class="map_wrap">
        <img
          src="~@assets/img/found/map.png"
        >
      </div>
      <!-- 进度条 -->
      <!-- 地图针 根据类名添加不同地图针 -->
      <div class="point">
        <span
          class="point_icon1 icon"
        >
          <img
            src="~@assets/img/found/point_icon1.png"
          >
        </span>
        <span
          class="point_icon2 icon"
        >
          <img
            src="~@assets/img/found/point_icon2.png"
          >
        </span>
        <span
          href="javascript:;"
          class="point_icon3 icon"
        >
          <img
            src="~@assets/img/found/point_icon3.png"
          >
        </span>
        <a
          class="point_icon4 icon"
        >
          <img
            src="~@assets/img/found/point_icon4.png"
            alt="中级物资"
          >
        </a>
        <a
          href="javascript:;"
          class="point_icon5 icon"
        >
          <img
            src="~@assets/img/found/point_icon5.png"
            alt="高级物资"
          >
        </a>
        <a
          href="javascript:;"
          class="point_icon6 icon"
        >
          <img
            src="~@assets/img/found/point_icon6.png"
            alt="中级芯片"
          >
          <a
            href="javascript:;"
            class="point_icon7 icon"
          >
            <img
              src="~@assets/img/found/point_icon7.png"
              alt="高级芯片"
            >
          </a>
          <a
            href="javascript:;"
            class="point_bor bor"
          >
            <img
              src="~@assets/img/found/point_icon8.png"
              alt="红圈"
            >
          </a>
          <a
            href="javascript:;"
            class="point_bor bor"
          >
            <img
              src="~@assets/img/found/point_icon9.png"
              alt="黄圈"
            >
          </a>
        </a>
      </div>
    </div>
    <MapRightPanel />
    <!-- 弹窗 -->
    <StrategyDialog />
  </div>
</template>


<style lang="less" scoped>
* {
  touch-action: auto !important;
}

.hd {
  font-size: 0;
  display: block;
  text-indent: -999rem;
}

.horn {
  position: absolute;
  width: 0.1rem;
  height: 0.1rem;
  border: 1px solid #9fa2a8;
}

.horn1 {
  border-bottom-color: transparent;
  border-left-color: transparent;
  right: 0;
  top: 0;
}

.horn2 {
  border-bottom-color: transparent;
  border-right-color: transparent;
  left: 0;
  top: 0;
}

.horn3 {
  border-top-color: transparent;
  border-right-color: transparent;
  left: 0;
  bottom: 0;
}

.horn4 {
  border-top-color: transparent;
  border-left-color: transparent;
  right: 0;
  bottom: 0;
}

#map {
  width: 100%;
  height: calc(100vh - 0.77rem);
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding-top: 0.2rem;
  box-sizing: border-box;

  .map_left {
    width: 6.28rem;
    height: 6.36rem;
    overflow: auto;
    position: relative;
    background: url(~~@assets/img/found/map_left.png) no-repeat center/6.28rem 6.36rem;
    margin-right: 0.2rem;

    .map_wrap {
      width: 6.28rem;
      height: 6.36rem;

      .map_wrap img {
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
}

</style>

<script src="./index.ts" lang="ts"></script>
