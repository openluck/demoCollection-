<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 18:56:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-26 11:38:31
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
          <a-icon type="info-circle" color="#ffbc7a" />
        </div>
        <p>批量设置教师课时后所选老师课时数将被覆盖！</p>
      </div>
      <template slot="footer">
        <a-button @click="ClosetipsDialogModel()">取消</a-button>
        <a-button class="themeBtn" @click="comfirmImport()">确定</a-button>
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
    TipsData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    ClosetipsDialogModel() {
      this.$emit("ClosetipsDialogModel", this.tipsDialogVisible);
    },
    comfirmImport() {
      this.$parent.seetingTeacherHour(this.TipsData);
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
    font-size: 19px;
  }
  .ant-modal-footer {
    border-top: 1px solid #e8e8e8;
  }
  /deep/ .anticon {
    color: #ffbc7a;
  }
}
</style>