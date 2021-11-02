<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-03 13:55:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-01 20:06:07
-->

<!-- 教室安排 -->
<template>
  <a-modal
    title
    :visible="visible"
    :footer="null"
    class="deleModal"
    @cancel="() => deleOption(2)"
  >
    <div class="errorInfo">
      <a-icon type="exclamation-circle" class="errorNo" />
      <label>确定删除该{{ title }}安排？</label>
    </div>
    <div class="btnList">
      <a-button class="btnCancel" @click="() => deleOption(2)">取消</a-button>
      <a-button @click="() => deleOption(3)">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: ["visible", "title"],
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    deleOption(value) {
      this.$parent.deleModalTip(value);
    },
  },
};
</script>

<style lang="less" scoped>
.deleModal {
  /deep/ .ant-modal-header {
    text-align: left;
  }
  /deep/ .errorInfo {
    margin: 30px 0 20px;
    color: #323435;
    .errorOk svg,
    .errorNo svg {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      vertical-align: sub;
    }
    .errorOk {
      color: #1ba4b3;
    }
    .errorNo {
      color: #ffd6af;
    }
  }
  .btnList {
    text-align: right;
    .ant-btn {
      margin-left: 10px;
      background-color: #1ba4b3;
      color: #ffffff;
      border-color: #1ba4b3;
    }
    .btnCancel {
      background-color: #fff;
      color: #000000a6;
      border-color: #d9d9d9;
    }
  }
}
</style>
