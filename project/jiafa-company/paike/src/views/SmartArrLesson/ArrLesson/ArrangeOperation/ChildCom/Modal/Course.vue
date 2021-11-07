<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-03 13:55:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:58:52
-->

<template>
  <div>
    <a-modal
      title="课程安排"
      class="operationCourse"
      :visible="courseDrawerVisible"
      @cancel="onClose"
      :width="680"
      :footer="null"
    >
      <div class="content">
        <div class="teacher-list">
          <div class="add item-common" @click="addCourse">
            <a-icon type="plus"></a-icon>添加
          </div>
          <div
            class="item item-common"
            v-for="item in courseList"
            :key="item.courseId"
          >
            <div class="name" :title="item.courseName">
              {{ item.courseName }}
            </div>
            <div class="num">
              {{ item.restNum }}
              <span style="color: #b9bdc0">/{{ item.totalNum }}</span>
            </div>
            <div class="close" @click="() => deleModalTip(1, item.courseId)">
              <a-icon
                :style="{ fontSize: '12px', color: '#FF6464' }"
                type="minus-circle"
              />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 添加课程 -->
    <AddCourse ref="settingHourDialog" />
    <!-- 删除提示：改用confirm -->
    <!-- <DeleModal v-if="isDeleModal" :visible="isDeleModal" title="课程" /> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AddCourse from "../Modal/AddCourse.vue";
import DeleModal from "./deleModal.vue";
export default {
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "956eeb4f27e64419adc1d98037d70e5c", //计划id
      courseList: [], // 课程列表
      // isDeleModal: false, //删除弹窗显隐
      deleCourseId: "" // 需要删除的课程id
    };
  },
  components: { AddCourse, DeleModal },
  computed: {
    ...mapState("arrangeOperation", ["courseDrawerVisible"])
  },
  mounted() {
    this.getLessonList();
  },
  methods: {
    ...mapMutations("arrangeOperation", [
      "setCourseDrawerVisible",
      "setSettingHourVisible"
    ]),
    /**
     * @desc 关闭课程安排弹窗
     */
    onClose() {
      this.setCourseDrawerVisible(false);
      this.$parent.topChan();
    },

    /**
     * @desc 获取课程安排列表
     */
    async getLessonList() {
      let params = { planId: this.planId };
      let res = await this.$api.ArrangeOperation.getLessonList(params);
      if (res.code === "200" || res.code === 200) {
        const data = (res.data && res.data.list) || [];
        let lessonData = [];
        if (data) {
          lessonData = data;
        }
        this.courseList = lessonData;
      } else this.$message.error(res.message,5);
    },
    /**
     * @desc 删除操作
     * value:1打开弹窗2弹窗取消3弹窗确定 item需删除项
     */
    deleModalTip(value, item) {
      // if (value === 1) {
      //   this.isDeleModal = true;
      //   this.deleCourseId = item;
      // } else {
      //   this.isDeleModal = false;
      //   value === 3 ? this.delCourse() : null;
      // }
      this.deleCourseId = item;
      this.$confirm({
        title: "确定删除该课程安排？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.delCourse();
        }
      });
    },
    /**
     * @desc 删除课程
     * id课程id
     */
    async delCourse(courseId) {
      let params = { planId: this.planId, courseId: this.deleCourseId };
      let res = await this.$api.ArrangeOperation.delLesson(params);
      if (res.code === "200" || res.code === 200) {
        this.$message.success("取消成功",5);
        this.getLessonList();
      } else this.$message.warning(res.message,5);
      this.deleCourseId = "";
    },
    // 添加课程
    addCourse() {
      this.setSettingHourVisible(true);
      this.$refs.settingHourDialog.getTeaClassDialogList();
    }
  }
};
</script>

<style lang="less" scoped>
.operationCourse {
  /deep/ .ant-modal-body {
    height: 540px;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
}
.content {
  height: 100%;
  overflow: auto;
  .teacher-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item-common {
      height: 40px;
      line-height: 40px;
      width: 115px;
      margin: 8px 8px 0 0;
    }
    .add {
      text-align: center;
      background-color: #e5f2ff;
      color: #409fff;
      cursor: pointer;
    }
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 8px;
      background-color: #f4f6f7;
      position: relative;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close {
        position: absolute;
        top: -20px;
        right: -4px;
        cursor: pointer;
      }
    }
  }
}
</style>
