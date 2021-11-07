<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-05-26 14:39:43
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-11 14:52:36
-->
<template>
  <div class="arrange-operation">
    <div class="arrangeTop">
      <a-icon type="left-circle" @click="goBack" />
      <label>{{ this.$store.state.stateList.arrLessonNumber }}</label>
    </div>
    <div class="left">
      <!-- 行政班 -->
      <a-card
        title="行政班级"
        :bodyStyle="{
          padding: '1px 0',
          height: 'calc(100% - 60px)',
          fontSize: '12px',
          textAlign: 'center',
          overflow: 'auto',
        }"
      >
        <a-menu tabPosition="left" :selectedKeys="classId">
          <a-menu-item
            v-for="item of classList"
            :key="item.classId"
            mode="inline"
            @click="classChan"
            :class="[
              item.isNoTeacher && contactIsNoTeacher ? 'isNoTeacher' : '',
            ]"
          >
            <!-- :class="[item.isNoTeacher &&  ? 'isNoTeacher' : '']" -->
            <div class="class-item">
              <div class="class-item-class">
                <div :title="item.className" class="class-item-title">
                  {{ item.className }}
                </div>
                <!-- <div class="class-item-span"> -->
                <div class="class-item-span" v-if="item.conflictNum > 0">
                  <a-tag color="#FF8D54">冲突 {{ item.conflictNum }}</a-tag>
                </div>
              </div>
              <div class="class-item-info">
                <div>已排课时：{{ item.lessonNum }}</div>
                <div>教师已排：{{ item.teacherNum }}</div>
              </div>
            </div>
          </a-menu-item>
        </a-menu>

        <div class="noneData" v-if="classList.length < 1">
          <img :src="require('./../../../../assets/img/noData.png')" />
          <p>暂无数据</p>
        </div>
      </a-card>
    </div>
    <!-- 中间操作部分 -->
    <Center ref="center" />
    <!-- 右侧操作部分 -->
    <Right ref="right" :classId="classId[0]" />

    <!-- 教室抽屉 -->
    <Room v-if="roomDrawerVisible" />
    <!-- 任教安排抽屉 -->
    <Teacher v-if="teacherDrawerVisible" />
    <!-- 课程安排抽屉 -->
    <Course v-if="courseDrawerVisible" ref="rightCourse" />
    <!-- 规则 -->
    <Rules />
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { mapState, mapActions, mapMutations } from "vuex";
import Right from "./ChildCom/Right";
import Center from "./ChildCom/Center";
import Room from "./ChildCom//Modal/Room";
import Teacher from "./ChildCom/Modal/Teacher";
import Course from "./ChildCom/Modal/Course";
import Rules from "./ChildCom/Modal/Rules";
export default {
  components: { Right, Center, Room, Teacher, Course, Rules },
  props: [],
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "35eaa9cc3f07475c9bde44eba5b71637",
      classList: [], // left - 班级List
      classId: [], // left - 选中的班级Id
      saveClassId: "", // 保存savaClassId 用于关闭规则弹窗，刷新课程，
    };
  },
  computed: {
    ...mapState("dialog", ["teacherListVisible"]),
    ...mapState("arrangeOperation", [
      "roomDrawerVisible",
      "teacherDrawerVisible",
      "courseDrawerVisible",
      "isDroped",
      "contactIsNoTeacher",
    ]),
  },
  // 给孙子组件传递方法
  provide() {
    return {
      getAdminClassList: this.getAdminClassList,
      getAdminClassListBackup: this.getAdminClassListBackup,
    };
  },
  watch: {
    isDroped() {
      if (this.isDroped) {
        this.getAdminClassList();
      }
    },
    $route: {
      handler(val, oldval) {
        // console.log(val); //新路由信息
        // console.log(oldval); //老路由信息
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    this.getAdminClassList();
    this.setContactIsNoTeacher(false);
  },
  beforeDestroy() {
    this.classId = [];
    this.chanClass(""); //选中id存至store
  },
  methods: {
    ...mapMutations("arrangeOperation", [
      "setDroped",
      "chanClass",
      "setShowLineup",
      "setContactIsNoTeacher",
    ]),
    // 左侧 - 获取班级List
    async getAdminClassList() {
      let params = { planId: this.planId };
      let res = await this.$api.ArrangeOperation.getAdminClassList(params);
      if (res.code === "200") {
        const data = res.data;
        let classIdShow = this.classId[0];
        this.classList = data;

        const item = data.find((dataItem) => {
          return dataItem.classId === classIdShow;
        });
        //初始化页面
        if (!classIdShow || !item) {
          classIdShow = res.data && res.data.length ? res.data[0].classId : "";
          this.reGetPageData(classIdShow);
        }

        this.classId[0] = classIdShow;
        this.chanClass(classIdShow); //选中id存至store
        this.setDroped(false);
      } else this.$message.warning(res.message, 5);
    },
    /**
     * @name: 备份还原-刷新整体页面
     */
    getAdminClassListBackup() {
      this.reGetPageData(this.$store.state.arrangeOperation.classId); //选中id存至store
    },
    /**
     * @desc 班级选中变化 重新获取右侧及表格数据
     */
    reGetPageData(classId) {
      // 用于 右侧-刷新列表数据
      let tabKey = sessionStorage.getItem("tabKey");
      if (!tabKey) {
        tabKey = "1";
        sessionStorage.setItem("tabKey", tabKey);
      }
      this.$refs.right.noTitleKey = tabKey;

      if (tabKey === "1") {
        this.$refs.right.getNolessonList(classId);
      } else {
        // } else if (tabKey === "2") {
        // 获取教室场所树列表
        this.$refs.right.getClassroomTree();
        // } else if (tabKey === "3") {
        // 获取 右侧-教师-教研组List
        this.$refs.right.getGroupOfTeacher(classId);
      }
    },
    /**
     * @desc 行政班级选中
     * item 选中项
     */
    classChan(item) {
      // 点击班级的时候 清空center组件中的筛选条件
      this.$refs.center.fatchRuleId = undefined;
      this.$refs.center.fatchRuleIdTem = 0;
      this.$refs.center.selectRules = undefined;
      const listId = this.classList.find((listItem) => {
        return listItem.classId === item.key;
      });
      this.classId[0] = listId.classId;
      this.$store.commit("arrangeOperation/chanClass", listId.classId); //选中id存至store
      this.reGetPageData(listId.classId);
    },
    /**
     * 表格头部数据变化回调：刷新右侧数据
     */
    topChan() {
      let tabKey = sessionStorage.getItem("tabKey");
      if (tabKey === "1") {
        this.$refs.right.getNolessonList(this.classId[0]);
      } else if (tabKey === "2") {
        this.$refs.right.getNoRoomList();
      } else if (tabKey === "3") {
        this.$refs.right.getGroupOfTeacher(this.classId[0]);
      }
    },
    /**
     * @desc 返回
     */
    goBack() {
      const backPath = this.$route.query.prePath
        ? this.$route.query.prePath
        : "/PreviewTimetable";
      this.$router.push(backPath);
    },
  },
};
</script>

<style lang="less" scoped>
.arrange-operation {
  width: 100%;
  height: 100%;
  // display: flex;
  background-color: #f2f5f7;
  .arrangeTop {
    padding: 0 16px;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;
    /deep/ .anticon svg {
      width: 22px;
      height: 22px;
      color: #616366;
      vertical-align: middle;
    }
    label {
      margin-left: 10px;
      font-size: 20px;
      color: #242526;
      vertical-align: middle;
    }
  }
  .left {
    display: inline-block;
    width: 230px;
    height: 100%;
    vertical-align: top;
    /deep/ .ant-card {
      width: 230px;
      // height: 100%;
      height: calc(100vh - 62px);
      box-shadow: 0px 0px 10px 1px #b3b3b373;
      z-index: 1;
      .ant-card-head {
        padding: 0 16px;
        .ant-card-head-title {
          padding: 20px 0;
        }
      }
    }
    /deep/ .ant-card-bordered {
      border-top: 0;
    }
    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
      border-right: none;
    }
    /deep/.ant-menu-item {
      height: 80px;
      // padding: 4px 16px !important;
      padding: 0 !important;
      margin: 0;
      border-bottom: 1px solid #e8e8e8;
    }
    /deep/ .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background-color: #bae7ff;
      .class-item-info {
        color: #717579;
      }
    }
    .class-item {
      display: flex;
      flex-direction: column;
      padding: 4px 0 4px 8px;
      .class-item-class {
        // display: flex;
        // flex-direction: row;
        // justify-content: space-between;
        height: 30px;
        color: #303233;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        .class-item-title {
          // flex: 4;
          display: inline-block;
          width: 77%;
          text-align: left;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
        }
        .class-item-span {
          // flex: 1;
          display: inline-block;
          vertical-align: middle;
          .ant-tag {
            margin: 0;
            padding: 0 2px;
            // width: 46px;
            text-align: center;
          }
        }
      }
      .class-item-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        // height: 30px;
        color: #919599;
        font-size: 12px;
        :nth-child(1) {
          margin-right: 16px;
        }
      }
    }
    .isNoTeacher {
      border: 1px solid red;
    }
  }

  .noneData {
    padding-top: 100%;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #bfbfbf;
    p {
      margin-top: 10px;
    }
  }
}
</style>
