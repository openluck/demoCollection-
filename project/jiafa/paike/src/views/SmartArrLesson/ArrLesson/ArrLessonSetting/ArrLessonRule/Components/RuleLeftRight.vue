<!--
 * @descripttion: 排课规则-单双周 & 连堂 & 周内分散 & 周内集中
 * @version: v1.0
 * @Author: mzc
 * @Date: 2021-06-22 09:08:12
-->
<template>
  <div class="rule-left-right">
    <div class="selection">
      <!-- 单双周 & 连堂 -->
      <div class="select-item" v-if="[3, 4].includes(baseData.rules)">
        <label for="">作用范围：</label>
        <a-select
          v-model="requestParams.useGrade"
          @change="useGradeChange"
          :class="shake && !requestParams.useGrade ? 'shake' : ''"
          placeholder="请选择作用范围"
          style="width: 200px"
        >
          <a-select-option
            v-for="item in useClassList"
            :value="item.classId"
            :key="item.classId"
            >{{ item.className }}
          </a-select-option>
        </a-select>
      </div>
      <!-- 周内分散 & 周内集中 -->
      <div
        class="select-item"
        v-if="baseData.rules === 7 || baseData.rules === 11"
      >
        <label for="">作用时间：</label>
        <a-select
          v-model="requestParamsZNFS.useTime"
          :class="
            shake && requestParamsZNFS.useTime == undefined ? 'shake' : ''
          "
          placeholder="请选择作用作用时间"
          style="width: 200px"
        >
          <a-select-option :value="0">全天都可以</a-select-option>
          <a-select-option :value="1">只排上午</a-select-option>
          <a-select-option :value="2">只排下午</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="operation">
      <!-- 单双周 -->
      <div class="left" v-if="baseData.rules === 3" :key="3331234">
        <div class="all-check">
          <a-checkbox
            :indeterminate="indeterminate"
            :disabled="true"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            待选课程</a-checkbox
          >
        </div>
        <div class="check-list">
          <a-checkbox-group
            v-model="requestParams.useCourse"
            :class="shake && requestParams.useCourse.length <= 1 ? 'shake' : ''"
            :options="chooseCourseList"
            @change="onCheckboxChange"
          >
          </a-checkbox-group>
        </div>
      </div>
      <!-- 连堂 -->
      <div class="left" v-if="baseData.rules === 4" :key="4441234">
        <div class="all-check title">待选课程</div>
        <div class="check-list">
          <a-radio-group
            v-model="requestParamsLT.courseId"
            @change="onLTChange"
            :class="shake && !requestParamsLT.courseId ? 'shake' : ''"
          >
            <a-radio
              v-for="item in chooseCourseList"
              :key="item.subjectId"
              :style="radioStyle"
              :value="item.subjectId"
            >
              {{ item.label }}</a-radio
            >
          </a-radio-group>
        </div>
      </div>
      <!-- 周内分散 & 周内集中 -->
      <div
        class="left"
        v-if="baseData.rules === 7 || baseData.rules == 11"
        :key="5551234"
      >
        <div class="all-check title">
          {{ baseData.useType == 1 ? "待选课程" : "教师选择" }}
        </div>
        <div class="check-list">
          <a-radio-group
            v-model="requestParamsZNFS.useLesson"
            @change="onLTChange"
            :class="shake && !requestParamsZNFS.useLesson ? 'shake' : ''"
          >
            <a-radio
              v-for="item in chooseCourseListZNFS"
              :key="
                baseData.useType == 2
                  ? item.teacherId
                  : item.subjectType + item.subjectId
              "
              :style="radioStyle"
              :value="
                baseData.useType == 2
                  ? item.teacherId
                  : item.subjectType + item.subjectId
              "
            >
              {{ item.label }}</a-radio
            >
          </a-radio-group>
        </div>
      </div>

      <div class="center">
        <div class="control">
          <div class="top" style="margin-bottom: 10px">
            设置{{
              baseData.rules === 3
                ? "课时数"
                : baseData.rules === 4 ||
                  (baseData.useType == 2 &&
                    (baseData.rules == 7 || baseData.rules == 11))
                ? "最大连堂数"
                : "规则"
            }}：
          </div>
          <div class="bottom">
            <!-- 单双周 -->
            <a-select
              v-if="baseData.rules === 3"
              v-model="requestParams.lessonCount"
              :class="shake && !requestParams.lessonCount ? 'shake' : ''"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option
                v-for="item in courseCount"
                :key="item"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
            <!-- 连堂 -->
            <a-select
              v-if="baseData.rules === 4"
              v-model="requestParamsLT.connectCount"
              :class="shake && !requestParamsLT.connectCount ? 'shake' : ''"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option
                v-for="item in connectCountList"
                :key="item"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
            <!-- 连堂 教师 周内分散周内集中 -->
            <a-select
              v-if="
                baseData.useType == 2 &&
                (baseData.rules == 7 || baseData.rules == 11)
              "
              v-model="requestParamsZNFS.connectCount"
              :class="shake && !requestParamsZNFS.connectCount ? 'shake' : ''"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option
                v-for="item in connectCountList"
                :key="item"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
            <a-button
              type="primary"
              @click="handleAddLessonRules"
              icon="caret-right"
              :loading="btnLoading"
              style="margin-left: 15px"
            >
            </a-button>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">已选课程</div>
        <a-table
          class="table"
          :columns="
            baseData.rules === 3
              ? columnsDSZ
              : baseData.rules === 4
              ? columnsLT
              : baseData.useType == 2 &&
                (baseData.rules == 7 || baseData.rules == 11)
              ? columnsTeaZNFS
              : columnsZNFS
          "
          :data-source="list"
          :loading="tableLoading"
          :pagination="false"
          :scroll="{ y: 388 }"
        >
          <span slot="action" slot-scope="text, record">
            <a style="color: red" @click="delRuleConfirm(text, record)">删除</a>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>
 
<script>
import { mapState, mapActions } from "vuex";
// 单双周表头
const columnsDSZ = [
  {
    title: "作用范围",
    dataIndex: "useGrade",
    key: "useGrade",
    scopedSlots: { customRender: "useGrade" },
  },
  {
    title: "课程1",
    dataIndex: "course1",
    key: "course1",
  },
  {
    title: "课程2",
    dataIndex: "course2",
    key: "course2",
  },
  {
    title: "课时数",
    dataIndex: "lessonCount",
    key: "lessonCount",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
// 连堂表头
const columnsLT = [
  {
    title: "作用范围",
    dataIndex: "useGrade",
    key: "useGrade",
    scopedSlots: { customRender: "useGrade" },
  },
  {
    title: "课程",
    dataIndex: "course",
    key: "course",
  },
  {
    title: "连堂课时数",
    dataIndex: "connectCount",
    key: "connectCount",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
// 周内分散表头
const columnsZNFS = [
  {
    title: "课程",
    dataIndex: "course",
    key: "course",
  },
  {
    title: "作用时间",
    dataIndex: "useTime",
    key: "useTime",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const columnsTeaZNFS = [
  {
    title: "老师",
    dataIndex: "teacherName",
    key: "teacherName",
  },
  {
    title: "作用时间",
    dataIndex: "useTime",
    key: "useTime",
  },
  {
    title: "最大连堂数",
    dataIndex: "maxConnectCount",
    key: "maxConnectCount",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "RuleLeftRight",
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
      arrLessonId: "956eeb4f27e64419adc1d98037d70e5c",
      // 单双周
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      chooseCourseList: [],
      courseListLoading: false,
      btnLoading: false,
      columnsDSZ,
      columnsTeaZNFS,
      list: [],
      shake: false,
      tableLoading: false,
      classId: "",
      courseCount: [],
      requestParams: {
        useGrade: undefined,
        useCourse: [],
        lessonCount: undefined,
      },
      // 连堂
      radioStyle: {
        display: "block",
        height: "40px",
        lineHeight: "40px",
      },
      requestParamsLT: {
        // 连堂请求参数
        useGrade: "0",
        courseId: "",
        courseType: 0,
        connectCount: undefined,
        subjectType: "",
      },
      columnsLT,
      connectCountList: [], // 连堂数列表
      // 周内分散 & 周内集中
      requestParamsZNFS: {
        // 周内分散请求参数
        useTime: 0,
        useLesson: "",
        connectCount: undefined,
      },
      columnsZNFS,
      chooseCourseListZNFS: [], // 课程列表
      pagination: {
        current: 1,
        size: "small",
        defaultPageSize: 6,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        // showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "20", "30", "40"],
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
    };
  },
  computed: {
    ...mapState("common", ["useClassList"]),
  },
  watch: {
    "requestParams.useGrade"(val) {
      this.chooseCourseList = [];
      console.log("66");
      const {
        baseData: { rules },
      } = this;
      if (rules == 3) {
        this.requestParams.useCourse = [];
        this.courseCount = [];
      }
      if (rules == 4) {
        this.requestParamsLT.courseId = "";
        this.connectCountList = [];
        this.requestParamsLT.connectCount = undefined;
      }
    },
    "requestParamsLT.courseId"() {
      this.requestParamsLT.connectCount = undefined;
      this.connectCountList = [];
    },
    useClassList(useClassList) {
      console.log("999", 999);
      if (useClassList.length) {
        this.requestParams.useGrade = useClassList[0].classId;
        this.classId = useClassList[0].classId;
        this.getToChooseCourse();
      }
    },
  },
  mounted() {
    const _arrLessonId = sessionStorage.getItem("arrLessonId");
    this.arrLessonId = _arrLessonId ? _arrLessonId : "";
    // rules 规则类型 ： String  1 只能排，2 不能排，3 单双周，4 连堂，5.教案平齐，6.课程不相邻，7.周内分散， 8 互斥，9 同步，10 合班， 11  周内集中
    const {
      baseData: { rules, useType },
    } = this;
    if (rules === 3) {
      this.getSetedRules();
    } else if (rules === 4) {
      this.getCourseRulesList();
    } else if (useType == 1 && rules === 7) {
      this.getToChooseCourseZNFS();
      this.getZNFSRulesList();
    } else if ((useType == 2 && rules === 7) || rules === 11) {
      this.getZNJZFSteacherList();
      this.getZNJZFSruleList();
    }

    const { arrLessonId } = this;
    if (rules !== 7) {
      this.getUseClassListAsync({ arrLessonId, courseId: "", courseType: 0 });
    }
  },
  methods: {
    ...mapActions("common", ["getUseClassListAsync"]),
    onCheckboxChange(checkedList) {
      this.courseCount = [];
      // this.indeterminate = !!checkedList.length && checkedList.length < chooseCourseList.length;
      // this.checkAll = checkedList.length === chooseCourseList.length;
      /**
       * 需求: 待选课程只可选择两个。
       */
      if (checkedList.length >= 2) {
        const noChecked = this.chooseCourseList.filter(
          (i) => !checkedList.includes(i.value)
        );
        noChecked.map((t) => {
          t.disabled = true;
          return t;
        });
        this.chooseCourseList.concat(noChecked);
        const checkedCount = checkedList.map((item) => {
          for (let index = 0; index < this.chooseCourseList.length; index++) {
            if (item === this.chooseCourseList[index].subjectId) {
              return this.chooseCourseList[index].subjectCount;
            }
          }
        });
        // 选择的两个课程，课时数取交集
        checkedCount.sort((a, b) => a - b);
        console.log("checkedCount", checkedCount);

        let _courseCount = [];
        for (let i = 1; i <= checkedCount[0]; i++) {
          _courseCount.push(i);
        }
        if (
          String(checkedCount[0]).indexOf(".") > -1 &&
          String(checkedCount[1]).indexOf(".") > -1
        ) {
          _courseCount = [0.5, ..._courseCount];
        }
        console.log("_courseCount", _courseCount);
        this.courseCount = _courseCount;
      } else {
        this.chooseCourseList.map((o) => delete o.disabled);
      }

      this.requestParams.lessonCount = undefined;
    },
    onCheckAllChange(e) {
      this.requestParams.useCourse = e.target.checked ? chooseCourseList : [];
      console.log("84634");
      Object.assign(this, {
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
    // 作用范围选择框change 事件
    useGradeChange(val) {
      this.classId = val;
      this.getToChooseCourse();
      // console.log("rules", this.baseData.rules);
      if (this.baseData.rules == 4) {
        this.requestParamsLT.useGrade = val;
      }
    },
    // change page current event
    onPageChange(page) {
      this.pagination.current = page;
      const {
        baseData: { rules },
      } = this;
      if (rules == 3) {
        this.getSetedRules();
      } else if (rules == 4) {
        this.getCourseRulesList();
      } else {
        this.getZNJZFSruleList();
      }
    },
    // change page size options event
    onShowSizeChangeMethod(i, pageSize) {
      this.requestParams.pageSize = pageSize;
      this.pagination.current = 1;
      this.requestParams.current = 1;
      this.getSetedRules();
    },
    // 点击设置规则button
    handleAddLessonRules() {
      const {
        requestParams,
        requestParamsLT,
        requestParamsZNFS,
        baseData,
        arrLessonId,
      } = this;
      const { rules, useType } = baseData;
      // 单双周
      if (rules === 3) {
        if (!requestParams.useGrade) {
          this.setVerifyStyle();
          return this.$message.warn("请选择作用班级！");
        }
        if (requestParams.useCourse.length <= 1) {
          this.setVerifyStyle();
          const msg = !requestParams.useCourse.length
            ? "请选择课程！"
            : requestParams.useCourse.length === 1
            ? "课程需选择两个！"
            : "";
          return this.$message.warn(msg);
        }

        if (!requestParams.lessonCount) {
          this.setVerifyStyle();
          return this.$message.warn("请选择课时数！");
        }
        this.addLessonWeek();
        // 连堂
      } else if (rules === 4) {
        if (!requestParams.useGrade) {
          this.setVerifyStyle();
          return this.$message.warn("请选择作用班级！");
        }
        if (!requestParamsLT.courseId) {
          this.setVerifyStyle();
          return this.$message.warn("请选择课程！");
        }
        if (!requestParamsLT.connectCount) {
          this.setVerifyStyle();
          return this.$message.warn("请选择连堂数量！");
        }
        this.addLessonConnectClass();
        // 周内分散
      } else if (useType == 1 && rules === 7) {
        if (requestParamsZNFS.useTime == undefined) {
          this.setVerifyStyle();
          return this.$message.warn("请选择作用时间！");
        }
        if (!requestParamsZNFS.useLesson) {
          this.setVerifyStyle();
          return this.$message.warn("请选择作用课程！");
        }
        this.addLessonZNFS();
      } else if (useType == 2 && (rules === 7 || rules === 11)) {
        console.log("requestParamsZNFS", requestParamsZNFS);
        console.log("baseData", baseData);
        if (requestParamsZNFS.useTime == undefined) {
          this.setVerifyStyle();
          return this.$message.warn("请选择作用时间！");
        }
        if (requestParamsZNFS.useLesson == undefined) {
          this.setVerifyStyle();
          return this.$message.warn("请选择教师！");
        }
        if (requestParamsZNFS.connectCount == undefined) {
          this.setVerifyStyle();
          return this.$message.warn("请选择连堂数！");
        }
        const params = { ...requestParamsZNFS, ...baseData, arrLessonId };
        this.addLessonTeacherZNFS(params);
      }
    },
    // 设置验证不通过样式
    setVerifyStyle() {
      this.shake = true;
      setTimeout(() => {
        this.shake = false;
      }, 1000);
    },
    // 表格删除规则
    delRuleConfirm(text, n) {
      const {
        baseData: { rules, useType },
        arrLessonId,
        pagination: { current, defaultPageSize, total },
      } = this;
      const { ruleId } = text;

      this.$confirm({
        title: "你确定要删除此条规则？",
        // content: 'Some descriptions',
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          const res = await this.$api.ArrLessonRule.delRules({
            ruleId,
            arrLessonId,
          });
          if (res.code == 200) {
            let _total = total - 1;
            if (!(_total % defaultPageSize) && current > 1) {
              this.pagination.current = current - 1;
            }
            setTimeout(() => {
              this.$message.success("删除规则成功！");
            }, 0);
            if (rules == 3) {
              this.getSetedRules();
              this.getToChooseCourse();
            } else if (rules == 4) {
              this.getCourseRulesList();
              this.getToChooseCourse();
            } else if (useType == 1 && rules == 7) {
              this.getZNFSRulesList();
              this.getToChooseCourseZNFS();
            } else if (useType == 2 && (rules == 7 || rules == 11)) {
              this.getZNJZFSruleList();
              this.getZNJZFSteacherList();
            }
          }
        },
      });
    },

    // *************************单双周 逻辑*************************

    // 单双周-获取已设置规则列表
    async getSetedRules() {
      try {
        this.tableLoading = true;
        const {
          arrLessonId,
          baseData: { rules },
        } = this;
        const params = {
          arrLessonId,
          rules,
        };
        const res = await this.$api.ArrLessonRule.getSetedRules(params);
        if (res.code === "200" || res.code === 200) {
          const { data, total } = res;
          this.list = data;
          // this.pagination.total = total;
          this.tableLoading = false;
        } else {
          this.$message.error("获取列表失败" + res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 单双周&课程连堂-获取待选课程
    async getToChooseCourse() {
      try {
        this.courseListLoading = true;
        const {
          arrLessonId,
          classId,
          requestParams,
          baseData: { rules },
          requestParamsLT: { courseId },
        } = this;
        const params = {
          arrLessonId,
          classId,
          rules,
        };
        const res = await this.$api.ArrLessonRule.getToChooseCourse(params);
        if (res.code === "200" || res.code === 200) {
          const { data, total } = res;
          // @todo 将列表转为label value的形式
          const formatList = data.map((i) => ({
            label: `${i.subjectName}  （${i.subjectCount}课时）`,
            value: i.subjectId,
            ...i,
          }));
          this.chooseCourseList = formatList;
          // this.pagination.total = total;
          this.courseListLoading = false;

          if (rules == 3) {
            const { useCourse } = requestParams;
            console.log("formatList", formatList);
            console.log("useCourse", useCourse);
            if (useCourse.length) {
              let _useCourse = useCourse.filter((i) => {
                let one = formatList.find((item) => item.subjectId === i);
                return one;
              });
              this.requestParams.useCourse = _useCourse;
              // console.log('_useCourse', _useCourse)
              this.onCheckboxChange(_useCourse);
            }
          } else if (rules == 4) {
            let courseOne = formatList.find((i) => i.subjectId === courseId);
            if (courseOne) {
              this.getLessonConnectCount(courseOne.subjectCount);
            } else {
              this.connectCountList = [];
              this.requestParamsLT.connectCount = undefined;
              this.requestParamsLT.courseId = undefined;
            }
          }
          // onCheckboxChange
        } else {
          this.$message.error("获取列表失败" + res.message);
          this.courseListLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增-课程-单双周
    async addLessonWeek() {
      try {
        this.btnLoading = true;
        const { arrLessonId, baseData, requestParams, chooseCourseList } = this;
        const params = { arrLessonId, ...baseData, ...requestParams };
        params.useCourse = params.useCourse.map((item) => {
          return {
            courseType: chooseCourseList.find((el) => el.subjectId === item)
              .subjectType,
            courseId: item,
          };
        });
        const res = await this.$api.ArrLessonRule.addLessonWeek(params);
        if (res.code === "200" || res.code === 200) {
          this.btnLoading = false;
          this.getToChooseCourse();
          this.getSetedRules();
          this.$message.success("新增规则成功！");
        } else {
          this.$message.error("设置规则失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    // *************************连堂逻辑*************************

    onLTChange(e) {
      const id = e.target.value;
      const { rules } = this.baseData;
      let count;
      this.requestParamsLT.connectCount = undefined;
      if (rules == 4) {
        count = this.chooseCourseList.reduce((total, current) => {
          if (current.subjectId === id) {
            total += current.subjectCount;
          }
          return total;
        }, 0);
      } else {
        count = this.chooseCourseListZNFS.reduce((total, current) => {
          if (current.teacherId === id) {
            total += current.teacherCount;
          }
          return total;
        }, 0);
      }
      this.requestParamsZNFS.connectCount = undefined;
      this.getLessonConnectCount(count);
    },
    // 新增-课程-获取连堂数列表
    async getLessonConnectCount(connectCount) {
      const {
        requestParamsLT: { connectCount: _c },
        baseData: { rules, useType },
      } = this;
      try {
        const { arrLessonId } = this;
        const params = { arrLessonId, connectCount };
        const res = await this.$api.ArrLessonRule.addLessonConnectCount(params);
        if (res.code === "200" || res.code === 200) {
          const {
            data: { connectCount },
          } = res;
          this.connectCountList = connectCount;
          if (rules == 4 && !connectCount.find((num) => _c == num)) {
            this.requestParamsLT.connectCount = undefined;
          }
          //  else if (useType == 2 && (rules == 7 || rules == 11)) {

          // }
        } else {
          this.$message.error("获取失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增-课程-连堂
    async addLessonConnectClass() {
      try {
        this.btnLoading = true;
        const { arrLessonId, baseData, requestParamsLT, chooseCourseList } =
          this;
        const params = { arrLessonId, ...baseData, ...requestParamsLT };
        const { courseId } = params;
        params.courseType = chooseCourseList.find(
          (el) => el.subjectId === courseId
        ).subjectType;
        const res = await this.$api.ArrLessonRule.addLessonConnectClass(params);
        if (res.code === "200" || res.code === 200) {
          this.btnLoading = false;
          this.getCourseRulesList();
          this.getToChooseCourse();
          this.$message.success("新增规则成功！");
        } else {
          this.$message.error("设置规则失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增-课程-连堂-获取已设置规则列表
    async getCourseRulesList() {
      try {
        this.tableLoading = true;
        const {
          arrLessonId,
          baseData: { rules },
        } = this;
        const params = {
          arrLessonId,
          rules,
        };
        const res = await this.$api.ArrLessonRule.getCourseRulesList(params);
        if (res.code === "200" || res.code === 200) {
          const { data, total } = res;
          this.list = data;
          this.tableLoading = false;

          // this.pagination.total = total;
        } else {
          this.$message.error("获取列表失败！" + res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    // *************************周内分散 & 周内集中 逻辑*************************

    // 周内分散-获取待选课程
    async getToChooseCourseZNFS() {
      console.log("454545");
      try {
        const { arrLessonId } = this;
        const params = { arrLessonId };
        const res = await this.$api.ArrLessonRule.getToChooseCourseZNFS(params);
        if (res.code === "200" || res.code === 200) {
          const { data } = res;
          // @todo 将列表转为label value的形式
          const formatList = data.map((i) => ({
            label: `${i.subjectName}`,
            value: i.subjectId,
            ...i,
          }));
          this.chooseCourseListZNFS = formatList;
        } else {
          this.$message.error("获取列表失败！" + res.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 周内分散-获取已设置的规则列表
    async getZNFSRulesList() {
      try {
        this.tableLoading = true;
        const { arrLessonId } = this;
        const params = { arrLessonId };
        const res = await this.$api.ArrLessonRule.getZNFSRulesList(params);
        if (res.code === "200" || res.code === 200) {
          const { data, total } = res;
          this.list = data;
          this.tableLoading = false;
          // this.pagination.total = total;
        } else {
          this.$message.error("获取列表失败！" + res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增-课程-周内分散
    async addLessonZNFS() {
      try {
        this.btnLoading = true;
        const { arrLessonId, baseData, requestParamsZNFS } = this;
        const params = { arrLessonId, ...baseData, ...requestParamsZNFS };
        const useLesson = params.useLesson;
        params.useLesson = useLesson.substring(1);
        params.lessonType = Number(useLesson.substring(0, 1));
        console.log("params", params);
        const res = await this.$api.ArrLessonRule.addLessonZNFS(params);
        if (res.code === "200" || res.code === 200) {
          this.btnLoading = false;
          this.getZNFSRulesList();
          this.getToChooseCourseZNFS();
          this.requestParamsZNFS.useLesson = "";
          this.$message.success("新增规则成功！");
        } else {
          this.$message.error("操作失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取待选教师及课时
    async getZNJZFSteacherList() {
      try {
        const {
          arrLessonId,
          baseData: { rules },
        } = this;
        const params = { arrLessonId, ruleType: rules };
        const res = await this.$api.ArrLessonRule.getZNJZFSteacherList(params);
        if (res.code === "200" || res.code === 200) {
          const { data } = res;
          // @todo 将列表转为label value的形式
          const formatList = data.map((i) => ({
            label: `${i.teacherName}  （${i.teacherCount}课时）`,
            value: i.teacherId,
            ...i,
          }));
          this.chooseCourseListZNFS = formatList;
        } else {
          this.$message.error("获取列表失败！" + res.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getZNJZFSruleList() {
      try {
        this.tableLoading = true;
        const {
          arrLessonId,
          baseData: { rules },
        } = this;
        const params = {
          arrLessonId,
          rules,
        };
        const res = await this.$api.ArrLessonRule.getZNJZFSruleList(params);
        if (res.code === "200" || res.code === 200) {
          const { data } = res;
          console.log("data", data);
          this.list = data;
          this.tableLoading = false;
        } else {
          this.$message.error("获取列表失败！" + res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async addLessonTeacherZNFS(params) {
      const res = await this.$api.ArrLessonRule.addLessonTeacherZNFS(params);
      if (res.code == 200) {
        this.getZNJZFSruleList();
        this.getZNJZFSteacherList();
        this.requestParamsZNFS.connectCount = undefined;
        this.requestParamsZNFS.useLesson = undefined;
        this.connectCountList = [];
        this.$message.success("新增规则成功！");
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.rule-left-right {
  background: #f8f9fa;
  padding: 16px;
  .selection {
    height: 65px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebedf0;
  }
  .operation {
    height: 500px;
    display: flex;
    margin-top: 15px;
    .left {
      flex: 0.5;
      display: flex;
      flex-direction: column;
      width: 240px;
      background: white;
      border: 1px solid #e1e3e5;
      .all-check {
        height: 40px;
        line-height: 40px;
        padding-left: 16px;
        background: #fafbfc;
        border-bottom: 1px solid #e1e3e5;
      }
      .check-list {
        flex: 1;
        padding: 16px;
        height: 380px;
        overflow-y: auto;
        .ant-checkbox-group {
          display: flex;
          flex-direction: column;
          /deep/.ant-checkbox-group-item {
            height: 36px;
          }
        }
      }
    }
    .center {
      flex: 0.5;
      display: flex;
      align-items: center;
      justify-content: center;
      .control {
        background-color: #f8f9fa;
      }
    }
    .right {
      background: white;
      border: 1px solid #e1e3e5;
      flex: 1;
      .title {
        padding-left: 16px;
        height: 40px;
        line-height: 40px;
        background: #fafbfc;
        border-bottom: 1px solid #e1e3e5;
      }
      .table {
        padding: 16px;
      }
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
</style>