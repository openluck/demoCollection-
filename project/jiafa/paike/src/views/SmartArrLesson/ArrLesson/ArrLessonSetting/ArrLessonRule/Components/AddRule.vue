<!--
 * @descripttion: 排课规则-添加规则
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-6-02 13:26:12
-->
<template>
  <div class="add-rule">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-model-item label="作用类型：" prop="useType">
        <a-radio-group v-model="form.useType">
          <a-radio :value="1">课程</a-radio>
          <a-radio :value="2">教师</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item label="规则选择：" prop="rules">
        <a-select
          v-model="form.rules"
          :getPopupContainer="
            (triggerNode) => triggerNode.parentNode || document.body
          "
          placeholder="请选择规则"
          style="width: 280px"
        >
          <template v-if="form.useType === 1">
            <a-select-option
              v-for="item in courseRule"
              :key="item.rules"
              :value="item.rules"
              >{{ item.text }}
            </a-select-option>
          </template>
          <template v-else>
            <a-select-option
              v-for="item in teacherRule"
              :key="item.rules"
              :value="item.rules"
              >{{ item.text }}
            </a-select-option>
          </template>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="规则排序：" prop="ruleSort">
        <a-radio-group v-model="form.ruleSort">
          <a-radio :value="1">置顶</a-radio>
          <a-radio :value="2">置底</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <div class="add-rule-tips">
      <a-popover trigger="hover" placement="left">
        <template slot="content" v-if="rulesTips.length">
          <p v-for="item in rulesTips" :key="item.title" class="rule-tipsp">
            <b>{{ item.title }}：</b><span>{{ item.content }}</span>
          </p>
        </template>
        <span
          ><span style="margin-right: 5px">帮助提示</span
          ><svg-icon iconClass="28" color="#409fff"
        /></span>
      </a-popover>
    </div>
    <transition mode="out-in">
      <component
        :is="showDynamicComponent"
        :baseData="form"
        v-if="show"
      ></component>
    </transition>
  </div>
</template>
 
<script>
import CanAndCant from "./CanAndCant";
import RuleLeftRight from "./RuleLeftRight";
import SelectCourseClass from "./SelectCourseClass";
import CanAndCantChoose from "./CanAndCantChoose.vue"; //只能排不能排框选组件部分
const courseRule = [
  { rules: 1, text: "只能排/不能排" },
  { rules: 8, text: "互斥" },
  { rules: 3, text: "单双周" },
  { rules: 4, text: "连堂" },
  { rules: 5, text: "教案平齐" },
  { rules: 6, text: "课程不相邻" },
  { rules: 7, text: "周内分散" },
];
const teacherRule = [
  { rules: 1, text: "只能排/不能排" },
  { rules: 8, text: "互斥/同步" },
  { rules: 10, text: "合班" },
  { rules: 11, text: "周内集中" },
  { rules: 7, text: "周内分散" },
];
export default {
  name: "AddRule",
  components: {
    CanAndCant,
    RuleLeftRight,
    SelectCourseClass,
    CanAndCantChoose,
  },
  props: {},
  data() {
    return {
      courseRule,
      teacherRule,
      show: true,
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
      form: {
        rules: 1, // 规则类型 ： String  1 只能排，2 不能排，3 单双周，4 连堂，5.教案齐平，6.课程不相邻，7.周内分散， 8 互斥，9 同步，10 合班， 11  周内集中
        useType: 1, // String   1 课程 ， 2教师
        ruleSort: 2, // String  1 置顶， 2 置底
      },

      rules: {
        rules: [{ required: true, message: "请选择规则！", trigger: "change" }],
        useType: [
          { required: true, message: "请选择作用类型！", trigger: "change" },
        ],
        ruleSort: [
          { required: true, message: "请选择规则排序！", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    showDynamicComponent() {
      const {
        form: { rules },
      } = this;
      const CAN_AND_CANT_KET = [8, 10];
      const CAN_AND_CANT_CHOOSE_KET = [1];
      const RULE_LEFT_RIGHT_KEY = [3, 4, 7, 11];
      const SELECT_COURSE_CLASS_KEY = [5, 6];
      let component;

      if (CAN_AND_CANT_KET.includes(rules)) {
        component = "CanAndCant";
      } else if (CAN_AND_CANT_CHOOSE_KET.includes(rules)) {
        component = "CanAndCantChoose";
      } else if (RULE_LEFT_RIGHT_KEY.includes(rules)) {
        component = "RuleLeftRight";
      } else if (SELECT_COURSE_CLASS_KEY.includes(rules)) {
        component = "SelectCourseClass";
      }
      return component;
    },
    rulesTips() {
      const {
        form: { rules, useType },
      } = this;
      let types = [];
      if (rules) {
        if (useType == 1) {
          if (rules == 1 || rules == 2) {
            types = [
              {
                title: "不能排",
                content: "在某个节次中不排某个课程",
              },
              {
                title: "只能排",
                content:
                  "在某个节次只能排某个课程同一个时间节次中不可同时对相同课程同时设置不能排和只能排",
              },
            ];
          } else if (rules == 8 || rules == 9) {
            types = [
              {
                title: "互斥",
                content:
                  "两个课程在某个固定节次或不固定时间设置互斥上课（列如：设置A，B课程在周一的第一节互斥，则A课程和B课程在周一的第一节不可同时上课）",
              },
              // {
              //   title: "同步",
              //   content:
              //     "两名课程在某个固定节次或不固定时间设置同步上课（列如：设置A，B课程在周一的第一节同步上课，则A课程和B课程在周一的第一节需要同时上课）",
              // },
            ];
          } else if (rules == 3) {
            types = [
              {
                title: "单双周",
                content:
                  "选择两名课程设置对应的课时数，在授课过程中课程进行单双周交换上课；设置课时为0.5课时的课程，则该课程分为单周或双周授课",
              },
            ];
          } else if (rules == 4) {
            types = [
              {
                title: "课程连堂",
                content:
                  "针对单个课程进行几节课连堂；列如：选择语文，语文共5课时，进行连堂设置时只可设置2,3,4,5课时的连堂，区分上下午；",
              },
            ];
          } else if (rules == 5) {
            types = [
              {
                title: "课程教案齐平",
                content:
                  "设置单个课程进行教案齐平例如：语文课设置了1,2班教案齐平，这在实际授课中1班当天有一节次语文课，则2班也需要有一节次语文课",
              },
            ];
          } else if (rules == 6) {
            types = [
              {
                title: "课程不相邻",
                content:
                  "选择两门不同课程，在某些班级中不能相邻授课；中间需隔一个其他课程",
              },
            ];
          } else if (rules == 7) {
            types = [
              {
                title: "周内分散",
                content:
                  "针对某个课程进行全天或者上午，下午分散授课；如为全天则所选课程在一周内平均分布授课不限制时间；如为上午则所选课程在一周内上午平均分布授课限制时间为上午；下午同理",
              },
            ];
          }
        } else {
          if (rules == 1 || rules == 2) {
            types = [
              {
                title: "不能排",
                content: "教师在固定节次上不上课",
              },
              {
                title: "只能排",
                content:
                  "教师在固定节次上必须上课（同一节次上不能针对同一个老师在同一个班级上同时设置不能排和只能排）",
              },
            ];
          } else if (rules == 10) {
            types = [
              {
                title: "合班",
                content:
                  "针对单个老师作用于该老师的课程，作用于哪些班级在某个时间节次进行合班上课（列如：A老师教语文选择两个课时，1班和2班在第一节和第二节进行合班授课）",
              },
            ];
          } else if (rules == 8 || rules == 9) {
            types = [
              {
                title: "互斥",
                content:
                  "两名教师在某个固定节次或不固定时间上互斥上课（列如：A老师在这第一节上课则b老师不可在第一节上课）",
              },
              {
                title: "同步",
                content:
                  "两名教师在某个固定节次或不固定时间上同步上课（列如：A老师在这第一节上课则b老师必须在第一节上课）",
              },
            ];
          } else if (rules == 11) {
            types = [
              {
                title: "周内集中",
                content:
                  "针对单个教师的课程时候集中在某一天或者某一上午或下午上课，最大允许的连堂数为设置的连堂数（列如：A教师的课程集中在上午上完但是他的课程最大只可连堂两节次）",
              },
            ];
          } else if (rules == 7) {
            types = [
              {
                title: "周内分散",
                content:
                  "针对教师的课程分散到一周上完；（列如：A老师的所有课程平均分摊到一周每天，最大只允许两个节次的连堂）",
              },
            ];
          }
        }
      }
      return types;
    },
  },
  watch: {
    "form.useType"(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.rules = 1;
      }
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 0);
    },
    "form.rules"(rules) {
      if (rules) {
        this.show = false;
        setTimeout(() => {
          this.show = true;
        }, 0);
      }
    },
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("closeModal");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
 
<style scoped lang="less">
.rule-tipsp {
  margin-bottom: 0;
  max-width: 400px;
  & + & {
    margin-top: 10px;
  }
}
.add-rule {
  position: relative;
  .add-rule-tips {
    position: absolute;
    right: 10px;
    top: 35px;
    cursor: pointer;
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateZ(200px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
}
/deep/ .ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0;
}
/deep/ .ant-form-item {
  margin-bottom: 6px;
}
</style>