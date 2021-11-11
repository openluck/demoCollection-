<!--
 * @Author: ylc
 * @Date: 2021-08-11 10:46:28
 * @LastEditTime: 2021-10-14 13:49:18
 * @LastEditors: ylc
 * @Description: 课表菜单栏
 * @FilePath: \Web\src\views\TimetableQuery\Child\TableMenu.vue
-->

<template>
  <div class="ylc-table-menu">
    <a-week-picker id="selectWeek"
      :allowClear="false"
      v-model="week"
      @change="dateChange"
      :disabled-date="disabledDate"
      placeholder="请选择时间"
      style="width: 232px; padding: 12px 0"
      :format="placeTime" />
    <div class="ylc-table-week">{{ teachWeek.teachWeekName }}</div>
    <!-- 选择显示项 -->
    <div style="margin-left: 48px;white-space: nowrap;">
      <a-checkbox-group :value="checkList"
        name="checkboxgroup"
        :options="plainOptions"
        @change="checkChange" />
    </div>
    <div class="ylc-check-btn">课表内容显示勾选</div>
  </div>
</template>

<script>
import moment from "moment";
import { getWeekInTime } from "../../../Utils/util";
export default {
  props: {
    semesterStartTime: {
      type: String,
      default: ""
    },
    semesterEndTime: {
      type: String,
      default: ""
    },
    statu: {
      type: Boolean,
      default: false
    },
    defaultWeek: {},
    outCheck: []
  },
  data() {
    return {
      week: "",
      plainOptions: ["科目", "场所", "教师", "班级", "时间"],
      fetchData: {
        startDate: "",
        endTime: "",
        startTime: ""
      },
      checkList: [],
      teachWeek: {} // 教学周数
    };
  },
  computed: {
    placeTime() {
      return (
        this.fetchData.startTime + " " + "  ~  " + " " + this.fetchData.endTime
      );
    }
  },
  watch: {
    semesterStartTime(val) {
      if (val) {
        this.week = moment(val);
        this.dateChange()
      }
    }
  },
  mounted() {
    this.nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
    this.dateValue()
    this.checkList = this.outCheck
  },
  methods: {
    // 更改显示项
    checkChange(checkedValues) {
      if (checkedValues.length < 1) {
        return this.$message.warn("至少勾选一个")
      } else {
        this.checkList = checkedValues
        this.$emit("checkChange", checkedValues);
      }
    },
    // 时间初始化赋值
    async dateValue() {
      if (typeof (this.defaultWeek) === "string") {
        this.week = this.defaultWeek
      } else {
        this.week = this.nowSemester.defaultTime
      }
      let startDate = moment(this.week).day(1).format("YYYY-MM-DD");
      let endDate = moment(this.week).day(7).format("YYYY-MM-DD");
      if (startDate < this.semesterStartTime) {
        startDate = this.semesterStartTime
      }
      this.fetchData.startTime = startDate;
      this.fetchData.endTime = endDate;
      this.fetchData.startDate = startDate;
      await this.getTeachWeekByDate();
      this.$emit("getTeachWeek", this.teachWeek);
    },
    // 禁止时间范围
    disabledDate(current) {
      return (
        moment(this.semesterEndTime ? this.semesterEndTime : this.nowSemester.semesterEndTime) < current ||
        current < moment(this.semesterStartTime ? this.semesterStartTime : this.nowSemester.semesterStartTime)
      );
    },
    // 选择日期
    async dateChange() {
      if (!this.statu) {
        return this.$message.warn("请点击查询后调整日期")
      }
      let startDate = moment(this.week).day(1).format("YYYY-MM-DD");
      let endDate = moment(this.week).day(7).format("YYYY-MM-DD");
      if (startDate < this.semesterStartTime) {
        startDate = this.semesterStartTime
      }
      this.fetchData.startTime = startDate;
      this.fetchData.endTime = endDate;
      this.fetchData.startDate = startDate;
      await this.getTeachWeekByDate();
      this.$emit("getTeachWeek", this.teachWeek);
    },
    //根据时间获取教学周
    async getTeachWeekByDate() {
      if (!this.fetchData.startTime) {
        return
      }
      const res = await this.$api.common.getTeachWeekByDate({
        ...this.fetchData
      });
      if (res.code === "200" && res.result) {
        this.teachWeek = res.data;
        this.teachWeek.lesDay = getWeekInTime(this.fetchData.startDate);
        this.teachWeek.week = this.fetchData.startDate
      } else {
        this.$message.warn(res.message);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ylc-table-menu {
  min-width: 880px;
  display: flex;
  height: 56px;
  line-height: 56px;
  padding: 0 15px;
  .ylc-table-week {
    white-space: nowrap;
    margin-left: 16px;
    margin-top: 12px;
    padding: 0 9px;
    height: 32px;
    line-height: 32px;
    background-color: #f3f3f3;
    color: #797c7f;
    font-size: 14px;
    border-radius: 4px;
  }
  .ylc-check-btn {
    margin-left: 16px;
    color: #aaaeb2;
    font-size: 14px;
  }
}
</style>