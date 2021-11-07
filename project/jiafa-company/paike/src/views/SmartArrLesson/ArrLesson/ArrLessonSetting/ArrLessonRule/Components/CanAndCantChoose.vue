<!--
 * @descripttion: 排课规则-只能排/不能排
 * @version: v1.0
 * @Author: mzc
 * @Date: 2021-6-04 13:26:12
-->
<template>
  <div class="can-and-cant">
    <div class="selection">
      <div class="select-item">
        <label for="">规则细分：</label>
        <a-radio-group v-model="requestParams.ruleType">
          <a-radio :value="1">只能排</a-radio>
          <a-radio :value="2">不能排</a-radio>
        </a-radio-group>
      </div>
      <template>
        <!-- 课程   只能排/不能排  useType: '1', // String   1 课程 ， 2教师 -->
        <div class="select-item" v-if="baseData.useType === 1">
          <label for="">作用课程：</label>
          <a-select
            v-model="requestParams.useSubject"
            :class="shake && !requestParams.useSubject ? 'shake' : ''"
            @change="handleChooseCourse"
            allowClear
            placeholder="请选择作用课程"
            style="width: 200px"
          >
            <a-select-opt-group v-for="item in courseList" :key="item.icon">
              <span slot="label" style="font-size: 14px">
                <a-icon :type="item.icon" /><span
                  style="margin-left: 5px; color: #003459"
                  >{{ item.label }}</span
                >
              </span>
              <a-select-option
                :value="i.courseType + i.courseId"
                v-for="i in item.data"
                :key="i.courseType + i.courseId"
              >
                {{ i.courseName }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
        <!-- 教师   只能排/不能排 -->
        <div class="select-item" v-if="baseData.useType === 2">
          <label for="">作用人员：</label>
          <a-select
            v-model="requestParams.usePerson"
            :class="shake && !requestParams.usePerson ? 'shake' : ''"
            allowClear
            show-search
            :filter-option="filterOptionOnly"
            placeholder="请选择作用人员"
            style="width: 200px"
          >
            <a-select-option
              v-for="item in actionPerson"
              :value="item.teacherId"
              :key="item.teacherId"
            >
              {{ item.teacherName }}
            </a-select-option>
          </a-select>
        </div>
        <div class="select-item">
          <label for="">作用范围：</label>
          <a-select
            v-model="requestParams.useGrade"
            :class="shake && !requestParams.useGrade ? 'shake' : ''"
            :disabled="disabled"
            :placeholder="
              baseData.useType == 1 ? '请选择课程获取班级' : '请选择作用班级'
            "
            allowClear
            style="width: 200px"
          >
            <a-select-option
              :value="item.classId"
              v-for="item in useClassList"
              :key="item.classId"
              >{{ item.className }}
            </a-select-option>
          </a-select>
        </div>
      </template>
    </div>
    <div class="operation">
      <ChooseBox
        :tableList="timetableList"
        @handleSettingRuleForCourse="handleSettingRuleForCourse"
        @delRule="delRule"
      ></ChooseBox>
      <div class="spin" :style="{ display: tableLoading ? 'flex' : 'none' }">
        <a-spin />
      </div>
    </div>
  </div>
</template>
 
<script>
import { mapState, mapActions } from "vuex";
import ChooseBox from "./ChooseBox.vue";

export default {
  name: "CanAndCant",
  components: { ChooseBox },
  props: {
    baseData: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      arrLessonId: "", // 排课方案id，全局拿
      requestParams: {
        ruleType: 1, //  ruleType 排课规则类型：String  1只能排  ， 2不能排
        useSubject: undefined,
        useGrade: undefined,
        courseType: "",
        usePerson: undefined,
      },
      disabled: true,
      timetableList: [],
      tableLoading: false,
      shake: false,
      actionPerson: [],
    };
  },
  computed: {
    ...mapState("common", ["courseList", "useClassList", "actionPerson"]),
  },
  watch: {
    "requestParams.useSubject": {
      handler(val) {
        if (!val) {
          this.disabled = true;
          this.requestParams.useGrade = undefined;
        } else {
          this.disabled = false;
        }
      },
      immediate: true,
    },
    "requestParams.usePerson"(usePerson) {
      if (usePerson) {
        this.disabled = false;
        const { arrLessonId } = this;
        this.getUseClassListAsync({
          arrLessonId,
          courseId: "",
          teacherId: usePerson,
        });
      } else {
        this.disabled = true;
      }
      this.requestParams.useGrade = undefined;
    },
  },
  async mounted() {
    // @todo 调用接口根据rules 判断
    const _arrLessonId = sessionStorage.getItem("arrLessonId");
    this.arrLessonId = _arrLessonId ? _arrLessonId : "";
    const {
      arrLessonId,
      baseData: { useType, rules },
    } = this;
    if (useType === 1) {
      this.getActionCourseAsync({ arrLessonId });
    } else {
      this.getUsePersonList();
    }

    this.getSetRulesTimetable();
  },
  methods: {
    ...mapActions("common", [
      "getActionCourseAsync",
      "getUseClassListAsync",
      "getActionPersonAsync",
    ]),
    filterOptionOnly(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    async getUsePersonList() {
      const {
        arrLessonId,
        baseData: { rules },
      } = this;
      let filterAdj = rules == 10;
      const res = await this.$api.ArrLessonRule.getUsePersonList({
        arrLessonId,
        filterAdj,
      });
      if (res.code == 200) {
        this.actionPerson = res.data ? res.data : [];
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },

    // 点击课程格子
    handleSettingRuleForCourse(lesId) {
      const { arrLessonId, baseData, requestParams } = this;
      const { rules, useType } = baseData;

      const useLessonId = lesId;

      if (rules == 1 || rules == 2) {
        if (useType == 1) {
          if (!requestParams.useSubject) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用课程！");
          }
        } else {
          if (!requestParams.usePerson) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用人员！");
          }
        }

        if (!requestParams.useGrade) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用范围！");
        }
        const params = {
          ...baseData,
          ...requestParams,
          arrLessonId,
          useLessonId,
        };
        params.rules = params.ruleType;
        if (useType == 1) {
          let useSubject = requestParams.useSubject;
          params.courseType = Number(useSubject.substring(0, 1));
          params.useSubject = useSubject.substring(1);
        } else {
          params.courseType = 0;
        }
        this.addRulesCanorCant(params);
      }
    },
    handleChooseCourse(useSubject) {
      const { arrLessonId } = this;
      let courseType = Number(useSubject.substring(0, 1));
      let courseId = useSubject.substring(1);
      let typeId = this.requestParams.ruleType;
      console.log("typeId", typeId);
      this.getUseClassListAsync({ arrLessonId, courseId, courseType, typeId });
      this.requestParams.useGrade = undefined;
    },
    async delRule(ruleId) {
      const { arrLessonId } = this;
      const params = {
        arrLessonId,
        ruleId,
      };
      const res = await this.$api.ArrLessonRule.delRules(params);
      if (res.code == 200) {
        this.getSetRulesTimetable();
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    // 获取设置规则课程表格
    async getSetRulesTimetable() {
      try {
        this.tableLoading = true;
        // type： 类型  String // 1. 课程 - 不能排/只能排 // 2. 教师 - 不能排/只能排 // 3. 教师 - 互斥/同步授课 // 4. 教师 - 合班
        const {
          arrLessonId,
          baseData: { useType },
        } = this;
        const params = { arrLessonId, type: useType };
        const res = await this.$api.ArrLessonRule.getSetRulesTimetable(params);
        if (res.code === "200" || res.code === 200) {
          const { data } = res;
          this.timetableList = data;
          this.loading = false;
        } else {
          this.$message.error("请求失败！" + res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增规则-不能排/只能排
    async addRulesCanorCant(params) {
      this.tableLoading = true;
      try {
        const res = await this.$api.ArrLessonRule.addRulesOnlyNotOnly(params);
        if (res.code === "200" || res.code === 200) {
          this.getSetRulesTimetable();
          this.$message.success("新增规则成功！");
        } else {
          this.$message.error(res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUseClassList(params) {
      console.log("排课", params);
      const res = await this.$api.ArrLessonRule.getUseClassList(params);
      if (res.code == 200) {
        this.HBuseClassList = res.data.list;
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
/deep/ table tbody tr:hover > td {
  background-color: #ffffff !important;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 0 !important;
}

.can-and-cant {
  .selection {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .select-item {
      margin-right: 20px;
      padding-left: 10px;
      margin-bottom: 10px;
    }
  }
  .operation {
    position: relative;
    .spin {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.05);
      left: 0;
      top: 0;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      z-index: 100;
    }
  }
}
.shake {
  animation-name: shake-base;
  animation-duration: 800ms;
  // animation-iteration-count: infinite;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-play-state: running;
}
// @todo 将此样式提取base css。
@keyframes shake-base {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    transform: translate(-0.5px, 0.5px) rotate(-0.5deg);
  }
  4% {
    transform: translate(-2.5px, -1.5px) rotate(0.5deg);
  }
  6% {
    transform: translate(1.5px, 1.5px) rotate(-1.5deg);
  }
  8% {
    transform: translate(-1.5px, -2.5px) rotate(0.5deg);
  }
  10% {
    transform: translate(1.5px, 1.5px) rotate(-0.5deg);
  }
  12% {
    transform: translate(-1.5px, 1.5px) rotate(-1.5deg);
  }
  14% {
    transform: translate(-1.5px, 0.5px) rotate(0.5deg);
  }
  16% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }
  18% {
    transform: translate(0.5px, -2.5px) rotate(-0.5deg);
  }
  20% {
    transform: translate(-2.5px, 0.5px) rotate(-1.5deg);
  }
  22% {
    transform: translate(1.5px, 0.5px) rotate(-0.5deg);
  }
  24% {
    transform: translate(-0.5px, -1.5px) rotate(-0.5deg);
  }
  26% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  28% {
    transform: translate(-1.5px, -0.5px) rotate(0.5deg);
  }
  30% {
    transform: translate(-2.5px, 0.5px) rotate(0.5deg);
  }
  32% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  34% {
    transform: translate(0.5px, -2.5px) rotate(-1.5deg);
  }
  36% {
    transform: translate(0.5px, -2.5px) rotate(-0.5deg);
  }
  38% {
    transform: translate(-2.5px, -0.5px) rotate(0.5deg);
  }
  40% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }
  42% {
    transform: translate(1.5px, 1.5px) rotate(-0.5deg);
  }
  44% {
    transform: translate(-2.5px, -2.5px) rotate(0.5deg);
  }
  46% {
    transform: translate(0.5px, -2.5px) rotate(0.5deg);
  }
  48% {
    transform: translate(-0.5px, -2.5px) rotate(-0.5deg);
  }
  50% {
    transform: translate(-0.5px, 0.5px) rotate(0.5deg);
  }
  52% {
    transform: translate(1.5px, 0.5px) rotate(0.5deg);
  }
  54% {
    transform: translate(-2.5px, 0.5px) rotate(-1.5deg);
  }
  56% {
    transform: translate(-2.5px, 1.5px) rotate(0.5deg);
  }
  58% {
    transform: translate(-2.5px, -2.5px) rotate(-0.5deg);
  }
  60% {
    transform: translate(-0.5px, -2.5px) rotate(-0.5deg);
  }
  62% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  64% {
    transform: translate(-1.5px, -0.5px) rotate(0.5deg);
  }
  66% {
    transform: translate(-2.5px, 0.5px) rotate(-0.5deg);
  }
  68% {
    transform: translate(-1.5px, -0.5px) rotate(0.5deg);
  }
  70% {
    transform: translate(0.5px, 1.5px) rotate(0.5deg);
  }
  72% {
    transform: translate(-2.5px, 1.5px) rotate(0.5deg);
  }
  74% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  76% {
    transform: translate(-0.5px, -1.5px) rotate(0.5deg);
  }
  78% {
    transform: translate(-0.5px, -2.5px) rotate(0.5deg);
  }
  80% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  84% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }
  86% {
    transform: translate(0.5px, -0.5px) rotate(-1.5deg);
  }
  88% {
    transform: translate(-2.5px, -2.5px) rotate(-1.5deg);
  }
  90% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  92% {
    transform: translate(-1.5px, 0.5px) rotate(0.5deg);
  }
  94% {
    transform: translate(-1.5px, -0.5px) rotate(0.5deg);
  }
  96% {
    transform: translate(1.5px, 0.5px) rotate(-0.5deg);
  }
  98% {
    transform: translate(-0.5px, -1.5px) rotate(0.5deg);
  }
}
// /deep/
//   .ant-select-dropdown-menu
//   .ant-select-dropdown-menu-item
//   .ant-empty-description {
//   color: red;
// }
</style>