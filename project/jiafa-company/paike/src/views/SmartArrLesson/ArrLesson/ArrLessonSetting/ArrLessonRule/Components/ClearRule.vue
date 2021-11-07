<!--
 * @descripttion: 排课规则-规则清空
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-6-02 13:26:12
-->
<template>
  <div class="clear-rule">
    <a-modal
      class="clear-rule-modal"
      v-model="visible"
      title="规则清空"
      @ok="handleOk"
      :destroyOnClose="true"
    >
      <div class="lesson">
        <label for="">课程：</label>
        <div class="check">
          <a-checkbox
            :indeterminate="lessonIndeterminate"
            :checked="lessonCheckAll"
            @change="lessonOnCheckAllChange"
          >
            全选</a-checkbox
          >
          <div class="checkbox">
            <a-checkbox-group
              v-model="lessonCheckedList"
              :options="lessonRule"
              @change="lessonOnChange"
            />
          </div>
        </div>
      </div>

      <div class="teacher">
        <label for="">教师：</label>
        <div class="check">
          <a-checkbox
            :indeterminate="teacherIndeterminate"
            :checked="teacherCheckAll"
            @change="teacherOnCheckAllChange"
          >
            全选</a-checkbox
          >
          <div class="checkbox">
            <a-checkbox-group
              v-model="teacherCheckedList"
              :options="teacherRule"
              @change="teacherOnChange"
            />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
//  rules 规则类型 ： String  1 只能排，2 不能排，3 单双周，4 连堂，5.教案平齐，6.课程不相邻，7.周内分散， 8 互斥，9 同步，10 合班， 11  周内集中
const lessonRule = [
  { value: 2, label: "不能排" },
  { value: 1, label: "只能排" },
  { value: 8, label: "互斥授课" },
  { value: 3, label: "单双周" },
  { value: 4, label: "连堂" },
  { value: 5, label: "教案齐平" },
  { value: 6, label: "课程不相邻" },
  { value: 7, label: "周内分散" },
];

const teacherRule = [
  { value: 2, label: "不能排" },
  { value: 1, label: "只能排" },
  { value: 8, label: "互斥授课" },
  { value: 9, label: "同步授课" },
  { value: 10, label: "合班" },
  { value: 11, label: "周内集中" },
  { value: 7, label: "周内分散" },
];
export default {
  name: "ClearRule",
  components: {},
  props: {},
  data() {
    return {
      arrLessonId: "956eeb4f27e64419adc1d98037d70e5c", // 排课方案id，全局拿
      visible: false,
      lessonRule,
      lessonCheckedList: [],
      lessonIndeterminate: false,
      lessonCheckAll: false,

      teacherRule,
      teacherCheckedList: [],
      teacherCheckAll: false,
      teacherIndeterminate: false,
    };
  },
  computed: {},
  mounted() {
    this.arrLessonId = this.$store.state.dialog.arrLessonId;
  },
  methods: {
    showModal() {
      this.visible = true;
      this.arrLessonId = sessionStorage.getItem("arrLessonId");
    },
    handleOk() {
      const { lessonCheckedList, teacherCheckedList } = this;
      if (!lessonCheckedList.length && !teacherCheckedList.length) {
        return this.$message.warn("请至少选择一个规则进行清除！");
      }
      this.clearRules();
    },
    // 课程选择
    lessonOnChange(checkedList) {
      this.lessonIndeterminate =
        !!checkedList.length &&
        this.lessonCheckedList.length < lessonRule.length;
      this.lessonCheckAll = checkedList.length === this.lessonRule.length;
    },
    lessonOnCheckAllChange(e) {
      const { lessonRule } = this;
      const valueArr = lessonRule.map((i) => i.value);
      Object.assign(this, {
        lessonCheckedList: e.target.checked ? valueArr : [],
        lessonIndeterminate: false,
        lessonCheckAll: e.target.checked,
      });
    },
    // 教师选择
    teacherOnChange(checkedList) {
      this.teacherIndeterminate =
        !!checkedList.length && checkedList.length < teacherRule.length;
      this.teacherCheckAll = checkedList.length === teacherRule.length;
    },
    teacherOnCheckAllChange(e) {
      const { teacherRule } = this;
      const valueArr = teacherRule.map((i) => i.value);
      Object.assign(this, {
        teacherCheckedList: e.target.checked ? valueArr : [],
        teacherIndeterminate: false,
        teacherCheckAll: e.target.checked,
      });
    },
    clearRules() {
      this.$confirm({
        title: "确定清空所选规则？",
        // content: 'Some descriptions',
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: async () => {
          try {
            const { lessonCheckedList, teacherCheckedList, arrLessonId } = this;
            const params = {
              arrLessonId,
              course: lessonCheckedList,
              teacher: teacherCheckedList,
            };
            const res = await this.$api.ArrLessonRule.clearRules(params);
            if (res.code === "200" || res.code === 200) {
              this.$message.success("清除成功！");
              //@todo 重新调用查询接口
              this.$parent.pagination.current = 1;
              this.$parent.getRuleList();
              // this.$emit('');
            } else {
              this.$message.error("请求失败！" + res.message);
            }
          } catch (error) {
            throw new Error(error);
          }
          // 清除之前的状态
          this.lessonCheckedList = [];
          this.teacherCheckedList = [];
          this.lessonCheckAll = false;
          this.teacherCheckAll = false;
          this.lessonIndeterminate = false;
          this.teacherIndeterminate = false;
          this.visible = false;
        },
      });
    },
  },
};
</script>
 
<style scoped lang="less">
.clear-rule-modal {
  .lesson {
    margin-bottom: 20px;
    display: flex;
    label {
      text-align: right;
    }
    .check {
      flex: 1;
      margin-left: 10px;
    }
  }
  .teacher {
    border-top: 1px solid #e8e8e8;
    padding-top: 20px;
    display: flex;
    label {
      text-align: right;
    }
    .check {
      flex: 1;
      margin-left: 10px;
    }
  }
  .checkbox {
    margin-top: 20px;
    /deep/ .ant-checkbox-group-item {
      margin-bottom: 20px;
    }
  }
}
</style>