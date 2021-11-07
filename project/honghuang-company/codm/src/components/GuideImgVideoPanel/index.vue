<template>
  <div class="content-right">
    <div class="tit">
      <h3>{{ panelTitle }}</h3>
    </div>
    <sui-scroll
      class="scroll-wrapper"
      style="height: calc(100% - 0.5rem);"
      :pull-down="!noData"
      @refresh="handlerRefresh"
      @reach-end="handleScrollLoadMore"
    >
      <div class="hotgl-up">
        <div
          v-for="item in videoList"
          :key="item.id"
          class="hotgl-video"
        >
          <router-link
            class="hotgl-imgbox"
            :to="item.url"
          >
            <img
              v-if="item.url"
              v-report="[reportId2, item.name]"
              class="hotgl-img"
              :src="item.img"
            >
            <!-- 去除蒙层类名 -->
            <img
              v-else
              :src="item.img"
              class="placeholder-img"
            >
            <img
              class="play-btn2"
              :src="convertImgExt('walkthrough/play-btn2.png')"
            >
            <div class="tit-mantle">
              {{ item.name }}
            </div>
          </router-link>
        </div>
      </div>
      <ul class="zx-ul">
        <template v-for="item in list">
          <V4ListItem
            :key="item.iId"
            :src="item.sIMG"
            :i-id="item.iId"
            :s-title="item.sTitle"
            :i-total-play="item.iTotalPlay"
            :s-idx-time="item.sCreated | timeFormat"
            :type="item.iInfoType == 1 ? 'article' : 'video'"
            :report-id="reportId3"
          >
            <i class="horn1 horn" />
            <i class="horn2 horn" />
            <i class="horn3 horn" />
            <i class="horn4 horn" />
          </V4ListItem>
        </template>
      </ul>
      <sui-load
        v-if="!noData && noMoreData"
        :more="!noMoreData"
      />
    </sui-scroll>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

.content-right {
  width: 53%;
  height: 100%;
  // background: blue;

  .tit {
    .mx-size(100%, auto);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.13rem 0;
    box-sizing: border-box;

    .change {
      width: 1.1rem;
      height: 0.35rem;
      background: url(https://gzhcos.qq.com/codm/home/change.png) no-repeat center / cover;
      background-size: contain;
      display: block;
      // padding: 0.13rem 0;
    }
  }

  .hotgl-up {
    display: flex;
    justify-content: space-between;
    .mx-size(100%, 30%);
    min-height: 1.5rem;

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
        display: block;
        min-height: 0.8rem;

        .hotgl-img {
          .mx-size(100%, 100%);
          min-height: 1.5rem;
        }

        .placeholder-img {
          .mx-size(100%, 1.5rem);
        }

        .play-btn2 {
          .mx-size(0.24rem, 0.27rem);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .tit-mantle {
          .tit-mantle();
        }
      }
    }
  }

  .zx-ul {
    height: 57%;
    width: 100%;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    // overflow-y: scroll;
    margin-top: 0.1rem;

    /deep/ .zx-li {
      // width: 100%;
      // height: 30%;
      // position: relative;
      height: 30.5%;
      background-color: #2a313b;
      border: 1px solid #464f5b;
      padding: 0.05rem;
      box-sizing: border-box;
      // display: flex;
      .mx-horn(0.1rem, #9fa2a8);
      margin-bottom: 1.8%;

      .zx-img {
        .mx-size(1.59rem, 100%);
        display: block;
      }

      .zx-cont {
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

/deep/ .sui-load {
  padding: 0 0.2rem !important;
}
</style>
