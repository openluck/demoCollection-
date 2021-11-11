<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-08-02 15:10:36
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-08 13:15:30
-->
<template>
  <div class="spelledAdjustment">
    <div class="spelledcontainer">
      <div class="conditionOrg" style="position: relative">
        <a-select
          class="mar20"
          @change="seleChange"
          v-model="item.type"
          style="width: 88px; margin-left: 20px"
          :getPopupContainer="(v) => v.parentNode"
        >
          <a-select-option value="1">调整</a-select-option>
          <a-select-option value="2">休课</a-select-option>
        </a-select>
        <!-- 调整time -->
        <div v-if="item.type === '1'" class="adjust-time">
          <div style="position: relative">
            <a-date-picker
              v-model="item.selectDate"
              placeholder="请选择时间"
              class="mar20"
              style="width: 200px"
              :disabled-date="disabledDate"
              @change="onAdjustmentChange1"
              :getCalendarContainer="(v) => v.parentNode"
            >
              <template #suffixIcon>
                <svg-icon icon-class="com_calendar" style="margin-top: -8px">
                </svg-icon>
              </template>
            </a-date-picker>
          </div>
          <span class="mar20">补上</span>
          <div style="position: relative">
            <a-date-picker
              v-model="item.classDate"
              placeholder="请选择时间"
              class="mar20"
              style="width: 200px"
              :disabled-date="disabledDate"
              @change="onAdjustmentChange2"
              :getCalendarContainer="(v) => v.parentNode"
            >
              <template #suffixIcon>
                <svg-icon icon-class="com_calendar" style="margin-top: -8px" />
              </template>
            </a-date-picker>
          </div>
        </div>
        <!-- 休课time -->
        <div v-if="item.type === '2'" class="xk-time">
          <div style="position: relative">
            <a-date-picker
              v-model="item.restDate"
              class="mar20"
              placeholder="请选择休课时间"
              style="width: 200px"
              @change="onXKChangeTime"
              :disabled-date="disabledDate"
              :getCalendarContainer="(v) => v.parentNode"
            >
              <template #suffixIcon>
                <svg-icon icon-class="com_calendar" style="margin-top: -8px">
                </svg-icon>
              </template>
            </a-date-picker>
          </div>

          <span class="">休假节次：</span>
          <div style="position: relative">
            <a-select
              v-model="item.startLesId"
              style="width: 104px"
              @change="handleChange1"
              :getPopupContainer="(v) => v.parentNode"
            >
              <a-select-option
                v-for="item in lesSortList1"
                :disabled="item.disabled"
                :key="item.lesSortId"
              >
                {{ item.lesSortName }}
              </a-select-option>
            </a-select>
          </div>
          <span class="mar21">至</span>
          <div style="position: relative">
            <a-select
              v-model="item.endLesId"
              style="width: 104px"
              @change="handleChange2"
              :getPopupContainer="(v) => v.parentNode"
            >
              <a-select-option
                :disabled="item.disabled"
                v-for="item in lesSortList2"
                :key="item.lesSortId"
              >
                {{ item.lesSortName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div @click="deleteItem" class="mar20 del">
          <svg-icon icon-class="hx-clear" :scale="2"></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "spelledAdjustment",
  props: ["item", "secId"],
  data() {
    return {
      lesSortList1: [],
      lesSortList2: [],
      nowSemester: {
        semesterEndTime: "",
        semesterStartTime: "",
      },
    };
  },
  computed: {},
  async mounted() {
    await this.getSpelledLesSort(this.secId);
    await this.initLesId();
    this.nowSemester.semesterEndTime = JSON.parse(
      sessionStorage.getItem("nowSemester")
    ).semesterEndTime;
    this.nowSemester.semesterStartTime = JSON.parse(
      sessionStorage.getItem("nowSemester")
    ).semesterStartTime;
  },
  methods: {
    initLesId() {
      if (this.item.type === "2") {
        this.item.startLesId = this.lesSortList1[0].lesSortId;
        let lesSortListLength = this.lesSortList1.length - 1;
        this.item.endLesId = this.lesSortList1[lesSortListLength].lesSortId;
      }
    },
    /**
     * @name: 删除节点
     * @msg:
     * @param {*} value节次id
     * @return {*}
     */
    deleteItem() {
      this.$parent.delItem(this.item.id);
    },

    seleChange(value) {
      if (value === "1") {
        this.item.restDate = null;
      } else {
        this.item.selectDate = null;
        this.item.classDate = null;
        this.initLesId();
      }
    },

    /**
     * @name: 修改节次2 disabled
     * @msg:
     * @param {*} value节次id
     * @return {*}
     */
    handleChange1(value) {
      console.log(11, value);
      // 重新设置this.lesSortList2的disabled为false
      this.lesSortList2.map((item, index) => {
        item.disabled = false;
      });
      // 获取value在this.lesSortList2数组中的下标
      let arr2Num;
      this.lesSortList2.map((item, index) => {
        if (item.lesSortId === value) {
          arr2Num = index;
        }
      });
      for (let i = 0; i < arr2Num; i++) {
        this.lesSortList2[i].disabled = true;
      }
    },

    /**
     * @name: 修改节次1 disabled
     * @msg:
     * @param {*} value 节次id
     * @return {*}
     */
    handleChange2(value) {
      // 重新设置this.lesSortList1的disabled为false
      this.lesSortList1.map((item, index) => {
        item.disabled = false;
      });
      // 获取value在this.lesSortList1数组中的下标
      let arr1Num;
      this.lesSortList1.map((item, index) => {
        if (item.lesSortId === value) {
          arr1Num = index;
        }
      });
      for (let i = arr1Num + 1; i < this.lesSortList1.length; i++) {
        this.lesSortList1[i].disabled = true;
      }
    },
    // 调整时间选择1
    onAdjustmentChange1(date, dateString) {
      if (this.item.classDate !== null) {
        let classDate = this.item.classDate.format("YYYY-MM-DD");
        if (dateString == classDate) {
          this.$message.warning("调整时间不能选同一天");
          this.item.selectDate = null;
        }
      }
    },
    // 调整时间选择2
    onAdjustmentChange2(date, dateString) {
      if (this.item.selectDate !== null) {
        let selectDate = this.item.selectDate.format("YYYY-MM-DD");
        if (dateString == selectDate) {
          this.$message.warning("调整时间不能选同一天");
          this.item.classDate = null;
        }
      }
    },

    /**
     * @name: 休课时间选择
     * @msg:
     * @param {*} date
     * @param {*} dateString
     * @return {*}
     */
    onXKChangeTime(date, dateString) {},
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
        // res.data.map((item) => {
        //   item.disabled = false;
        // });
        // this.lesSortList = res.data;
        // this.lesSortList1 = [...res.data];
        // this.lesSortList2 = [...res.data];
        this.lesSortList1 = res.data.map((item) => ({
          ...item,
          disabled: false,
        }));
        this.lesSortList2 = res.data.map((item) => ({
          ...item,
          disabled: false,
        }));
      } else {
        this.$message.warning(res.message);
      }
    },
    disabledDate(current) {
      return (
        moment(this.nowSemester.semesterEndTime).subtract(-1, "days") <
          current || current < moment(this.nowSemester.semesterStartTime)
      );
    },
  },
};
</script>
<style scoped lang="less">
.spelledAdjustment {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .spelledcontainer {
    background-color: rgb(248, 249, 249);
    width: 680px;
    .conditionOrg {
      height: 50px;
      display: flex;
      align-items: center;
      position: relative;
      .mar20 {
        margin-right: 20px;
      }
      .mar21 {
        margin-right: 9px;
        margin-left: 9px;
      }
      .del {
        width: 25px;
        height: 25px;
        position: absolute;
        right: -9%;
      }
    }
  }
  .adjust-time {
    display: flex;
    align-items: center;
  }
  .xk-time {
    display: flex;
    align-items: center;
  }
}
</style>
