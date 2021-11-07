<template>
  <div class="detection-and-auto">
    <a-modal
      class="detection-modal"
      v-model="visible"
      title="方案检测"
      :destroyOnClose="true"
      :width="530"
    >
      <div class="container" style="margin-top:10px">
        <div class="left" >
          <a-icon type="info-circle" style="font-size: 22px; color: #1ba4b3" />
        </div>
        <div class="right">
          <div>
            检测到您已完成<span style="color: #1ba4b3">学考</span>分班，可直接发布该方案！
          </div>
        </div>
      </div>

      <div  slot="footer">
        <a-button :disabled="btnsDisabled || releaseDisabled" @click="cancel"
          >取 消</a-button
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
import { mapState } from "vuex";
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
    // 是否完成
    ...mapState("adminClass", ["isFinish", "count", "divideclassType"]),
    // 分班类型： 选考分班还是学考分班 1 - 选考分班  2 - 学考分班
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
    showModal() {
      this.visible = true;
    },
    cancel() {
      this.visible = false;
    },
    // 点击自动分班
    handleAutoDivideClass() {
      this.btnsLoading = true;
      eventBus.$emit("show-drawer");
      eventBus.$emit("get-plan-relevance-classcount");
    },
    // 点击手动分班
    handleManualDivideClass() {
      this.cancel();
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
            // 取出 路由跳转
            const { planGroupId, selCourseName } = JSON.parse(
              sessionStorage.getItem("goDivideClassList")
            );
            this.$router.replace({
              path: "/DivideClassList",
              query: {
                id: planGroupId,
                name: selCourseName,
              },
            });
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