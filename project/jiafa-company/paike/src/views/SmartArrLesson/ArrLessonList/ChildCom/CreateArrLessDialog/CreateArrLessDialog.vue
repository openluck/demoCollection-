<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-17 13:39:13
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-09 13:12:23
-->
<template>
  <div>
    <a-modal
      :visible="ArrLessDailogvisible"
      title="创建排课"
      @cancel="CloseModel"
      @ok="handleOk"
    >
      <p class="tips" v-show="this.$store.state.stateList.showTipe">
        <a-icon style="margin-right: 10px" type="info-circle" />
        检测到您存在其他排课方案，可将其进行复用。
      </p>
      <div class="content">
        <div class="reuse">
          <span>是否复用：</span>
          <a-radio-group v-model="reuseValue" @change="changeReuseValue">
            <a-radio :value="1"> 复用 </a-radio>
            <a-radio :value="2"> 不复用 </a-radio>
          </a-radio-group>
        </div>
        <div class="select" v-show="showSelect">
          <span>方案选择：</span>
          <a-select
            v-model="selectPlan"
            style="width: 120px"
            placeholder="请选择"
            class="aselect"
          >
            <a-select-option
              v-for="item in recordList"
              :key="item.arrLessonId"
              :value="item.arrLessonId"
            >
              {{ item.number }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
    <!-- class="show-loading" -->
    <div class="example">
      <a-spin
        :spinning="showLoading"
        size="large"
        class="show-loading"
        wrapperClassName="global-export-spin-loading"
        tip="Loading..."
      >
      </a-spin>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "",
  props: {
    // recordList: {
    //   type: Array,
    //   default: [],
    // },
    arrLessonGroupId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ArrLessDailogvisible: false,
      reuseValue: 1,
      selectPlan: undefined, // 排课方案组id
      showSelect: true,
      arrLessonId: "", // 排课方案id
      createArrLessonId: "", // 新的排课方案id
      showLoading: false,
      recordList: [],
      // showTipe: true,
    };
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("fbPlanId");
    // this.getArrLessonList();
  },
  methods: {
    /**
     * @name: 弹窗显示
     * @msg:
     * @param {*}
     * @return {*}
     */
    showDialog() {
      this.ArrLessDailogvisible = true;
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseModel() {
      this.ArrLessDailogvisible = false;
    },

    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setArrLessonId"]),
    async handleOk() {
      let data = {
        arrLessonId: "",
        arrLessonGroupId: this.arrLessonGroupId,
      };

      if (this.reuseValue === 1) {
        if (!this.selectPlan) {
          this.$message.warning("请选择排课方案！");
          return;
        } else {
          data.arrLessonId = this.selectPlan;
          this.setArrLessonId(this.selectPlan);
        }
      } else {
        data.arrLessonId = "";
      }
      try {
        this.showLoading = true;
        this.CloseModel();
        let res = await this.$api.ArrlessonList.createArrLessonId(data);
        if (res.code === "200") {
          let number = res.data.code;
          this.$store.commit("stateList/setArrLessonNumber", number);
          this.createArrLessonId = res.data.arrLessonId;
          sessionStorage.setItem("arrLessonId", this.createArrLessonId);
          this.$parent.getSectionArr();
          // this.getSectionArr();
          // this.$router.push({
          //   path: "/CourseSecArrange",
          // });
          // sessionStorage.setItem("arrLessonId", this.selectPlan);
        } else {
          this.$message.error(res.message);
        }
        this.showLoading = false;
      } catch (error) {
        this.$message.error("请求失败", error);
      }
    },

    /**
     * @name: 是否复用
     * @msg:  1 复用  2 不复用
     * @param {*}
     * @return {*}
     */
    changeReuseValue(e) {
      let index = e.target.value;
      if (index === 2) {
        this.selectPlan = undefined;
      }
      index === 1 ? (this.showSelect = true) : (this.showSelect = false);
    },

    /**
     * @name: 下拉框
     * @msg:
     * @param {*}
     * @return {*}
     */
    handleChange(value) {
      console.log(`selected ${value}`);
    },

    /**
     * @name: 获取排课方案列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getArrLessonList() {
      let data = {
        planId: this.arrLessonId,
        current: 1,
        pageSize: 100,
      };
      try {
        const res = await this.$api.ArrlessonList.getArrLessonList(data);
        if (res.code === "200") {
          this.recordList = res.data.list;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！", +error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tips {
  color: #ffa74e;
  font-size: 16px;
  background-color: #fff9f3;
  height: 30px;
  line-height: 30px;
  width: 76%;
  padding-left: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 27%;
  left: 50%;
  transform: translateX(-50%);
}
.content {
  margin-top: 45px;
  margin-left: 60px;
}
.select {
  margin-top: 20px;
  margin-bottom: 30px;
  .aselect {
    width: 300px !important;
  }
}
/deep/ .ant-modal-header {
  text-align: left;
}
/deep/ .ant-modal-close-icon {
  color: #000;
}
/deep/ .ant-modal-body {
  padding: 10px 24px 24px;
}
/deep/ .ant-modal-footer {
  text-align: center;
}
/deep/ .ant-modal-body {
  height: 150px;
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
/deep/ .ant-spin-text {
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
}
.example {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.global-export-spin-loading {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
</style>