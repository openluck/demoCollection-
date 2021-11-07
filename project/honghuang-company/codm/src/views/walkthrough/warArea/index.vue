<template>
  <div class="war-area">
    <ul class="firearms-ul">
      <!-- 加on选中 -->
      <li
        v-report="['br.br-tab', '边境攻略']"
        :class="['firearms-li', tab === 'forbidden' ? 'on': '']"
        @click.stop="handleClickTabTap('forbidden')"
      >
        <span class="weapon">边境攻略</span>
      </li>
      <!-- <li
        v-report="['br.br-tab', '恶魔岛攻略']"
        :class="['firearms-li', tab === 'evil' ? 'on': '']"
        @click.stop="handleClickTabTap('evil')"
      >
        <span class="weapon">恶魔岛攻略</span>
      </li> -->
      <li
        v-report="['br.br-tab', '技能芯片']"
        :class="['firearms-li', tab === 'skillCore' ? 'on': '']"
        @click.stop="handleClickTabTap('skillCore')"
      >
        <span class="weapon">技能芯片</span>
      </li>
      <li
        v-report="['br.br-tab', '进阶技能']"
        :class="['firearms-li', tab === 'advancedSkill' ? 'on': '']"
        @click.stop="handleClickTabTap('advancedSkill')"
      >
        <span class="weapon">进阶技能</span>
      </li>
    </ul>
    <div
      v-if="tab !== 'skillCore' && tab !== 'advancedSkill'"
      class="area-con"
    >
      <div class="area-left">
        <div class="tit">
          <h3>{{ tab === 'evil' ? '恶魔岛介绍': '边境介绍' }}</h3>
        </div>
        <ul class="zone-ul">
          <li
            v-for="card in cardDataList"
            :key="card.id"
            class="zone-li"
          >
            <div class="jq-imgbox">
              <img
                v-if="card.name"
                class="jq-img"
                :src="card.img"
              >
              <img
                v-else
                class="jq-img-cover"
                :src="card.img"
              >
              <!-- 蒙层 note: 这里为了处理 埋点， 使用 条件渲染-->
              <div
                v-if="tab === 'evil'"
                v-report="['br.alcatraz-desc', card.id]"
                class="mantle"
                @click.stop="handleJumpBtn(card.url)"
              />
              <div
                v-else
                v-report="['br.restricted-area-desc', card.id]"
                class="mantle"
                @click.stop="handleJumpBtn(card.url)"
              />
            </div>
            <i class="icon icon1" />
            <i class="icon icon2" />
            <i class="icon icon3" />
            <i class="icon icon4" />
          </li>
        </ul>
      </div>
      <!-- note: 这里为了处理 埋点， 使用 条件渲染-->
      <GuideImgVideoPanel
        :panel-title="'热门攻略'"
        :v4id="v4IdMap[tab]"
        :type="'warArea'"
        :video-list="hotData"
        :report-id2="tab === 'evil' ?'br.alcatraz-banner': 'br.restricted-area-banner'"
        :report-id3="tab === 'evil'? 'br.alcatraz-v4': 'br.restricted-area-v4'"
      />
    </div>
    <div
      v-else
      class="skill-core-panel"
    >
      <GuideCardList
        :report-id="'br.skill-chip'"
        :list="cardDataList"
        :tab="tab"
      />
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.war-area {
  .mx-size(100%, calc(100vh - 0.77rem));
  // overflow-y: scroll;
  .firearms-ul {
    .comfirearms-ul();
  }

  .area-con {
    .mx-size(100%, calc(100% - 0.7rem));
    // background: pink;
    // margin-top: 0.23rem;
    display: flex;
    justify-content: space-between;

    .area-left {
      .mx-size(45%, 100%);
      // background: red;

      .tit {
        .mx-size(100%, auto);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.13rem 0;
        box-sizing: border-box;
      }

      .zone-ul {
        .mx-size(100%, 88%);
        display: flex;
        flex-wrap: wrap;
        // margin-top: 0.14rem;
        justify-content: space-between;
        // overflow-y: scroll;

        .zone-li {
          .mx-size(49%, 49%);
          border: 1px solid #7b828b;
          position: relative;
          padding: 0.02rem;
          box-sizing: border-box;

          .icon {
            .icon-sf();
          }

          .jq-imgbox {
            .mx-size(100%);
            position: relative;

            .jq-img {
              .mx-size(100%);
            }

            .jq-img-cover {
              .mx-size(100%);
              .com-mantle();
            }

            .mantle {
              .com-mantle();
              opacity: 0;
            }
          }
        }
      }
    }

    .area-right {
      width: 49%;
      height: 100%;
      // background: blue;

      .tit {
        .mx-size(100%, auto);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .change {
          width: 1.1rem;
          height: 0.35rem;
          background: url(https://gzhcos.qq.com/codm/home/change.png) no-repeat center / cover;
          background-size: contain;
          display: block;
          padding: 0.13rem 0;
        }
      }

      .hotgl-up {
        display: flex;
        justify-content: space-between;
        .mx-size(100%, 30%);

        .hotgl-video {
          border: 1px solid #7b828b;
          box-sizing: border-box;
          background-color: #2a313b;
          .mx-size(49%, 100%);
          position: relative;
          padding: 0.07rem;

          .hotgl-imgbox {
            .mx-size(100%, 100%);
            position: relative;

            .hotgl-img {
              .mx-size(100%, 100%);
            }

            .play-btn2 {
              .mx-size(0.24rem, 0.27rem);
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 2;
            }

            .mantle {
              .com-mantle();
            }

            .tit-mantle {
              .tit-mantle();
            }
          }
        }
      }

      .zx-ul {
        height: 59%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow-y: scroll;
        margin-top: 0.13rem;

        /deep/ .zx-li {
          width: 100%;
          height: 1.35rem;
          position: relative;
          background-color: #2a313b;
          border: 1px solid #464f5b;
          padding: 0.05rem;
          box-sizing: border-box;
          display: flex;
          .mx-horn(0.1rem, #9fa2a8);
          margin-bottom: 0.13rem;

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
  }
}

.skill-core-panel {
  height: calc(100% - 0.55rem);
  overflow-y: scroll;
  //
}
</style>
