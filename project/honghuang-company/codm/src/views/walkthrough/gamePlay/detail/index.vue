<template>
  <div
    v-if="detail"
    class="details-page"
  >
    <h2 class="top-nav">
      <span class="title">
        {{ detail.wfmc95 || detail.dtmmc63 }}
      </span>
    </h2>
    <div class="content">
      <div class="play-left">
        <div class="play-video">
          <div class="play-img">
            <img :src="detail.wflhxqy93 || detail.dtgllh79">
            <!-- 蒙层 -->
            <div
              v-if="detail.dtspjs54"
              class="play-frm"
              @click.stop="handleShowPlayBox"
            />
            <!-- 播放按钮 -->
            <div
              v-if="detail.dtspjs54"
              v-report="tab === 'map' ?
                ['map-guide.map-desc', detail.dtmmc63] :
                ['pattern.pattern-desc', detail.wfmc95]"
              class="play-btnbox"
              @click.stop="handleShowPlayBox"
            >
              <img
                class="play-btn"
                :src="convertImgExt('walkthrough/play-btn.png')"
              >
            </div>
            <!-- 文案介绍 -->
            <span
              v-if="tab==='map'"
              class="video-tit"
            >{{ detail.dtjs80 }}</span>
          </div>
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
        </div>
        <div class="play-box">
          <!-- 玩法的  -->
          <div
            v-if="tab === 'mode'"
            class="play-content"
          >
            <!-- 玩法规则 -->
            <div
              v-if="detail.wfgzjs96"
              class="play-rule"
            >
              <h3>玩法规则</h3>
              <p class="play-info">
                {{ detail.wfgzjs96 }}
              </p>
            </div>
            <i class="line" />
            <!-- 玩法人数 -->
            <div
              v-if="detail.wfrs9d"
              class="play-num"
            >
              <h3>玩法人数</h3>
              <p class="play-info">
                <span>{{ detail.wfrs9d }}</span>人
              </p>
            </div>
            <i class="line" />
            <!-- 玩法地图 -->
            <div
              v-if="detail.wfdt7f"
              class="play-map"
            >
              <h3>玩法地图</h3>
              <p class="play-info">
                <span>{{ detail.wfdt7f }}</span>地图
              </p>
            </div>
          </div>
          <!-- 地图的 -->
          <div
            v-else
            class="map-content"
          >
            <!-- 一句话攻略 -->
            <div class="one-word">
              <h3>一句话攻略</h3>
              <p class="play-info">
                {{ detail.dtglF8 }}
              </p>
            </div>
            <i class="line" />
            <!-- 适用模式 -->
            <div class="syms">
              <h3>适用模式</h3>
              <div class="syms-img">
                <router-link
                  v-for="item in detail.dtsymsD2"
                  :key="item.dtsysms06"
                  class="syms-imgbox"
                  :to="`/walkthrough/gameplay_detail/${item.dtsyms06}?tab=mode`"
                >
                  <img
                    v-report="['map-guide.map-suitable-pattern', item.dtsyms06, detail.dtmmc63]"
                    :src="item.dtmsmc8d | convertHttps"
                  >
                </router-link>
              </div>
            </div>
          </div>
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
        </div>
      </div>
      <!-- 玩法攻略 -->
      <div class="play-right">
        <div class="play-detail">
          <h3>玩法攻略</h3>
          <div class="rank-box">
            <V4VideoCardList
              v-report="tab === 'mode'?
                ['pattern.pattern-content', detail.wfmc95]:
                ['map-guide.map-content', detail.dtmmc63]"
              :v4-id="v4Id"
            />
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="!detail" />
    <PlayVideoBox
      v-if="detail.dtspjs54 && showPlayBox"
      :vid="detail.dtspjs54"
      :title="detail.dtmmc63"
      :poster="detail.dtgllh79 | convertHttps"
      :on-hide="handleClosePlayBox"
    />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.details-page {
  .top-nav {
    .mx-top-nav;
    justify-content: center;
  }

  .nav-bg-img {
    width: 100%;
    .mx-nav-bg-img;
  }

  .content {
    .mx-size(100%, 100%);
    display: flex;
    justify-content: space-between;
    padding-top: 0.2rem;
    box-sizing: border-box;
  }

  .play-left {
    .mx-size(40%, calc(100vh - 0.97rem));

    .play-video {
      .mx-size(100%, 38%);
      position: relative;
      .mx-horn(0.05rem, #a4a8ae);

      .play-img {
        position: relative;
        .mx-size(100%, 100%);

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
          .mx-size(1.16rem, 1.16rem);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          img {
            .mx-size(100%, 100%);
          }
        }

        .video-tit {
          width: 100%;
          height: 0.4rem;
          line-height: 0.4rem;
          color: #fff;
          display: block;
          position: absolute;
          bottom: 0;
          padding-left: 0.13rem;
          background-color: rgba(0, 0, 0, 0.4);
          box-sizing: border-box;
          font-size: 0.22rem;
          text-align: left;
          .single-line();
        }
      }
    }

    .play-box {
      .mx-size(100%, 56%);
      position: relative;
      background-color: #2a313b;
      border: 1px solid #464f5b;
      margin-top: 4%;
      .mx-horn(0.1rem, #a4a8ae);

      .play-content {
        .mx-size(100%, 100%);
        // .mx-size(100%, 5rem);
        text-align: left;
        overflow-y: scroll;
        padding: 0.2rem 0.08rem 0 0.08rem;
        box-sizing: border-box;

        .play-rule,
        .play-num,
        .play-map {
          .mx-size(100%, auto);

          h3 {
            margin-top: 0.2rem;
          }
        }

        .play-rule {
          .mx-size(100%, auto);

          h3 {
            margin-top: 0;
          }

          .play-info {
            margin-top: 0.1rem;
            margin-bottom: 0.3rem;
            .mx-size(100%, auto);
            // overflow-y: scroll;
          }
        }

        .play-num,
        .play-map {
          .play-info {
            margin-top: 0.1rem;
            margin-bottom: 0.2rem;
          }
        }

        .play-info {
          color: #ddd;
          font-size: 0.2rem;
        }

        .one-word {
          .play-info {
            color: #ddd;
            font-size: 0.2rem;
            margin-top: 0.1rem;
            margin-bottom: 0.2rem;
            .multi-line(2);
          }
        }
      }

      .map-content {
        .mx-size(100%, 100%);
        // .mx-size(100%, 5rem);
        text-align: left;
        overflow-y: scroll;
        padding: 0.2rem 0.08rem 0 0.08rem;
        box-sizing: border-box;

        .syms {
          .mx-size(100%, auto);

          h3 {
            margin-top: 0.2rem;
            margin-bottom: 0.07rem;
          }
        }

        .play-info {
          color: #ddd;
          font-size: 0.2rem;
          margin-top: 0.1rem;
          margin-bottom: 0.3rem;
          width: 100%;
          height: auto;
        }

        .syms-img {
          .mx-size(100%, auto);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          // overflow-y: scroll;

          .syms-imgbox {
            .mx-size(48%, 0.49rem);
            border: 1px solid #464f5b;
            margin-top: 0.1rem;
            position: relative;

            img {
              .mx-size(100%);
              display: block;
            }

            // .mantle {
            //   .com-mantle();
            // }

            .syms-name {
              color: #fff;
              font-weight: bold;
              font-size: 0.24rem;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 2;
            }
          }
        }
      }
    }
  }

  .play-right {
    .mx-size(58%, calc(100vh - 0.97rem));

    .play-detail {
      .mx-size(100%, 100%);

      .rank-box {
        .mx-size(100%, calc(100% - 0.55rem));
        overflow-y: scroll;
        margin-top: 0;

        /deep/ .rank-ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding-bottom: 0.3rem;
          box-sizing: border-box;
          padding-top: 0.17rem;

          .rank-li {
            width: 48%;
          }

          .rank-li:nth-child(3n + 3) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
