<template>
  <div class="home-page">
    <h2 class="top-nav">
      <span class="title">
        {{ title }}
      </span>
    </h2>
    <router-view />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import "styles/mixin.less";

.home-page {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .mx-size(100%);

  .top-nav {
    .mx-top-nav;
    justify-content: center;
  }
}
/* 屏幕分辨率比大于2 */
@media screen and (min-aspect-ratio: ~"200/100") {
  .home-page {
    .home-bottom {
      height: 56%;

      .home-bd {
        .bd-box {
          height: 80%;
        }
      }

      .home-zx {
        .zx-ul {
          height: 80%;
        }
      }
    }
  }
}
/* 屏幕分辨率比大于2.16 */
@media screen and (min-aspect-ratio: ~"216/100") {
  .home-page {
    .home-bottom {
      height: 56%;

      .home-bd {
        .bd-box {
          height: 79%;
        }
      }

      .home-zx {
        .zx-ul {
          height: 79%;
        }
      }
    }
  }
}
</style>
