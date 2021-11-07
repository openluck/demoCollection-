<template>
  <div class="home-bd">
    <div class="tit-box">
      <h3>
        大神宝典
      </h3>
      <span
        v-report="'index.change-book'"
        class="change-box"
      >
        <i
          v-if="labelList.length > 6"
          class="change"
          @click.stop="handleUpdateLabels"
        />
      </span>
    </div>
    <div class="bd-box">
      <i class="line" />
      <ul class="bd-ul">
        <!-- 加green类名显示绿色new,加red显示红色new -->
        <own-route-link
          v-for="item in labelList"
          :key="item.id"
          :class="labelCls(item.recommended)"
          :to="parserUrl(item.url, { title: encodeURIComponent(item.title) })"
          role="li"
          :report-id="['index.book', item.title]"
        >
          <i class="new">{{ item.recommended.toUpperCase() }}</i>
          <p
            class="bd-tit"
          >
            {{ item.title }}
          </p>
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
        </own-route-link>
        <li
          v-for="(item, index) in 6 - labelList.length"
          :key="index"
          class="bd-li hide"
        />
      </ul>
      <i class="line" />
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.home-bd {
  .mx-size(43.7%, 100%);

  .tit-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 0.26rem;
      color: #fff;
      padding-left: 0.12rem;
      box-sizing: border-box;
      position: relative;

      &::before {
        content: '';
        .mx-size(0.04rem, 0.24rem);
        background-color: #f9e655;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }

    .change-box {
      .mx-size(1.1rem, 0.61rem);
      display: block;
    }

    .change {
      .mx-size(1.1rem, 100%);
      background: url(https://gzhcos.qq.com/codm/home/change.png) no-repeat center/cover;
      background-size: contain;
      display: block;
    }
  }

  .bd-box {
    .mx-size(100%, 83%);
    background-color: #2a313b;
    border: 1px solid #464f5b;
    box-sizing: border-box;
    padding: 0.15rem;

    .line {
      background-color: #555c64;
      width: 100%;
      height: 1px;
      display: block;
      position: relative;

      &::before {
        content: '';
        .mx-size(1.5%, 100%);
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
      }

      &::after {
        content: '';
        .mx-size(1.5%, 100%);
        background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .bd-ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      height: 100%;
      align-content: flex-start;
      box-sizing: border-box;
      padding: 2% 0;

      .bd-li {
        .mx-size(48%, 28%);
        background: url(https://gzhcos.qq.com/codm/home/bd-li.png) no-repeat 50%/cover;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 3.8%;

        &:nth-child(1) {
          margin-top: 0;
        }

        &:nth-child(2) {
          margin-top: 0;
        }

        &.hide {
          opacity: 0;
          background: unset;
        }

        .new {
          display: none;
        }

        &.green {
          .new {
            display: block;
            color: #53a252;
            font-size: 0.14rem;
            font-style: normal;
            padding: 0 0.1rem;
            box-sizing: border-box;
            border: 1px solid #53a252;
            position: absolute;
            top: 0.05rem;
            left: 0.06rem;
          }
        }

        &.red {
          .new {
            display: block;
            color: #c35356;
            font-size: 0.14rem;
            font-style: normal;
            padding: 0 0.1rem;
            box-sizing: border-box;
            border: 1px solid #c35356;
            position: absolute;
            top: 0.05rem;
            left: 0.06rem;
          }
        }

        .bd-tit {
          color: #fff;
          font-size: 0.2rem;
          font-weight: bold;
        }

        .mx-horn(0.05rem, #fff);

        &:nth-child(5) {
          margin-bottom: 0;
        }

        &:nth-child(6) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
