<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 18:56:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-06 15:53:56
-->
<template>
  <div class="tips-dialog">
    <a-modal
      class="import-course"
      :visible="tipsDialogVisible"
      @cancel="ClosetipsDialogModel()"
      destroyOnClose
    >
      <div class="content">
        <div>
          <a-icon type="info-circle" />
        </div>
        <p>确定批量删除所选分班方案？</p>
      </div>
      <template slot="footer">
        <a-button @click="ClosetipsDialogModel()">取消</a-button>
        <a-button class="themeBtn" @click="comfirmImport()">确定删除</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    tipsDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    ClosetipsDialogModel() {
      console.log(this.tipsDialogVisible);
      this.$emit("ClosetipsDialogModel", this.tipsDialogVisible);
    },
    comfirmImport() {
      this.$parent.btnchDel();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  p {
    margin-left: 10px;
  }
  .ant-modal-footer {
    border-top: 1px solid #e8e8e8;
  }
  /deep/ .anticon {
    color: #ffbc7a;
  }
}
</style>