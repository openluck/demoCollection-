<template>
  <div class="lineup">
    <div class="top">
      <a-icon type="left-circle" @click="back" style="font-size: 22px" />
      <span @click="out">退出排队</span>
    </div>
    <div class="center" v-if="isLine">
      <div class="iconLoading">
        <a-icon type="loading" />
      </div>
      <p>
        {{
          `${
            this.lineup.status === 0
              ? "正在排队，请稍后喔..."
              : this.lineup.status === 1
              ? "排课中，请稍等..."
              : ""
          }`
        }}
      </p>

      <div class="dataInfo" v-if="this.lineup.status === 0">
        当前
        <span>{{ lineup.current }}</span>
        号
      </div>
    </div>
    <div v-else class="center">
      <div class="iconLoading">
        <a-icon type="check-circle" />
      </div>
      <p>排课已完成</p>
      <a-button @click="goResult">查看排课结果</a-button>
    </div>
    <div class="data-list">
      <div class="title">
        <span class="title1">自动排课进入数据</span>
        <span
          >{{ dataList.length === 0 ? 0 : dataList.totalTeacherNum }}位老师 /
          {{ dataList.length === 0 ? 0 : dataList.totalTeacherCourseNum }}课时
        </span>
      </div>
      <div class="subject">
        <div
          class="sub-item"
          v-for="(item, index) in dataList.subjectList"
          :key="index"
        >
          <span class="subjectName">{{ item.subjectName }}</span>
          <div>
            <span :style="{ color: item.subjectTeacher == 0 ? '#919599' : '' }"
              >{{ item.subjectTeacher }}位 / </span
            ><span :style="{ color: item.subjectHour == 0 ? '#919599' : '' }"
              >{{ item.subjectHour }}课时</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    planId: {
      type: String,
      default: "",
    },
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      _queueup: null,
      lineup: {
        front: 0,
        current: 0,
      },
      isLine: true, //是否在排队中：true是，false排课完成
      dataList: {},
    };
  },
  mounted() {
    this.getQueueup();
    this.autoArrangeDataList();
    this._queueup = setInterval(() => {
      this.getQueueup();
    }, 5000);
  },
  beforeDestroy() {
    // console.log(111);
    // clearInterval(this._queueup);
    this.toClearInterval();
  },
  methods: {
    /**
     * @desc 排队接口
     * status：0-排队，1-进行中，2-结束，3-退出
     */
    async getQueueup() {
      // console.log(this.planId);
      const planId = this.planId;
      const res = await this.$api.ArrlessonList.getQueueup({
        planId,
      });
      if (res.code == 200) {
        this.lineup = res.data;
        if (res.data.status === 2) {
          this.isLine = false;
        }
        if (res.data.status === 3) {
          this.$parent.showLineup = false;
          this.toClearInterval();
        }
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },

    back() {
      this.toClearInterval();
      if (this.pageType) {
        this.$parent.refreshAllData();
        this.$router.push({
          path: "/ArrLessonList",
          query: {},
        });
      } else this.$parent.showLineup = false;
    },

    async out() {
      const planId = this.planId;
      const res = await this.$api.ArrlessonList.outQueueup({ planId });
      if (res.code == 200) {
        this.toClearInterval();
        this.$parent.showLineup = false;
        this.$message.success("退出排队成功！");
        this.$parent.refreshAllData();
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },

    /**
     * @desc 查看排课结果
     */
    goResult() {
      this.toClearInterval();
      this.$parent.showLineup = false;
      this.$parent.refreshAllData();
      // setTimeout(() => {
      //   this.$router.push({
      //     path: "/PreviewTimetable",
      //     query: {},
      //   });
      // }, 1000);
    },
    /**
     * 清除定时器
     */
    toClearInterval() {
      clearInterval(this._queueup);
      this._queueup = null;
    },
    /**
     * @name: 自动排课页面展示数据
     * @msg:
     * @param {*}
     * @return {*}
     */
    async autoArrangeDataList() {
      const planId = this.planId;
      const res = await this.$api.ArrlessonList.autoArrangeDataList({
        planId,
      });
      if (res.code === "200") {
        this.dataList = res.data;
      } else {
        this.$message.warning(res.message);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.lineup {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  .top {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    color: #1890ff;
    padding: 0 24px;
    box-sizing: border-box;
    span {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .center {
    height: calc(100% - 36px);
    display: flex;
    // background-color: #f0f2f5;
    background-color: #fff;
    flex-direction: column;
    // justify-content: center;
    justify-content: flex-start;
    align-items: center;
    // padding-top: 50px;
    /deep/ .anticon svg {
      width: 80px;
      height: 80px;
      color: #409fff;
    }
    .dataInfo {
      width: 585px;
      height: 100px;
      line-height: 100px;
      box-sizing: border-box;
      border: 2px solid #98cbff;
      border-radius: 3px;
      font-size: 24px;
      text-align: center;
      color: #000000;
      span {
        display: inline-block;
        margin: 0 6px;
        font-size: 32px;
      }
    }
    p {
      font-size: 36px;
      color: #000000;
      margin-top: 15px;
      margin-bottom: 26px;
    }
    /deep/ .ant-btn {
      width: 160px;
      height: 40px;
      line-height: 40px;
      background-color: #3399ff;
      color: #fff;
      font-size: 16px;
    }
  }
  .data-list {
    width: 586px;
    position: fixed;
    top: 35%;
    right: 35%;
    font-size: 18px;
    color: #303233;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .title1 {
        color: #409fff;
        font-size: 20px;
      }
    }
    .subject {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: 539px;
      overflow-y: scroll;
      padding-right: 2px;
      font-size: 14px;

      .sub-item {
        width: 49%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f7f9fa;
        border-radius: 4px;
        padding: 0 16px;
        box-sizing: border-box;
        margin-bottom: 8px;

        .subjectName {
          display: inline-block;
          width: 63%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .subject::-webkit-scrollbar-thumb {
      border-radius: 3px !important;
      background-color: #f7f9fa !important;
      margin-left: 7px;
    }
    .subject::-webkit-scrollbar-track {
      border-radius: 3px !important;
      background-color: #fff !important;
    }
  }
}
</style>