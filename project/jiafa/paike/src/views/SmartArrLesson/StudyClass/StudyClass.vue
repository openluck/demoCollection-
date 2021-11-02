<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-08 10:56:40
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-12 16:44:49
-->
<template>
  <div class="study-class">
    <a-spin :spinning="spinning">
      <a-icon class="icon" type="left-circle" @click="goback" />
      <div>
        <a-input-number
          id="inputNumber"
          v-model="studyValue"
          placeholder="最大开班人数"
          :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
          :parser="(value) => value"
          :min="0"
          style="width: 150px; margin-right: 10px"
          :max="999"
        />
        <a-button type="primary" @click="atuoStudyDivideClass"
          >自习排课</a-button
        >
      </div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="自习班排课结果浏览" force-render>
          <StudyDivideClass ref="StudyDivideClass" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="自习班学生分班情况" force-render
          ><StudyStudentClass ref="StudyStudentClass"
        /></a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>
<script>
import StudyDivideClass from "./Child/StudyDivideClass.vue";
import StudyStudentClass from "./Child/StudyStudentClass.vue";
export default {
  data() {
    return {
      studyValue: undefined,
      spinning: false,
      tabKey: 1,
    };
  },
  components: {
    StudyDivideClass,
    StudyStudentClass,
  },
  methods: {
    callback(key) {
      this.tabKey = Number(key);
      if (this.tabKey === 1) {
        this.$refs.StudyDivideClass.refreshDividePage();
      } else {
        this.$refs.StudyStudentClass.refreshStudentPage();
      }
    },
    /**
     * @name: 返回
     * @msg:
     * @param {*}
     * @return {*}
     */
    goback() {
      this.$router.push("/ArrLessonList");
    },
    /**
     * @name: 自习课分班
     * @msg:
     * @param {*}
     * @return {*}
     */
    async atuoStudyDivideClass() {
      if (typeof this.studyValue === "undefined" || this.studyValue < 1) {
        this.$message.warning("最大开班人数必须大于0", 5);
      } else {
        this.spinning = true;
        let data = {
          planId: this.$route.query.planId,
          maxNumber: this.studyValue,
        };
        try {
          const res = await this.$api.ArrlessonList.createStudyClass(data);
          if (res.code === "200") {
            if (this.tabKey === 1) {
              await this.$refs.StudyDivideClass.refreshDividePage();
            } else {
              await this.$refs.StudyStudentClass.refreshStudentPage();
            }
            this.$message.success("自习排课成功");
          }
        } catch (error) {
          console.log("请求失败" + error);
        } finally {
          this.spinning = false;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.study-class {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background-color: #ffffff;
  .icon {
    font-size: 22px;
    margin-bottom: 10px;
  }
}
</style>