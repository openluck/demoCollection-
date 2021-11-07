<template>
  <div class="square-page">
    <router-link
      v-if="!isExperienceEnv"
      v-report="'dynamic.publish'"
      class="publish-btn"
      :to="'/found/publish'"
    >
      <img
        :src="convertImgExt('found/fb-btn.png')"
      >
    </router-link>
    <div
      v-if="!isExperienceEnv"
      class="square-tit"
    >
      <h3>热门话题</h3>
      <!-- 加on选中 -->
      <div class="sel-btn">
        <span
          v-report="['dynamic.topic-sort', '最新']"
          :class="`new ${tab === 'latest' ? 'on' : ''}`"
          @click.stop="handleTabClick('latest')"
        >最新</span>
        <span
          v-report="['dynamic.topic-sort', '最热']"
          :class="`hot ${tab === 'hottest' ? 'on' : ''}`"
          @click.stop="handleTabClick('hottest')"
        >最热</span>
        <!-- <span
          :class="`all ${tab === 'all' ? 'on' : ''}`"
          @click.stop="handleTabClick('all')"
        >全部</span> -->
      </div>
    </div>
    <DynamicWaterfall
      v-if="$route.name.includes('square') && !isExperienceEnv"
      :tab="tab"
      :on-click-topic="handleClickTopicItem"
    />
    <SystemSafeguardHint v-if="isExperienceEnv" />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.square-page {
  .mx-size(100%, calc(100vh - 0.77rem));
  // margin-top: 0.1rem;
  position: relative;
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;

  .publish-btn {
    position: absolute;
    z-index: 9;
    right: 2%;
    top: 70%;
    .mx-size(0.66rem);

    img {
      .mx-size(100%);
    }
  }

  .square-tit {
    display: flex;
    justify-content: space-between;
    margin-top: 0.16rem;

    .sel-btn {
      .mx-size(2.25rem, 0.34rem);
      display: flex;

      span {
        display: inline-block;
        flex: 1;
        height: 0.34rem;
        text-align: center;
        align-items: center;
        font-size: 0.22rem;
        color: #ddd;
        border: 1px solid #9da4ac;
        box-sizing: border-box;
        background: #4f5b69;
      }

      .on {
        background: #feed57;
        color: #000;
      }
    }
  }
}

/deep/ .empty-box {
  .inner {
    margin-top: 0.2rem;
  }
}
</style>
