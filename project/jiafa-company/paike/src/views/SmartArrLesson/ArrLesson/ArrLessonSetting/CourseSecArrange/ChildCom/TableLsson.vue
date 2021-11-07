<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-15 14:06:08
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-09 15:06:05
-->
<template>
  <div class="sec-inner">
    <!-- <a-spin :spinning="showLoading" tip="Loading..." size="large"> -->
    <div class="sec-inner-main">
      <div class="sec-inner-comtainer">
        <!-- grids是格子的样式 -->
        <!-- select是选中格子的样式,白色 -->
        <div
          class="grids"
          v-for="item in sectionNumberList"
          :key="item"
          :data-selected-index="item"
          @click="handleClick(item)"
          ref="slegrids"
        >
          <!-- ref="sleicon" -->
          <!-- <a-icon type="check-circle" class="slecticon" /> -->
          <!-- <span class="sel">选择节次</span> -->
          选择节次
        </div>
      </div>
      <VueAreaSelect
        style="backgroubnd: red"
        ref="areaSelect"
        :selectItemClassName="['grids']"
        v-model="selectNumberList"
        :preventParent="preventParent"
        selectedClassName="select"
        @handleClick="handleClick"
        @handleMouseUp="handleMouseUp"
      />
    </div>
    <!-- </a-spin> -->
    <div class="example">
      <a-spin
        :spinning="showLoading"
        size="large"
        class="show-loading"
        wrapperClassName="global-export-spin-loading"
      >
      </a-spin>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "",
  data() {
    return {
      preventParent: true,
      selectAreaClassName: "main",
      // 通过将id与数字分成两个数组进行操作。因为组件只能渲染数字组成数组，无法渲染id组成的数组
      sectionNumberList: [], // 格子数字列表
      sectionIdList: [], // 格子唯一id列表
      selectNumberList: [], // 选中的格子数字列表
      selectIdList: [], // 选中的格子id列表
      dataSourse: [],
      isSelectList: [], // 返回数据isSelect为true
      curList: [], // 存储选中的数字
      arrLessonId: "",
      data: {}, // 参数值
      mytimer: null,
      setCancel: false,
      courseTime: 0,
      selectCon: "选择节次",
      hasSelectCom: "已选择",
      courseNumber: [], // 根据返回的节次数量，设置节次数量数组
      temList: [],
      showLoading: false,
    };
  },
  watch: {},
  async created() {
    this.sectionNumberList = this.$store.state.stateList.sectionArr;
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    await this.getClassSectionList();
    this.curList = this.selectNumberList;

    await this.changeText();
    this.temList = this.selectNumberList;
  },
  async mounted() {
    // this.sectionNumberList = this.$store.state.stateList.sectionArr;
    // this.arrLessonId = sessionStorage.getItem("arrLessonId");
    // this.getClassSectionList();
    // this.curList = this.selectNumberList;
    // this.changeText();
  },
  methods: {
    /**
     * @name: 获取节次
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("stateList", ["setCourseTime"]),
    async getClassSectionList() {
      this.showLoading = true;
      let selectNumberListTem = [];

      let data = {
        arrLessonId: sessionStorage.getItem("arrLessonId"),
      };
      try {
        const res = await this.$api.SectionArrList.getClassSectionList(data);
        if (res.code === "200") {
          this.showLoading = false;
          this.dataSourse = res.data;
          this.dataSourse.map((itemObj) => {
            for (let i in itemObj) {
              if (typeof itemObj[i] === "object") {
                this.sectionIdList.push(itemObj[i].sectionId);
                // 返回数据isSelect为true
                if (itemObj[i].isSelect === true) {
                  this.isSelectList.push(itemObj[i].sectionId);
                }
              }
            }
          });
          // 双重循环节次id列表和isSelect为true的列表。获取对应的下标
          for (let i = 0; i < this.sectionIdList.length; i++) {
            for (let j = 0; j < this.isSelectList.length; j++) {
              if (this.sectionIdList[i] === this.isSelectList[j]) {
                let iString = String(i);
                selectNumberListTem.push(iString);
              }
            }
          }
          this.selectNumberList = selectNumberListTem;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("获取节次请求失败！", +error);
      }
    },

    /**
     * @name: 节次数据处理
     * @msg:
     * @param {*} item
     * @return {*}
     */
    async handleClick(index) {
      this.selectIdList = this.selectNumberList.map(
        (i) => this.sectionIdList[i]
      );
      // 取消节次
      if (this.curList.includes(index)) {
        this.selectNumberList = this.selectNumberList.filter((item, i) => {
          // 取消选中的格子
          return item !== index;
        });
        this.selectIdList = this.selectNumberList.map(
          (i) => this.sectionIdList[i]
        );
        this.curList = this.curList.filter((curItem, i) => {
          return curItem !== index;
        });
        this.data.list = this.selectIdList;
        // 取消节次的时候，调用接口，判断该节次是否已经排课，不能取消
        // this.handleMouseUp();
      } else {
        // 选中节次+防抖
        clearTimeout(this.mytimer);
        this.mytimer = setTimeout(() => {
          this.data.list = this.selectIdList;
          this.curList = [...this.selectNumberList];
        }, 50);
      }
      this.data.maxCourseHour = this.selectIdList.length;
      // this.selectIdList.length === this.curList.length
      //   ? (this.setCancel = true)
      //   : (this.setCancel = false);
      this.getPlanSectionsCountAgin();
    },
    /**
     * @name: 设置，取消节次
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleMouseUp() {
      this.showLoading = true;
      this.data.arrLessonId = this.arrLessonId;
      // 取消节次
      // if (this.setCancel) {
      try {
        let res = await this.$api.SectionArrList.setClassSection(this.data);
        if (res.code === "200") {
          this.$message.success(res.message);
          this.getPlanSectionsCount();
          this.getPlanSectionsCountAgin();
        } else {
          this.sectionIdList = [];
          this.isSelectList = [];
          this.selectNumberList = [];
          await this.getClassSectionList();
          await this.getPlanSectionsCountAgin();
          this.$message.warning(res.message);
          this.curList = [...this.selectNumberList];
        }
      } catch (error) {
        this.$message.error(error);
      }
      this.showLoading = false;
    },
    /**
     * @name: 初始化修改文字
     * @msg:
     * @param {*}
     * @return {*}
     */
    changeText() {
      this.curList.map((curListItem) => {
        this.$refs.slegrids[curListItem].innerText = "已选择";
      });
    },
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
        sessionStorage.setItem("stuCourseTime", this.arrLessonNumber);
        let maxCourse = {
          courseTime: res.data.sectionSelectNumber,
          stuMaxMorigningCourse: res.data.morningNumber,
          stuMaxNightCourse: res.data.nightNumber,
        };
        this.setCourseTime(maxCourse);
      }
    },

    /**
     * @name: 修改文字
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getPlanSectionsCountAgin() {
      let temSleNumberList = []; // 中间数组，存储数字类型的，选中的数字 改为已选择
      this.selectNumberList.map(
        (
          item // 转化为数字类型的数组
        ) => temSleNumberList.push(parseInt(item))
      );
      temSleNumberList.map((index) => {
        this.$refs.slegrids[index].innerText = "已选择"; // 修改文字
      });
      let temNoSleNumberList = []; // 中间数组，存储数字类型的，去重 未选中的数字 改为未选择
      temNoSleNumberList = this.sectionNumberList.filter(
        (index) => !temSleNumberList.includes(index)
      );
      temNoSleNumberList.map((index) => {
        this.$refs.slegrids[index].innerText = "选择节次"; // 修改文字
      });
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
.sec-inner {
  width: 100%;
  height: 100%;
}
.left {
  width: 200px;
  background-color: antiquewhite;
}
.control {
  background-color: wheat;
}
.model-list {
  background: #fff;
  height: 100px;
  overflow: auto;
}
.grids {
  // border: 1px solid #ccd;
  width: 14.2%;
  height: 58px;
  display: inline-block;
  text-align: center;
  line-height: 58px;
  background: #fff;
  cursor: pointer;
  vertical-align: middle;
  position: relative;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
  position: relative;
}
/deep/ .sec-inner-comtainer {
  display: inline-block;
  position: relative;
  background-color: #ffffff;
  width: 100%;
}
.select {
  background-color: #eaf4ff;
  border: 1px solid #94c8fd;
}
.select::before {
  content: "";
  position: absolute;
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url("../../../../../../assets/img/selected.png") no-repeat
    center/cover;
  right: 6%;
  top: 10%;
}
.slecticon {
  position: absolute;
  right: 5%;
  top: 7%;
  // display: none;
}
.sel {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.show-loading {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999999999999999999;
  // background-color: #e6f7ff;
  // opacity: 0.5;
  /deep/ .ant-spin-dot {
    top: 50%;
  }
}
</style>
