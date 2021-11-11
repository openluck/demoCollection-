<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 13:39:14
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-30 09:44:19
-->
<template>
  <div class="dialog">
    <!-- @ok="handleOk"
      @cancel="CloseOutDialogModel" -->
    <a-modal
      :visible="outputVisible"
      title="导出选择"
      okText="确定"
      cancelText="取消"
      centered
      :destroyOnClose="true"
      width="592px"
      height="552px"
      class="amodel"
      @cancel="CloseOutDialogModel"
    >
      <div class="select-group">
        <div class="all-sle">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全部
          </a-checkbox>
        </div>
        <div class="single-sle">
          <a-checkbox-group v-model="checkedList" @change="onChange">
            <a-checkbox
              v-for="item in projectList"
              :key="item.id"
              :value="item.id"
            >
              <span>{{ item.project }}</span>
            </a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
      <template slot="footer">
        <a-button key="back" @click="CloseOutDialogModel"> 取消 </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="bLoading"
          @click="handleOk"
        >
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { downloadFile } from "../../../../../Utils/util";
export default {
  name: "TeachGroupDialog",
  props: {
    outputVisible: {
      type: Boolean,
      default: false,
    },
    outputArrLessonId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      current: 2,
      arrLessonId: "", // 排课方案id
      current: 1, // 当前请求页数，从1开始
      pageSize: 20, // 每页数据条数
      projectList: [
        {
          id: 1,
          project: "年级课表",
        },
        {
          id: 2,
          project: "班级课表",
        },
        {
          id: 3,
          project: "教师课表",
        },
        {
          id: 4,
          project: "学生课表",
        },
      ],
      // projectNameList: [],
      total: 0,
      indeterminate: false, // 半选
      checkAll: false, //
      // plainOptions: [],
      checkedList: [],
      bLoading: false,
    };
  },
  mounted() {},
  methods: {
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleOk() {
      const key = "updatable";
      if (this.checkedList.length === 0) {
        this.$message.warning("请选择需要导出的课表类型");
      } else {
        this.$message.loading({ content: "下载中...", key, duration: 0 });
        this.bLoading = true;
        let data = {
          arrLessonId: this.outputArrLessonId,
          list: this.checkedList,
        };
        try {
          const res = await this.$api.ArrLessonSetting.exportArrLesson(data);
          downloadFile(res, 1);
          if (downloadFile) {
            this.bLoading = false;
            this.$message.destroy();
            this.$message.success({ content: "下载成功!", key, duration: 2 });
            this.checkedList = [];
            this.indeterminate = false;
            this.checkAll = false;
          }
        } catch (error) {
          this.$message.error("请求失败", +error);
        }
      }
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseOutDialogModel() {
      this.$emit("CloseOutDialogModel", this.outputVisible);
      this.checkedList = [];
      this.indeterminate = false;
    },

    /**
     * @name: 全选
     * @msg:
     * @param {*}
     * @return {*}
     */
    onCheckAllChange(e) {
      // let arr = this.projectList.map((item) => item.projectGroupId);
      // this.checkedList = e.target.checked ? arr : [];
      // this.indeterminate = false;
      // this.checkAll = e.target.checked;
      let arr = this.projectList.map((item) => item.id);
      this.checkedList = e.target.checked ? arr : [];
      this.indeterminate = false;
      this.checkAll = e.target.checked;
    },

    /**
     * @name: 单选
     * @msg:
     * @param {*} checkedList
     * @return {*}
     */
    onChange(checkedList) {
      this.checkedList = checkedList;
      this.indeterminate =
        checkedList.length && checkedList.length < this.projectList.length;
      this.checkAll = checkedList.length === this.projectList.length;
    },
  },
};
</script>

<style lang="less" scoped>
.amodel {
  .select-group {
    .single-sle {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 24px;
      .sle-course {
        width: 120px;
        height: 48px;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgb(0 0 0/2%);
        box-sizing: border-box;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
        border-color: #d9d9d9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        margin-top: 16px;
      }
    }
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
  /deep/ .ant-modal-footer {
    text-align: center;
  }
  /deep/ .ant-checkbox-group {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  /deep/ .ant-checkbox-wrapper {
    width: 120px;
    height: 48px;
    border: 1px solid transparent;
    // box-shadow: 0 2px 0 rgb(0 0 0/2%);
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    margin-top: 16px;
    margin-left: 0;
  }
  /deep/ .ant-checkbox {
    top: 0;
  }
}
</style>