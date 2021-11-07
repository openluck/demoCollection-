<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 13:39:14
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:39:02
-->
<template>
  <div class="dialog">
    <a-modal
      :visible="teachGroupVisible"
      title="新增教研组"
      okText="确定"
      cancelText="取消"
      centered
      :destroyOnClose="true"
      class="amodel"
      width="700px"
      @cancel="closeTeachGroupDialog"
    >
      <!-- @ok="handleOk"
      @cancel="closeTeachGroupDialog" -->
      <div class="select-group">
        <div class="all-sle">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
            class="all-slebtn"
            v-if="showCheckAll"
          >
            全部
          </a-checkbox>
        </div>
        <div class="single-sle">
          <!-- <div
            class="sle-course"
            v-for="item in projectList"
            :key="item.projectGroupId"
          >
            <a-checkbox @change="onChange(e,item.projectGroupId)">
              {{ item.projectGroupName }}
            </a-checkbox>
          </div> -->
          <a-checkbox-group v-model="checkedList" @change="onChange">
            <a-checkbox
              v-for="item in projectList"
              :key="item.projectGroupId"
              :value="item.projectGroupId"
            >
              <span>{{ item.projectGroupName }}</span>
            </a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
      <!-- :show-total="(total) => `共${total}条数据`" -->
      <a-pagination
        v-model="current"
        :total="total"
        :show-total="(total) => `共${total}条数据`"
        @change="changePage"
        :current="current"
        :pageSize="pageSize"
        show-less-items
      />
      <template slot="footer">
        <div>
          <a-button @click="closeTeachGroupDialog"> 取消 </a-button>
          <a-button type="primary" :loading="bloading" @click="debounceHandleOk">
            确定
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { debounce } from "@/Utils/util.js";
export default {
  name: "TeachGroupDialog",
  props: {
    teachGroupVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      arrLessonId: "", // 排课方案id
      current: 1, // 当前请求页数，从1开始
      pageSize: 20, // 每页数据条数
      projectList: [],
      // projectNameList: [],
      total: 0,
      indeterminate: false, // 半选
      checkAll: false, // 全选
      // plainOptions: [],
      checkedList: [],
      bloading: false,
      showCheckAll: false,
    };
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
  },
  methods: {
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
      this.bloading = true;
      let data = {
        projectGroup: this.checkedList,
        arrLessonId: this.arrLessonId,
      };
      if (this.checkedList.length !== 0) {
        try {
          const res = await this.$api.ArrLessonSetting.saveTeachGroup(data);
          if (res.code === "200") {
            this.$message.success("添加教研组成功");
            this.closeTeachGroupDialog();
            this.$parent.getTeachGroup();
            this.showCheckAll = false;
            this.checkAll = false;
            this.bloading = false;
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败", +error);
        }
      } else {
        this.$message.warning("请选择教研组");
        this.bloading = false;
      }
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    closeTeachGroupDialog() {
      this.$emit("closeTeachGroupDialog", this.teachGroupVisible);
      this.checkedList = [];
      this.indeterminate = false;
      this.showCheckAll = false;
      this.checkAll = false;
    },

    /**
     * @name: 获取教研组
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getTeachGroupDialogList() {
      let data = {
        current: this.current,
        pageSize: this.pageSize,
        arrLessonId: this.arrLessonId,
      };
      let res = await this.$api.ArrLessonSetting.getTeachGroupDialogList(data);
      try {
        if (res.code === "200") {
          this.projectList = res.data.list;
          this.total = res.data.pagination.total;
          this.current = res.data.pagination.current;
          if (res.data.list.length !== 0) {
            this.showCheckAll = true;
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败!", +error);
      }
    },

    /**
     * @name: 切换页数
     * @msg:
     * @param {*} current 改变页数
     * @return {*}
     */
    changePage(current) {
      this.current = current;
      this.getTeachGroupDialogList();
      this.checkedList = [];
      this.checkAll = false;
      this.indeterminate = false;
    },

    /**
     * @name: 全选
     * @msg:
     * @param {*}
     * @return {*}
     */
    onCheckAllChange(e) {
      let arr = this.projectList.map((item) => item.projectGroupId);
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
    width: 140px;
    height: 48px;
    border: 1px solid transparent;
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
  /deep/ .ant-pagination-total-text {
    // margin-right: 89px;
    float: left;
  }
  /deep/ .ant-pagination {
    text-align: right;
  }
  /deep/ .ant-pagination-item-active {
    background-color: #409fff;
    border-color: #409fff;
  }
  /deep/ .ant-pagination-item-active a {
    color: #fff;
  }
  .all-slebtn {
    border: none;
    width: 65px;
    height: 26px;
  }
  .ant-checkbox-wrapper:nth-child(4n) {
    margin-right: 0;
  }
}
</style>