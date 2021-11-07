<template>
  <div class="firearms-page">
    <!-- 武器列表 -->
    <ul
      class="firearms-ul"
    >
      <!-- 加on选中 -->
      <li
        v-report="['arms.arms-tab', 'hot']"
        :class="['firearms-li', tab === 'hot' ? 'on' : '']"
        @click.stop="switchTab('hot')"
      >
        <span class="weapon">热门</span>
      </li>
      <li
        v-report="['arms.arms-tab', 'gun']"
        :class="['firearms-li', tab === 'gun' ? 'on' : '']"
        @click.stop="switchTab('gun')"
      >
        <span class="weapon">枪匠</span>
      </li>
      <li
        v-for="(value, key) in labels"
        :key="key"
        v-report="['arms.arms-tab', value]"
        :class="getCls(key)"
        @click.stop="switchTab(key)"
      >
        <span class="weapon">{{ value }}</span>
      </li>
    </ul>
    <!-- 原来武器列表的样式 -->
    <ul
      v-if="tab !== 'hot' && tab !== 'gun'"
      class="weapon-ul"
    >
      <template v-for="item in data[tab]">
        <GunCardItem
          :key="item.id"
          :gun-id="item.id"
          :data="item"
          :report-id="['arms.arms', item.name]"
        />
      </template>
    </ul>

    <!-- 热门的界面 -->
    <div
      v-if="tab === 'hot'"
      class="hot-content"
    >
      <div class="content-left">
        <div class="tit">
          <H3>热门枪械</H3>
        </div>
        <div class="hotweapon-ul">
          <template v-for="item in mossData">
            <GunCardItem
              :key="item.id"
              :gun-id="item.url"
              :data="item"
              :report-id="['arms.arms-hot', item.name]"
            />
          </template>
        </div>
      </div>
      <GuideImgVideoPanel
        key="gun"
        :type="'firearms-gun'"
        :panel-title="'热门攻略'"
        :v4id="v4IdMap['gun']"
        :video-list="mossGuideData"
        :report-id2="'arms.arms-hot-banner'"
        :report-id3="'arms.arms-hot-v4-content'"
      />
    </div>

    <!-- 枪匠的界面 -->
    <div
      v-if="tab === 'gun'"
      class="gun-content"
    >
      <div class="content-left">
        <div class="tit">
          <h3>属性详解</h3>
        </div>
        <ul class="sx-ul">
          <li
            v-for="props in mossData"
            :key="props.id"
            class="sx-li"
          >
            <router-link
              v-report="['arms.arms-gunsmith-attribute', props.name]"
              class="jq-imgbox"
              :to="props.url"
            >
              <img
                v-if="props.name"
                class="jq-img"
                :src="props.img"
              >
              <img
                v-else
                :src="props.img"
                class="placeholder-img"
              >
              <!-- <div class="mantle" /> -->
              <span class="sx-name">{{ props.name }}</span>
            </router-link>
            <i class="icon icon1" />
            <i class="icon icon2" />
            <i class="icon icon3" />
            <i class="icon icon4" />
          </li>
        </ul>
      </div>
      <GuideImgVideoPanel
        key="hot"
        :v4id="v4IdMap['hot']"
        :panel-title="'枪匠攻略'"
        :type="'firearms-gun'"
        :video-list="mossGuideData"
        :report-id2="'arms.arms-gunsmith-banner'"
        :report-id3="'arms.arms-gunsmith-content'"
      />
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.firearms-page {
  .mx-size(100%, calc(100vh - 0.77rem));

  .firearms-top {
    .mx-size(100%, 0.77rem);
    color: #dadbdc;
    font-size: 0.2rem;
  }

  .firearms-ul {
    .comfirearms-ul();
  }

  .weapon-ul {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-top: 0.1rem;
    height: calc(100vh - 1.43rem);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  // 热门样式
  .hot-content {
    .mx-size(100%, calc(100% - 0.7rem));
    display: flex;
    justify-content: space-between;

    .content-left {
      .mx-size(45%, 100%);

      .tit {
        .mx-size(100%, auto);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.13rem 0;
        box-sizing: border-box;
      }

      /deep/ .hotweapon-ul {
        width: 100%;
        height: 88%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 0;
        overflow-y: scroll;
        overflow-x: hidden;

        .weapon-li {
          width: 49%;
          background: url(https://gzhcos.qq.com/codm/walkthrough/wq-bg2.png) no-repeat center / cover;
          margin-right: 0;
          height: 1.22rem;
          margin-bottom: 0.12rem;
          border-bottom: 1px solid #f9e655;

          .weapon-box {
            // width: auto;
            // height: 0.76rem;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.1rem;
            position: absolute;
            top: -10%;
          }

          .wq-name {
            width: 100%;
            color: #fff;
            text-align: left;
            padding-left: 0.3rem;
            box-sizing: border-box;
            position: absolute;
            z-index: 2;
            font-size: 0.22rem;
            bottom: 0.02rem;
          }
        }
      }
    }
  }

  // 枪匠样式
  .gun-content {
    .mx-size(100%, calc(100% - 0.7rem));
    display: flex;
    justify-content: space-between;

    .content-left {
      .mx-size(45%, 100%);

      .tit {
        padding: 0.13rem 0;
        box-sizing: border-box;
      }
    }

    .sx-ul {
      .mx-size(100%, 91%);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      // overflow-y: scroll;

      .sx-li {
        .mx-size(49%, 29.8%);
        border: 1px solid #7b828b;
        position: relative;
        padding: 0.03rem;
        box-sizing: border-box;
        margin-bottom: 0.13rem;
      }

      .icon {
        .icon-sf();
      }

      .jq-imgbox {
        .mx-size(100%);
        position: relative;
        display: inline-block;

        .jq-img {
          .mx-size(100%);
        }

        .mantle {
          .com-mantle();
        }

        .sx-name {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #ffed57;
          font-size: 0.3rem;
          font-weight: bold;
        }
      }
    }
  }
}

.placeholder-img {
  .mx-size(1.3rem, 0.77rem);
}
</style>
