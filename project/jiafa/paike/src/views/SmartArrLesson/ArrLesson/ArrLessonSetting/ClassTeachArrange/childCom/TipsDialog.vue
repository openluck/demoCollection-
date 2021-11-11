<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 18:56:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-21 15:18:21
-->
<template>
  <div class="tips-dialog">
    <a-modal
      class="import-course"
      :visible="tipsDialogVisible"
      @cancel="ClosetipsDialogModel()"
      destroyOnClose
      title="教师课时超出"
    >
      <div class="content">
        <!-- <div>
          <a-icon type="info-circle" />
        </div> -->
        <p style="text-align: center">
          当前已超过该教师的最大课时数<span class="xgks" @click="goTeacherGroup"
            >前往修改教师最大课时数</span
          >
        </p>
      </div>
      <template slot="footer">
        <a-button @click="ClosetipsDialogModel()">取消</a-button>
        <!-- <a-button class="themeBtn" @click="comfirmImport()">确定删除</a-button> -->
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "",
  props: {
    tipsDialogVisible: {
      type: Boolean,
      default: false,
    },
    teacherGroupId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    ClosetipsDialogModel() {
      this.$emit("ClosetipsDialogModel", this.tipsDialogVisible);
    },

    ...mapMutations("stateList", ["setTeacherGroupId", "setOnLi2"]),
    goTeacherGroup() {
      this.$router.push({
        path: "/TeacherLesArrange",
        query: {
          teacherGroupId: this.teacherGroupId,
        },
      });
      // this.setTeacherGroupId(this.teacherGroupId);
      this.setOnLi2();
      this.ClosetipsDialogModel();
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
  .xgks {
    display: inline-block;
    color: #3ca0ff;
    cursor: pointer;
    border-bottom: 1px solid #3ca0ff;
  }
}
/deep/ .ant-modal-title {
  text-align: left;
}
</style>