<template>
  <div class="content">
    <div class="nav-box">
      <ul class="nav">
        <li id="btn-share">
          <img :src="convertImgExt('central/nav-share.png')">
          <span>分享</span>
        </li>
        <li
          class="like"
          @click.stop="handleClickLike"
        >
          <!-- 未点赞 -->
          <img
            v-if="!operateInfo.like"
            :src="convertImgExt('central/nav-zhan.png')"
          >
          <!-- 已点赞 -->
          <img
            v-else
            :src="convertImgExt('central/onnav-zhan.png')"
          >
          <span>{{ operateInfo.likeCount }}</span>
        </li>
        <li
          class="cai"
          @click.stop="handleClickTread"
        >
          <!-- 未踩 -->
          <img
            v-if="!operateInfo.tread"
            :src="convertImgExt('central/nav-cai.png')"
          >
          <!-- 已踩 -->
          <img
            v-else
            :src="convertImgExt('central/onnav-cai.png')"
          >
          <span>{{ operateInfo.treadCount }}</span>
        </li>
      </ul>
      <i class="horn1 horn" />
      <i class="horn2 horn" />
      <i class="horn3 horn" />
      <i class="horn4 horn" />
    </div>
    <div
      v-if="detail"
      class="video-details"
    >
      <div
        class="play-video"
        @click="handleShowPlayBox"
      >
        <div class="play-img">
          <img
            :src="detail.sIMG | convertHttps"
            alt="图片"
          >
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
          <div class="play-frm" />
          <div class="play-btnbox">
            <img
              class="play-btn"
              :src="convertImgExt('walkthrough/play-btn2.png')"
            >
          </div>
        </div>
        <div class="video-con">
          <div class="video-tit">
            {{ detail.sTitle }}
          </div>
          <div
            v-if="detail.sAuthor"
            class="video-author"
          >
            <span>作者：</span>
            <span>{{ detail.sAuthor }}</span>
          </div>
          <div class="video-time">
            <span class="time">{{ detail.sIdxTime | timeFormat('yyyy年MM月dd日h点i分') }}</span>
            <div class="see-num">
              <img
                :src="convertImgExt('home/see.png')"
              >
              <div>{{ detail.iTotalPlay }}</div>
            </div>
          </div>
          <div class="video-info">
            {{ detail.sDesc }}
          </div>
        </div>
      </div>
      <div class="recommend">
        <h3>相关推荐</h3>
        <ul class="zx-ul">
          <template v-for="item in detail.linkList">
            <V4ListItem
              :key="item.iVideoId"
              :src="item.sIMG"
              :i-id="item.iVideoId"
              :type="'video'"
              :s-title="item.sTitle"
              :i-total-play="item.iTotalPlay"
              :s-idx-time="item.sCreated | timeFormat"
            >
              <i class="horn1 horn" />
              <i class="horn2 horn" />
              <i class="horn3 horn" />
              <i class="horn4 horn" />
            </V4ListItem>
          </template>
        </ul>
      </div>
      <Comment
        :id="detail.iVideoId"
        :title="detail.sTitle"
        :resource-type="'v4_video'"
        :btn-z-index="zIndex"
      />
      <PlayVideoBox
        v-if="showPlayBox"
        :vid="detail.sVID"
        :title="detail.sTitle"
        :poster="detail.sIMG | convertHttps"
        :on-hide="handleClosePlayBox"
      />
    </div>
    <Loading
      v-else
      :msg="'加载中'"
    />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.content {
  // .mx-size(calc(100vw - 1.54rem), calc(100vh - 1.02rem));
  // .mx-size(calc(100vw - 1.6rem), auto);
  // margin: 0.78rem auto 0;
  margin-top: 0.77rem;
  // background: rgba(0, 0, 0, 0.1);
  // background: #38404d;
  overflow-y: scroll;
  // padding-left: 0.58rem;
  box-sizing: border-box;
  // padding-top: 0.24rem;

  &::-webkit-scrollbar {
    .mx-size(0.04rem, 0.08rem);
    background: #8a8d92;
  }

  &::-webkit-scrollbar-thumb {
    background: #fae655;
  }

  .nav-box {
    .nav-boxfun();
  }

  .video-details {
    position: relative;
    // .mx-size( calc(100% - 0.53rem),100%);
    box-sizing: border-box;
    // margin-top: 0.78rem;
    // margin-top: 0.24rem;
    margin: 0 0.98rem;
    padding: 0.33rem 0.55rem 0;
    background: #38404d;

    .play-video {
      .mx-size(100%, auto);
      display: flex;
      margin-bottom: 0.23rem;
      justify-content: space-between;

      .play-img {
        position: relative;
        .mx-size(56%, 2.82rem);
        border: 1px solid #464f5b;
        .mx-horn(0.05rem, #9fa2a8);

        img {
          .mx-size(100%, 100%);
        }

        .play-frm {
          .mx-size(100%, 100%);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          visibility: visible;
          backface-visibility: visible;
          opacity: 0.4;
        }

        .play-btnbox {
          .mx-size(0.39rem, 0.44rem);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          img {
            display: inline-block;
            .mx-size(100%, 100%);
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }

      .video-con {
        font-size: 0.3rem;
        color: #fff;
        text-align: left;
        .mx-size(40%, auto);

        .video-tit {
          .multi-line(2);
        }

        span {
          color: #c3c3c3;
          font-size: 0.18rem;
        }

        .video-time {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .see-num {
            display: flex;
            align-items: center;
            font-size: 0.18rem;
            color: #c3c3c3;

            img {
              margin-right: 0.1rem;
              .mx-size(0.26rem, 0.12rem);
            }
          }
        }

        .video-info {
          font-size: 0.2rem;
          color: #fff;
          margin-top: 0.2rem;
          text-indent: 2em;
        }
      }
    }

    .recommend {
      h3 {
        margin-bottom: 0.2rem;
      }

      .zx-ul {
        height: 82%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 0.24rem;

        /deep/ .zx-li {
          width: 49.5%;
          height: 1.1rem;
          position: relative;
          background-color: #2a313b;
          border: 1px solid #464f5b;
          padding: 0.05rem;
          box-sizing: border-box;
          margin-bottom: 0.07rem;
          display: flex;
          .mx-horn(0.1rem, #9fa2a8);

          .zx-img {
            .mx-size(1.59rem, 100%);
          }

          .zx-cont {
            flex: 1;
            height: 100%;
            color: #aeb1b3;
            font-size: 0.2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            padding-left: 0.05rem;
            box-sizing: border-box;

            .zx-desc {
              text-align: left;
              display: -webkit-box;
              overflow: hidden;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              margin-bottom: 0.15rem;
              .multi-line(2);
              white-space: normal;
            }

            .zx-info {
              span {
                color: #91959a;
                font-size: 0.18rem;
                margin-right: 0.3rem;
              }

              .see-num {
                .mx-size(0.26rem, 0.12rem);
                margin-right: 0.08rem;
              }
            }
          }

          .zx-line {
            display: none;
          }
        }
      }
    }

    .comment {
      h3 {
        margin-bottom: 0.2rem;
      }

      .com-ul {
        .com-li {
          margin-bottom: 0.2rem;

          .user-info {
            display: flex;
            align-items: center;

            .user-tx {
              .com-head();

              img {
                .mx-size(100%);
                border-radius: 50%;
              }
            }

            .user-mesg {
              font-size: 0.22rem;
              color: #fff;
              display: flex;
              flex-direction: column;
              text-align: left;
              margin-left: 0.15rem;

              .iph-jx {
                color: #91959a;
                font-size: 0.18rem;
              }
            }
          }
        }
      }
    }

    .com-ul {
      .com-li {
        .mx-size(100%, 100%);
        .mx-horn(0.1rem, #9fa2a8);
        background-color: #2a313b;
        border: 1px solid #464f5b;
        padding: 0.08rem 0.14rem 0.2rem;
        box-sizing: border-box;
        position: relative;

        .up-box {
          display: flex;
          justify-content: space-between;

          .com-icon {
            color: #91959a;
            font-size: 0.22rem;
            display: flex;

            img {
              margin-right: 0.05rem;
            }

            .zhan {
              .mx-size(0.25rem, 0.23rem);
            }

            .cai {
              .mx-size(0.25rem, 0.23rem);
            }

            .xiaoxi {
              .mx-size(0.26rem, 0.22rem);
            }

            span {
              margin-right: 0.2rem;
            }
          }
        }

        p {
          color: #fff;
          font-size: 0.24rem;
          text-align: left;
          margin-top: 0.14rem;
          .single-line();
        }
      }
    }
  }

  .zx-line {
    display: none;
  }
}
</style>
