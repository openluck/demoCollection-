<!--
 * @descripttion: 排课规则-教案齐平 & 课程不相邻
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-6-04 14:38:12
-->
<template>
  <div class="select-course-class">
    <div class="use-course">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          :label="
            baseData.rules === 5
              ? '作用课程'
              : baseData.rules === 6
              ? '作用课程1：'
              : ''
          "
          prop="useCourse"
          :key="123654"
        >
          <a-select
            v-model="form.useCourse"
            allowClear
            placeholder="请选择作用课程"
            style="width: 280px"
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
        </a-form-model-item>

        <a-form-model-item
          v-if="baseData.rules === 6"
          label="作用课程2："
          prop="useCourse2"
        >
          <a-select
            v-model="form.useCourse2"
            allowClear
            placeholder="请选择作用课程"
            style="width: 280px"
            :key="123456"
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
        </a-form-model-item>
        <!-- 新增教案齐平-设定班级 -->
        <a-form-model-item
          label="设定班级："
          prop="useStaticGrade"
          key="77722"
          v-if="baseData.rules === 5"
        >
          <a-tree-select
            v-model="form.useStaticGrade"
            style="width: 280px"
            :tree-data="treeStaticData"
            :show-checked-strategy="SHOW_PARENT"
            placeholder="请设定班级"
            allowClear
            :dropdownStyle="{ maxHeight: '256px', overflow: 'auto' }"
            :treeDefaultExpandAll="true"
            :replaceFields="{
              title: 'className',
              key: 'classId',
              value: 'classId',
            }"
            :disabled="!form.useCourse"
            @change="ChangeStaticClass"
          />
          <!-- :disabled="!form.useStaticGrade" -->
          <p style="margin-bottom: 0; width: 270px; line-height: 21px">
            由于教案齐平需要作用在多个班级，需先指定第一个被放置的班级，方可避免发生冲突提示。
          </p>
        </a-form-model-item>
        <a-form-model-item
          label="作用范围："
          prop="useGrade"
          key="777"
          v-if="baseData.rules === 5"
        >
          <a-tree-select
            v-model="form.useGrade"
            style="width: 280px"
            :tree-data="treeData"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            placeholder="请选择作用范围"
            allowClear
            :dropdownStyle="{ maxHeight: '256px', overflow: 'auto' }"
            :treeDefaultExpandAll="true"
            :replaceFields="{
              title: 'className',
              key: 'classId',
              value: 'classId',
            }"
            :disabled="!form.useCourse || !form.useStaticGrade"
            @change="rangeChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="作用范围："
          prop="useGrade"
          key="888"
          v-if="baseData.rules === 6"
        >
          <a-tree-select
            v-model="form.useGrade"
            style="width: 280px"
            :tree-data="treeData"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            placeholder="请选择作用范围"
            allowClear
            :dropdownStyle="{ maxHeight: '256px', overflow: 'auto' }"
            :disabled="!(form.useCourse && form.useCourse2)"
            :treeDefaultExpandAll="true"
            :replaceFields="{
              title: 'className',
              key: 'classId',
              value: 'classId',
            }"
            @change="rangeChange"
          />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="btns">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="handleSave" :loading="btnLoading" type="primary"
          >保存</a-button
        >
      </a-space>
    </div>
  </div>
</template>
 
<script>
import { mapState, mapActions } from "vuex";
import { TreeSelect } from "ant-design-vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
  name: "SelectCourseClass",
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
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      value: ["0-0-0"],
      SHOW_PARENT,
      btnLoading: false,
      form: {
        useCourse: undefined,
        useCourse2: undefined,
        useStaticGrade: undefined,
        useGrade: undefined,
      },
      oldUseGrade: [],
      subjectType: "",
      JAQPStaticFatch: {
        courseType: "",
        courseId: "",
        normClassId: "",
      },
      rules: {
        useCourse: {
          required: true,
          message: "请选择作用课程！",
          trigger: "change",
        },
        useStaticGrade: {
          required: true,
          message: "请设定班级！",
          trigger: "change",
        },
        useCourse2: {
          required: true,
          message: "请选择作用课程2！",
          trigger: "change",
        },
        useGrade: {
          required: true,
          message: "请选择作用范围！",
          trigger: "change",
        },
      },
    };
  },
  computed: {
    ...mapState("common", ["courseList", "useClassList", "useStaticClassList"]),
    // 标准班级
    treeStaticData() {
      let useStaticClassListTem = [];
      this.useStaticClassList.map((item, index) => {
        if (item.classId !== "0") {
          useStaticClassListTem.push(item);
        }
      });
      return useStaticClassListTem;
    },
    // 作用班级：
    treeData() {
      // return [{ className: "全部", classId: "", children: this.useClassList }];
      return this.useClassList;
    },
  },
  mounted() {
    const _arrLessonId = sessionStorage.getItem("arrLessonId");
    this.arrLessonId = _arrLessonId ? _arrLessonId : "";
    const {
      arrLessonId,
      baseData: { rules },
    } = this;
    this.getActionCourseAsync({ arrLessonId });
    if (rules == 5) {
      this.getUseClassListAsync({ arrLessonId, courseId: "", courseType: 0 });
    }
  },
  watch: {
    "form.useCourse"(useCourse) {
      const {
        baseData: { rules },
        arrLessonId,
        form: { useCourse2 },
      } = this;
      if (rules == 5) {
        if (!useCourse) {
          this.form.useStaticGrade = undefined;
          this.form.useGrade = undefined;
        } else {
          // 教案齐平获取通过通过作用课程获取班级  改为 获取标准班级
          const courseType = Number(useCourse.substring(0, 1));
          const courseId = useCourse.substring(1);
          // this.getUseClassListAsync({ arrLessonId, courseId, courseType });
          // this.form.useGrade = undefined;
          this.JAQPStaticFatch.courseId = courseId;
          this.JAQPStaticFatch.courseType = courseType;
          // 获取设定班级列表
          this.getStaticUseClassListAsync({
            arrLessonId,
            courseId,
            courseType,
          });
        }
      } else if (rules == 6) {
        if (useCourse2) {
          this.form.useGrade = undefined;
          const courseType = Number(useCourse.substring(0, 1));
          const courseId = useCourse.substring(1);
          const courseType2 = Number(useCourse2.substring(0, 1));
          const courseId2 = useCourse2.substring(1);
          this.getUseClassListAsync({
            arrLessonId,
            courseId,
            courseType,
            courseId2,
            courseType2,
          });
        }
      }
    },
    "form.useCourse2"(useCourse2) {
      const {
        arrLessonId,
        form: { useCourse },
      } = this;
      this.form.useGrade = undefined;
      if (useCourse) {
        const courseType = Number(useCourse.substring(0, 1));
        const courseId = useCourse.substring(1);
        const courseType2 = Number(useCourse2.substring(0, 1));
        const courseId2 = useCourse2.substring(1);
        this.getUseClassListAsync({
          arrLessonId,
          courseId,
          courseType,
          courseId2,
          courseType2,
        });
      }
    },
  },
  methods: {
    ...mapActions("common", [
      "getActionCourseAsync",
      "getUseClassListAsync",
      "getStaticUseClassListAsync",
      "getUseClassListAsyncJAQP",
    ]),
    // 取消
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.form = {
        useCourse: undefined,
        useCourse1: undefined,
        useGrade: undefined,
      };
      this.$parent.$emit("closeModal");
    },
    /**
     * @name: 点击设定班级
     * @msg:
     * @param {*}
     * @return {*}
     */
    ChangeStaticClass(value) {
      const { arrLessonId } = this;
      this.form.useGrade = undefined;
      this.JAQPStaticFatch.normClassId = value;
      let data = {
        arrLessonId,
        normClassId: this.JAQPStaticFatch.normClassId,
        courseId: this.JAQPStaticFatch.courseId,
        courseType: this.JAQPStaticFatch.courseType,
      };
      console.log(data);
      this.getUseClassListAsync(data);
    },
    /**
     * @name: 年级通用，与其他班级互斥
     * @msg:
     * @param {*} range
     * @return {*}
     */
    rangeChange(range) {
      const { oldUseGrade } = this;
      let grade = range;
      range.some((el) => {
        if (el == "0") {
          if (oldUseGrade.find((ol) => ol == "0")) {
            grade = range.filter((i) => i != "0");
          } else {
            grade = ["0"];
          }
          this.form.useGrade = grade;
          this.oldUseGrade = grade;
          return true;
        }
      });
    },
    // 保存
    handleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const {
            baseData: { rules },
          } = this;
          rules === 5
            ? this.addLessonJAQP()
            : rules === 6
            ? this.addLessonKCBZL()
            : "";
        } else {
          return false;
        }
      });
    },
    // 新增-课程-教案齐平
    async addLessonJAQP() {
      try {
        const { arrLessonId, baseData, form } = this;
        const params = {
          arrLessonId,
          ...baseData,
          ...form,
          normClassId: this.JAQPStaticFatch.normClassId,
        };
        const { useCourse, useGrade } = params;
        if (!useGrade.find((el) => el == "0") && useGrade.length < 2) {
          this.$message.warning("非年级通用选项需选择至少两个班级！");
          return;
        }

        params.useLesson = useCourse.substring(1);
        params.lessonType = Number(useCourse.substring(0, 1));
        delete params.useCourse2;
        delete params.useCourse;
        this.btnLoading = true;
        const res = await this.$api.ArrLessonRule.addLessonJAQP(params);
        if (res.code === "200" || res.code === 200) {
          this.$message.success("添加成功！");
          this.btnLoading = false;
          this.form.useCourse = undefined;
          this.form.useGrade = undefined;
        } else {
          this.$message.error("添加失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 新增-课程-课程不相邻
    async addLessonKCBZL() {
      try {
        const { arrLessonId, baseData, form } = this;
        const params = { arrLessonId, ...baseData, ...form };
        const { useGrade, useCourse, useCourse2 } = params;
        params.useLesson1 = useCourse.substring(1);
        params.lessonType1 = Number(useCourse.substring(0, 1));
        params.useLesson2 = useCourse2.substring(1);
        params.lessonType2 = Number(useCourse2.substring(0, 1));
        delete params.useCourse2;
        delete params.useCourse;
        // if (!useGrade.find(el => el == '0') && useGrade.length < 2) {
        //   this.$message.warning('非年级通用选项需选择至少两个班级！')
        //   return
        // }
        this.btnLoading = true;
        const res = await this.$api.ArrLessonRule.addLessonKCBZL(params);
        if (res.code === "200" || res.code === 200) {
          this.btnLoading = false;
          this.$message.success("添加成功！");
          this.form.useCourse = undefined;
          this.form.useCourse2 = undefined;
          this.form.useGrade = undefined;
        } else {
          this.$message.error("添加失败！" + res.message);
          this.btnLoading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.select-course-class {
  .btns {
    width: 375px;
    text-align: right;
    margin-top: 30px;
  }
}
/deep/ .ant-form-item {
  height: 56px !important;
  margin-bottom: 6px !important;
}
</style>