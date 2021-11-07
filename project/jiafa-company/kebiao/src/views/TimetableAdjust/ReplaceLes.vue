
<!--
 * @Desc: 代课调整
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-11 10:57:45
 * @LastEditors: went
 * @LastEditTime: 2021-10-11 17:22:39
-->

<template>
  <div class="wt-container">
    <a-skeleton :loading="skeletonLoading">
      <div class="common-title">代课调整</div>
      <adjust-operate ref="RepLesOperate"></adjust-operate>

      <div class="wt-p-tb">
        <!-- 时间 -->
        <a-week-picker
          id="selectWeek"
          :allowClear="false"
          v-model="curWeek"
          @change="dateChange"
          placeholder="请选择时间"
          style="width: 235px;z-index:8"
          :disabled-date="disabledDate"
          :format="formatWeek"
          :getCalendarContainer="(v) => v.parentNode"
        >
          <template #suffixIcon>
            <svg-icon
              icon-class="com_calendar"
              style="margin-top:-8px"
            ></svg-icon>
          </template>

        </a-week-picker>
        <!-- 教学周 -->
        <div class="wt-p-week">{{curTeachWeek.teachWeekName}}</div>
        <!-- 教师课程 -->
        <a-select
          style="width: 244px"
          @change="courseChange"
          v-model="curCourseId"
          allowClear
          placeholder="批量选择课程"
          :dropdownStyle="{zIndex:'10'}"
          :getPopupContainer="(v) => v.parentNode"
        >
          <a-select-option
            v-for="item in courseList"
            :key="item.courseId"
          >{{ item.courseName }}</a-select-option>
        </a-select>
        <!-- 条件过滤 -->
        <a-checkbox-group
          :options="options"
          style="margin-left: 49px;"
          :value="filterValue"
          @change="showItemChange"
        />
      </div>
    </a-skeleton>

    <reLesTimetable
      v-show="tableVisible"
      ref="timetable"
      :pageType="3"
    ></reLesTimetable>
    <global-modal
      :visible="entVisible"
      :title="entTitle"
      :width="400"
      :defaultBtn="false"
      :closable="false"
      @cancel="initConfirm"
    >
      <div class="wt-modal-content">
        <a-form-model
          :model="initModalForm"
          ref="initModalForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            label="学段"
            prop="secId"
          >
            <a-select
              class="wt-modal-select-item"
              v-model="initModalForm.secId"
              @change="handleChangeSec"
            >
              <a-select-option
                v-for="(item) in secList"
                :key="item.secId"
              >{{item.secName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="科目"
            prop="subjectId"
          >
            <a-select
              class="wt-modal-select-item"
              v-model="initModalForm.subjectId"
              @change="handleChangeSubject"
            >
              <a-select-option
                v-for="item in subjectList"
                :key="item.subjectId"
              >{{item.subjectName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="isShowFormItem"
            label="教师"
            prop="teacherId"
          >
            <a-select
              class="wt-modal-select-item"
              v-model="initModalForm.teacherId"
              @change="handleChangeTeacher"
            >
              <a-select-option
                v-for="item in teacherList"
                :key="item.teacherId"
              >{{item.teacherName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #selfBtn>
        <a-button
          type="primary"
          @click="initConfirm"
        >确定</a-button>
      </template>
    </global-modal>
  </div>
</template>
 
<script>
import moment from "moment";
import { mapState, mapMutations } from "vuex";
import { getWeekInTime } from "@/Utils/util";
import { disabledDate } from "@/Utils/adjustLes";
import GlobalModal from "@/components/common/GlobalModal";
import AdjustOperate from "./RepLesChild/RepLesOperate";
import reLesTimetable from "./RepLesChild/RepLesTimetable";
const options = [
  { label: "科目", value: "1" },
  { label: "场所", value: "2" },
  { label: "教师", value: "3" },
  { label: "班级", value: "4" },
  { label: "时间", value: "5" }
];
export default {
  components: { GlobalModal, AdjustOperate, reLesTimetable },
  name: "",
  data() {
    return {
      //入口弹框
      isShowFormItem: false,
      entVisible: true,
      entTitle: "选择调整班级",
      comfirmText: "确定",
      initModalForm: {
        secId: "",
        subjectId: "",
        teacherId: ""
      },
      secList: [],
      subjectList: [],
      teacherList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      rules: {
        // secId: [
        //   {
        //     required: true,
        //     message: "请选择学段",
        //     trigger: "blur"
        //   }
        // ],
        // subjectId: [
        //   {
        //     required: true,
        //     message: "请选择科目",
        //     trigger: "blur"
        //   }
        // ]
        // teacherId: [
        //   {
        //     required: true,
        //     message: "请选择教师",
        //     trigger: "blur"
        //   }
        // ]
      },

      skeletonLoading: true,
      tableVisible: false,

      courseList: [],
      curCourseId: undefined,
      //筛选项
      options,
      filterValue: ["1", "2", "4"],
      value: "0-0",
      // 日期
      curWeek: null,
      nowSemester: {},
      date: {
        startTime: "",
        endTime: ""
      }
    };
  },
  computed: {
    ...mapState("replaceLes", [
      "curTeachWeek",
      "reLesInitSecId",
      "reLesInitSubjectId",
      "reLesInitTeacherId"
    ]),
    /**格式化日期控件显示
     * @desc:
     * @param {*}
     * @author: went
     */

    formatWeek() {
      return this.date.startTime + " " + "  ~  " + " " + this.date.endTime;
    }
  },
  async created() {
    //将学段列表存在状态管理，方便其他组件统一从状态管理获取学段、科目、教师
    this.secList = JSON.parse(sessionStorage.getItem("secList"));
    this.nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
    this.setReLesSecList(this.secList);
    //再次进入页面，状态管理有初始化数据就不显示弹框和骨架屏
    if (this.reLesInitTeacherId) {
      this.entVisible = false;
      this.skeletonLoading = false;
      this.tableVisible = true;
      this.getTeacherCourseList(this.reLesInitTeacherId);
    } else {
      await this.handleChangeSec(this.secList[0].secId)
      setTimeout(() => {
        this.handleChangeSubject(this.subjectList[0].subjectId)
      }, 100);

      setTimeout(() => {
        this.handleChangeTeacher(this.teacherList[0]?.teacherId)
      }, 200);
      this.isShowFormItem = true
    }
  },
  mounted() {
    this.initAction();
    //初始化课堂显示内容
    this.$refs.timetable.filterText(this.filterValue);
  },
  methods: {
    ...mapMutations("replaceLes", [
      "setCurTeachWeek",
      "setReLesInitSecId",
      "setReLesInitSubjectId",
      "setReLesInitTeacherId",
      "setReLesSecList",
      "setReLesSubjectList",
      "setReLesTeacherList"
    ]),
    getWeekInTime,
    disabledDate,
    /**
     * @desc: 初始化周次数据
     * @param {*}
     * @author: went
     */

    initAction() {
      this.getWeek();
    },

    /** 根据学段获取科目
     * @desc:
     * @param {*}
     * @author: went
     */

    async getSubjecByStudySec() {
      const params = {
        secId: this.initModalForm.secId
      };
      const res = await this.$api.common.getSubjecByStudySec(params);
      if (res.code === "200") {
        this.subjectList = res.data;
        this.setReLesSubjectList(this.subjectList);
      }
    },
    /** 根据科目获取教师
     * @desc:
     * @param {*}
     * @author: went
     */

    async getTeacherBySubject() {
      const params = {
        secId: this.initModalForm.secId,
        subjectId: this.initModalForm.subjectId
      };
      const res = await this.$api.common.getTeacherBySub(params);
      if (res.code === "200") {
        this.teacherList = res.data;
        this.setReLesTeacherList(this.teacherList);
      }
    },
    /**
     * @desc: 切换学段
     * @param {*}
     * @author: went
     */

    handleChangeSec(val) {
      this.initModalForm.secId = val;
      this.initModalForm.subjectId = "";
      this.initModalForm.teacherId = "";
      this.teacherList = [];
      this.setReLesInitSecId(val);
      this.getSubjecByStudySec();
    },
    /**
     * @desc:选择科目
     * @param {*}
     * @author: went
     */

    handleChangeSubject(val) {
      this.initModalForm.subjectId = val;
      this.initModalForm.teacherId = "";
      this.setReLesInitSubjectId(val);
      this.getTeacherBySubject();
    },
    /**
     * @desc:选择教师
     * @param {*}
     * @author: went
     */

    handleChangeTeacher(val) {
      this.initModalForm.teacherId = val;
      this.setReLesInitTeacherId(val);
    },
    /**
     * @desc: 初始化弹框确定提交
     * @param {*}
     * @author: went
     */

    initConfirm() {
      this.$refs.initModalForm.validate(valid => {
        if (valid) {
          this.entVisible = false;
          this.skeletonLoading = false;
          this.tableVisible = true;
          this.getTeacherCourseList(this.reLesInitTeacherId);
          this.getTableData();
        }
      });
    },

    /**
     * @desc:初始化获取当前时间，周次
     * @param {Number} type  上下周切换 1:下周 -1：上周
     * @author: went
     */

    getWeek(type) {
      if (type) {
        if (type === -1) {
          //往前翻页
          if (
            this.curWeek.endOf('week') <
            moment(this.nowSemester.semesterStartTime).add(7, "days")
          ) {
            this.$message.warning("已经是第一周了");
            return
          } else {
            this.curWeek = this.curWeek.subtract(1, "weeks");
          }
        } else {
          //往后翻页
          if (
            this.curWeek.startOf('week') >
            moment(this.nowSemester.semesterEndTime).subtract(7, "days")
          ) {
            this.$message.warning("已经是最后一周了");
            return
          } else {
            this.curWeek = this.curWeek.add(1, "weeks");
          }
        }
      } else {
        this.curWeek = this.nowSemester.defaultTime ? moment(this.nowSemester.defaultTime) : moment(new Date());
      }
      this.dateChange();
    },

    /**
     * @desc: 选择日期 存储当前周开始结束日期
     * @param {*}
     * @author: went
     */

    dateChange() {
      let startDate = moment(this.curWeek)
        .startOf("week")
        .format("YYYY-MM-DD");
      let endDate = moment(this.curWeek)
        .endOf("week")
        .format("YYYY-MM-DD");
      this.date.startTime = startDate;
      this.date.endTime = endDate;
      this.slotDay = getWeekInTime(this.curWeek);
      this.transformTeachWeek(startDate);
    },

    /**根据日期获取教学周，状态管理储存教学周
     * @desc:
     * @param {*} startDate
     * @author: went
     */

    async transformTeachWeek(startDate) {
      if (startDate < this.nowSemester.semesterStartTime) {
        startDate = this.nowSemester.semesterStartTime
      }
      const res = await this.$api.common.getTeachWeekByDate({
        startDate
      });
      try {
        if (res.code === "200") {
          this.setCurTeachWeek({
            teachWeekId: res.data.teachWeekId,
            teachWeekName: res.data.teachWeekName
          });
          if (res.data.teachWeekId && this.reLesInitTeacherId) {
            this.getTableData();
          }
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("err", error);
      }
    },
    lastWeek() {
      this.getWeek(-1);
    },
    nextWeek() {
      this.getWeek(1);
    },
    clearCurCourseId() {
      this.curCourseId = ""
    },
    /**
     * @desc:获取表格数据
     * @param {*}
     * @author: went
     */
    getTableData() {
      this.$refs.timetable.getStuTimetable({
        secId: this.reLesInitSecId,
        subjectId: this.reLesInitSubjectId,
        personId: this.reLesInitTeacherId,
        teachWeekId: this.curTeachWeek.teachWeekId,
        courseId: this.curCourseId
      });
    },
    /**
     * @desc:获取老师课程列表
     * @param {*}
     * @author: went
     */

    async getTeacherCourseList(teacherId) {
      try {
        const res = await this.$api.ReplaceLes.getTeacherCourseList({
          teacherId
        });
        if (res.code === "200") {
          this.courseList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("err", error);
      }
    },
    /**
     * @desc:选择教师课程
     * @param {*}
     * @author: went
     */

    courseChange(val) {
      this.curCourseId = val;
      if (this.curTeachWeek.teachWeekName) {
        this.getTableData();
      } else {
        this.$message.warning("未获取到教学周");
      }
    },

    /** 课表数据显示项切换
     * @desc:
     * @param {*} checkedValues
     * @author: went
     */

    showItemChange(checkedValues) {
      this.filterValue = checkedValues;
      this.$refs.timetable.filterText(this.filterValue);
    }

  },
  beforeDestroy() { }
};
</script>
 
<style  lang = "less">
.wt-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f5f7;

  .wt-p-tb {
    width: 100%;
    height: 56px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    position: relative;
    .wt-p-week {
      margin: 0 16px;
      min-width: 89px;
      height: 32px;
      line-height: 18px;
      text-align: center;
      background: #f3f3f3;
      border-radius: 4px;
      font-size: 14px;
      color: #797c7f;
      padding: 7px 9px;
    }
  }
}
.wt-modal-content {
  padding: 32px 54px 16px;
  .ant-form-item {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    margin-bottom: 16px;
    vertical-align: top;
  }
}
.wt-has-selected-les {
  position: fixed;
  right: 0;
  top: 40vh;
}
</style>