<!--
 * @descripttion: 排课规则-只能排/不能排
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-6-04 13:26:12
-->
<template>
  <div class="can-and-cant">
    <div class="selection">
      <div
        class="select-item"
        v-if="baseData.rules == 1 || baseData.rules == 2"
      >
        <label for="">规则细分：</label>
        <a-radio-group v-model="requestParams.ruleType">
          <a-radio :value="1">只能排</a-radio>
          <a-radio :value="2">不能排</a-radio>
        </a-radio-group>
      </div>
      <template>
        <div
          class="select-item"
          v-if="baseData.rules == 1 || baseData.rules == 2"
        >
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
      <!-- 同步/互斥 -->
      <template v-if="baseData.rules == 8 || baseData.rules == 9">
        <div class="select-item">
          <label for="">规则：</label>
          <a-radio-group v-model="requestParamsHT.ruleType">
            <a-radio :value="8">互斥</a-radio>
            <a-radio :value="9" v-if="baseData.useType != 1">同步</a-radio>
          </a-radio-group>
        </div>
        <template v-if="baseData.useType === 1">
          <div class="select-item">
            <label for="">作用课程1：</label>
            <a-select
              v-model="requestParamsHT.crrCourse1"
              :class="shake && !requestParamsHB.crrUseCourse ? 'shake' : ''"
              allowClear
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              placeholder="请选择作用课程1"
              style="width: 200px"
            >
              <a-select-option
                :value="item.courseType + item.courseId"
                v-for="item in HTCourseList"
                :key="item.courseType + item.courseId"
              >
                {{ item.courseName }}
              </a-select-option>
            </a-select>
          </div>
          <div class="select-item">
            <label for="">作用课程2：</label>
            <a-select
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              v-model="requestParamsHT.crrCourse2"
              :class="shake && !requestParamsHT.crrCourse2 ? 'shake' : ''"
              allowClear
              placeholder="请选择作用课程2"
              style="width: 200px"
            >
              <a-select-option
                :value="item.courseType + item.courseId"
                v-for="item in HTCourseList"
                :key="item.courseType + item.courseId"
              >
                {{ item.courseName }}
              </a-select-option>
            </a-select>
          </div>
        </template>
        <template v-if="baseData.useType === 2">
          <div class="select-item">
            <label for="">作用人员1：</label>
            <a-select
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              v-model="requestParamsHT.usePerson1"
              :class="shake && !requestParamsHT.usePerson1 ? 'shake' : ''"
              allowClear
              show-search
              placeholder="请选择作用人员1"
              :filter-option="filterOption"
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
            <label for="">作用人员2：</label>
            <a-select
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              v-model="requestParamsHT.usePerson2"
              :class="shake && !requestParamsHT.usePerson2 ? 'shake' : ''"
              allowClear
              show-search
              :filter-option="filterOption2"
              placeholder="请选择作用人员2"
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
        </template>
        <div class="select-items">
          <div class="select-item">
            <label for=""
              >是否设置{{
                requestParamsHT.ruleType == 8 ? "互斥" : "同步"
              }}时间：</label
            >
            <a-select
              v-model="requestParamsHT.setMutuxTime"
              :class="shake && !requestParamsHT.setMutuxTime ? 'shake' : ''"
              allowClear
              :disabled="
                baseData.useType === 1
                  ? !requestParamsHT.crrCourse1 || !requestParamsHT.crrCourse2
                  : !requestParamsHT.usePerson1 || !requestParamsHT.usePerson2
              "
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              :placeholder="
                '请选择是否设定' +
                (requestParamsHT.ruleType == 8 ? '互斥' : '同步') +
                '时间'
              "
              style="width: 200px"
            >
              <a-select-option :value="true" :key="1"> 是 </a-select-option>
              <a-select-option :value="false" :key="2">
                否（确定）
              </a-select-option>
            </a-select>
          </div>
          <div
            class="select-item"
            v-if="
              (baseData.rules == 8 || baseData.rules == 9) &&
              requestParamsHT.setMutuxTime === false
            "
          >
            <label for=""
              >{{
                requestParamsHT.ruleType == 8 ? "互斥" : "同步"
              }}课时数：</label
            >
            <a-select
              v-model="requestParamsHT.mutuxCount"
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              :class="
                shake && requestParamsHT.mutuxCount == undefined ? 'shake' : ''
              "
              allowClear
              :placeholder="
                '请选择' +
                (requestParamsHT.ruleType == 8 ? '互斥' : '同步') +
                '课时'
              "
              style="width: 200px"
            >
              <a-select-option
                v-for="item in lessonList"
                :value="item"
                :key="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <div
            class="sets"
            v-if="
              requestParamsHT.setMutuxTime == false &&
              requestParamsHT.mutuxCount
            "
          >
            <a-button type="primary" @click="handleSetHTTime">
              确认任意时间{{ requestParamsHT.ruleType == 8 ? "互斥" : "同步" }}
            </a-button>
          </div>
        </div>
      </template>
      <!-- 合班 -->
      <template v-if="baseData.rules == 10">
        <div class="select-item">
          <label for="">作用人员：</label>
          <a-config-provider>
            <template #renderEmpty>
              <div style="text-align: center">
                <a-empty description="需要先为班级指定教师授课" />
              </div>
            </template>
            <a-select
              :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
              v-model="requestParamsHB.usePerson"
              :class="shake && !requestParamsHB.usePerson ? 'shake' : ''"
              allowClear
              show-search
              :filter-option="filterOptionHB"
              placeholder="请选择作用人员"
              style="width: 220px"
            >
              <!-- :placeholder="
                actionPerson.length
                  ? '请选择作用人员'
                  : '需要先为班级指定教师授课'
              " -->
              <a-select-option
                v-for="item in actionPerson"
                :value="item.teacherId"
                :key="item.teacherId"
              >
                {{ item.teacherName }}
              </a-select-option>
            </a-select>
          </a-config-provider>
        </div>
        <div class="select-item">
          <label for="">作用课程：</label>
          <a-select
            v-model="requestParamsHB.crrUseCourse"
            :class="shake && !requestParamsHB.crrUseCourse ? 'shake' : ''"
            allowClear
            :getPopupContainer="
              (triggerNode) => triggerNode.parentNode || document.body
            "
            :disabled="!requestParamsHB.usePerson"
            placeholder="请选择作用课程"
            style="width: 200px"
          >
            <a-select-opt-group
              v-for="(item, index) in courseList"
              :key="item.icon"
            >
              <span slot="label" style="font-size: 14px">
                <a-icon :type="item.icon" /><span
                  style="margin-left: 5px; color: #003459"
                  >{{ item.label }}</span
                >
              </span>
              <a-select-option
                :value="index + 1 + i.courseId"
                v-for="i in item.data"
                :key="index + 1 + i.courseId"
              >
                {{ i.courseName }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
        <div class="select-item">
          <label for="">作用范围：</label>
          <a-select
            mode="multiple"
            v-model="requestParamsHB.useClass"
            :getPopupContainer="
              (triggerNode) => triggerNode.parentNode || document.body
            "
            :class="shake && !requestParamsHB.useClass.length ? 'shake' : ''"
            allowClear
            :disabled="
              !requestParamsHB.usePerson || !requestParamsHB.crrUseCourse
            "
            @change="HBchange"
            placeholder="请选择作用范围"
            style="min-width: 259px"
          >
            <a-select-option
              v-for="item in HBuseClassList"
              :value="item.classId"
              :key="item.classId"
              >{{ item.className }}
            </a-select-option>
          </a-select>
        </div>

        <div class="select-item">
          <label for="">是否设置合班时间：</label>
          <a-select
            v-model="requestParamsHB.setMergeClassTime"
            :class="shake && !requestParamsHB.setMergeClassTime ? 'shake' : ''"
            allowClear
            :getPopupContainer="
              (triggerNode) => triggerNode.parentNode || document.body
            "
            :disabled="
              !requestParamsHB.crrUseCourse ||
              !requestParamsHB.useClass.length ||
              (requestParamsHB.useClass[0] == '0'
                ? false
                : requestParamsHB.useClass.length < 2)
            "
            placeholder="
              请选择是否设定合班时间
            "
            style="width: 220px"
          >
            <a-select-option :value="true" :key="1"> 是 </a-select-option>
            <a-select-option :value="false" :key="2">
              否（确定）
            </a-select-option>
          </a-select>
        </div>
        <div
          class="select-item"
          v-if="requestParamsHB.setMergeClassTime === false"
        >
          <label for="">合班课时数：</label>
          <a-select
            v-model="requestParamsHB.mergeClassCount"
            :getPopupContainer="
              (triggerNode) => triggerNode.parentNode || document.body
            "
            :class="
              shake && requestParamsHB.mergeClassCount == undefined
                ? 'shake'
                : ''
            "
            allowClear
            placeholder="
              请选择合班课时数：
            "
            style="width: 200px"
          >
            <a-select-option
              :value="item"
              :key="item"
              v-for="item in HBclassNumList"
            >
              {{ item }}课时
            </a-select-option>
          </a-select>
        </div>
        <div
          class="select-item"
          v-if="
            requestParamsHB.setMergeClassTime == false &&
            requestParamsHB.mergeClassCount
          "
        >
          <a-button type="primary" @click="handleSetHTTime">
            确认任意时间合班
          </a-button>
          <!-- <a-button
            class="cancel"
            v-if="hasMaskingRuleId"
            @click="delMaskingRule"
          >
            取消
          </a-button> -->
        </div>
      </template>
    </div>
    <div class="operation">
      <a-table
        class="timetable"
        :columns="columns"
        :data-source="timetableList"
        :loading="tableLoading"
        :pagination="false"
        :rowKey="(row) => row.id"
        bordered
      >
        <!-- 周一到周日课程 -->
        <template
          v-for="(item, index) in lesWeek"
          :slot="item.id"
          slot-scope="text"
        >
          <div
            class="unit"
            @click="handleSettingRuleForCourse(text)"
            :class="text.canEdit ? 'background active' : 'none'"
            :key="index"
          >
            <!-- <span class="little-unit">{{text.lesId}}</span> -->
            <div class="ruleList">
              <div v-for="rule in text.ruleList" :key="rule.id" class="rule">
                <template v-if="rule.useClass && rule.useClass.length">
                  【
                  <span v-for="(item, index) in rule.useClass" :key="index">
                    {{ item }}
                  </span>
                  】
                </template>
                <span>{{ rule.rules }}</span>
                <span>{{ rule.ruleWeight }}</span>
                <span>{{ rule.useObject }}</span>
                <span class="del" @click.stop="delRule(rule.ruleId)"
                  ><a-icon
                    type="delete"
                    style="color: rgba(0, 0, 0, 0.5); fontsize: 15px"
                /></span>
              </div>
            </div>
          </div>
        </template>
      </a-table>
      <div
        class="sets-mask"
        v-if="
          requestParamsHT.setMutuxTime == false ||
          requestParamsHB.setMergeClassTime == false
        "
      ></div>
    </div>
  </div>
</template>
 
<script>
import { rule } from "../../../PreviewTimetable/Components/data";
import { Empty } from "ant-design-vue";
import { mapState, mapActions } from "vuex";
const lesWeek = [
  {
    id: "lesMon",
    name: "星期一",
  },
  {
    id: "lesTue",
    name: "星期二",
  },
  {
    id: "lesWed",
    name: "星期三",
  },
  {
    id: "lesThu",
    name: "星期四",
  },
  {
    id: "lesFri",
    name: "星期五",
  },
  {
    id: "lesSat",
    name: "星期六",
  },
  {
    id: "lesSun",
    name: "星期日",
  },
];
const columns = [
  {
    title: "",
    dataIndex: "lesSort",
    key: "lesSort",
    align: "center",
    width: "9%",
    scopedSlots: { customRender: "lesSort" },
  },
];
for (let index = 0; index < lesWeek.length; index++) {
  columns.push({
    title: lesWeek[index].name,
    dataIndex: lesWeek[index].id,
    key: lesWeek[index].id,
    align: "center",
    width: "13%",
    height: 75,
    scopedSlots: { customRender: lesWeek[index].id },
    slots: { title: lesWeek[index].id },
  });
}
// const timetableList = rule;
export default {
  name: "CanAndCant",
  components: {},
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
      requestParamsHT: {
        ruleType: 8, //8互斥，9同步
        crrCourse1: undefined,
        crrCourse2: undefined,
        usePerson1: undefined,
        usePerson2: undefined,
        mutuxCount: undefined,
        setMutuxTime: undefined, // true / false
        useLessonId: "",
      },
      requestParamsHB: {
        //合班
        usePerson: undefined,
        useClass: [],
        useCourse: undefined,
        courseType: undefined,
        mergeClassCount: undefined, // 合班课时数
        setMergeClassTime: undefined, // true / false //是否设定合班时间
        useLesson: "",
        crrUseCourse: undefined,
      },
      disabled: true,
      columns,
      timetableList: [],
      tableLoading: false,
      lesWeek,
      shake: false,
      actionPerson: [],
      lessonList: [], //互斥同步课时数
      HTCourseList: [], //互斥同步课程列表
      hasMaskingRuleId: null,
      HBuseClassList: [],
      HBclassNumList: [],
      oldHBGrade: [],
    };
  },
  computed: {
    ...mapState("common", ["courseList", "useClassList", "actionPerson"]),
  },
  watch: {
    "requestParamsHT.ruleType"(ruleType) {
      const setMutuxTime = this.requestParamsHT.setMutuxTime;
      if (setMutuxTime == false) {
        this.GetTeacherMutexSync();
      }
    },
    "requestParamsHT.crrCourse1"(crrCourse1, oldCrrCourse1) {
      const crrCourse2 = this.requestParamsHT.crrCourse2;
      // const setMutuxTime = this.requestParamsHT.setMutuxTime;
      if (crrCourse1 == crrCourse2) {
        this.requestParamsHT.crrCourse1 = oldCrrCourse1;
        return;
      }
      this.requestParamsHT.id1 = crrCourse1;
      if (crrCourse2) {
        this.requestParamsHT.setMutuxTime = undefined;
      }
    },
    "requestParamsHT.crrCourse2"(crrCourse2, oldCrrCourse2) {
      const crrCourse1 = this.requestParamsHT.crrCourse1;
      // const setMutuxTime = this.requestParamsHT.setMutuxTime;
      if (crrCourse2 == crrCourse1) {
        this.requestParamsHT.crrCourse2 = oldCrrCourse2;
        return;
      }
      this.requestParamsHT.id2 = crrCourse2;
      if (crrCourse1) {
        this.requestParamsHT.setMutuxTime = undefined;
      }
    },
    "requestParamsHT.usePerson1"(usePerson1, oldUsePerson1) {
      const usePerson2 = this.requestParamsHT.usePerson2;
      // const setMutuxTime = this.requestParamsHT.setMutuxTime;
      if (usePerson1 == usePerson2) {
        this.requestParamsHT.usePerson1 = oldUsePerson1;
        return;
      }
      this.requestParamsHT.id1 = usePerson1;
      if (usePerson2) {
        this.requestParamsHT.setMutuxTime = undefined;
      }
    },
    "requestParamsHT.usePerson2"(usePerson2, oldUsePerson2) {
      const usePerson1 = this.requestParamsHT.usePerson1;
      // const setMutuxTime = this.requestParamsHT.setMutuxTime;
      if (usePerson2 == usePerson1) {
        this.requestParamsHT.usePerson2 = oldUsePerson2;
        return;
      }
      this.requestParamsHT.id2 = usePerson2;
      if (usePerson1) {
        this.requestParamsHT.setMutuxTime = undefined;
      }
    },
    "requestParamsHT.mutuxCount"(mutuxCount) {
      console.log("mutuxCount", mutuxCount);
      if (mutuxCount) {
        this.GetTeacherMutexSync();
      }
      // this.GetTeacherMutexSync();
    },
    "requestParamsHT.setMutuxTime"(setMutuxTime) {
      const usePerson1 = this.requestParamsHT.usePerson1;
      const usePerson2 = this.requestParamsHT.usePerson2;
      const crrCourse1 = this.requestParamsHT.crrCourse1;
      const crrCourse2 = this.requestParamsHT.crrCourse2;
      console.log("setMutuxTime", setMutuxTime);
      if (setMutuxTime == false) {
        if (usePerson1 && usePerson2) {
          this.getMutuxCountList(usePerson1, usePerson2);
        } else {
          this.getMutuxCountList(crrCourse1, crrCourse2);
        }
      }
    },
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
    "requestParamsHB.usePerson"(teacherId) {
      this.requestParamsHB.useCourse = undefined;
      this.requestParamsHB.courseType = undefined;
      this.requestParamsHB.crrUseCourse = undefined;
      this.requestParamsHB.useClass = [];
      this.requestParamsHB.mergeClassCount = undefined;
      this.requestParamsHB.setMergeClassTime = undefined;

      const {
        arrLessonId,
        baseData: { rules },
      } = this;
      const params = {
        arrLessonId,
        teacherId,
        ruleType: rules,
      };
      this.getActionCourseAsync(params);
    },
    "requestParamsHB.crrUseCourse"(crrUseCourse) {
      if (crrUseCourse) {
        const courseType = Number(crrUseCourse.substring(0, 1));
        const courseId = crrUseCourse.substring(1);
        this.requestParamsHB.useCourse = courseId;
        this.requestParamsHB.courseType = courseType;

        this.requestParamsHB.useClass = [];
        this.requestParamsHB.mergeClassCount = undefined;
        this.requestParamsHB.setMergeClassTime = undefined;

        const {
          arrLessonId,
          requestParamsHB: { usePerson },
        } = this;
        const params = {
          arrLessonId,
          courseId,
          courseType,
          teacherId: usePerson,
        };
        this.getUseClassList(params);
      }
    },
    "requestParamsHB.mergeClassCount"(mergeClassCount) {
      // if (mergeClassCount != undefined) {
      //   this.requestParamsHB.setMergeClassTime = undefined;
      // }
      if (this.requestParamsHB.setMergeClassTime == false) {
        this.getMergeClassRules();
      }
    },
    "requestParamsHB.setMergeClassTime"(setMergeClassTime) {
      if (setMergeClassTime == false) {
        // this.getMergeClassRules();
        this.getMergeHour();
        this.requestParamsHB.mergeClassCount = undefined;
      }
    },
    "requestParamsHB.useClass"() {
      this.requestParamsHB.mergeClassCount = undefined;
      this.requestParamsHB.setMergeClassTime = undefined;
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
    this.getUsePersonList();
    if (rules == 8 || rules == 9) {
      this.type = 3;
      if (useType === 1) {
        // this.getActionCourseAsync({ arrLessonId });
        this.getHTCourseList();
      }
      // this.getUseClassListAsync({ arrLessonId, courseId: "" });
    } else if (rules == 10) {
      this.type = 4;
    }
    this.getSetRulesTimetable();
  },
  methods: {
    ...mapActions("common", [
      "getActionCourseAsync",
      "getUseClassListAsync",
      "getActionPersonAsync",
    ]),
    filterOptionHB(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    filterOption2(input, option) {
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
    handleSettingRuleForCourse({ lesId, canEdit }) {
      if (!canEdit) return;
      const {
        arrLessonId,
        baseData,
        requestParams,
        requestParamsHT,
        requestParamsHB,
        HBclassNumList,
      } = this;
      const { rules, useType } = baseData;
      const useLessonId = lesId;

      if (rules == 8 || rules == 9) {
        if (useType === 1) {
          if (!requestParamsHT.crrCourse1) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用课程1！");
          }
          if (!requestParamsHT.crrCourse2) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用课程2！");
          }
        } else {
          if (!requestParamsHT.usePerson1) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用人员1！");
          }
          if (!requestParamsHT.usePerson2) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用人员2！");
          }
        }

        // if (!requestParamsHT.mutuxCount) {
        //   this.shake = true;
        //   setTimeout(() => {
        //     this.shake = false;
        //   }, 1000);
        //   return this.$message.warn(
        //     `请选择${requestParamsHT.ruleType == 8 ? "互斥" : "同步"}课时数！`
        //   );
        // }
        if (!requestParamsHT.setMutuxTime) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn(
            `请选择是否设定${
              requestParamsHT.ruleType == 8 ? "互斥" : "同步"
            }时间！`
          );
        }
        let params = {
          arrLessonId,
          ...baseData,

          useLessonId,
          rules: requestParamsHT.ruleType,
        };
        let _requestParamsHT = {
          ruleType: requestParamsHT.ruleType,
          mutuxCount: requestParamsHT.mutuxCount,
          setMutuxTime: requestParamsHT.setMutuxTime, // true / false
        };
        if (useType === 1) {
          _requestParamsHT.id1 = requestParamsHT.crrCourse1.substring(1);
          _requestParamsHT.id2 = requestParamsHT.crrCourse2.substring(1);
          _requestParamsHT.courseType1 = requestParamsHT.crrCourse1.substring(
            0,
            1
          );
          _requestParamsHT.courseType2 = requestParamsHT.crrCourse2.substring(
            0,
            1
          );
        } else {
          _requestParamsHT.id1 = requestParamsHT.usePerson1;
          _requestParamsHT.id2 = requestParamsHT.usePerson2;
        }
        console.log("rules", params.rules);
        params = { ...params, ..._requestParamsHT, mutuxCount: 1 };
        this.addCourseMutuxOrSync(params);
      } else if (rules == 10) {
        if (!requestParamsHB.usePerson) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用人员！");
        }
        if (!requestParamsHB.useCourse) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用人员！");
        }
        if (!requestParamsHB.useClass.length) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用范围！");
        }
        if (
          requestParamsHB.useClass[0] != "0" &&
          requestParamsHB.useClass.length < 2
        ) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("至少选择两个班级！");
        }

        if (!requestParamsHB.setMergeClassTime) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择是否设定合班时间");
        }
        // if (!HBclassNumList.length) {
        //   return this.$message.warn("合班课时数已用完！");
        // }
        // if (requestParamsHB.mergeClassCount == undefined) {
        //   this.shake = true;
        //   setTimeout(() => {
        //     this.shake = false;
        //   }, 1000);
        //   return this.$message.warn("请选择合班课时数");
        // }

        const params = {
          ...requestParamsHB,
          ...baseData,
          arrLessonId,
          useLesson: useLessonId,
          mergeClassCount: 1,
        };
        this.addMergeClass(params);
      }
    },
    /**
     * @desc 删除规则
     */
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
        const { arrLessonId, type } = this;
        const params = { arrLessonId, type };
        const res = await this.$api.ArrLessonRule.getSetRulesTimetable(params);
        if (res.code === "200" || res.code === 200) {
          const { data } = res;
          this.timetableList = data;
          this.loading = false;
          this.setTableTrHeight();
        } else {
          this.$message.error("请求失败！" + res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        throw new Error(error);
      }
    },
    setTableTrHeight() {
      const $ = (s) => document.querySelector(s);
      this.$nextTick(() => {
        for (let i = 0; i < 10; i++) {
          let list = [];
          for (let j = 2; j < 9; j++) {
            const unit = $(
              `.operation tbody tr:nth-child(${
                i + 1
              }) td:nth-child(${j}) .unit .ruleList`
            );
            const unitHeight = unit.clientHeight;
            list.push(unitHeight);
          }

          list.sort((a, b) => b - a);
          const trMax = list[0];
          for (let k = 2; k < 9; k++) {
            const td = $(
              `.operation tbody tr:nth-child(${i + 1}) td:nth-child(${k})`
            );
            td.style.height = trMax + "px";
          }
        }
      });
    },
    /**
     * @desc 获取互斥课时数
     */
    async getMutuxCountList(id1, id2) {
      const {
        arrLessonId,
        baseData: { useType },
      } = this;
      let params = {
        useType: String(useType),
        arrLessonId,
        ruleType: this.requestParamsHT.ruleType + "",
      };
      this.requestParamsHT.mutuxCount = undefined;
      // this.requestParamsHT.setMutuxTime = undefined;
      if (useType === 1) {
        const courseType1 = id1.substring(0, 1);
        const courseId1 = id1.substring(1);
        const courseType2 = id2.substring(0, 1);
        const courseId2 = id2.substring(1);
        params = {
          ...params,
          courseType1,
          id1: courseId1,
          courseType2,
          id2: courseId2,
        };
      } else {
        params = { ...params, id1, id2 };
      }

      const res = await this.$api.ArrLessonRule.getMutuxCountList(params);
      if (res.code == "200") {
        this.lessonList = res.data;
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    /**
     * @desc 添加互斥同步
     */
    async addCourseMutuxOrSync(params) {
      const res = await this.$api.ArrLessonRule.addCourseMutuxOrSync(params);
      if (res.code == 200) {
        // if (params.setMutuxTime) {
        //   this.getSetRulesTimetable();
        //   this.$message.success("新增规则成功！");
        // } else {
        //   this.GetTeacherMutexSync();
        // }
        this.getSetRulesTimetable();
        if (!params.setMutuxTime) {
          this.requestParamsHT.mutuxCount = undefined;
          let id1 = this.requestParamsHT.id1;
          let id2 = this.requestParamsHT.id2;
          this.getMutuxCountList(id1, id2);
        }

        this.$message.success("新增规则成功！");
      } else {
        this.$message.error("设置失败！" + res.message);
      }
    },
    //互斥同步/合班，遮罩层部分
    handleSetHTTime() {
      const { arrLessonId, baseData, requestParamsHT, requestParamsHB } = this;
      const { rules, useType } = baseData;
      if (rules == 10) {
        if (!requestParamsHB.usePerson) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用人员！");
        }
        if (!requestParamsHB.useCourse) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用人员！");
        }
        if (!requestParamsHB.useClass.length) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择作用范围！");
        }
        if (
          requestParamsHB.useClass[0] != "0" &&
          requestParamsHB.useClass.length < 2
        ) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("至少选择两个班级！");
        }
        if (requestParamsHB.mergeClassCount == undefined) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn("请选择合班课时数");
        }
        const params = {
          arrLessonId,
          ...baseData,
          ...requestParamsHB,
          useLesson: "",
        };
        if (this.hasMaskingRuleId)
          return this.$message.error("设置失败！已存在该规则");
        this.addMergeClass(params);
      } else {
        if (useType === 1) {
          if (!requestParamsHT.crrCourse1) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用课程1！");
          }
          if (!requestParamsHT.crrCourse2) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用课程2！");
          }
        } else {
          if (!requestParamsHT.usePerson1) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用人员1！");
          }
          if (!requestParamsHT.usePerson2) {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 1000);
            return this.$message.warn("请选择作用人员2！");
          }
        }
        if (!requestParamsHT.mutuxCount) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 1000);
          return this.$message.warn(
            `请选择${requestParamsHT.ruleType == 8 ? "互斥" : "同步"}课时数！`
          );
        }

        let params = {
          arrLessonId,
          ...baseData,

          useLessonId: "",
        };
        let _requestParamsHT = {
          ruleType: requestParamsHT.ruleType,
          mutuxCount: requestParamsHT.mutuxCount,
          setMutuxTime: requestParamsHT.setMutuxTime, // true / false
        };
        if (useType === 1) {
          _requestParamsHT.id1 = requestParamsHT.crrCourse1.substring(1);
          _requestParamsHT.id2 = requestParamsHT.crrCourse2.substring(1);
          _requestParamsHT.courseType1 = requestParamsHT.crrCourse1.substring(
            0,
            1
          );
          _requestParamsHT.courseType2 = requestParamsHT.crrCourse2.substring(
            0,
            1
          );
        } else {
          _requestParamsHT.id1 = requestParamsHT.usePerson1;
          _requestParamsHT.id2 = requestParamsHT.usePerson2;
        }
        params.rules = params.ruleType;
        params = { ...params, ..._requestParamsHT };
        if (this.hasMaskingRuleId)
          return this.$message.error("设置失败！已存在该规则");
        this.addCourseMutuxOrSync(params);
      }
    },
    /**
     * @desc 获取同步互斥遮罩层状态
     */
    async GetTeacherMutexSync() {
      const { requestParamsHT, baseData, arrLessonId } = this;
      const { rules, useType } = baseData;
      const params = {
        arrLessonId,
        ...requestParamsHT,
        ...baseData,
      };
      if (rules === 8 || rules === 9) {
        if (useType === 1) {
          params.id1 = requestParamsHT.crrCourse1.substring(1);
          params.id2 = requestParamsHT.crrCourse2.substring(1);
          params.courseType1 = requestParamsHT.crrCourse1.substring(0, 1);
          params.courseType2 = requestParamsHT.crrCourse2.substring(0, 1);
        } else {
          params.id1 = requestParamsHT.usePerson1;
          params.id2 = requestParamsHT.usePerson2;
        }
        delete params.crrCourse1;
        delete params.crrCourse2;
        delete params.usePerson1;
        delete params.usePerson2;
      }
      const res = await this.$api.ArrLessonRule.GetTeacherMutexSync(params);
      if (res.code == 200) {
        if (res.data) {
          this.hasMaskingRuleId = res.data.ruleId;
        } else {
          this.hasMaskingRuleId = null;
        }
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    /**
     * @desc 获取-课程-互斥同步课程列表
     */
    async getHTCourseList() {
      const { arrLessonId } = this;
      const res = await this.$api.ArrLessonRule.getHTCourseList({
        arrLessonId,
      });
      if (res.code === "200" || res.code === 200) {
        this.HTCourseList = res.data;
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    /**
     * @desc 删除遮罩层状态规则
     */
    async delMaskingRule() {
      const {
        arrLessonId,
        hasMaskingRuleId,
        baseData: { rules },
      } = this;
      const params = { arrLessonId, ruleId: hasMaskingRuleId };
      const res = await this.$api.ArrLessonRule.delRules(params);
      if (res.code == 200) {
        if (rules == 10) {
          this.getMergeClassRules();
        } else {
          this.GetTeacherMutexSync();
        }
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    //合班
    async addMergeClass(params) {
      const useClass = params.useClass;
      if (useClass[0] == "0") {
        // addCourseMutuxOrSync;
        const { HBuseClassList } = this;
        params.useClass = HBuseClassList.filter(
          (item) => item.classId !== "0"
        ).map((el) => el.classId);
      }
      const res = await this.$api.ArrLessonRule.addMergeClass(params);
      if (res.code == 200) {
        this.getSetRulesTimetable();
        if (params.setMergeClassTime) {
          // this.getMergeHour();
          // this.getSetRulesTimetable();
          // this.requestParamsHB.mergeClassCount = undefined;
          // this.requestParamsHB.setMergeClassTime = undefined;
          // this.$message.success("新增规则成功！");
        } else {
          // this.requestParamsHB.useClass = [];
          // this.requestParamsHB.mergeClassCount = undefined;
          // this.requestParamsHB.setMergeClassTime = undefined;
          this.getMergeClassRules();
          this.getMergeHour();
          this.requestParamsHB.mergeClassCount = undefined;
        }
        this.$message.success("新增规则成功！");
      } else {
        this.$message.error("请求失败！" + res.message);
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
    async getMergeHour() {
      let {
        requestParamsHB: {
          useCourse: courseId,
          courseType,
          useClass: classIds,
        },
        arrLessonId,
        HBuseClassList,
      } = this;
      if (classIds[0] == "0") {
        classIds = HBuseClassList.filter((item) => item.classId !== "0").map(
          (el) => el.classId
        );
      }
      const params = {
        courseId,
        courseType,
        classIds,
        arrLessonId,
      };
      const res = await this.$api.ArrLessonRule.getMergeHour(params);
      if (res.code == 200) {
        this.HBclassNumList = res.data;
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    async getMergeClassRules() {
      const { arrLessonId, requestParamsHB, baseData } = this;
      const params = {
        ...requestParamsHB,
        ...baseData,
        arrLessonId,
      };
      const useClass = params.useClass;
      if (useClass[0] == "0") {
        const { useClassList } = this;
        params.useClass = useClassList
          .filter((item) => item.classId !== "0")
          .map((el) => el.classId);
      }
      const res = await this.$api.ArrLessonRule.getMergeClassRules(params);
      if (res.code == 200) {
        if (res.data) {
          this.hasMaskingRuleId = res.data.rulesId;
        } else {
          this.hasMaskingRuleId = null;
        }
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    HBchange(range) {
      const { oldHBGrade } = this;
      let grade = range;
      range.some((el) => {
        if (el == "0") {
          if (oldHBGrade.find((ol) => ol == "0")) {
            grade = range.filter((i) => i != "0");
          } else {
            grade = ["0"];
          }
          this.requestParamsHB.useClass = grade;
          this.oldHBGrade = grade;
          return true;
        }
      });
      // if (grade.find((el) => el == "0") || grade.length > 1) {
      //   this.getMergeHour();
      //   this.requestParamsHB.mergeClassCount = undefined;
      //   this.requestParamsHB.setMergeClassTime = undefined;
      // }
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
    .select-items {
      width: 1100px;
      display: flex;
    }
    .select-item {
      margin-right: 20px;
      padding-left: 10px;
      margin-bottom: 10px;
    }
  }
  .operation {
    position: relative;
    .timetable {
      /deep/.unit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 75px;
        height: 100%;
        padding: 15px 0;
        position: relative;
        transition: all 0.3s;
        cursor: pointer;
        &.background {
          // background: #ffcfd9;
        }
        &.none {
          cursor: no-drop;
          background: url("./../../../../../../assets/img/rulesno.png");
        }
        // .ruleList
        .little-unit {
          display: block;
          text-align: center;
        }
        &.active:hover {
          background-color: rgb(255, 239, 255);
          .rule {
            .del {
              display: block;
            }
          }
        }
        .rule {
          position: relative;
          .del {
            position: absolute;
            display: none;
            right: -3px;
            top: -3px;
            box-sizing: border-box;
            font-size: 13px;
            font-weight: bold;
            width: 17px;
            height: 17px;
            text-align: center;
            line-height: 17px;
            color: #ffffff;
            // background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
          }
        }
      }
    }
    // .sets {
    //   background-color: rgba(0, 0, 0, 0.1);
    //   margin-right: 20px;
    //   padding-left: 10px;
    //   margin-bottom: 10px;
    // }
    .sets-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      cursor: not-allowed;
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