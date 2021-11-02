<template>
  <div class="course-table">
    <!-- 课时：
    {{ showCourseTime }} -->
    <!-- class="spin-content" -->
    <div class="table">
      <ul class="head-table">
        <!-- <li class="head-item" v-for="(item, index) in head" :key="index">
          {{ item }}
        </li> -->
        <li class="head-item">时间段</li>
        <li class="head-item">节次</li>
        <li class="head-item">周一</li>
        <li class="head-item">周二</li>
        <li class="head-item">周三</li>
        <li class="head-item">周四</li>
        <li class="head-item">周五</li>
        <li class="head-item">周六</li>
        <li class="head-item">周日</li>
      </ul>
      <div class="sec-container">
        <div class="sec-container-left">
          <ul class="course-time">
            <!-- <li class="" v-for="(item, index) in courseTime" :key="index">
              {{ item }}
            </li> -->
            <!-- <li>早晨</li>
            <li>上午</li>
            <li>下午</li>
            <li>晚上</li> -->
            <li
              v-for="(item, index) in temTimeQuantum"
              :key="index"
              ref="liTime"
            >
              {{ item }}
            </li>
          </ul>
          <div class="course-lesson">
            <!-- <li class="" v-for="(item, index) in courseLesson" :key="index">
              {{ item }}
            </li> -->
            <!-- <div class="zjx">早自习</div> -->
            <ul class="sw">
              <!-- <li>第一节</li>
              <li>第二节</li>
              <li>第三节</li>
              <li>第四节</li> -->
              <li v-for="(item, index) in courseLesson" :key="index">
                {{ item }}
              </li>
            </ul>
            <!-- <ul class="xw">
              <li>第五节</li>
              <li>第六节</li>
              <li>第七节</li>
              <li>第八节</li>
              <li>活动</li>
            </ul> -->
          </div>
        </div>
        <div class="right">
          <TableLsson></TableLsson>
        </div>
      </div>
    </div>
    <!-- <a-spin :spinning="showLoading" tip="Loading..." size="large">
     
    </a-spin> -->
  </div>
</template>

<script>
import TableLsson from "./ChildCom/TableLsson.vue";
export default {
  name: "CourseTable",
  components: {
    TableLsson,
  },
  data() {
    return {
      courseTime: ["早晨", "上午", "下午"],
      courseLesson: [],
      courseTime: 0,
      arrLessonId: "",
      timeQuantum: [], // 没有去重的数组
      temTimeQuantum: [], // 去重之后的数组
      showLoading: false,
    };
  },
  computed: {
    // showCourseTime(courseTime) {
    //   this.courseTime = courseTime;
    //   return this.courseTime;
    // },
  },
  async mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    await this.getClassSectionList();
    await this.changeHeight();
  },
  methods: {
    async getClassSectionList() {
      this.showLoading = true;
      let data = {
        arrLessonId: this.arrLessonId,
      };
      try {
        const res = await this.$api.SectionArrList.getClassSectionList(data);
        if (res.code === "200") {
          res.data.map((item) => {
            this.timeQuantum.push(item.diffNoon); // 上午，下午列表
            this.courseLesson.push(item.lesSort); // 节次
          });
          this.temTimeQuantum = Array.from(new Set(this.timeQuantum)); // 对上午，下午列表进行去重，循环渲染，
          this.showLoading = false;
        } else {
          this.showLoading = false;
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！", +error);
      }
    },
    changeHeight() {
      var countedNames = this.timeQuantum.reduce((obj, name) => {
        if (name in obj) {
          obj[name]++;
        } else {
          obj[name] = 1;
        }
        return obj;
      }, {});
      //reduce的第二个参数就是obj的初始值
      // this.$refs.liTime[0].style.height = 51 * 1 + "px";
      // this.$refs.liTime[1].style.height = 51 * 4 + "px";
      // this.$refs.liTime[2].style.height = 51 * 4 + "px";
      // this.$refs.liTime[3].style.height = 51 * 1 + "px";
      let index = 0;
      for (let i in countedNames) {
        this.$refs.liTime[index].style.height = 58 * countedNames[i] + "px";
        index++;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.course-table {
  width: 100%;
  height: 78%;
  // overflow-y: scroll;
  // &::-webkit-scrollbar-track {
  //   display: none !important;
  //   height: 0;
  //   background-color: #fff;
  // }
  // background-color: red;
  .table {
    width: 100%;
    height: 100%;
    .head-table {
      display: flex;
      margin: 0;
      .head-item {
        display: inline-block;
        width: 11.43%;
        // flex: 1;
        height: 40px;
        background-color: #fafbfc;
        // border: 1px solid #000;
        box-sizing: border-box;
        text-align: center;
        line-height: 40px;
        // border: 1px solid #e8e8e8;
        border-left: 1px solid #e8e8e8;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        box-sizing: border-box;
        font-weight: bold;
        &:nth-of-type(1) {
          width: 9.7%;
          border-bottom: 0;
        }
        &:nth-of-type(2) {
          width: 9.65%;
          border-bottom: 0;
        }
        &:nth-of-type(6) {
          width: 11.46%;
        }
        &:nth-of-type(6) {
          width: 11.46%;
        }
        &:nth-of-type(7) {
          width: 11.47%;
        }
        // &:nth-last-child() {
        //   border-right: 1px solid #e8e8e8;
        // }
        &:last-child {
          width: 11.48%;
          border-right: 1px solid #e8e8e8;
        }
      }
    }
    .sec-container {
      // height: calc(100% - 40px);
      width: 100%;
      // width: 90%;
      display: flex;
      // background-color: pink;
      .sec-container-left {
        width: 24%;
        height: 100%;
        // background-color: blue;
        display: flex;
        .course-time {
          width: 50%;
          // height: 100%;
          background-color: #fafbfc;
          font-weight: bold;
          li {
            width: 100%;
            // text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid #e8e8e8;
            border-left: 1px solid #e8e8e8;
            border-top: 1px solid #e8e8e8;
            box-sizing: border-box;
            // height: 51px;
            // &:nth-of-type(1) {
            //   height: 51px;
            //   border-top: 0;
            //   // background: red;
            // }
            // &:nth-of-type(2) {
            //   height: 204px;
            // }
            // &:nth-of-type(3) {
            //   height: 204px;
            // }
            // &:nth-of-type(4) {
            //   height: 51px;
            //   border-bottom: 1px solid #e8e8e8;
            // }
            &:last-child {
              border-bottom: 1px solid #e8e8e8;
            }
          }
        }
        .course-lesson {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #fafbfc;
          .zjx {
            width: 100%;
            height: 50px;
            // text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid #e8e8e8;
            border-left: 1px solid #e8e8e8;
            // border-top: 1px solid #e8e8e8;
            border-right: 1px solid #e8e8e8;
            box-sizing: border-box;
          }
          .sw {
            width: 100%;
            // height: 45%;
            font-weight: bold;
            li {
              // display: inline-block;
              width: 100%;
              height: 57.9px;
              // text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              border-left: 1px solid #e8e8e8;
              border-top: 1px solid #e8e8e8;
              border-right: 1px solid #e8e8e8;
              box-sizing: border-box;
            }
            &:last-child {
              border-bottom: 1px solid #e8e8e8;
            }
          }
          .xw {
            width: 100%;
            // height: 45%;
            li {
              // display: inline-block;
              width: 100%;
              // height: 20%;
              height: 51px;
              // text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              border-left: 1px solid #e8e8e8;
              border-top: 1px solid #e8e8e8;
              border-right: 1px solid #e8e8e8;
              box-sizing: border-box;
              &:last-child {
                border-bottom: 1px solid #e8e8e8;
              }
            }
          }
        }
        .course-lesson {
          width: 50%;
          height: 100%;
        }
      }
      .right {
        width: 100%;
        height: 100%;
        // background-color: pink;
      }
    }
  }
  ul {
    list-style: none;
  }
  ol,
  ul,
  dl {
    margin: 0;
  }

  .spin-content {
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    grid-row: 1;
    margin: 0px;
    padding: 100px;
  }
}
</style>