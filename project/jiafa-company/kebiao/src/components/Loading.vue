<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-06-25 15:46:32
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-19 16:35:06
-->
<template>
  <transition name="cv-loading-fade">
    <div
      v-show="visible"
      class="cv-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]"
    >
      <div class="cv-loading-spinner">
        <div class="loading-animation-box">
          <span class="ant-spin-dot ant-spin-dot-spin"
            ><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i
            ><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i
          ></span>
        </div>
        <!-- <span class="cv-loading-text">{{ text }}</span> -->
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      text: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: ""
    };
  },
  mounted() {
    if (this.fullscreen) {
      document.body.style.overflow = "hidden";
    }
  },
  methods: {
    setText(text) {
      this.text = text;
    }
  },
  destroyed() {
    document.body.style.overflowX = "hidden";
  }
};
</script>
<style lang="less" scoped>
// @import "assets/styles/variables.scss";
.cv-loading-fade-enter,
.cv-loading-fade-leave-active {
  opacity: 0;
}
.cv-loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.6);
  // background-image: url("../assets/loading.gif");
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  &.is-fullscreen {
    position: fixed;
    .cv-loading-spinner {
      margin-top: -25px;
    }
  }
  .cv-loading-spinner {
    top: 50%;
    margin-top: -21px;
    width: 100%;
    text-align: center;
    position: absolute;
    .loading-animation-box {
      position: relative;
      width: 64px;
      // height: 50px;
      margin: 0 auto;
      .ant-spin-dot {
        font-size: 20px;
      }
    }
    .cv-loading-text {
      margin-left: 10px;
      font-size: 14px;
      color: @primary-color;
    }
  }
}
</style>
