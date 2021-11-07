<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-07 17:22:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-22 14:57:41
-->
<!-- 教室安排 -->
<template>
  <div>
    <a-modal
      class="teacher-arrange"
      title="排课规则"
      :visible="ruleDrawerVisible"
      @cancel="onClose"
      :width="1300"
      :footer="null"
    >
      <ArrLessonRule type="isAdd" />
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ArrLessonRule from "../../../ArrLessonSetting/ArrLessonRule";
export default {
  components: { ArrLessonRule },
  data() {
    return {};
  },
  computed: {
    ...mapState("arrangeOperation", ["ruleDrawerVisible", "classId"]),
  },
  mounted() {},
  methods: {
    ...mapMutations("arrangeOperation", [
      "setRuleDrawerVisible",
      "refreshTableData",
    ]),
    onClose() {
      // 刷新行政班列表
      this.$parent.getAdminClassList();
      // 刷新左侧列表
      this.$parent.reGetPageData(this.classId);
      // 刷新表格数据
      this.refreshTableData(true);
      this.setRuleDrawerVisible(false);
    },
  },
};
</script>
<style lang="less" scoped>
.teacher-arrange {
  /deep/ .ant-modal-body {
    height: 670px;
    overflow: auto;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
}
</style>
