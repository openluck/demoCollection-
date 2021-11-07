<template>
  <div id="app">
    <div class="side-nav">
      <div
        id="back-btn"
        @click="handleBack"
      />
      <ul
        v-if="!$route.meta.hideNav"
        class="sidebar-main"
      >
        <li class="nav-li">
          <router-link
            :to="{ name: 'home' }"
            :class="getActiveCls('home')"
          >
            <span><em /><i>首页</i></span>
          </router-link>
        </li>
        <li class="nav-li">
          <router-link
            :to="{ name: 'walkthrough' }"
            :class="getActiveCls('walkthrough')"
          >
            <span><em /><i>攻略</i></span>
          </router-link>
        </li>
        <li class="nav-li">
          <span
            v-if="hasIntegralPick"
            id="red-dot"
          />
          <router-link
            :to="{ name: 'found' }"
            :class="getActiveCls('found')"
          >
            <span><em /><i>发现</i></span>
          </router-link>
        </li>
        <li class="nav-li">
          <span
            v-if="messageCount > 0"
            id="red-dot"
          />
          <router-link
            :to="{ name: 'central' }"
            :class="getActiveCls('central')"
          >
            <span><em /><i>我的</i></span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="main-wrapper">
      <!-- note: exclude: not [route-name] is [component name]  -->
      <keep-alive
        :max="3"
        :exclude="[
          'articleDetail',
          'videoDetail',
          'articleList',
          'videoList',
          'dynamicDetail',
          'weaponDetail',
          'gamePlayDetail',
          'integralRecord',
          'myaward',
          'mapPage'
        ]"
      >
        <router-view />
      </keep-alive>
    </div>
    <FacePhotoAd v-if="$route.name === 'home-content'" />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';
@import 'styles/media.less';
</style>
