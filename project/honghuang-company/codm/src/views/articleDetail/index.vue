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
      class="article-detail"
    >
      <p class="title">
        {{ detail.sTitle }}
      </p>
      <div class="anthor-info">
        <div
          v-if="detail.sAuthor"
          class="anthor"
        >
          <span>作者：</span>
          <span>{{ detail.sAuthor }}</span>
          <span class="time">{{ detail.sIdxTime | timeFormat('yyyy年MM月dd日h点i分') }}</span>
        </div>
        <div class="see-num">
          <img
            :src="convertImgExt('home/see.png')"
            class="see-num"
          >
          <span>{{ detail.iTotalPlay }}<span /> </span>
        </div>
      </div>
      <i class="art-line" />
      <div
        class="artical-con"
        v-html="renderContent()"
      />
      <div class="recommend">
        <h3>相关推荐</h3>
        <ul class="zx-ul">
          <template v-for="item in detail.linkList">
            <V4ListItem
              :key="item.iNewsId"
              :src="item.sIMG"
              :i-id="item.iNewsId"
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
        :id="detail.iNewsId"
        :title="detail.sTitle"
        :resource-type="'v4_article'"
        :btn-z-index="zIndex"
      />
    </div>
    <Loading
      v-else
      :msg="'加载中'"
    />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

.content {
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

  .article-detail {
    position: relative;
    // .mx-size( calc(100% - 0.53rem),100%);
    box-sizing: border-box;
    margin: 0 0.98rem;
    padding: 0.33rem 0.55rem 0;
    background: #38404d;

    .title {
      color: #fff;
      font-size: 0.3rem;
      margin-bottom: 0.2rem;
      .multi-line(2);
    }

    .anthor-info {
      color: #c3c3c3;
      font-size: 0.22rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.1rem;

      .time {
        margin-left: 0.2rem;
      }

      .see-num {
        margin-right: 0.08rem;
        display: flex;
        align-items: center;
      }
    }

    .art-line {
      .mx-size(100%, 1px);
      background-color: #59616c;
      display: block;
    }

    .artical-con {
      width: 100%;
      color: #fff;
      font-size: 0.2rem;
      text-align: left;
      text-indent: 2em;
      margin-top: 0.24rem;

      /deep/ p {
        margin: 10px 0;

        &.video-box {
          text-align: center;
        }

        & > img {
          width: 100%;
          display: block;
        }

        strong > img {
          width: 100%;
          display: block;
          margin: 0 auto;
        }
      }

      // note: 修改文章内容中的 img 的宽度， 控制不横向超出
      /deep/ div {
        img {
          width: 100%;
          display: block;
        }
      }
    }

    .artical-img {
      margin-top: 0.25rem;
    }

    .recommend {
      width: 100%;

      h3 {
        margin-bottom: 0.2rem;
      }

      .zx-ul {
        height: 82%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 0.24rem;
        // overflow-x: scroll;

        /deep/ .zx-li {
          width: 49.5%;
          height: 1.3rem;
          display: flex;
          background-color: #2a313b;
          border: 1px solid #464f5b;
          margin-bottom: 0.09rem;
          box-sizing: border-box;
          .mx-horn(0.1rem, #9fa2a8);
          padding: 0.1rem;

          .zx-img {
            width: 1.59rem;
            object-fit: cover;
            // .mx-size(1.59rem);
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
              white-space: normal;
              .multi-line(2);
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

                img {
                  .mx-size(0.26rem, 0.12rem);
                }
              }
            }
          }

          /deep/ .zx-line {
            .mx-size(100%, 1px);
            background-color: #454f59;
            position: absolute;
            bottom: -9%;
            left: 0;
            display: none;

            &::before {
              content: '';
              .mx-size(1.5%, 100%);
              background-color: #a2a6ac;
              position: absolute;
              top: 0;
              left: 0;
            }

            &::after {
              content: '';
              .mx-size(1.5%, 100%);
              background-color: #a2a6ac;
              position: absolute;
              top: 0;
              right: 0;
            }
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
                width: 100%;
                height: 100%;
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
}
</style>
