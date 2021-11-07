<template>
  <div class="add-group">
    <!-- 父级抽屉 -->
    <a-drawer
      width="800"
      :closable="false"
      :visible="addGropuVisible"
      @close="handleClose"
      :maskClosable="false"
      :destroyOnClose="true"
      :keyboard="false"
    >
      <div slot="title" style="display: flex; justify-content: space-between">
        <div class="drawer-title">组内人员设置</div>
        <a @click="uploadPerson" style="font-size: 14px">上传人员</a>
      </div>
      <div
        class="subject-wrap"
        :class="isStuList ? 'subject-wrap-isStuList' : 'subject-wrap-unStuList'"
      >
        <div
          class="subject-G-item"
          v-for="item in combinationList"
          :key="item.combinationId"
        >
          <AddGroupSubGroup
            :combination="item"
            @handleInputValue="handleInputValue"
            @showChildrenDrawer="showChildrenDrawer"
          />
        </div>
      </div>
      <!-- 选择人员子级抽屉 -->
      <a-drawer
        width="1000"
        :closable="false"
        :visible="childrenDrawer"
        @close="onChildrenDrawerClose"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="false"
      >
        <ChooseStu
          :combination="combination"
          :groupId="groupId"
          @handleChooseStuNum="handleChooseStuNum"
        />
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
            borderRadius: '0 0 4px 4px',
          }"
        >
          <a-button style="margin-right: 8px" @click="onCancelChild"
            >取消</a-button
          >
          <a-button class="themeBtn" type="primary" @click="onCloseChild"
            >确定</a-button
          >
        </div>
      </a-drawer>

      <!-- 上传人员子级抽屉 -->
      <a-drawer
        width="620"
        title="上传人员到组内"
        :closable="false"
        :visible="uploadChildrenDrawer"
        @close="onUploadChildrenDrawerClose"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="false"
      >
        <div style="margin: 30px 10px; width: 100%">
          <span v-show="errorMb" class="error-mb" @click="uploadErrorTemplate"
            >下载错误信息模板</span
          >
          <a-upload-dragger
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="headers"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :before-upload="beforeUpload"
            :fileList="fileList"
            @change="handleChange"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">支持扩展名：xls、xlsx</p>
            <div style="height: 10px"></div>
            <a
              class="down-a"
              @click="handleDownExcelTep"
              style="margin-top: 15px"
              >点我下载模板
            </a>
          </a-upload-dragger>
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
            borderRadius: '0 0 4px 4px',
          }"
        >
          <a-button
            style="margin-right: 8px"
            @click="onUploadChildrenDrawerClose"
            >取消</a-button
          >
          <a-button
            class="themeBtn"
            type="primary"
            :loading="uploadBtnLoading"
            @click="onUploadCloseChild"
            >确定
          </a-button>
        </div>
      </a-drawer>
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
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="margin-right: 8px" @click="handleClose">取消</a-button>
        <a-button
          class="themeBtn"
          type="primary"
          @click="handleOk"
          :loading="handleOkLoading"
          >确定</a-button
        >
      </div>
    </a-drawer>
  </div>
</template>
 
<script>
/**
 * @description 添加分组抽屉
 * @date 2021-4-1 13:28:49
 */
import AddGroupSubGroup from "@/components/divide/AddGroupSubGroup";
import ChooseStu from "./ChooseStu";
import { baseUrl } from "@/Utils/global";
import { mapState } from "vuex";
import { downloadFile } from "@/Utils/util";
export default {
  name: "AddGroup",
  components: { AddGroupSubGroup, ChooseStu },
  props: {
    combinationList: {
      type: Array,
      require: true,
      default: () => [],
    },
    addGropuVisible: {
      type: Boolean,
      require: true,
      default: false,
    },
  },

  data() {
    return {
      childrenDrawer: false,
      uploadChildrenDrawer: false,
      combination: [],
      insertStu: 0,
      insertStuList: [],
      handleOkLoading: false, // 添加分组抽屉确定按钮loading状态
      combinationId: "", // 输入的某个组合id
      fileList: [],
      uploadBtnLoading: false,
      groupId: "",
      headers: {
        // 文件上传headers
        // authorization: "authorization-text",
        token: "",
        // orgCode: '',
      },
      fileUrl: "",
      errorMb: false,
      errorExcelurl: "",
    };
  },
  computed: {
    ...mapState("adminClass", ["isStuList", "createOrEdit"]),
    uploadAction() {
      return `${baseUrl}/Common/uploadExcel`;
    },
  },
  created() {
    const token = sessionStorage.getItem("fenban_token");
    this.headers.token = token;
  },
  mounted() {},
  methods: {
    showDrawer(groupId) {
      this.groupId = groupId;
      this.visible = true;
    },
    // 点击上传人员
    uploadPerson() {
      this.uploadChildrenDrawer = true;
    },

    // 确定上传
    onUploadCloseChild() {
      if (!this.fileUrl) return this.$message.warn("请上传文件！", 5);
      this.uploadGroupStuList();
    },
    // 关闭上传文件抽屉
    onUploadChildrenDrawerClose() {
      this.uploadChildrenDrawer = false;
      this.fileList = [];
      this.fileUrl = "";
      this.errorMb = false;
    },
    // 上传文件之前
    beforeUpload(file, fileList) {
      const isXLSX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        "application/vnd.ms-excel";
      if (!isXLSX) {
        this.$message.error("请上传xlsx文件！", 5);
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error("出错了"));
        });
      }
      this.fileList = [file];
    },
    // 上传文件事件
    handleChange(info) {
      this.fileList = info.fileList;
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        const res = info.file.response;
        if (res.code === "200") {
          //上传完成之后的路径
          this.fileUrl = res.data.excelurl;
          //上传的文件的size
          // this.fileSize = info.file.size;
          this.fileName = info.file.name;
        }
        this.$message.success(`${info.file.name} 上传成功！`, 5);
      } else if (info.file.status === "removed") {
        this.fileUrl = "";
        this.fileList = [];
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`, 5);
      }
    },
    // 关闭添加分组抽屉 事件
    handleClose() {
      this.$emit("closeAddGropuVisible");
    },
    // 添加分组 确定事件
    handleOk() {
      const { createOrEdit, groupId } = this;
      this.verifyIsInput()
        .then((res) => {
          if (res) {
            if (createOrEdit === "create") {
              this.$emit("addGroup");
            } else if (createOrEdit === "edit") {
              this.$emit("editGroup", groupId);
            }
          } else {
            this.$message.warn("请输入或选择进入组合内的人员！", 5);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 验证是否输入人数或选择人数
    verifyIsInput() {
      return new Promise((resolve, reject) => {
        try {
          const { combinationList } = this;
          const combinationListFilter = combinationList.filter((item) => {
            if (item.insertStu) {
              return item;
            }
          });
          // 是否有选择了人数的组合
          resolve(combinationListFilter.length);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 打开子抽屉 combination为点击的 科目组合
    showChildrenDrawer(combination) {
      this.combination = combination;
      this.childrenDrawer = true;
    },
    // 关闭选择人员子抽屉
    onChildrenDrawerClose() {
      this.childrenDrawer = false;
    },
    // 人员选择确定事件
    onCloseChild() {
      this.childrenDrawer = false;
      this.emitPrentsIsStuList();
    },
    // 取消人员选择
    onCancelChild() {
      this.childrenDrawer = false;
    },
    // 保存组合内选择了的人数（有人员名单），前端缓存。 ChooseStu子组件  -->选择事件emit
    handleChooseStuNum(data) {
      const dataType = Object.prototype.toString.call(data).slice(8, -1);
     if (dataType === "Number") {
        this.insertStu = data;
      } else if (dataType === "String") {
        this.insertStu = 0;
      } else if (dataType === "Array") {
        this.insertStu = data.length;
        this.insertStuList = data;
      }
      // 进入的人数
      // dataType === "Number"
      //   ? (this.insertStu = data)
      //   : // 选择的人员
      //   dataType === "Array"
      //   ? (() => {
      //       this.insertStu = data.length;
      //       this.insertStuList = data;
      //     })()
      //   : "";
      // dataType === 'Array' ? this.insertStuList = data : '';
    },

    // 触发父组件 SmartDivideClass 更改props
    emitPrentsIsStuList() {
      const type = "isStuList"; // 有人员名单情况下
      const {
        combination: { combinationId },
        insertStu,
        insertStuList,
      } = this;
      const obj = { type, combinationId, insertStu, insertStuList };
      this.$emit("saveCombinationListByChooseStuEvent", obj);
      // 将上次选择的数据清除
      Object.assign(this, {
        combinationId: "",
        insertStu: "",
        insertStuList: [],
      });
    },

    // 保存组合内选择了的人数（无人员名单），前端缓存。 子组件emit
    handleInputValue(insertStu, combinationId) {
      this.insertStu = insertStu;
      this.combinationId = combinationId;
      // @TODO 优化  -每次输入框改变都会执行下列方法 ---> 提交时才执行。
      this.emitPrentsUnStuList();
    },
    // 触发父组件 SmartDivideClass 更改数据
    emitPrentsUnStuList() {
      const type = "unStuList"; // 无人员名单情况下
      const { insertStu, combinationId } = this;
      const obj = { type, combinationId, insertStu };
      this.$emit("saveCombinationListByChooseStuEvent", obj);
      // 将上次选择的数据清除
      Object.assign(this, {
        combinationId: "",
        insertStu: "",
      });
    },
    // 下载模板
    async handleDownExcelTep(e) {
      e.stopPropagation();
      try {
        const { isStuList } = this;
        let key;
        // 2fdf7a08a2f744d2ab7f59ab9ebc7bc2  有人员名单
        // 4ab2e054cf4e40199e9fb9cdb3fafe68  无人员名单
        isStuList
          ? (key = "2fdf7a08a2f744d2ab7f59ab9ebc7bc2")
          : (key = "4ab2e054cf4e40199e9fb9cdb3fafe68");
        const params = { key };
        const res = await this.$api.getDivideClassList.downExcelTep(params);
        downloadFile(res);
      } catch (error) {
        this.$message.error("下载失败！" + error, 5);
        throw new Error(error);
      }
    },
    // 导入文件
    async uploadGroupStuList() {
      try {
        this.uploadBtnLoading = true;
        const planId = this.$store.state.adminClass.planId;
        const { fileUrl } = this;
        const params = { planId, fileUrl };
        const res = await this.$api.chooseExam.uploadGroupStuList(params);

        if (res.code === "200") {
          this.uploadBtnLoading = false;
          this.uploadChildrenDrawer = false;
          this.$message.success("文件导入成功！", 5);
          // 上传完成之后关闭抽屉，刷新数据。
          this.$emit("getBaseClassData");
          this.$emit("closeAddGropuVisible");
          // 上传成功之后清空filelist
          this.fileList = [];
          this.fileUrl = "";
        } else if (res.code === "3001") {
          this.errorMb = true;
          this.errorExcelurl = res.message;
          this.uploadBtnLoading = false;
          this.$message.warning("请下载错误信息模板，进行查看错误信息", 5);
        } else {
          this.uploadBtnLoading = false;
          this.$message.error(res.message, 5);
        }
      } catch (error) {
        this.uploadBtnLoading = false;
        // console.log(error);
        // throw new Error(error);
      }
    },
    /**
     * @desc 下载错误信息模板
     */
    async uploadErrorTemplate() {
      let data = {
        excelurl: this.errorExcelurl,
      };
      const errorRes = await this.$api.chooseExam.downExcelError(data);
      downloadFile(errorRes, this.errorExcelurl);
    },
  },
};
</script>
 
<style scoped lang="less">
/deep/.ant-drawer-body {
  padding: 10px;
  .down-a {
    &:hover {
      text-decoration: underline;
    }
  }
}
.subject-wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.subject-wrap-isStuList {
  &::after {
    height: 0;
    width: 20%;
    content: "";
    min-width: 320px;
  }
}
.subject-wrap-unStuList {
  &::after {
    height: 0;
    width: 20%;
    content: "";
    min-width: 295px;
  }
}
.error-mb {
  color: red;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>