<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 16:03:39
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:57:08
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
      width="800px"
      height="700px"
      class="amodel"
    >
      <div class="table-con">
        <a-table
          :columns="columns"
          :data-source="dataSourse"
          :rowKey="(record) => record.courseId"
          :row-selection="rowSelection"
          :row-class-name="rowClassName"
          :pagination="false"
          :scroll="{ y: 'calc(100vh - 414px)' }"
        >
          <template slot="weekHour" slot-scope="text, record">
            <!-- {{ record }} -->
            <a-input-number
              id="weekHour"
              v-model="record.weekHour"
              @blur="onBlur(record, 1)"
              @pressEnter="onBlur(record, 1)"
              placeholder="0"
              :min="0"
              :max="999"
              @focus="onFocus(record, 1)"
            />
          </template>
          <template slot="morningCourseHour" slot-scope="text, record">
            <!--  :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              v-model="record.morningCourseHour"
              id="morningCourseHour"
              @blur="onBlur(record, 2)"
              @pressEnter="onBlur(record, 2)"
              placeholder="0"
              :min="0"
              :max="999"
              @focus="onFocus(record, 2)"
            />
          </template>
          <template slot="nightCourseHour" slot-scope="text, record">
            <!-- :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              id="nightCourseHour"
              v-model="record.nightCourseHour"
              @blur="onBlur(record, 3)"
              @pressEnter="onBlur(record, 3)"
              placeholder="0"
              :min="0"
              :max="999"
              @focus="onFocus(record, 3)"
            />
          </template>
        </a-table>
      </div>
      <template slot="footer">
        <div>
          <a-button @click="closeSettingHourDialog"> 取消 </a-button>
          <a-button
            type="primary"
            :loading="isLoading"
            @click="debounceHandleOk"
          >
            确定
          </a-button>
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
  name: "",
  data() {
    return {
      columns,
      dataSourse: [], //表格数据
      arrLessonId: "",
      recordList: [], //修改过的表格项
      courseSeleList: [], //课程选中列表
      isLoading: false, //点击确定
      tempHour: {
        weekHour: 0,
        morningCourseHour: 0,
        nightCourseHour: 0,
      },
    };
  },
  computed: {
    ...mapState("arrangeOperation", ["settingHourVisible"]),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.courseSeleList = selectedRows;
        },
      };
    },
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
    ...mapMutations("arrangeOperation", ["setSettingHourVisible"]),
    closeSettingHourDialog() {
      this.setSettingHourVisible(false);
      // this.$emit("closeSettingHourDialog", this.settingHourVisible);
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
        isFilter: true,
      };
      try {
        const res = await this.$api.ArrangeOperation.getTeaClassDialogList(
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
      let { weekHour, morningCourseHour, nightCourseHour, id } = record;
      if (
        weekHour === null &&
        morningCourseHour === null &&
        nightCourseHour === null
      ) {
        // this.$message.warning("课时不能设置为空");
        // this.fillterArr(record);
        // !weekHour && !morningCourseHour && !nightCourseHour
        return;
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
          this.$message.warning(
            "周正课时只能设置0,0.5,正整数，早自习，晚自习可以设置为0,正整数"
          );
          if (type === 1) {
            record.weekHour = "";
            // delete record.weekHour;
          } else if (type === 2) {
            record.morningCourseHour = "";
            // delete record.morningCourseHour;
          } else {
            record.nightCourseHour = "";
            // delete record.nightCourseHour;
          }
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
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleOk() {
      if (this.isLoading) {
        return;
      }
      if (!this.courseSeleList.length) {
        this.$message.info("请先选择要添加的课程",5);
      } else {
        this.isLoading = true;
        let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
        this.recordList.forEach((item) => {
          delete item.courseName;
        });

        // 处理三个都为null的时候
        this.recordList = this.recordList.filter((item) => {
          // !item.morningCourseHou为真  !0的时候也为真
          if (
            item.morningCourseHour === null &&
            item.weekHour === null &&
            item.nightCourseHour === null
          ) {
            return;
          } else {
            return item;
          }
        });

        // 单独处理三个中的某个为null的时候
        for (let i = 0; i < this.recordList.length; i++) {
          let item = this.recordList[i];
          // 为了方便后端，改造数据，将为空的值，设置为0
          if (
            item.morningCourseHour === null ||
            item.morningCourseHour === ""
          ) {
            item.morningCourseHour = 0;
          }
          if (item.weekHour === null || item.weekHour === "") {
            item.weekHour = 0;
          }
          if (item.nightCourseHour === null || item.nightCourseHour === "") {
            item.nightCourseHour = 0;
          }

          if (item.morningCourseHour === undefined) {
            item.morningCourseHour = 0;
          }
          if (item.weekHour === undefined) {
            item.weekHour = 0;
          }
          if (item.nightCourseHour === undefined) {
            item.nightCourseHour = 0;
          }
        }

        let selectArr = [];
        this.courseSeleList.map((item) => {
          const changeItem = this.recordList.find((recordItem) => {
            return recordItem.courseId === item.courseId;
          });
          if (changeItem) {
            selectArr.push({
              subjectId: item.courseId,
              weekTimeHour: changeItem.weekHour,
              morningTimeHOur: changeItem.morningCourseHour,
              nightTimeHour: changeItem.nightCourseHour,
            });
          } else {
            selectArr.push({
              subjectId: item.courseId,
              weekTimeHour: 0,
              morningTimeHOur: 0,
              nightTimeHour: 0,
            });
          }
        });

        let data = {
          sectionSelectNumber: parseInt(sectionSelectNumber),
          planId: this.arrLessonId,
          selectArr: selectArr,
        };
        try {
          let res = await this.$api.ArrangeOperation.addLessonInType(data);
          if (res.code === "200") {
            this.$message.success("修改成功",5);
            this.closeSettingHourDialog();
            this.$parent.getLessonList();
            this.recordList = [];
            this.isLoading = false;
          } else {
            this.isLoading = false;
            if (res.message === "设置的参数不能为空",5) {
              this.$message.warning("请设置课时数",5);
            } else {
              this.$message.warning(res.message,5);
            }
          }
        } catch (error) {
          this.$message.error("请求失败", error,5);
        }
      }
    },
    onFocus(record, num) {
      // console.log("record", record);
      // if (num === 1) {
      //   this.tempHour.weekHour = record.weekHour;
      // } else if (num === 2) {
      //   this.tempHour.morningCourseHour = record.morningCourseHour;
      // } else {
      //   this.tempHour.nightCourseHour = record.nightCourseHour;
      // }
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
    // height: 518px;
    overflow-y: scroll;
  }
}
</style>