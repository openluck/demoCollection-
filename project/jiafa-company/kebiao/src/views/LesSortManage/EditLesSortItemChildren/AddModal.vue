<!--
 * @Descripttion: 新增编辑节次项弹窗
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-06 10:07:13
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-26 11:25:57
-->
<template>
  <GlobalModal
    :visible="addLesSortModalVisi"
    :title="title"
    :width="480"
    :defaultBtn="false"
    @cancel="$parent.addLesSortModalVisi = false"
  >
    <a-form-model
      class="add-lesSort-modal-form"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 6 ,offset: 1}"
      :wrapper-col="{ span: 14 }"
    >

      <a-form-model-item
        style="margin-bottom:8px"
        label="节次类型"
        prop="lesSortType"
      >
        <a-select
          v-model="form.lesSortType"
          :options="lesSortTypeList"
          :disabled="status"
        >
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.lesSortType==='1'"
        style="margin-bottom:8px"
        label="是否自习"
        prop="lesType"
      >
        <a-radio-group
          v-model="form.lesType"
          :options="lesTypeList"
        >
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        ref="lesSortName"
        label="节次项名称"
        prop="lesSortName"
      >
        <InputSuffix
          v-model.trim="form.lesSortName"
          @blurEvent="$refs.lesSortName.onFieldBlur()"
        />
      </a-form-model-item>
      <a-form-model-item
        style="margin-bottom:0px"
        label="展示形式"
        prop="showType"
      >
        <a-radio-group
          v-model="form.showType"
          :options="showTypeList"
          :disabled="form.lesSortType==='1'"
        >
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>

    <template #selfBtn>
      <div style="text-align:center">
        <a-button
          type="default"
          @click="$parent.addLesSortModalVisi = false"
        >取消</a-button>
        <a-button
          type="primary"
          @click="save"
        >确定</a-button>
      </div>
    </template>
  </GlobalModal>
</template>

<script>
import InputSuffix from "../../../components/InputSuffix.vue";
import GlobalModal from "@/components/common/GlobalModal";

export default {
  name: "",
  components: { InputSuffix, GlobalModal },
  props: {
    addLesSortModalVisi: { //显隐
      type: Boolean
    },
    status: { //状态
      type: Boolean
    },
    itemData: { //表单数据
      type: Object,
      default: () => { }
    }
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (this.$parent.lesSortList.some((i) => i.lesSortName === value && (this.status ? i.lesSortIndex !== this.form.lesSortIndex : true))) {
        callback(new Error('节次名称重复'));
      } else {
        callback();
      }
    };
    return {
      form: { ...this.itemData },
      rules: {
        lesSortName: [
          { required: true, message: "请填写节次名称", trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        lesSortType: [{ required: true }],
        lesType: [{ required: true }],
        showType: [{ required: true }]
      }
    };
  },
  computed: {
    lesSortTypeList() {
      return this.$store.state.codeTable.lesSortTypeList
    },
    lesTypeList() {
      return this.$store.state.codeTable.lesTypeList
    },
    showTypeList() {
      return this.$store.state.codeTable.showTypeList
    },
    title() {
      if (this.status) {
        return "编辑节次";
      }
      return "新增节次";
    }
  },
  watch: {
    'form.lesSortType'(val) {
      val === "1" ? this.form.showType = "2" : ""
    }
  },
  created() { },
  mounted() {
    // console.log("itemData", this.itemData);
  },
  methods: {
    save() {
      // console.log("itemData", this.itemData);
      // console.log("form", this.form);

      this.$refs.ruleForm.validate((res) => {
        if (res) {
          this.$emit('saveItem', this.form)
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.add-lesSort-modal-form {
  padding: 40px;
}
</style>
