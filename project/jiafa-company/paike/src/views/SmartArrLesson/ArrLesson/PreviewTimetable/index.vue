<!--
 * @descripttion: 预览课表
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-27 11:26:12
-->
<template>
  <div class="preview-timetable">
    <div class="head">
      <div class="left">
        <!-- <a-button @click="back">返回</a-button> -->
        <!-- <a-icon type="left-circle" @click="back" style="font-size: 22px" /> -->
      </div>
      <div class="right">
        <a-space>
          <!-- <a-button class="update-pub" type="primary" @click="toUpdate">
            <svg-icon
              class="icon"
              icon-class="edit"
              color="rgba(0,0,0,0.5)"
            ></svg-icon
            ><span>错峰/跨年级校验</span></a-button
          > -->
          <a-button
            class="update-pub"
            type="primary"
            @click="toUpdate"
            v-show="!prePath"
          >
            <svg-icon
              class="icon"
              icon-class="edit"
              color="rgba(0,0,0,0.5)"
            ></svg-icon
            ><span>修改课表</span></a-button
          >
          <!-- <a-button type="primary" @click="save">保存课表</a-button> -->
          <a-button
            class="update-pub"
            type="primary"
            @click="publish"
            :disabled="disabled"
            ><svg-icon
              class="icon"
              icon-class="fb"
              color="rgba(0,0,0,0.5)"
            ></svg-icon
            ><span>发布课表</span></a-button
          >
        </a-space>
      </div>
    </div>
    <a-tabs @change="change" :activeKey="tab">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.name">
        <component :is="item.components" />
      </a-tab-pane>
    </a-tabs>
    <Publish
      :InputDailogvisible="InputDailogvisible"
      @CloseInputDialogModel="CloseInputDialogModel"
      :arrLessonIdParent="arrLessonIdParent"
      ref="InputDialog"
    />
  </div>
</template>
 
<script>
import Publish from "../../ArrLessonList/ChildCom/InputDialog/InputDialog.vue";
export default {
  name: "PreviewTimetable",
  components: { Publish },
  props: {},
  data() {
    return {
      tabs: [
        {
          key: "01",
          name: "年级课表",
          components: () => import("./Components/GradeTimetable"),
        },
        {
          key: "02",
          name: "班级课表",
          components: () => import("./Components/ClassTimetable"),
        },
        {
          key: "03",
          name: "教师课表",
          components: () => import("./Components/TeacherTimetable"),
        },
        {
          key: "04",
          name: "教室课表",
          components: () => import("./Components/ClassroomTimetable"),
        },
        {
          key: "05",
          name: "学生课表",
          components: () => import("./Components/StudentTimetable"),
        },
      ],
      InputDailogvisible: false,
      prePath: "",
      tab: "01",
      loading: true,
      disabled: false,
    };
  },

  computed: {},
  mounted() {
    this.arrLessonIdParent = sessionStorage.getItem("arrLessonId");
    this.prePath = this.$route.query.prePath;
    this.checkArrLesson();
  },
  watch: {
    tab() {
      this.loading = false;
      setTimeout(() => {
        this.loading = true;
      }, 0);
    },
  },
  methods: {
    async saveTimetable() {},
    toUpdate() {
      this.$confirm({
        title: "修改排课结果",
        content:
          "该方案已发布完成，如对排课数据进行了修改，则该方案将会撤回，需要重新进行校验发布",
        okText: "前往修改",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          const { prePath } = this.$route.query;
          this.$router.push({
            path: "/SmartArrange/ArrangeOperation",
            query: {
              prePath,
            },
          });
        },
      });
    },
    async checkArrLesson() {
      const planId = sessionStorage.getItem("arrLessonId");
      let res = await this.$api.ArrangeOperation.checkArrLesson({ planId });
      if (res.code == 200) {
        this.disabled = res.data.type !== 1;
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },

    back() {
      // this.$router.go(-1); //返回上一层
      if (this.prePath) {
        this.$router.push({
          path: "/SmartArrange/ArrangeOperation",
          query: {
            prePath: this.prePath,
          },
        });
      } else {
        this.$router.push({
          path: "/ArrLessonList",
        });
      }
    },
    CloseInputDialogModel() {
      this.InputDailogvisible = false;
    },
    publish() {
      this.InputDailogvisible = true;
      this.$refs.InputDialog.getYearTermTree();
    },
    change(tab) {
      console.log("tab", tab);
      this.tab = tab;
    },
  },
};
</script>
 
<style scoped lang="less">
.preview-timetable {
  background: white;
  padding: 10px;
  overflow: scroll;
  // height: calc(100vh - 133px);
  .head {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.update-pub {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
  box-shadow: none;
  > span {
    margin-left: 5px;
  }
  .icon {
    font-size: 12px;
    color: #fff;
  }
  &:hover {
    color: #1890ff;
    svg {
      fill: #1890ff !important;
    }
  }
}
</style>