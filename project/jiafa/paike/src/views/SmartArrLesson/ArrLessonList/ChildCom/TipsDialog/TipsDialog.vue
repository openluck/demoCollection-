<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 18:56:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-21 15:41:42
-->
<template>
  <div class="tips-dialog">
    <a-modal
      class="import-course"
      :visible="tipsDialogVisible"
      @cancel="ClosetipsDialogModel()"
      destroyOnClose
      title="方案发布"
    >
      <div class="content">
        <!-- <div>
          <a-icon type="info-circle" />
        </div> -->
        <p style="text-align: center">
          检测到您该方案下的排课未完成,无法进行发布，
        </p>
        <p class="xgks" @click="goArrLesson">去排课</p>
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
    TipsRecord: {
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

    ...mapMutations("stateList", ["setTeacherGroupId", "setOnLi2"]),
    goArrLesson() {
      // this.$router.push({
      //   path: "/TeacherLesArrange",
      //   query: {
      //     teacherGroupId: this.teacherGroupId,
      //   },
      // });
      // // this.setTeacherGroupId(this.teacherGroupId);
      // this.setOnLi2();
      this.$parent.continueArrLesson(this.TipsRecord);
      this.ClosetipsDialogModel();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  font-size: 18px;
  // display: flex;
  // justify-content: center;
  // align-content: center;
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
    margin-left: 9%;
  }
  p {
    margin-top: 0;
    margin-bottom: 0;
    text-align: center;
  }
}
/deep/ .ant-modal-title {
  text-align: left;
}
</style>