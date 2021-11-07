<template>
  <div
    class="calendar-page"
    style="color: #fff;"
  >
    <h3>活动日历</h3>
    <div class="calen-all">
      <!-- 日历 -->
      <div class="calen-data">
        <i class="horn1 horn" />
        <i class="horn2 horn" />
        <i class="horn3 horn" />
        <i class="horn4 horn" />
        <!-- 日历 -->
        <div id="calendar">
          <div class="cal-wrap">
            <div class="cal-top">
              <div class="cal-yx">
                <div class="yx-text ovh">
                  {{ calendar.year }}年{{ calendar.month }}月
                </div>
                <!-- <i class="line"></i> -->
              </div>
              <div class="cal-week-wrap ovh">
                <div
                  v-for="(item, index) in calendar.weeks"
                  :key="index"
                  class="cal-week"
                >
                  {{ item }}
                </div>
              </div>
            </div>

            <table class="cal-table mb20">
              <tr
                v-for="(row, itemIndex) in calendar.dayList"
                :key="itemIndex"
              >
                <td
                  v-for="(item, index) in row"
                  :key="item.date + index"
                  :class="{ 'bg-grey': item.disable }"
                >
                  <div
                    v-if="!item.nowMonth && item"
                    class="cal-item"
                    :class="{
                      ago: !item.nowMonth,
                    }"
                  >
                    <span>{{ item.day }}</span>
                  </div>
                  <!-- on表示选中-->
                  <!-- cal-active 表示有当天 -->
                  <div
                    v-else-if="item"
                    v-report="['calender.other-day',item.date + index]"
                    class="cal-item"
                    :class="{
                      on: beDay === item.day,
                      'cal-active': parseInt(item.day) === calendar.isDay && item.day !== 0,
                    }"
                    @click.stop="handleChooseDate(item.day)"
                  >
                    <span>{{ item.day }}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 活动 -->
      <!-- calen-active加on表示无数据 -->
      <div
        v-if="activeData.length > 0"
        class="calen-active"
      >
        <i class="horn1 horn" />
        <i class="horn2 horn" />
        <i class="horn3 horn" />
        <i class="horn4 horn" />
        <div class="active-all">
          <img
            class="no-data"
            src=""
            alt=""
          >
          <ul class="acontnt-all">
            <!-- active-content 加import表示重磅 -->
            <li
              v-for="(item, index) in activeData"
              :key="index"
              :class="item.zb1a === '1' ? 'active-content import' : 'active-content'"
            >
              <span class="zb-box">
                <i class="import">重磅</i>
              </span>
              <i class="horn1 horn" />
              <i class="horn2 horn" />
              <i class="horn3 horn" />
              <i class="horn4 horn" />
              <h4>{{ item.jldymcE5 }}</h4>
              <div class="act-top">
                <span class="act-time">活动时间:&emsp;</span>
                <span>{{ item.sj5a }}</span>
              </div>
              <div class="act-top act-top2">
                <span class="act-time">活动奖励:&emsp;</span>
                <ul class="gift-list">
                  <li>
                    <div>
                      <img
                        :src="item.jlt66"
                        alt="金币"
                      >
                      <i class="horn1 horn" />
                      <i class="horn2 horn" />
                      <i class="horn3 horn" />
                      <i class="horn4 horn" />
                    </div>
                    <span>{{ item.jldymcE5 }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Empty
        v-else
        :msg="'暂时还没有活动哦'"
      />
    </div>
    <Loading v-if="loading" />
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

/deep/ .empty-box {
  width: 49% !important;

  .inner {
    margin-top: -20px;
  }
}

.calen-all {
  display: flex;
  justify-content: space-between;
  .mx-size(100%, calc(100vh - 1.27rem));
  margin-top: 0.2rem;
  // padding: 0 0.24rem 0 0.2rem;
}

.calendar-page {
  // padding-top: 0.15rem;
  width: 100%;
  height: calc(100vh - 0.77rem);
  position: relative;
  padding: 0 0.24rem 0 0.2rem;
  box-sizing: border-box;

  h3 {
    font-size: 0.26rem;
    color: #fff;
    padding-left: 0.12rem;
    box-sizing: border-box;
    position: relative;
    text-align: left;

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

  .calen-data,
  .calen-active {
    .mx-size(49%, calc(100% - 0.2rem));
    background: #2c333e;
    position: relative;
    .mx-horn(0.05rem, #9fa2a8);
  }
}

// 日历样式
#calendar {
  font-size: 0.2rem;
  .mx-size(100%);

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .hand {
    cursor: pointer;
  }

  .cal-wrap {
    .mx-size(100%);
    color: #fff;
    box-sizing: border-box;
    background-color: #2a313b;
    border: 1px solid #464f5b;
  }

  .cal-yx {
    text-align: left;
    line-height: 0.5rem;
    margin: 0 0.1rem;
  }

  .cal-week-wrap {
    border-bottom: none;
    .mx-size(100%, auto);
    display: flex;
    justify-content: space-between;
    color: #fff;
    margin-top: 0.05rem;
    // padding: 0 0.2rem;
    box-sizing: border-box;
  }

  .cal-week {
    font-size: 0.3rem;
    .mx-size(14%, 13%);
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid #424852;
    border-right: 1px solid #424852;
    border-top: 1px solid #424852;
  }

  .cal-week:nth-child(7) {
    border-right: 0;
  }

  .yx-text {
    font-size: 0.3rem;
    box-sizing: border-box;
    color: #ffed57;
    padding-top: 0.1rem;
    margin-bottom: 0.1rem;
    text-align: center;
  }

  .yx-text span {
    display: inline-block;
    margin: -0.1rem 0 0 0.1rem;
    border-radius: 0.03rem;
    background: #f17437;
    color: #fff;
    font-size: 0.14rem;
  }

  .cal-left,
  .cal-right {
    font-size: 0.22rem;
    .mx-size(0.2rem, auto);
    text-align: center;
  }

  .cal-left:hover > i,
  .cal-right:hover > i {
    color: #3583f7;
  }

  .cal-table {
    // .mx-size(100%, calc(100% - 1.22rem));
    .mx-size(100%, calc(100% - 1.1rem));
    text-align: center;
    border-collapse: collapse;
    box-sizing: border-box;
  }

  .cal-table tr {
    display: flex;
    justify-content: space-between;
    text-align: center;
    // padding: 0 0.2rem;
    // .mx-size(100%, 15.5%);
    .mx-size(100%, 16.6%);
    box-sizing: border-box;
  }

  .cal-table td {
    .mx-size(14%, 100%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    // border: 1px solid #464f5b;
    border-top: 0.01rem solid #464f5b;
    border-left: 0.01rem solid #464f5b;
  }

  .cal-table td:nth-child(1) {
    border-left: 0;
  }

  .cal-item > span {
    // border-radius: 50%;
    font-size: 0.26rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .mx-size(100%, 100%);
  }

  .cal-active > span {
    color: #4b410f;
    // background: #ffed57;
    border: 1px solid #ffed57;
    background: url(~@assets/img/found/activeday-bg.png) no-repeat center;
    background-size: cover;
    box-sizing: border-box;
  }

  .cal-active.on > span {
    // background: #ffed57 !important;
    background: url(~@assets/img/found/activeday-bg.png) no-repeat center;
    background-size: cover;
    box-sizing: border-box;
  }

  .cal-time-list {
    font-size: 0.12rem;
    text-align: left;
  }

  .cal-time-list > p {
    margin: 0 auto;
    padding-left: 0.08rem;
    .mx-size(auto, 0.18rem);
    line-height: 0.18rem;
  }

  .cal-time-list > p > span {
    display: block;
    overflow: hidden;
  }

  .cal-item {
    position: relative;
    // .mx-size(0.6rem);
    .mx-size(0.7rem, 90%);
    padding: 0.02rem;
    box-sizing: border-box;
  }

  .cal-item.on {
    color: #fff !important;
    border: 1px solid #ffed57;
    box-sizing: border-box;
    // border-radius: 100%;
    font-size: 0.22rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .mx-size(0.7rem, 90%);
  }

  .cal-item.ago {
    color: #91959a;
  }
}

// 活动样式

.calen-active {
  background: none !important;

  .horn {
    display: none;
  }

  .active-content {
    background-color: #2a313b;
    border: 1px solid #464f5b;

    .horn {
      display: block;
    }
  }
}

.acontnt-all {
  .mx-size(100%);
  overflow: hidden;
  overflow-y: scroll;
}

.calen-active.on {
  background-color: #2a313b !important;
  border: 1px solid #464f5b;
  display: flex;
  align-items: center;
  justify-content: center;
  .mx-horn(0.05rem, #9fa2a8);

  .horn {
    display: block;
  }

  .acontnt-all {
    display: none;
  }

  .active-all {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-data {
    display: block;
  }
}

.calen-data {
  margin-right: 0.1rem;
}

.active-all {
  .mx-size(100%);

  .no-data {
    display: none;
    .mx-size(1.63rem, 1.52rem);
    background: oldlace;
  }

  .active-content {
    .mx-size(100%, 3rem);
    .mx-horn(0.05rem, #9fa2a8);
    position: relative;
    color: #ffed57;
    font-size: 0.22rem;
    box-sizing: border-box;

    .zb-box {
      display: inline-block;
      .mx-size(0.8rem, 0.79rem);
      position: absolute;
      right: -0.03rem;
      top: -0.03rem;
      background: url(~@assets/img/found/imp-icon.png) no-repeat center/cover;
    }

    h4 {
      font-size: 0.24rem;
      text-align: left;
      padding-left: 0.2rem;
      margin-top: 0.1rem;
    }
  }
}

.act-top {
  text-align: left;
  padding-left: 0.4rem;
  margin-top: 0.2rem;
  position: relative;

  .act-time {
    color: #ddd;
    position: relative;

    &::before {
      content: '';
      display: inline-block;
      background-color: #ffed57;
      top: 50%;
      transform: translateY(-50%) rotate(130deg);
      position: absolute;
      .mx-size(0.1rem);
      left: -0.2rem;
    }
  }

  .gift-list {
    display: inline-block;
    margin-left: 1rem;
    padding-right: 0.2rem;
    box-sizing: border-box;
    white-space: nowrap;
    overflow-x: scroll;
    .mx-size(calc(100% - 1rem), auto);

    img {
      .mx-size(100%);
      // .mx-size(0.58rem, 0.44rem);
    }

    span {
      color: #ddd;
      max-width: 100%;
      font-size: 0.18rem;
      .multi-line(2);
      text-align: center;
    }

    li {
      display: inline-block;
      flex-direction: column;
      align-items: center;
      .mx-size(1rem, auto);
      margin-right: 0.1rem;
      white-space: initial;

      &:last-of-type {
        margin-right: 0;
      }
    }

    div {
      display: flex;
      justify-content: center;
      position: relative;
      .mx-size(0.66rem);
      align-items: center;
      margin: auto;

      img {
        .mx-size(0.58rem, 0.44rem);
      }
    }
  }
}

.act-top2 {
  position: relative;

  .act-time {
    top: -0.06rem;
    position: absolute;
  }
}

.how-order {
  .mx-size(1.2rem, 0.34rem);
  display: block;
  position: absolute;
  bottom: 0.2rem;
  left: 50%;
  transform: translateX(-50%);

  img {
    .mx-size(100%);
    display: none;
  }

  &.order {
    .order {
      display: block;
    }
  }

  &.ordered {
    .ordered {
      display: block;
    }
  }
}

.active-content {
  position: relative;
  margin-bottom: 0.2rem;

  .import {
    display: none;
    color: #4b410f;
    .mx-size(0.8rem, 0.79rem);
    // position: absolute;
    // right: 0.05rem;
    // top: 0.1rem;
    font-style: normal;
    transform: rotateZ(46deg);
    padding-top: 0.08rem;
  }

  &.import {
    .import {
      display: block;
    }
  }
}
</style>
