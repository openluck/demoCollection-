<template>
  <div class="detection-and-auto">
    <a-modal
      class="detection-modal"
      v-model="visible"
      title="方案检测"
      :destroyOnClose="true"
      :width="530"
    >
      <div class="container" style="margin-top: 10px">
        <div class="left">
          <a-icon type="info-circle" style="font-size: 22px; color: #1ba4b3" />
        </div>
        <div class="right">
          <div>
            检测到您已完成选考分班，可进行<span style="color: #1ba4b3"
              >学考分班</span
            >， 也可直接发布该方案！
          </div>
          <div class="tips">
            <div class="tips-con">
              <a-icon
                type="info-circle"
                style="font-size: 22px; color: #ffaa00"
              />
              <div style="margin-left: 10px">
                可选择不进行学考分班直接发布，则排课时无学考班级
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <a-button :disabled="btnsDisabled || releaseDisabled" @click="cancel"
          >取 消</a-button
        >
        <a-button
          class="yellowBtn"
          :loading="stBtnsLoading"
          :disabled="releaseDisabled"
          @click="handleLearnDivideClass"
          type="primary"
          >学考分班</a-button
        >
        <a-button
          class="themeBtn"
          :loading="releaseLoading"
          :disabled="btnsDisabled"
          @click="handleReleasePlan"
          type="primary"
          >发布方案</a-button
        >
      </div>
    </a-modal>
  </div>
</template>
 
<script>
/**
 * @description 检测分班是否完成，自动分班
 * @date 2021-4-2 13:47:35
 */
import eventBus from "@/Utils/eventBus";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "DetectionAndAuto",
  components: {},
  props: {
    planId: {
      type: String,
      require: true,
      default: () => "",
    },
  },
  data() {
    return {
      visible: false,
      stBtnsLoading: false,
      btnsDisabled: false,
      releaseLoading: false,
      releaseDisabled: false,
    };
  },
  computed: {
    // 从vuex中获取模态框的状态
    // 行政班级-查看人员名单弹窗状态
    ...mapState("adminClass", ["divideclassType"]),
  },
  created() {
    eventBus.$on("close-detection-and-auto-modal", () => {
      this.cancel();
    });
  },
  beforeDestroy() {
    // eventBus.$off(['close-detection-and-auto-modal'])
  },
  methods: {
    // 显示弹窗
    showModal() {
      this.visible = true;
    },
    // 关闭弹窗
    cancel() {
      this.visible = false;
    },
    // 点击学考分班
    async handleLearnDivideClass() {
      // console.log('学考检测');
      this.stBtnsLoading = true;
      this.btnsDisabled = true;
      await this.getBaseClassData();
      this.$store.commit("adminClass/setDCbtnLoadingStatus", true);
      this.$store.commit("adminClass/setDivideclassType", "2");
      this.$store.commit("adminClass/setPageContentLoading", true);

      setTimeout(() => {
        this.$store.commit("adminClass/setPageContentLoading", false);
        this.$store.commit("adminClass/setDCbtnLoadingStatus", false);
        this.cancel();
        this.stBtnsLoading = false;
        this.btnsDisabled = false;
      }, 1000);

    },
    // 获取组合和行政班级数据
    async getBaseClassData() {
      try {
        const params = { planId: this.planId, type: '1' };
        const res = await this.$api.chooseExam.getBaseClassData(params);
        if (res.code === "200") {
          this.$parent.groupList = [...res.data];
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 点击发布方案
    async handleReleasePlan() {
      this.releaseLoading = true;
      this.releaseDisabled = true;
      try {
        const { planId } = this;
        const res = await this.$api.getDivideClassList.inputDivideClass({
          divideSchemId: planId,
        });
        if (res.code === "200") {
          setTimeout(() => {
            this.$message.success("发布成功！", 5);
            this.releaseLoading = false;
            this.releaseDisabled = false;
            this.visible = false;
            this.$parent.getDivideClassTable();
          }, 1000);
        } else {
          this.$message.error("发布失败！" + res.message, 5);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.detection-modal {
  .container {
    padding: 10px;
    display: flex;
    align-items: center;
    .right {
      margin-left: 10px;
      .num {
        margin: 0 5px;
        font-weight: 600;
        font-size: 18px;
        font-style: italic;
      }
    }
  }
  .divide-class-scoped {
    margin-top: 15px;
    h4 {
      font-weight: normal;
    }
    .scoped {
      display: flex;
      margin-top: 10px;
      label {
        width: 100px;
      }
    }
  }
  .tips {
    position: absolute;
    top: 0%;
    background-color: #fffbe6;
    width: 100%;
    height: 30px;
    left: 0;
    .tips-con {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
}
/deep/ .ant-modal-body {
  position: relative;
}
</style>