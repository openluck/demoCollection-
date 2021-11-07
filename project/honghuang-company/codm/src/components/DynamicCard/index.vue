<template>
  <li class="central-dtli">
    <router-link
      v-report="['dynamic.dynamic', dynamicReportKey]"
      class="user-info"
      :to="`/found/dynamic_detail/${data.aid}`"
    >
      <div class="user-tx">
        <img :src="(data.authorAvatar || defalutAvatar) | convertHttps">
      </div>
      <div class="user-mesg">
        <span class="user-name">{{ data.authorName || '匿名用户' }}</span>
        <span class="iph-jx">{{ data.author.acctype | area }}-{{ data.author.platid | plat }}</span>
      </div>
    </router-link>
    <p class="dt-content">
      {{ data.content }}
    </p>
    <!-- 传一张图片的时候，默认类名 dt-imgbox -->
    <!-- 传两张图片的时候，添加类名 img2-->
    <!-- 传三张图片的时候，添加类名 img3-->
    <!-- 传四张图片及四张以上的时候，添加类名 img4-->
    <div :class="getCls()">
      <span
        v-for="el in piclist"
        :key="el.url"
        class="dt-img"
        @click.stop="previewIamge(el.url)"
      >
        <img
          :src="el.url | convertHttps"
          class="disabled"
        >
      </span>
    </div>

    <div class="dt-time">
      <span class="time">{{ (data.publishTime * 1000) | timeFormat('MM月dd日 hh:mm') }}</span>
      <router-link
        v-report="['dynamic.dynamic-comment', dynamicReportKey]"
        class="dt-xx"
        :to="`/found/dynamic_detail/${data.aid}`"
      >
        <i />{{ commentCount }}
      </router-link>
      <span
        v-report="['dynamic.dynamic-like', dynamicReportKey]"
        :class="likeInfo.isLike === 0 ? 'dt-dz' : 'dt-undz'"
        @click.stop="handleTapLikeIcon(data.aid)"
      ><i />{{ likeInfo.count }}</span>
    </div>
    <i class="horn1 horn" />
    <i class="horn2 horn" />
    <i class="horn3 horn" />
    <i class="horn4 horn" />
  </li>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.central-dtli {
  display: inline-block;
  width: 99%;
  background: #2b323c;
  color: #91959a;
  padding: 0.18rem;
  margin-right: 1%;
  box-sizing: border-box;
  margin-bottom: 0.27rem;
  position: relative;
  // max-height: 6rem;

  .mx-horn(0.05rem, #9fa2a8);

  .user-info {
    display: flex;
    align-items: center;

    .user-tx {
      .com-head();

      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
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
        margin-top: 0.12rem;
      }
    }
  }

  .dt-content {
    font-size: 0.2rem;
    color: #91959a;
    width: 100%;
    text-align: left;
    margin-top: 0.15rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
  }

  .dt-imgbox {
    // margin-top: 0.15rem;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .dt-img {
      display: block;
      margin-top: 0.15rem;
      max-height: 3.2rem;

      img {
        object-fit: contain;
        height: 3.2rem;
      }
    }

    &.img2 {
      display: flex;
      justify-content: space-between;

      .dt-img {
        .mx-size(48%, auto);
        margin-top: 0.15rem;

        img {
          .mx-size(100%);
        }
      }
    }

    &.img3 {
      display: flex;
      justify-content: space-between;

      .dt-img {
        .mx-size(33%, auto);
        margin-top: 0.15rem;

        img {
          .mx-size(100%);
        }
      }
    }

    &.img4 {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .dt-img {
        .mx-size(33%, auto);
        margin-top: 0.15rem;

        img {
          .mx-size(100%);
        }
      }
    }
  }

  .dt-time {
    font-size: 0.18rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: 0.17rem;
    position: relative;

    .time {
      position: absolute;
      left: 0;
    }

    & span:nth-child(2) {
      margin-right: 0.32rem;
    }

    .dt-xx {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      margin-right: 0.3rem;
      color: #91959a;

      i {
        display: inline-block;
        width: 0.26rem;
        height: 0.22rem;
        background: url(https://gzhcos.qq.com/codm/central/xiaoxi.png) no-repeat center/cover;
        background-size: contain;
        margin-right: 0.08rem;
      }
    }

    .dt-dz {
      font-size: 0.26rem;

      i {
        display: inline-block;
        background: url(https://gzhcos.qq.com/codm/central/zhan.png) no-repeat;
        background-size: contain;
        width: 0.25rem;
        height: 0.23rem;
        margin-right: 0.08rem;
      }
    }

    .dt-undz {
      font-size: 0.26rem;

      i {
        display: inline-block;
        background: url(https://gzhcos.qq.com/codm/central/onzhan.png) no-repeat;
        background-size: contain;
        width: 0.25rem;
        height: 0.23rem;
        margin-right: 0.08rem;
      }
    }
  }
}
</style>
