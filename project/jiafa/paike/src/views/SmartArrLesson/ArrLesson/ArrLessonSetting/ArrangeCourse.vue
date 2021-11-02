<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-02 14:01:23
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-22 16:43:43
-->
<template>
  <div class="arrange-course">
    <!-- <div class="title">
      <span class="gray">智能排课&nbsp;/</span>
      <span class="gray">智能方案&nbsp;/</span>
      <span>排课编号</span>
    </div>-->
    <div class="container">
      <h4 class="title-num">
        <a-icon
          type="left-circle"
          @click="goback"
        />
        <span>{{ this.$store.state.stateList.arrLessonNumber }}</span>
      </h4>
      <div class="head-btn">
        <ul class="tab-title">
          <!-- on*选中状态  successed*选中状态 -->
          <!-- :class="{ onli1: onli1, successedli1: successedli1 }" -->
          <li
            class="tab-li tab-li1"
            :class="{
              onli1: this.$store.state.stateList.onli1,
              successedli1: successedli1,
            }"
            @click="goPage(1)"
          >
            <span>1. 排课节次安排</span>
            <!-- <span><a-icon type="check" color="#fff" />排课节次安排</span> -->
          </li>
          <li
            class="tab-li tab-li2"
            :class="{
              onli2: this.$store.state.stateList.onli2,
              successedli2: successedli2,
            }"
            @click="goPage(2)"
          >
            <span>2. 教师任教安排</span>
          </li>
          <li
            class="tab-li tab-li2"
            :class="{
              onli3: this.$store.state.stateList.onli3,
              successedli3: successedli4,
            }"
            @click="goPage(3)"
          >
            <span>3. 班级授课安排</span>
          </li>
          <li
            class="tab-li tab-li2"
            :class="{
              onli4: this.$store.state.stateList.onli4,
              successedli4: successedli4,
            }"
            @click="goPage(4)"
          >
            <span>4. 教室安排</span>
          </li>
          <li
            class="tab-li tab-li3"
            :class="{
              onli5: this.$store.state.stateList.onli5,
              successedli5: successedli5,
            }"
            @click="goPage(5)"
          >
            <span>5. 排课规则</span>
          </li>
        </ul>
        <div class="step-btn">
          <a-button
            class="step next-strp"
            type="primary"
            @click="goOperation"
          >去排课</a-button>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between">
        <div>
          <span class="tips">
            <a-icon
              style="margin-right: 10px"
              type="info-circle"
            />
            <span
              :class="{ ji: !this.$store.state.stateList.showClassWeekHour }">学生最大课时:{{ this.$store.state.stateList.courseTime }}课时</span>
            <span
              class="tips"
              style="margin-right: 10px"
              v-show="this.$store.state.stateList.showClassWeekHour"
            >≥班级总课时:{{ this.$store.state.stateList.classWeekHour }}课时</span>
            <span :class="{ ji: !this.$store.state.stateList.showClassWeekHour }">学生最大早自习课时:{{
            this.$store.state.stateList.stuMaxMorigningCourse
          }}课时</span>
            <span
              class="tips"
              style="margin-right: 10px"
              v-show="this.$store.state.stateList.showClassWeekHour"
            >≥班级早自习课时:{{
            this.$store.state.stateList.classMoriningHour
          }}课时</span>
            <span :class="{ ji: !this.$store.state.stateList.showClassWeekHour }">学生最大晚自习课时:{{
            this.$store.state.stateList.stuMaxNightCourse
          }}课时</span>
            <span
              class="tips"
              style="margin-right: 10px"
              v-show="this.$store.state.stateList.showClassWeekHour"
            >≥班级晚自习课时{{
            this.$store.state.stateList.classNightHour
          }}课时</span>
          </span>
        </div>
        <div style="margin-right:10px">
          <a-popover
            trigger="hover"
            placement="left"
          >
            <template slot="content">
              <div v-if="info === '1'">
                1、选择参与排课的节次，该节次为学生所要上课的课时。<br />
                2、可对节次进行批量选择，按住鼠标左键拖动选择节次范围完成批量选择。
              </div>
              <div v-else-if="info === '2'">
                1、对每个教研组添加参与任教的老师，并对其进行最大课时数的设置，点击 
                <img src="@/assets/img/2-1.png" alt="" style="width:150px;margin:0 10px;vertical-align:middle;">入具体数字后再任意点击输入框外的地方则确定该课时数批量应用。<br />
                点击"批量设置教师课时"输入具体数字后再任意点击输入框外的地方则确定该课时数批量应用。<br />
                2、教师最大课时数表示该老师在一周中最多能上多少节课程。<br />
                3、点击<img src="@/assets/img/2-2.jpg" alt="" style="width:30px;margin:0 10px;vertical-align:middle;">按钮可删除不需要用到的教研组。
              </div>
              <div v-else-if="info === '3'">
                1、设定学生需要上课的课程课时，点击<img src="@/assets/img/3-1.jpg" alt="" style="width:200px;margin:0 10px;vertical-align:middle;">对学生上课的课程进行课时确定，该操作针对所有班级的学生生效。<br />
                2、如果单个班级的课程课时数不一样，可点击<img src="@/assets/img/3-2.jpg" alt="" style="width:80px;margin:5px 10px;vertical-align:middle;">课时输入框进行课程课时的设置，该操作只针对单个班级的学生生效。<br />
                3、可针对单个班级设置副教师，实现双师课堂，如A教师被设置为副教师，则该教师不可再被设置为正教师。
              </div>
              <div v-else-if="info === '4'">
                添加排课所需要的教室，为学生安排上课教室，点击<img src="@/assets/img/4-1.jpg" alt="" style="width:180px;margin:5px 10px;vertical-align:middle;">选择需要添加教室。
              </div>
              <div v-else-if="info === '5'">
                学校对排课有着个性化的规则要求，通过<img src="@/assets/img/5-1.jpg" alt="" style="width:120px;margin:5px 10px;vertical-align:middle;">对这次的排课方案进行个性化规则定义。
              </div>
            </template>
            <span>
              <span style="margin-right: 5px">帮助提示</span>
              <svg-icon
                iconClass="28"
                color="#409fff"
              />
            </span>
          </a-popover>
        </div>
      </div>

      <transition mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "",
  data() {
    return {
      number: "",
      perStep: false,
      goArrLesson: false,
      successedli1: false,
      successedli2: false,
      successedli3: false,
      successedli4: false,
      successedli5: false,
      showClassWeekHour: false,
      arrLessonNumber: 0,
      sessionArrLessonNumber: sessionStorage.getItem("stuCourseTime"),
      info: '1'
    };
  },
  created() { },
  mounted() {
    this.number = this.$route.query.number;
    let path = this.$route.path;
    if (path == "/CourseSecArrange") {
      this.goPage(1);
      this.setShowClassWeekHour(false);
    } else if (path == "/TeacherLesArrange") {
      this.setShowClassWeekHour(false);
      this.goPage(2);
    } else if (path == "/ClassTeachArrange") {
      this.setShowClassWeekHour(true);
      this.goPage(3);
    } else if (path == "/ClassArrange") {
      this.setShowClassWeekHour(false);
      this.goPage(4);
    } else if (path == "/ArrLessonRule") {
      this.setShowClassWeekHour(false);
      this.goPage(5);
    }
    this.getPlanSectionsCount();
  },
  methods: {
    ...mapMutations("stateList", [
      "setOnLi1",
      "setOnLi2",
      "setOnLi3",
      "setOnLi4",
      "setOnLi5",
      "setRemberPath",
      "setShowClassWeekHour",
    ]),
    /**
     * @name: 跳转页面
     * @msg:
     * @param {*} index
     * @return {*}
     */
    goPage(index) {
      switch (index) {
        case 1:
          this.setOnLi1();
          this.$router.push("/CourseSecArrange");
          this.setShowClassWeekHour(false);
          this.info = '1'
          break;
        case 2:
          this.setOnLi2();
          this.$router.push("/TeacherLesArrange");
          this.setShowClassWeekHour(false);
          this.info = '2'
          break;
        case 3:
          this.setOnLi3();
          this.$router.push("/ClassTeachArrange");
          this.setShowClassWeekHour(true);
          this.info = '3'
          break;
        case 4:
          this.setOnLi4();
          this.$router.push("/ClassArrange");
          this.setShowClassWeekHour(false);
          this.info = '4'
          break;
        case 5:
          this.setOnLi5();
          this.$router.push("/ArrLessonRule");
          this.setShowClassWeekHour(false);
          this.info = '5'
          break;
      }
    },
    /**
     * @name: 返回
     * @msg:
     * @param {*}
     * @return {*}
     */
    goback() {
      // this.$router.go(-1);
      this.$router.push("/ArrLessonList");
    },
    /**
     * @name: 去操作页面
     * @msg:
     * @param {*}
     * @return {*}
     */
    goOperation() {
      let prePath = this.$route.path;
      this.$router.push({
        path: "/SmartArrange/ArrangeOperation",
        query: {
          prePath,
        },
      });
    },
    ...mapMutations("stateList", ["setCourseTime"]),
    /**
     * @name: 获取学生最大课时数
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getPlanSectionsCount() {
      let data = {
        arrLessonId: sessionStorage.getItem("arrLessonId"),
      };
      let res = await this.$api.ArrLessonSetting.getPlanSectionsCount(data);
      if (res.code === "200") {
        this.arrLessonNumber = res.data.sectionSelectNumber;
        sessionStorage.setItem("stuCourseTime", res.data.sectionSelectNumber);
        let maxCourse = {
          courseTime: res.data.sectionSelectNumber,
          stuMaxMorigningCourse: res.data.morningNumber,
          stuMaxNightCourse: res.data.nightNumber,
        };
        this.setCourseTime(maxCourse);
      }
    },

  },
};
</script>

<style lang="less" scoped>
.arrange-course {
  width: 100%;
  height: 100%;
  .title {
    font-size: 15px;
    span {
      margin-right: 5px;
    }
    .gray {
      color: #d1d4d7;
    }
  }
  .container {
    width: 100%;
    height: 100%;
    padding: 16px;
    // margin-top: 16px;
    background-color: #ffffff;
    overflow-y: scroll;
    .title-num {
      font-weight: normal;
      font-size: 22px;
      // cursor: pointer;
      span {
        margin-left: 5px;
      }
    }
    .head-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 10px;
      .tab-title {
        display: flex;
        margin: 13px 0;
        .tab-li {
          display: inline-block;
          margin-right: 8px;
          list-style: none;
          position: relative;
          cursor: pointer;

          span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: inline-block;
            font-size: 15px;
            width: 111px;
          }
          &:nth-child(1) {
            margin-right: -2px;
          }
          &:nth-child(4) {
            margin-right: -2px;
          }
        }
        .tab-li2 {
          width: 160px;
          height: 32px;
          transform: skew(36deg);
          background-color: #f0f2f5;
          span {
            transform: skew(-34deg) translate(-50%, -54%);
            display: inline-block;
          }
        }
        .tab-li1 {
          height: 0;
          width: 160px;
          // border-bottom: 32px solid #409fff;
          border-bottom: 32px solid #f0f2f5;
          border-right: 18px solid transparent;
          span {
            transform: translate(-50%, 17%);
          }
          // &.onjc {
          //   border-bottom: 32px solid #47cc8a;
          //   // background-color: #47cc8a;
          // }
        }
        .onli1 {
          border-bottom: 32px solid #409fff;
          color: #fff;
        }
        .successedli1 {
          border-bottom: 32px solid #47cc8a;
        }
        .onli2,
        .onli3,
        .onli4 {
          background-color: #409fff;
          color: #fff;
        }
        .successedli2,
        .successedli3,
        .successedli4 {
          background-color: #47cc8a;
        }
        .tab-li3 {
          height: 0;
          width: 160px;
          border-left: 18px solid transparent;
          border-top: 32px solid #f0f2f5;
          span {
            transform: translate(-50%, -127%);
          }
        }
        .onli5 {
          border-top: 32px solid #409fff;
          color: #fff;
        }
        .successedli5 {
          border-top: 32px solid #47cc8a;
        }
      }
      .step-btn {
        .step {
          margin-left: 15px;
        }
      }
    }

    .tips {
      color: #ffa74e;
      font-size: 18px;
      margin-bottom: 10px;
      display: inline-block;
    }
    .ji {
      margin-right: 10px;
    }
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(150px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0;
}
</style>