
<!--
 * @Description: 场所调整主页面
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: went
 * @LastEditTime: 2021-10-15 16:52:33
-->
<template>
  <div class="wt-container">
    <a-skeleton :loading="skeletonLoading">
      <div class="common-title">周内调换课</div>
      <adjust-operate
        ref="adjustOperate"
        :operateType="1"
      ></adjust-operate>

      <div class="wt-table-op">
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
        <div class="wt-p-week">{{iwCurTeachWeek.teachWeekName}}</div>
        <!-- 条件过滤 -->
        <a-checkbox-group
          :options="options"
          style="margin-left: 49px;"
          :value="filterValue"
          @change="showItemChange"
        />
        <TableGraphic class="wt-table-graphic"></TableGraphic>
      </div>
    </a-skeleton>

    <timetable
      v-show="tableVisible"
      ref="timetable"
      :pageType="1"
    ></timetable>
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
            label="年级"
            prop="gradeId"
          >
            <a-select
              class="wt-modal-select-item"
              v-model="initModalForm.gradeId"
              @change="handleChangeGrade"
            >
              <a-select-option
                v-for="item in gradeList"
                :key="item.gradeId"
              >{{item.gradeName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="班级"
            prop="classId"
          >
            <a-select
              class="wt-modal-select-item"
              v-model="initModalForm.classId"
              @change="handleChangeClass"
            >
              <a-select-option
                v-for="item in classList"
                :key="item.classId"
              >{{item.className}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template
        style="text-align:center"
        #selfBtn
      >
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
import AdjustOperate from "./SwitchTimetableChild/AdjustOperate";
import TableGraphic from './SwitchTimetableChild/TableGraphic'
import Timetable from "./SwitchTimetableChild/Timetable";

const options = [
  { label: "科目", value: "1" },
  { label: "场所", value: "2" },
  { label: "教师", value: "3" },
  { label: "班级", value: "4" },
  { label: "时间", value: "5" }
];
export default {
  components: { GlobalModal, AdjustOperate, Timetable, TableGraphic },
  name: "",
  data() {
    return {
      //入口弹框
      entVisible: true,
      entTitle: "选择调整班级",
      comfirmText: "确定",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      initModalForm: {
        secId: "",
        gradeId: "",
        classId: ""
      },
      secList: [],
      gradeList: [],
      classList: [],
      rules: {
        // secId: [
        //   {
        //     required: true,
        //     message: "请选择学段",
        //     trigger: "blur"
        //   }
        // ],
        // gradeId: [
        //   {
        //     required: true,
        //     message: "请选择年级",
        //     trigger: "blur"
        //   }
        // ],
        // classId: [
        //   {
        //     required: true,
        //     message: "请选择班级",
        //     trigger: "blur"
        //   }
        // ]
      },

      skeletonLoading: true,
      tableVisible: false,
      //筛选项
      options,
      filterValue: ["1", "2", "3"],
      value: "0-0",
      // 日期
      curWeek: null,
      selectWeek: null,
      nowSemester: {},
      date: {
        startTime: "",
        endTime: ""
      }
    };
  },
  computed: {
    ...mapState("timetableAdjust", [
      "iwSecList",
      "iwInitSecId",
      "iwInitGradeId",
      "iwInitClassId",
      "iwCurTeachWeek"
    ]),
    formatWeek() {
      return this.date.startTime + " " + "  ~  " + " " + this.date.endTime;
    }
  },
  async created() {
    //将学段列表存在状态管理，方便其他组件统一从状态管理获取学段、年级、班级
    this.nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
    this.secList = JSON.parse(sessionStorage.getItem("secList"));
    //再次进入页面，状态管理有初始化数据就不显示弹框和骨架屏
    if (this.iwInitClassId) {
      this.entVisible = false;
      this.skeletonLoading = false;
      this.tableVisible = true;
    } else {
      await this.handleChangeSec(this.secList[0].secId)
      await this.handleChangeGrade(this.gradeList[0].gradeId)
      setTimeout(() => {
        this.handleChangeClass(this.classList[0].classId)
      }, 100);
    }
  },
  mounted() {
    this.initAction();
    //初始化课堂显示内容
    this.$refs.timetable.filterText(this.filterValue);
  },
  methods: {
    ...mapMutations("timetableAdjust", [
      "setIsEditType",
      "setIwSecList",
      "setIwGradeList",
      "setIwClassList",
      "setIwInitSecId",
      "setIwInitGradeId",
      "setIwInitClassId",
      "seIwtCurTeachWeek"
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

    /** 根据年级获取班级
     * @desc:
     * @param {*}
     * @author: went
     */

    async getClassByGrade() {
      const params = {
        secId: this.initModalForm.secId,
        gradeId: this.initModalForm.gradeId,
        appId: sessionStorage.getItem("appId")
      };
      const res = await this.$api.common.getClassByGrade(params);
      if (res.code === "200") {
        this.classList = res.data;
      }
    },
    /**
     * @desc: 切换学段
     * @param {*}
     * @author: went
     */

    handleChangeSec(val) {
      this.initModalForm.secId = val;
      this.initModalForm.gradeId = "";
      this.initModalForm.classId = "";
      this.secList.forEach(item => {
        if (item.secId === val) {
          this.gradeList = item.gradeList;
        }
      });
      this.classList = []
    },
    /**
     * @desc:选择年级
     * @param {*}
     * @author: went
     */

    handleChangeGrade(val) {
      this.initModalForm.gradeId = val;
      this.initModalForm.classId = "";
      this.getClassByGrade(this.initModalForm.gradeId);
    },
    /**
     * @desc:选择班级
     * @param {*}
     * @author: went
     */
    handleChangeClass(val) {
      this.initModalForm.classId = val;
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
          this.setIwInitSecId(this.initModalForm.secId);
          this.setIwInitGradeId(this.initModalForm.gradeId);
          this.setIwInitClassId(this.initModalForm.classId);
          this.setIwGradeList(this.gradeList);
          this.setIwClassList(this.classList);
          this.setIwSecList(this.secList);
          if (this.iwCurTeachWeek.teachWeekId) {
            this.getTableData();
          } else {
            this.$message.warning("未获取到教学周");
          }
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
    //选择日期
    dateChange() {
      this.setIsEditType(false)
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
    /**
     * @desc:根据日期获取教学周，状态管理储存教学周
     * @param {*} startDate
     * @author: went
     */

    async transformTeachWeek(startDate) {
      // if (startDate < this.nowSemester.semesterStartTime) {
      //   startDate = this.nowSemester.semesterStartTime
      // }
      const res = await this.$api.common.getTeachWeekByDate({
        startDate
      });
      try {
        if (res.code === "200") {
          this.seIwtCurTeachWeek({
            teachWeekId: res.data.teachWeekId,
            teachWeekName: res.data.teachWeekName
          });
          if (res.data.teachWeekId && this.iwInitClassId) {
            this.getTableData();
          }
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("err", error);
      }
    },
    /**
     * @desc:调用子组件获取表格数据
     * @param {*}
     * @author: went
     */
    getTableData() {
      this.$refs.timetable.getClassTimetable({
        secId: this.iwInitSecId,
        gradeId: this.iwInitGradeId,
        classId: this.iwInitClassId,
        teachWeekId: this.iwCurTeachWeek.teachWeekId,
        selectLesGroup: null //周内调整不会切换周次，故不需传选中课堂信息
      });
    },
    lastWeek() {
      this.getWeek(-1);
    },
    nextWeek() {
      this.getWeek(1);
    },
    //条件过滤change事件
    showItemChange(checkedValues) {
      if (checkedValues.length < 1) {
        this.$message.warning('至少勾选一个')
      } else {
        this.filterValue = checkedValues;
        this.$refs.timetable.filterText(this.filterValue);
      }
    }
  },
  beforeDestroy() {
    this.setIsEditType(false);
  }
};
</script>
 
<style  lang = "less">
.wt-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f5f7;

  .wt-table-op {
    width: 100%;
    height: 56px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
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
    .wt-table-graphic {
      flex: 1;
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
</style>