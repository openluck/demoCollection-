<!--
 * @Description: 换休调整主页面
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-08 13:19:19
-->

<template>
  <div class="SpelledAdjustment">
    <div class="title-head">
      <div class="lky-common-title">换休调整</div>
      <div class="cb-p-filter">
        <div class="cb-p-btn">
          <a-button @click="openRecord">
            <svg-icon
              icon-class="com_adjust_record"
              :scale="0.8"
              style="margin-right: 8px"
            ></svg-icon>
            调整记录
          </a-button>
          <a-button @click="save" type="primary">
            <svg-icon
              icon-class="com_apply"
              :scale="0.8"
              style="margin-right: 8px"
            ></svg-icon>
            应用
          </a-button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="SpelledAdjustmentT">
      <div class="conditionOrg">
        <div>影响学段/年级：</div>
        <div style="position: relative">
          <a-select
            v-model="searchData.secId"
            style="width: 180px; margin-right: 20px"
            @change="secChange"
            :getPopupContainer="(v) => v.parentNode"
          >
            <!-- 学段 -->
            <a-select-option
              v-for="(item, index) in secList"
              :key="index"
              :value="item.secId"
            >
              {{ item.secName }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 学年 -->
        <div style="position: relative">
          <a-select
            v-model="searchData.gradeId"
            style="width: 180px"
            @change="gradeChange"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option v-for="item in gradeList" :key="item.gradeId">
              {{ item.gradeName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="item in list" :key="item.index">
        <spelledAdjustment
          class="listItem"
          :item="item"
          :secId="searchData.secId"
          ref="spelledAdjustment"
        ></spelledAdjustment>
        <!-- :lesSortList="lesSortList" -->
      </div>

      <div class="add1">
        <div class="add" @click="addItem">
          <svg-icon
            class="add"
            @click="addItem"
            icon-class="hx-add"
            :scale="1"
          ></svg-icon>
        </div>
      </div>
    </div>
    <RecordModal ref="RecordModal" />
  </div>
</template>
<script>
import moment from "moment";
import spelledAdjustment from "./SpelledChildCom/spelledAdjustment"; //time
import RecordModal from "@/components/common/RecordModal"; // 操作记录
export default {
  name: "",
  components: { spelledAdjustment, RecordModal },
  data() {
    return {
      id: 3,
      list: [], // 参数data列表
      weekOption: [],
      secList: [], // 学段列表
      gradeList: [], // 年级列表
      lesSortList: [], // 节次列表
      searchData: {
        // 查询参数
        secId: "",
        gradeId: "",
      },
    };
  },
  created() {
    // 获取学段
    this.secList = JSON.parse(sessionStorage.getItem("secList"));
    this.searchData.secId = this.secList[0].secId;
    // 获取节次列表
    // this.getSpelledLesSort(this.searchData.secId);
    // 默认选中年级
    this.secChange(this.searchData.secId);
    // console.log((this.gradeList);
   

    // 默认有一个调整，换休
    this.list = [
      {
        type: "1",
        id: 1,
        selectDate: null, //选择时间
        classDate: null, //上课时间
        restDate: null, //休课时间
        startLesId: null, // 开始节次
        endLesId: null, // 结束节次
      },
      {
        type: "2",
        id: 2,
        selectDate: null, //选择时间
        classDate: null, //上课时间
        restDate: null, //休课时间
        startLesId: null, // 开始节次
        endLesId: null, // 结束节次
      },
    ];
  },
  methods: {
    moment,
    addItem() {
      this.id = this.id + 1;
      let temp = {
        type: "1",
        id: this.id,
        selectDate: null, //选择时间
        classDate: null, //上课时间
        restDate: null, //休课时间
        startLesId: null, // 开始节次
        endLesId: null, // 结束节次
      };
      this.list.push(temp);
    },
    //学段change事件，置空年级，选择调换，休课的列表
    secChange(value) {
      this.searchData.secId = value;
      this.getSpelledLesSort(value);
      this.searchData.gradeId = "";
      this.gradeList = [];
      this.list = [];
      // this.gradeChange();
      //获取年级数组
      this.secList.map((item) => {
        if (item.secId === value) {
          this.gradeList = item.gradeList;
        }
      });
      // this.searchData.gradeId = this.gradeList[0].gradeId;
       if (this.gradeList.length === 0) {
      this.searchData.gradeId = "";
    } else {
      this.searchData.gradeId = this.gradeList[0].gradeId;
    }
    },
    //年级change事件
    gradeChange() {
      this.searchData.classId = "";
      // this.gradeList = [];
    },
    delItem(id) {
      this.list.splice(
        this.list.findIndex((item) => item.id === id),
        1
      );
    },

    /**
     * @name: 应用之前判断
     * @msg:
     * @param {*}
     * @return {*}
     */
    save() {
      if (this.list.length === 0) {
        this.$message.warning("请先添加换休调整~！");
        return;
      }
      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index];
        if (element.type === "1") {
          if (!element.selectDate || !element.classDate) {
            this.$message.warning("请选择调整时间~！");
            return;
          }
        } else {
          if (!element.restDate) {
            this.$message.warning("请选择休课时间~！");
            return;
          }
          // if (!element.startLesId || !element.endLesId) {
          if (element.startLesId === "" || element.endLesId === "") {
            this.$message.warning("请选择节次~！");
            return;
          }
        }
      }
      if (!this.searchData.gradeId) {
        this.$message.warning("请选择应用年级");
        return;
      }

      const timeList = this.fillterList(this.list);
      // 判断调整与换休都有相同的内容
      for (let i = 0; i < timeList.length - 1; i++) {
        for (let j = i + 1; j < timeList.length; j++) {
          // 1是调整
          if (timeList[i].type === "1") {
            // 如果具有调整开始时间相同，进行提示
            if (timeList[i].selectDate === timeList[j].selectDate) {
              this.$message.warning("调整不能设置为同一天");
              return;
            }
            // 如果具有调整结束时间相同，进行提示
            if (timeList[i].classDate === timeList[j].classDate) {
              this.$message.warning("调整补上时间不能设置为同一天");
              return;
            }
            // 如果具有调整时间都一样，进行提示
            if (
              timeList[i].selectDate === timeList[j].selectDate &&
              timeList[i].classDate === timeList[j].classDate
            ) {
              this.$message.warning("调整不能设置重复日期");
              return;
            }
          }
          // 换休
          if (timeList[i].type === "2") {
            if (
              timeList[i].restDate === timeList[j].restDate &&
              timeList[i].startLesId === timeList[j].startLesId &&
              timeList[i].endLesId === timeList[j].endLesId
            ) {
              this.$message.warning("换休不能设置重复日期");
              return;
            }
          }
        }
      }
      // 判断调整和休课不能为同一天
      let selectDateList = []; // 调整开始时间
      let restDateList = []; // 换休时间
      timeList.map((item) => {
        if (item.type === "1") {
          selectDateList.push(item.selectDate);
        }
        if (item.type === "2") {
          restDateList.push(item.restDate);
        }
      });
      for (let i = 0; i < selectDateList.length; i++) {
        for (let j = 0; j < restDateList.length; j++) {
          if (selectDateList[i] === restDateList[j]) {
            this.$message.warning("不能设置同一天为即为补上课程又为休课");
            return;
          }
        }
      }

      this.handleOk();
    },
    /**
     * @name: 应用弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    handleOk() {
      const data = {
        gradeId: this.searchData.gradeId,
        secId: this.searchData.secId,
        list: this.fillterList(this.list),
      };
      this.$confirm({
        title: "确定应用到课表吗？",
        okText: "确定",
        width: 360,
        onOk: () => {
          this.applyCgOnLeave(data);
        },
      });
    },
    /**
     * @name: 应用
     * @msg:
     * @param {*} data
     * @return {*}
     */
    async applyCgOnLeave(data) {
      try {
        const res = await this.$api.spelledAdjustment.applyCgOnLeave(data);
        if (res.code === "200") {
          // this.$message.success(res.message);
          this.$success({
            // title: `${res.message}`,
            title: "应用成功！",
            okText: "知道了",
            okType: "danger",
          });
          this.list = [];
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    /**
     * @name: 过滤List
     * @msg:
     * @param {*} data
     * @return {*}
     */
    fillterList(list) {
      if (list) {
        list = JSON.parse(JSON.stringify(list));
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          delete element.id;
          if (element.type === "1") {
            element.selectDate = moment(element.selectDate).format(
              "YYYY-MM-DD"
            );
            element.classDate = moment(element.classDate).format("YYYY-MM-DD");
          } else {
            element.restDate = moment(element.restDate).format("YYYY-MM-DD");
          }
        }
        return list;
      }
    },

    //换休记录弹窗
    openRecord() {
      let data = {
        changeType: "6",
        secId: this.searchData.secId,
        gradeId: this.searchData.gradeId,
      };
      this.$refs.RecordModal.showModal(data);
    },
    /**
     * @name:
     * @msg: 换休调整-获取节次
     * @param {*}
     * @return {*}
     */
    async getSpelledLesSort(secId) {
      let data = {
        secId: secId,
      };
      const res = await this.$api.spelledAdjustment.getSpelledLesSort(data);
      if (res.code === "200") {
        res.data.map((item) => {
          item.disabled = false;
        });
        this.lesSortList = res.data;
      } else {
        this.$message.warning(res.message);
      }
    },
  },
};
</script>

<style  lang="less">
.SpelledAdjustment {
  width: 100%;
  height: 100%;
  // padding: 16px 24px 16px;
  display: flex;
  flex-direction: column;
  .title-head {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px 16px;
  }
  .SpelledAdjustmentT {
    width: 100%;
    height: 40px;
    // margin-bottom: 10px;
    margin: 20px 0 24px 32px;
    display: flex;
    .conditionOrg {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .conditionOrgr {
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .list {
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin: 0 0 39px 32px;
    min-height: 700px;
    position: relative;
    .listItem {
      margin-right: 20px;
      height: 50px;
    }
    .add1 {
      width: 100%;
      height: 60px;
      .add {
        width: 32px;
        height: 32px;
      }
    }
  }

  .lky-common-title {
    display: flex;
    font-size: 18px;
    font-family: "Microsoft YaHei";
    color: #303233;
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #e6e8eb;
  }
}
/deep/ .layout-content-no-top {
  margin-top: 84px;
}
</style>
