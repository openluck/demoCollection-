<template>
  <div class="resource-div">
    <div id="tit">
      <p class="xz">
        您已选择
      </p>
      <span @click.stop="handleSwitchMapBtn">{{ currentMap.name }}</span>
      <transition name="fade">
        <ul
          v-show="showMapSelectedPanel"
          id="select"
        >
          <li
            v-for="item in mapList"
            :key="item.key"
            v-report="'map-resource.map-next'"
            @click.stop="handleMapBtnTap(item.key)"
          >
            {{ item.name }}
          </li>
        </ul>
      </transition>
    </div>
    <ul class="resource-list">
      <li
        v-for="(item, index) in mapDetailData"
        :key="item.id"
        class="resource-item"
      >
        <img :src="item.images">
        <p class="text-box">
          <span class="text-1">{{ item.title }}</span>
          <span>{{ item.describe }}</span>
        </p>
        <i
          v-report="['map-resource.map-resource', item.title]"
          :class="['choose hd', item.checked ? 'on' : '']"
          @click.stop="handleSelectedItem({ index, key: item.id })"
        />
      </li>
    </ul>
    <!-- 已经选择全部，添加on类名，变为全部取消 -->
    <span
      v-report="'map-resource.map-show-all'"
      :class="['show-all', showAllFlag ? 'on': '']"
      @click="handleSelectedAll"
    />
    <i class="horn1 horn" />
    <i class="horn2 horn" />
    <i class="horn3 horn" />
    <i class="horn4 horn" />
  </div>
</template>

<style lang="less" scoped>
@import 'styles/mixin.less';

.resource-div {
  width: 48%;
  height: 90%;
  overflow-y: auto;
  background: url(~@assets/img/found/resource_div.png) no-repeat center/5.65rem 6.36rem;
  padding: 0 0.15rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  .mx-horn(0.1rem, #9fa2a8);

  #tit {
    width: 100%;
    height: 0.6rem;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 5.32rem;
      height: 1px;
      position: absolute;
      background: url(~@assets/img/found/tit_icon.png) no-repeat center/5.32rem 0.01rem;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }

    .xz {
      display: block;
      width: 1.14rem;
      height: 0.24rem;
      line-height: 0.24rem;
      font-size: 0.24rem;
      color: #fff;
      position: relative;
      padding-left: 0.12rem;
      box-sizing: border-box;
      font-weight: 600;

      &::before {
        display: block;
        content: '';
        width: 0.04rem;
        height: 0.24rem;
        background: #f9e655;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
      }
    }

    span {
      width: 1.93rem;
      height: 0.48rem;
      display: flex;
      line-height: 0.48rem;
      align-items: center;
      padding-left: 0.35rem;
      box-sizing: border-box;
      margin-left: 0.1rem;
      font-size: 0.26rem;
      color: #ffed57;
      font-weight: 600;
      background: url(~@assets/img/found/section.png) no-repeat center/1.93rem 0.48rem;
    }

    #select {
      width: 1.91rem;
      // height: 2.35rem;
      background: rgba(42, 49, 59, 1);
      border: 1px solid #ffed57;
      font-size: 0.24rem;
      color: #fff;
      position: absolute;
      font-weight: 600;
      top: 0.6rem;
      left: 1.25rem;

      li {
        height: 0.46rem;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
        position: relative;

        &::before {
          content: '';
          width: 1.68rem;
          height: 1px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          background: url(~@assets/img/found/select_icon.png) no-repeat center/1.68rem 0.01rem;
        }

        &:nth-last-child(1)::before {
          display: none;
        }
      }

      &.on {
        display: block;
      }
    }
  }

  .resource-list {
    width: 100%;
    height: calc(100% - 1.8rem);
    margin: 0.18rem auto 0;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 0.05rem;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 0.04rem;
      background: #8a8d92;
    }

    &::-webkit-scrollbar-thumb {
      background: #fae655;
    }

    li.resource-item {
      width: 100%;
      height: 0.8rem;
      background: url(~@assets/img/found/resource_list.png) no-repeat center/cover;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 0.06rem;

      &:nth-child(1) {
        margin-top: 0;
      }

      img {
        height: 0.6rem;
        object-fit: contain;
      }

      p.text-box {
        width: 50%;
        font-size: 0.18rem;
        color: #bdbdbf;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .text-1 {
          font-size: 0.2rem;
        }
      }

      i {
        width: 0.52rem;
        height: 0.52rem;
        position: relative;
        background: url(~@assets/img/found/i.png) no-repeat;
        background-size: 100% 100%;

        &.on::before {
          content: '';
          display: block;
          width: 0.34rem;
          height: 0.26rem;
          background: url(~@assets/img/found/sure.png) no-repeat center/cover;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }

  .show-all {
    display: inline-block;
    width: 2.16rem;
    height: 0.74rem;
    margin: 0.1rem auto 0;
    background: url(~@assets/img/found/show_all.png) no-repeat center/cover;

    &.on {
      background: url(~@assets/img/found/cancel-all.png) no-repeat center/cover;
    }
  }
}

</style>

<script lang="ts" src="./index.ts"></script>
