<!--
 * @Descripttion:  还原备份列表弹窗
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-09-30 09:11:40
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-11 14:34:30
-->
<template>
  <div class="dialog">
    <a-modal
      :visible="modelVisible"
      title="还原备份"
      okText="确定"
      cancelText="取消"
      centered
      @cancel="closeModel"
      destroyOnClose
      width="500px"
      height="700px"
      class="amodel"
    >
      <div v-if="backupList.length" class="content">
        <p class="tips" v-show="true">
          <a-icon style="margin-right: 10px" type="info-circle" />
          检测到您已将该方案进行了多次备份。
        </p>
        <div>
          <div class="title">备份方案</div>
          <a-radio-group
            name="radioGroup"
            @change="onChangeRadio"
            class="radio-group"
          >
            <a-radio
              :value="item.courseTimetableBackupId"
              v-for="item in backupList"
              :key="item.courseTimetableBackupId"
            >
              于{{ item.timeStamp.replace("T", " ") }} 备份
              <span @click="delBackUp"><a-icon type="close-circle" /></span>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <a-empty v-else />
      <template #footer>
        <div>
          <a-button @click="closeModel"> 取消 </a-button>
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
import { mapState } from "vuex";
export default {
  name: "",
  props: {
    planId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modelVisible: false,
      isLoading: false,
      backupList: [],
      backupId: "", // 备份方案id
    };
  },
  computed: {
    ...mapState("arrangeOperation", ["classId"]),
  },
  inject: ["getAdminClassList", "getAdminClassListBackup"],
  methods: {
    /**
     * @name: 弹窗显示
     */
    showModel() {
      this.modelVisible = true;
      this.getbackUpList();
    },
    /**
     * @name: 关闭弹窗
     */
    closeModel() {
      this.modelVisible = false;
    },
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async debounceHandleOk() {
      if (!this.backupList.length) {
        this.$message.warning("暂无备份数据");
      } else if (!this.backupId) {
        this.$message.warning("请选择需要需要还原的备份");
      } else {
        const res = await this.$api.ArrangeOperation.restoreCourseTable({
          backupId: this.backupId,
        });
        if (res.code === "200") {
          // 先在arrangeLesArrange中调用getAdminClassList，获取班级
          // 然后在center中获取表格数据
          // 然后在arrangeLesArrange调用右侧的数据
          this.$parent.fatchRuleIdTem = 0;
          this.$parent.fatchRuleId = undefined;
          await this.getAdminClassList();
          await this.$parent.getTimeTable(this.classId);
          await this.getAdminClassListBackup();
          await this.closeModel();
          this.$message.success("还原备份成功");
        } else {
          this.$message.warning(res.message);
        }
      }
    },
    /**
     * @name: 删除备份
     */
    delBackUp() {
      this.$confirm({
        title: "确定删除该方案备份？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          // this.isLoading = true;
          this.sureDelBackUp();
        },
      });
    },
    async sureDelBackUp() {
      const res = await this.$api.ArrangeOperation.delBackUp({
        backupId: this.backupId,
      });
      if (res.code === "200") {
        this.$message.warning("删除成功");
        this.getbackUpList();
        this.backupId = "";
      } else {
        this.$message.warning(res.message);
      }
    },
    /**
     * @name: 获取备份列表
     */
    async getbackUpList() {
      const res = await this.$api.ArrangeOperation.getbackUpList({
        planId: this.planId,
      });
      try {
        if (res.code === "200") {
          if (res.data === null) {
            res.data = [];
          }
          this.backupList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * @name: radio
     */
    onChangeRadio(e) {
      this.backupId = e.target.value;
    },
  },
};
</script>

<style lang="less" scoped>
.amodel {
  .tips {
    color: #ffa74e;
    font-size: 16px;
    background-color: #fff9f3;
    height: 30px;
    line-height: 30px;
    width: 76%;
    padding-left: 10px;
    box-sizing: border-box;
    margin: 0 auto;
    // position: absolute;
    // top: 37%;
    // left: 50%;
    // transform: translateX(-50%);
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
  /deep/ .ant-modal-body {
    padding: 10px 24px 10px;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    width: 33%;
    margin-left: 100px;
    margin-bottom: 10px;
  }
  .title {
    margin-left: 80px;
    margin-top: 10px;
  }
}
</style>