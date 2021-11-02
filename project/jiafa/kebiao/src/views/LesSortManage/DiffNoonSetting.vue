<!--
 * @Descripttion: 时段设置
 * @version: 
 * @Author: YanQY
 * @Date: 2021-07-29 10:05:53
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-24 09:20:18
-->
<template>
  <div class="yqy-diffnoon-setting">
    <h3 class="title">时段设置</h3>
    <a-button type="primary" @click="addItem">
      <svg-icon
        icon-class="com_add"
        style="width: 14px; margin-right: 8px"
      />添加时段
    </a-button>
    <a-table
      class="table"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :loading="tableLoading"
      :rowKey="(row) => row.diffNoonId"
    >
      <template v-slot:handle="text, row">
        <div v-if="row.diffNoonType === '2'">
          <span @click="editItem(row)" class="btn">
            <svg-icon
              icon-class="com_edit"
              style="fontsize: 14px; margin-right: 6px"
            />
            <span>编辑</span>
          </span>
          <span @click="deleteItem(row)" class="btn">
            <svg-icon
              icon-class="com_delete"
              style="fontsize: 14px; margin-right: 6px"
            />
            <span>删除</span>
          </span>
        </div>
      </template>
    </a-table>

    <GlobalModal
      :visible="visible"
      :title="title"
      :width="416"
      @cancel="visible = false"
      :defaultBtn="false"
    >
      <a-form-model
        class="yqy-diffnoon-modal-form"
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item
          label="时段名称"
          prop="diffNoonName"
          ref="diffNoonName"
        >
          <InputSuffix
            v-model.trim="form.diffNoonName"
            placeholder="请输入时段名称"
            @blurEvent="$refs.diffNoonName.onFieldBlur()"
          />
        </a-form-model-item>
        <a-form-model-item
          v-if="!form.diffNoonId"
          label="编码"
          prop="diffNoonCode"
          ref="diffNoonCode"
        >
          <InputSuffix
            v-model.trim="form.diffNoonCode"
            placeholder="请输入编码"
            @blurEvent="$refs.diffNoonCode.onFieldBlur()"
          />
        </a-form-model-item>
      </a-form-model>

      <div style="text-align: center" slot="selfBtn">
        <a-button type="default" @click="visible = false">取消</a-button>
        <a-button type="primary" @click="save" :loading="buttonLoading"
          >确定</a-button
        >
      </div>
    </GlobalModal>
  </div>
</template>

<script>
import InputSuffix from "../../components/InputSuffix";
import GlobalModal from "@/components/common/GlobalModal";

const columns = [
  {
    title: "名称",
    dataIndex: "diffNoonName",
    key: "diffNoonName",
  },
  {
    title: "编号",
    dataIndex: "diffNoonCode",
    key: "diffNoonCode",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    // dataIndex: "updateDate",
    // key: "updateDate",
    ellipsis: true,
  },
  {
    title: "操作",
    width: 210,
    scopedSlots: { customRender: "handle" },
  },
];
export default {
  name: "",
  components: { InputSuffix, GlobalModal },
  data() {
    let validateRepetition = (rule, value, callback) => {
      if (
        this.data.some(
          (i) =>
            i.diffNoonName === value &&
            (this.tempName ? value !== this.tempName : true)
        )
      ) {
        return callback(new Error("时段名称重复"));
      } else {
        callback();
      }
    };
    let validateCodeRepetition = (rule, value, callback) => {
      console.log(value);
      var r = /^[^\u4e00-\u9fa5]+$/;
      if (!r.test(value)) {
        return callback(new Error("不能包含中文"));
      }
      if (
        this.data.some(
          (i) =>
            i.diffNoonCode === value &&
            (this.tempCode ? value !== this.tempCode : true)
        )
      ) {
        return callback(new Error("编码重复"));
      } else {
        callback();
      }
    };
    return {
      columns,
      data: [],
      visible: false, //modal显隐
      tableLoading: false, //表格loading
      buttonLoading: false, //按钮loading
      tempName: null, //临时名称，用于查重
      tempCode: null, //临时名称，用于查重
      form: {
        diffNoonName: "",
        diffNoonCode: "",
      },
      rules: {
        diffNoonName: [
          {
            required: true,
            message: "请输入时段名称",
            trigger: ["blur", "change"],
          },
          { validator: validateRepetition, trigger: ["blur", "change"] },
        ],
        diffNoonCode: [
          {
            required: true,
            message: "请输入编码",
            trigger: ["blur", "change"],
          },
          { validator: validateCodeRepetition, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  computed: {
    title() {
      if (this.form.diffNoonId) {
        return "编辑时段";
      }
      return "添加时段";
    },
  },
  created() {},
  mounted() {
    this.getDiffNoonList();
  },
  methods: {
    blurEvent() {
      console.log(222);
      this.$refs.diffNoonName.onFieldBlur();
    },
    addItem() {
      this.form = {
        diffNoonName: "",
        diffNoonCode: "",
      };
      this.tempName = "";
      this.tempCode = "";
      this.visible = true;
    },
    editItem(row) {
      console.log(row);
      this.form = { ...row };
      this.tempName = row.diffNoonName;
      this.tempCode = row.diffNoonCode;
      this.visible = true;
    },
    async deleteItem({ diffNoonId, diffNoonCode }) {
      this.$confirm({
        title: "确定要删除该时段内容吗？",
        okText: "确定删除",
        icon: () => (
          <svg-icon
            class="anticon"
            icon-class="com_warn"
            style="fontSize:20px;cursor: default"
          />
        ),
        width: 360,
        onOk: async () => {
          const result = await this.deleteDiffNoon({
            diffNoonId,
            diffNoonCode,
          });
          if (result) this.getDiffNoonList();
        },
      });
    },
    async save() {
      this.$refs.form.validate(async (res) => {
        if (res) {
          let result;
          if (this.form.diffNoonId) {
            result = await this.updateDiffNoon(this.form);
          } else {
            result = await this.addDiffNoon(this.form);
          }
          console.log("result", result);
          if (result) {
            this.getDiffNoonList();
            this.visible = false;
          }
        }
      });
    },
    async getDiffNoonList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.diffNoonSetting.getDiffNoonList();
        if (res.code === "200" && res.result) {
          console.log(111);
          this.data = res.data;
        } else {
          this.data = [];
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },
    async addDiffNoon(data) {
      this.buttonLoading = true;

      try {
        const res = await this.$api.diffNoonSetting.addDiffNoon(data);
        if (res.code === "200" && res.result) {
          this.$message.success("添加成功");
          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.buttonLoading = false;
      }
    },
    async updateDiffNoon(data) {
      this.buttonLoading = true;

      try {
        const res = await this.$api.diffNoonSetting.updateDiffNoon(data);
        if (res.code === "200" && res.result) {
          this.$message.success("编辑成功");
          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.buttonLoading = false;
      }
    },
    async deleteDiffNoon(data) {
      try {
        const res = await this.$api.diffNoonSetting.deleteDiffNoon(data);
        if (res.code === "200" && res.result) {
          this.$message.success("删除成功");
          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.yqy-diffnoon-setting {
  padding: 24px;
  // height: 100%;
  .title {
    margin: 0;
    padding: 0;
    font-size: 18px;
    color: #303233;
    margin-bottom: 18px;
    line-height: 16px;
  }
  .table {
    margin-top: 24px;
    .btn {
      color: #797c7f;
      cursor: pointer;
      &:hover {
        color: @primary-color;
      }
    }
    .btn + .btn {
      margin-left: 24px;
    }
  }

  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    padding: 16px;
  }

  /deep/.ant-table-tbody .ant-table-row-cell-break-word {
    background-color: #fff;
  }
}
.yqy-diffnoon-modal-form {
  padding: 40px;
  padding-bottom: 16px;
}
</style>
