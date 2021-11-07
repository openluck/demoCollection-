<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-01-28 19:13:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 17:30:06
-->
<template>
  <div class="Schedule">
    <h3 class="title">课表调整记录</h3>
    <!-- :default-active-key="defaultActiveKey" -->
    <a-tabs
      class="ScheduleAdjustment"
      :active-key="defaultActiveKey"
      @change="callbackey"
    >
      <a-tab-pane class="ScheduleItem" key="1" tab="周内调换课">
        <ScheduleInWeek></ScheduleInWeek>
      </a-tab-pane>
      <a-tab-pane class="ScheduleItem" key="2" tab="跨周课换课">
        <ScheduleAcrossWeek></ScheduleAcrossWeek>
      </a-tab-pane>
      <a-tab-pane key="3" tab="代课调整">
        <ScheduleTipsay></ScheduleTipsay>
      </a-tab-pane>
      <a-tab-pane key="4" tab="场所调整">
        <SchedulePlace></SchedulePlace>
      </a-tab-pane>
      <a-tab-pane key="5" tab="学生换课">
        <ScheduleStudent></ScheduleStudent>
      </a-tab-pane>
      <a-tab-pane key="6" tab="换休调整">
        <ScheduleRest></ScheduleRest>
      </a-tab-pane>
      <a-tab-pane key="7" tab="删除课程">
        <ScheduleCancle></ScheduleCancle>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import ScheduleAcrossWeek from "./ScheduleChildCom/ScheduleAcrossWeek"; //跨周调换课
import ScheduleInWeek from "./ScheduleChildCom/ScheduleInWeek"; //周内调换课
import SchedulePlace from "./ScheduleChildCom/SchedulePlace"; //场所调整
import ScheduleRest from "./ScheduleChildCom/ScheduleRest"; //换休调整
import ScheduleStudent from "./ScheduleChildCom/ScheduleStudent"; //学生换课
import ScheduleTipsay from "./ScheduleChildCom/ScheduleTipsay"; //代课调整
import ScheduleCancle from "./ScheduleChildCom/ScheduleCancle"; //删除课程调整
export default {
  components: {
    ScheduleAcrossWeek,
    SchedulePlace,
    ScheduleRest,
    ScheduleStudent,
    ScheduleTipsay,
    ScheduleCancle,
    ScheduleInWeek,
  },
  data() {
    return {
      defaultActiveKey: "",
    };
  },
  mounted() {
    let type = this.$route.query.changeType;
    if (typeof type !== "undefined") {
      this.$nextTick(() => {
        this.defaultActiveKey = type;
      });
    } else {
      this.defaultActiveKey = "1";
    }
  },
  methods: {
    callbackey(key) {
      this.defaultActiveKey = key;
    },
  },
};
</script>

<style  lang="less" scoped>
.Schedule {
  width: 100%;
  height: 100%;
  .ScheduleAdjustment {
    width: 100%;
    display: flex;
    flex-direction: column;
    .ant-tabs-content {
      flex-grow: 1;
    }
  }
  .title {
    color: #303233;
    font-size: 18px;
    font-weight: normal;
    margin: 21px 0 0 24px;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab {
    color: #494b4d;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab-active {
    color: #1bb280;
  }
  /deep/ .ant-tabs-nav {
    margin-left: 10px;
  }
  /deep/ .ant-tabs-ink-bar {
    height: 3px;
    background-color: #2abf8e;
  }
}
</style>
