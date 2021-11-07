<template>
  <router-link
    :to="type === 'video'? `/video_detail/${iId}` : `/article_detail/${iId}`"
    class="rank-li"
  >
    <div
      v-report="reportId"
      class="rank-img"
    >
      <img
        :src="src"
      >
      <div
        v-if="type==='video'"
        class="play-cen"
      >
        <img
          :src="convertImgExt('walkthrough/play-z.png')"
        >
      </div>
      <div class="rank-video">
        <div class="rank-playnum">
          <!-- 视频显示播放按钮 -->
          <img
            v-if="type === 'video'"
            class="play-num"
            :src="convertImgExt('walkthrough/play-num.png')"
          >
          <!-- 文章显示眼睛 -->
          <img
            v-else
            class="play-eyes-icon"
            src="@/assets/img/walkthough/play-eyes.png"
          >
          <span>{{ iTotalPlay }}</span>
        </div>
      </div>
    </div>
    <span class="rank-tit">{{ sTitle }}</span>
  </router-link>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

.rank-ul {
  padding-top: 0.2rem;
  box-sizing: border-box;

  .rank-li {
    background-color: #2a313b;
    .mx-size(32%, auto);
    // background: yellow;
    border: 0.01rem solid #3e4550;
    padding: 0.08rem;
    box-sizing: border-box;
    margin-bottom: 0.14rem;
    // background: red;
    margin-right: 1.85%;

    .rank-img {
      position: relative;
      .mx-size(100%, 1.9rem);

      img {
        .mx-size(100%, 100%);
        display: block;
      }

      .rank-video {
        .mx-size(100%, auto);
        // background: #3a3732;
        font-size: 0.21rem;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
        // opacity: 0.8;
        padding: 0 0.37rem 0 0.07rem;
        background-color: rgba(0, 0, 0, 0.5);
        box-sizing: border-box;

        .rank-playnum {
          display: flex;
          align-items: center;

          .play-num {
            .mx-size(0.18rem, 0.18rem);
          }

          .play-eyes-icon {
            .mx-size(0.23rem, 0.15rem);
          }

          span {
            margin-left: 0.06rem;
          }
        }
      }

      .play-cen {
        .mx-size(0.5rem);
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, 50%);

        img {
          display: block;
          .mx-size(100%);
        }
      }
    }

    .rank-tit {
      color: #fff;
      font-size: 0.2rem;
      .mx-size(100%, auto);
      margin: 0.08rem 0;
      display: block;
      text-align: left;
      .multi-line(2);
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

    .rank-info {
      .mx-size(100%, auto);
      color: #fff;
      font-size: 0.18rem;
      text-align: left;
      margin-top: 0.06rem;
      .multi-line(2);
    }
  }

  .rank-li:nth-child(3n + 3) {
    margin-right: 0;
  }
}
</style>
