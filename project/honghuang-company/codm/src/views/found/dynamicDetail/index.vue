<template>
  <!-- 一下内容为动态详情页面 -->
  <div class="content">
    <div
      v-if="detail"
      class="dynamic-detail"
    >
      <div class="user-info">
        <div class="user-tx">
          <img :src="(detail.authorAvatar || defalutAvatar) | convertHttps">
        </div>
        <div class="user-mesg">
          <span class="user-name">{{ detail.authorName }}</span>
          <span class="iph-jx">{{ detail.author.acctype | area }}-{{ detail.author.platid | plat }}</span>
        </div>
        <div
          v-if="likeInfo"
          class="dz"
          @click.stop="handleTapLikeIcon(detail.aid)"
        >
          <!-- 未点赞的图片 -->
          <!-- 将线上未点赞的图片替换为本地图片 -->
          <!-- <img v-if="likeInfo.isLike" :src="convertImgExt('central/dtonzhan.png')" /> -->
          <img
            v-if="likeInfo.isLike"
            src="@/assets/img/central/dtonzhan.png"
          >
          <!-- 已经点赞的图片， 类名要加 on -->
          <img
            v-else
            :src="convertImgExt('central/dtzhan.png')"
          >
          <span>{{ likeInfo.count }}</span>
        </div>
      </div>
      <p class="article">
        {{ detail.content }}
      </p>
      <!-- 动态详情页面一张图片的类名为 article-img-->
      <!-- 传两张图片的时候，添加类名 img2-->
      <!-- 传三张图片的时候，添加类名 img3-->
      <!-- 传四张图片及四张以上的时候，添加类名 img4-->
      <div :class="getCls()">
        <img
          v-for="el in picList"
          :key="el.url"
          :src="el.url | convertHttps"
          class="disabled"
        >
      </div>
      <Loading v-if="loading" />
      <Comment
        v-if="detail"
        :id="detail.aid"
        :title="detail.summary"
        :resource-type="'moment'"
      />
    </div>
    <Empty
      v-if="error"
      :msg="'好像出错了哦, 请稍后再试试'"
    />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

/deep/ .empty-box {
  .inner {
    margin-top: -1rem;
  }
}

.content {
  // padding-top: 0.77rem;
  box-sizing: border-box;
  margin-top: 0.775rem;
  // overflow-y: scroll;
  height: 100vh;
  overflow-x: hidden;
  width: 100%;
  padding: 0 0.5rem;

  .dynamic-detail {
    box-sizing: border-box;
    padding: 0.33rem 0.55rem 0;
    background: #38404d;
    // width: 11.42rem;
    height: 100vh;
    margin: 0 auto;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 0.04rem;
      height: 0.08rem;
      background: #8a8d92;
    }

    &::-webkit-scrollbar-thumb {
      background: #fae655;
    }

    .user-info {
      display: flex;
      align-items: center;
      position: relative;

      .user-tx {
        .mx-size(0.6rem);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.01rem solid #fff;
        border-radius: 100%;
        box-sizing: border-box;
        padding: 0.02rem;

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
      }

      .dz {
        // 解决动态详情页点赞按钮拉伸
        // .mx-size(0.64rem);
        // background-color: #8a8d92;
        color: #d6d5c6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;

        // &.on {
        //   background-color: #ffed57;
        // }

        img {
          .mx-size(0.43rem, 0.38rem);
        }

        // 修改文章详情页的点赞
        span {
          font-size: 0.18rem;
          color: #d6d5c6;
          margin-top: 0.07rem;
        }
      }
    }

    .article {
      font-size: 0.2rem;
      color: #fff;
      text-indent: 2em;
      text-align: left;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
    }

    .article-img {
      .mx-size(6.7rem, auto);
      box-sizing: border-box;
      margin: 0 auto;
      position: relative;
      .mx-horn(0.1rem, #9fa2a8);
      // border: 1px solid #464f5b;
      margin-bottom: 0.24rem;

      &.img2 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          // .mx-size(48%, auto);
          width: 48%;
          max-height: 5.75rem;
        }
      }

      &.img3 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          // .mx-size(30%, auto);
          width: 30%;
          max-height: 5.75rem;
        }
      }

      &.img4 {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;

        img {
          // .mx-size(33%, auto);
          width: 33%;
          max-height: 5.75rem;
          margin-left: 0.01rem;
        }

        img:nth-child(n + 4) {
          margin-top: 0.05rem;
        }
      }

      img {
        // .mx-size(100%);
        object-fit: contain;
        width: 100%;
        max-height: 5.75rem;
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

  .comment-input {
    .mx-size(100%, 0.76rem);
    // background: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.42rem;
    box-sizing: border-box;

    input {
      font-size: 0.24rem;
      color: #536275;
      .mx-size(80%, 100%);
      padding-left: 0.14rem;
      background: #ececec;
    }

    .comment-num {
      .mx-size(1.89rem, 0.54rem);
      background: #ffed57;
      font-size: 0.28rem;
      color: #4b410f;
      line-height: 0.54rem;
    }
  }
}
</style>
