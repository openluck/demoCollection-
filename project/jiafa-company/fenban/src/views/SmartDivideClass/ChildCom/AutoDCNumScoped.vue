<template>
  <div class="auto-DC-num-scoped">
    <a-drawer
      title="自动分班"
      placement="right"
      :maskClosable="false"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="590"
    >
      <!-- :zIndex="2000" -->
      <!-- 自动分班设置开班人数范围 -->
      <div class="divide-class-scoped">
        <div class="title">分班人数范围</div>
        <div class="scoped">
          <a-form-model :model="form" ref="ruleForm" :rules="rules">
            <div class="columns" style="display: flex">
              <a-form-model-item label="开班人数：" prop="stuStartRange">
                <a-input-number
                  v-model="form.stuStartRange"
                  :min="0"
                  style="width: 100px; text-align: center"
                  placeholder="0"
                  :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
                  :parser="(value) => value"
                />
              </a-form-model-item>
              <a-input
                style="
                  width: 40px;
                  border: 0;
                  pointer-events: none;
                  backgroundcolor: #fff;
                "
                placeholder="-"
                disabled
              />
              <a-form-model-item prop="stuEndRange">
                <a-input-number
                  v-model="form.stuEndRange"
                  :min="0"
                  style="width: 100px; text-align: center"
                  placeholder="0"
                  prop="stuEndRange"
                  :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
                  :parser="(value) => value"
                />
              </a-form-model-item>
            </div>
            <a-form-model-item
              label="分班规则："
              prop="prioritSet"
              style="display: flex"
            >
              <a-radio-group v-model="form.prioritSet">
                <a-radio value="0">优先定三</a-radio>
                <a-radio value="1">优先定二</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              label="行政班数量："
              prop="classCount"
              style="display: flex"
            >
              <a-checkbox v-model="cheched">保留原行政班</a-checkbox>
              <a-input-number
                v-model="form.classCount"
                @change="inputChange"
                placeholder="0"
                :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
                :parser="(value) => value"
                :min="0"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }"
      >
        <a-button @click="onClose">取消</a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          type="primary"
          @click="handleOk"
          :loading="loading"
          >开始分班</a-button
        >
      </div>
    </a-drawer>
  </div>
</template>
 
<script>
/**
 * @description 导入分班
 * @date 2021-4-2 13:10:37
 */
import eventBus from "@/Utils/eventBus";
import { mapActions } from "vuex";
export default {
  name: "AutoDCNumScoped",
  components: {},
  props: {
    planId: {
      type: String,
      require: true,
      default: () => ""
    }
  },
  data() {
    const validatePass = (_, value, callback) => {
      if (value === "") {
        callback(new Error("请输入最大开班人数"));
      } else {
        if (value < this.form.stuStartRange) {
          callback(new Error("起始人数不可超过截止人数"));
        }
        callback();
      }
    };
    const prioritSetValidator = (_, value, callback) => {
      if (value === "1") {
        callback(
          new Error(
            "优先定二：优先生成组合中两科不走班，该班级组合中单科进行走班"
          )
        );
      } else if (value === "0") {
        callback(
          new Error("优先定三：优先生成一个组合班级，该班级学生不走动上课")
        );
      } else {
        callback(new Error("请选择优先定二或优先定三"));
      }
    };
    return {
      form: {
        stuStartRange: "",
        stuEndRange: "",
        prioritSet: "",
        classCount: 0
      },
      cheched: true,
      visible: false,
      loading: false,
      count: 0,
      rules: {
        stuStartRange: [
          {
            required: true,
            message: "请输入最小开班人数",
            trigger: ["change", "blur"]
          }
        ],
        stuEndRange: [{ validator: validatePass, trigger: ["change", "blur"] }],
        prioritSet: [
          {
            required: true,
            validator: prioritSetValidator,
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  created() {
    eventBus.$off(["show-drawer", "get-plan-relevance-classcount"]);

    eventBus.$on("show-drawer", () => {
      this.showDrawer();
    });
    eventBus.$on("get-plan-relevance-classcount", () => {
      this.getPlanRelevanceClassCount();
    });
  },
  mounted() {},
  watch: {
    cheched(val) {
      if (val) {
        this.form.classCount = this.count;
      }
    }
  },
  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },

    // 开始分班按钮事件
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        const { stuStartRange, stuEndRange, prioritSet, classCount } =
          this.form;
        if (
          stuStartRange > -1 &&
          stuEndRange > -1 &&
          prioritSet !== "" &&
          classCount > -1
        ) {
          this.autoDivideClass();
        } else {
          return false;
        }
      });
    },
    // input
    inputChange(val) {
      const { count } = this;
      this.cheched = val === count;
    },
    // 获取机构下该方案下关联的班级数量
    async getPlanRelevanceClassCount() {
      try {
        const { planId } = this;
        const params = { planId };
        const res = await this.$api.chooseExam.getPlanRelevanceClassCount(
          params
        );

        if (res.code === "200") {
          const {
            data: { count }
          } = res;
          this.count = count;
          this.form.classCount = count;
        } else {
          this.$message.error("获取班级数量失败！" + res.message,5);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 自动分班
    async autoDivideClass() {
      try {
        this.loading = true;
        const {
          planId,
          form: { stuStartRange, stuEndRange, prioritSet, classCount }
        } = this;
        const params = {
          planId,
          stuStartRange,
          stuEndRange,
          prioritSet,
          classCount
        };
        const res = await this.$api.chooseExam.autoDivideClass(params);
        if (res.code === "200") {
          this.$message.success("自动分班完成！",5);
          this.visible = false;
          this.loading = false;
          this.$store.commit("adminClass/setIsFinishStatus", true);
          eventBus.$emit("close-detection-and-auto-modal");
          this.$emit("getBaseClassData");
          this.getSaveData();
        } else {
          this.$message.error("自动分班失败！" + res.message,5);
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        throw new Error(error);
      }
    }
  }
};
</script>
 
<style scoped lang="less">
.divide-class-scoped {
  /deep/.ant-form-item {
    margin-right: 0 !important;
  }
  .title {
    font-size: 16px;
  }
  /deep/.ant-form-item {
    display: flex;
  }
  .scoped {
    margin-top: 20px;
    margin-left: 40px;
  }
}
/deep/.ant-drawer-body {
  margin-top: 10px;
}
</style>