<template>
  <div class="pop-wrap">
    <div class="pop">
      <h4 class="title">
        {{ currentData.title }}
      </h4>
      <div class="img-box">
        <div
          id="my-video"
          @click.stop="handleReport"
        />
        <i class="horn1 horn" />
        <i class="horn2 horn" />
        <i class="horn3 horn" />
        <i class="horn4 horn" />
      </div>
      <div class="btn">
        <span
          v-if="showPrevBtn"
          v-report="'map-resource.map-nail-next'"
          class="prev"
          @click.stop="handlePrev"
        >上一篇：{{ prevData.title }}</span>
        <span v-else />
        <span
          v-if="showNextBtn"
          v-report="'map-resource.map-nail-next'"
          class="next"
          @click.stop="handleNext"
        >下一篇：{{ nextData.title }}</span>
      </div>
      <span
        class="close hd"
        @click="handleClose"
      />
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

/deep/ .loading {
  position: absolute;
}

.pop-wrap {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99998;

  .pop {
    position: absolute;
    width: 9.05rem;
    height: 6.04rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url(~@assets/img/found/pop.png) no-repeat center/cover;
    z-index: 99999;

    .title {
      font-size: 0.24rem;
      color: #fff;
      text-align: center;
      display: block;
      width: 100%;
      height: 0.24rem;
      line-height: 0.24rem;
      margin-top: 0.1rem;
    }

    .img-box {
      width: 8.61rem;
      height: 4.41rem;
      margin: 0.3rem auto 0;
      position: relative;

      img {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
      }

      .video {
        width: 0.39rem;
        height: 0.44rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url(~@assets/img/found/video.png) no-repeat center/cover;
      }
    }

    .btn {
      width: 8.61rem;
      height: 0.34rem;
      margin: 0.4rem auto 0;
      display: flex;
      align-content: center;
      justify-content: space-between;

      .prev {
        width: 2.45rem;
        height: 0.34rem;
        display: block;
        text-align: center;
        line-height: 0.34rem;
        font-size: 0.22rem;
        border: 1px solid #9a9fa6;
        background: #48535f;
        color: #fff;
        .single-line();
      }

      .next {
        width: 2.45rem;
        height: 0.34rem;
        display: block;
        text-align: center;
        line-height: 0.34rem;
        font-size: 0.22rem;
        border: 1px solid #9a9fa6;
        background: #48535f;
        color: #fff;
        .single-line();
      }
    }

    .close {
      width: 0.43rem;
      height: 0.43rem;
      position: absolute;
      top: 0.03rem;
      right: 0.03rem;
      background: url(~@assets/img/found/close.png) no-repeat center/cover;
    }
  }
}

#my-video {
  height: 100%;
}
</style>
<script lang="ts" src="./index.ts"></script>
