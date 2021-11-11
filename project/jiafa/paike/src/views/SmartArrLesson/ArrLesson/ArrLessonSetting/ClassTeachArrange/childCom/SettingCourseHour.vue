<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 16:03:39
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-24 16:54:55
-->
<template>
  <div class="dialog">
    <a-modal
      :visible="settingHourVisible"
      title="批量配置课程课时"
      okText="确定"
      cancelText="取消"
      centered
      @cancel="closeSettingHourDialog"
      destroyOnClose
      width="592px"
      height="552px"
      class="amodel"
    >
      <p class="tips">
        <a-icon style="margin-right: 10px" type="info-circle" />
        <span>批量设置更新后，将运用于所有班级课程课时</span>
      </p>
      <div class="table-con">
        <a-table
          :columns="columns"
          :data-source="dataSourse"
          :rowKey="(record) => record.classTeachHourId"
          :row-class-name="rowClassName"
          :pagination="false"
        >
          <template slot="weekHour" slot-scope="text, record">
            <!-- {{ record }} -->
            <a-input-number
              id="weekHour"
              v-model="record.weekHour"
              @blur="onBlur(record, 1)"
              @pressEnter="onBlur(record, 1)"
              @change="changInput(record, 1)"
              placeholder="0"
              :max="999"
            />
          </template>
          <template slot="morningCourseHour" slot-scope="text, record">
            <!-- :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              v-model="record.morningCourseHour"
              id="morningCourseHour"
              @blur="onBlur(record, 2)"
              @pressEnter="onBlur(record, 2)"
              @change="changInput(record, 2)"
              placeholder="0"
              :max="999"
            />
          </template>
          <template slot="nightCourseHour" slot-scope="text, record">
            <!-- :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              id="nightCourseHour"
              v-model="record.nightCourseHour"
              @blur="onBlur(record, 3)"
              @pressEnter="onBlur(record, 3)"
              @change="changInput(record, 3)"
              placeholder="0"
              :max="999"
            />
            <!-- @focus="onFocus(record, 3)" -->
          </template>
        </a-table>
      </div>
      <template slot="footer">
        <div>
          <a-button @click="closeSettingHourDialog"> 取消 </a-button>
          <a-button type="primary" @click="debounceHandleOk"> 确定 </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { debounce } from "@/Utils/util.js";
// 表头
const columns = [
  {
    title: "课程",
    dataIndex: "courseName",
    key: "courseName",
    align: "center",
  },
  {
    title: "周正课时",
    dataIndex: "weekHour",
    key: "weekHour",
    scopedSlots: { customRender: "weekHour" },
    align: "center",
  },
  {
    title: "早自习课时",
    dataIndex: "morningCourseHour",
    key: "morningCourseHour",
    scopedSlots: { customRender: "morningCourseHour" },
    align: "center",
  },
  {
    title: "晚自习课时",
    dataIndex: "nightCourseHour",
    key: "nightCourseHour",
    scopedSlots: { customRender: "nightCourseHour" },
    align: "center",
  },
];
export default {
  name: "SettingHourDialog",
  data() {
    return {
      columns,
      dataSourse: [],
      arrLessonId: "",
      recordList: [],
    };
  },
  computed: {
    ...mapState("dialog", ["settingHourVisible"]),
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
  },
  methods: {
    /**
     * @name: 表格隔行变色
     * @msg:
     * @param {*} record
     * @param {*} index
     * @return {*}
     */
    rowClassName(record, index) {
      let className = "";
      if (index % 2 === 1) className = "gray";
      return className;
    },

    /**
     * @name: 取消
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setSettingHourVisible"]),
    closeSettingHourDialog() {
      this.setSettingHourVisible(false);
      this.recordList = [];
    },
    /**
     * @name: 获取批量配置课程课时
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getTeaClassDialogList() {
      let data = {
        arrLessonId: this.arrLessonId,
      };
      try {
        const res = await this.$api.ArrLessonSetting.getTeaClassDialogList(
          data
        );
        if (res.code === "200") {
          // res.data.map((item) => {
          //   item.weekHour = 0;
          //   item.morningCourseHour = 0;
          //   item.nightCourseHour = 0;
          // });
          this.dataSourse = res.data;
        }
      } catch (error) {
        this.$message.error("请求失败");
      }
    },

    /**
     * @name: 判断输入的值是否正确
     * @msg:
     * @param {*}
     * @return {*}
     */
    onBlur(record, type) {
      // courseType
      let { weekHour, morningCourseHour, nightCourseHour } = record;

      if (
        weekHour === undefined &&
        morningCourseHour === undefined &&
        nightCourseHour === undefined
      ) {
        return;
      } else if (weekHour < 0 || morningCourseHour < 0 || nightCourseHour < 0) {
        this.$message.warning(
          "周正课时只能设置0,0.5,正整数，早自习，晚自习可以设置为0,正整数"
          
        );
        if (type === 1) {
          record.weekHour = undefined;
        } else if (type === 2) {
          record.morningCourseHour = undefined;
        } else {
          record.nightCourseHour = undefined;
        }
      } else {
        let pd = false;
        if (type === 1) {
          pd = this.isNum(weekHour);
        } else if (type === 2) {
          pd = this.isNumPositive(morningCourseHour);
        } else {
          pd = this.isNumPositive(nightCourseHour);
        }
        if (pd) {
          this.fillterArr(record);
        } else {
          if (type === 1) {
            record.weekHour = undefined;
          } else if (type === 2) {
            record.morningCourseHour = undefined;
          } else {
            record.nightCourseHour = undefined;
          }
          this.$message.warning(
            "周正课时只能设置0,0.5,正整数，早自习，晚自习可以设置为0,正整数"
            
          );
          this.fillterArr(record);
        }
      }
    },

    // 判断周正课时数，可以设置为0.5，0，正整数
    isNum(num) {
      if (num >= 0) {
        if (num === 0.5 || num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },

    // 只能为0，正整数
    isNumPositive(num) {
      if (num >= 0) {
        if (num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },

    /**
     * @name: 过滤相同的id
     * @msg:
     * @param {*}
     * @return {*}
     */
    fillterArr(item) {
      item = { ...item };
      if (this.recordList.length > 0) {
        let tem = false;
        for (let i = 0; i < this.recordList.length; i++) {
          if (
            item.courseId === this.recordList[i].courseId &&
            item.classTeachHourId === this.recordList[i].classTeachHourId
          ) {
            tem = true;
            this.recordList[i] = item;
          }
        }
        if (!tem) {
          this.recordList.push(item);
        }
      } else {
        this.recordList.push(item);
      }
    },
    debounceHandleOk: debounce(
      function () {
        this.handleOk();
      },
      2000,
      true
    ),
    changInput(record, type) {
      let { weekHour, morningCourseHour, nightCourseHour } = record;
    },
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleOk() {
      let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
      // 处理三个都为undefined的时候
      this.recordList = this.recordList.filter((item) => {
        if (
          item.morningCourseHour === undefined &&
          item.weekHour === undefined &&
          item.nightCourseHour === undefined
        ) {
          return;
        } else {
          return item;
        }
      });
      // 单独处理三个中的某个为''的时候
      for (let i = 0; i < this.recordList.length; i++) {
        let item = this.recordList[i];
        // 为了方便后端，改造数据，将为空的值，设置为-1
        if (
          item.morningCourseHour === undefined ||
          item.morningCourseHour === ""
        ) {
          item.morningCourseHour = -1;
        }
        if (item.weekHour === undefined || item.weekHour === "") {
          item.weekHour = -1;
        }
        if (item.nightCourseHour === undefined || item.nightCourseHour === "") {
          item.nightCourseHour = -1;
        }
      }
      let data = {
        arrLessonId: this.arrLessonId,
        list: this.recordList,
        sectionSelectNumber: Number(sectionSelectNumber),
      };
      try {
        let res = await this.$api.ArrLessonSetting.updateTeaClassDialogList(
          data
        );
        if (res.code === "200") {
          this.$message.success("修改成功");
          this.closeSettingHourDialog();
          this.$parent.getTeaClassList();
          this.recordList = [];
          // this.getTeaClassList();
        } else {
          if (res.message === "设置的参数不能为空") {
            this.$message.warning("请设置课时数");
          } else {
            this.$message.warning(res.message);
          }
        }
      } catch (error) {
        this.$message.error("请求失败" + error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.amodel {
  .tips {
    color: #ffa750;
    font-size: 15px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #fff9f3;
    padding-left: 10px;
    box-sizing: border-box;
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
  /deep/ .ant-modal-footer {
    text-align: center;
  }
  /deep/ .ant-btn-primary {
    background-color: #1890ff;
  }
  /deep/ .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 10px;
  }
  .table-con {
    height: 400px;
    overflow-y: scroll;
  }
}
</style>