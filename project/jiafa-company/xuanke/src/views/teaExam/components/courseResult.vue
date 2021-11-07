<template>
  <div class="curricula_variable_result">
    <div class="result_top">
      <span style="font-size: 18px; margin-right: 10px">
        <svg-icon
          icon-class="icon _back"
          :scale="0.8"
          @click.native="goback"
          style="margin-right: 4px; cursor: pointer"
        />
        选课结果
      </span>
      <span style="color: #9ea2a6">{{ courseGroupInfo.name }}</span>
    </div>

    <div class="result_bottom">
      <div class="tabs">
        <a-tabs default-active-key="1" @change="tabsChange">
          <a-tab-pane key="1" tab="选课结果明细">
            <div class="operation" style="margin-bottom: 15px">
              <div class="operation_left">
                <span>所属组合：</span>
                <a-select
                  v-model="fetchData.coursegroupitemids"
                  mode="multiple"
                  style="width: 300px"
                  @change="changeGroup"
                >
                  <a-select-option value="0"> 已选人员 </a-select-option>
                  <a-select-option value="-1"> 未选人员 </a-select-option>
                  <a-select-option
                    v-for="item in groupSelectList"
                    :key="item.courseGroupItemId"
                    :value="item.courseGroupItemId"
                    :disabled="
                      fetchData.coursegroupitemids.includes('0') ||
                      fetchData.coursegroupitemids.includes('-1')
                    "
                  >
                    {{ item.courseGroupItemName }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="operation_right">
                <span style="position: relative">
                  <a-input
                    v-model="fetchData.studentName"
                    placeholder="学生姓名"
                    style="width: 200px"
                  />
                  <svg-icon
                    @click.native="search()"
                    icon-class="icon_sousuo"
                    :scale="1.4"
                    style="
                      position: absolute;
                      right: 6px;
                      top: 0px;
                      cursor: pointer;
                    "
                  />
                </span>
                <a-button
                  @click="importExcel"
                  type="primary"
                  style="margin-left: 10px"
                >
                  <svg-icon
                    icon-class="icon_import"
                    :scale="0.8"
                    style="margin-right: 4px"
                  />
                  导入
                </a-button>
                <a-button
                  @click="exportExcel"
                  type="primary"
                  style="margin-left: 10px"
                >
                  <svg-icon
                    icon-class="icon_export"
                    :scale="0.8"
                    style="margin-right: 4px"
                  />
                  导出
                </a-button>
              </div>
            </div>

            <div class="table_list">
              <a-table
                :columns="columns"
                :data-source="dataList"
                size="middle"
                :loading="tableLoading"
                :pagination="pagination"
                :rowKey="(row) => row.studentSelectionId"
                bordered
              >
                <span slot="operation" slot-scope="text, record">
                  <!-- <a-button @click="deploy(record)">调配</a-button> -->
                  <span style="cursor: pointer" @click="deploy(record)">
                    <svg-icon
                      icon-class="icon_tiaopei"
                      :scale="0.8"
                      style="margin-right: 4px"
                    />
                    调配
                  </span>
                </span>
              </a-table>
            </div>
          </a-tab-pane>

          <a-tab-pane key="2" tab="选课结果统计">
            <a-radio-group
              button-style="solid"
              style="margin-bottom: 15px"
              v-model="radioGroupValue"
            >
              <a-radio-button
                value="1"
                style="
                  border-top-left-radius: 20px;
                  border-bottom-left-radius: 20px;
                "
              >
                课程总览
              </a-radio-button>
              <a-radio-button value="2"> 课程明细 </a-radio-button>
              <a-radio-button value="3"> 课程组合 </a-radio-button>
              <a-radio-button
                value="4"
                style="
                  border-top-right-radius: 20px;
                  border-bottom-right-radius: 20px;
                "
              >
                未选人员
              </a-radio-button>
            </a-radio-group>
            <div class="iframe" v-if="radioGroupValue === '1'">
              <iframe
                ref="iframe1"
                class="full"
                :src="pandect"
                frameborder="0"
              ></iframe>
            </div>
            <div class="iframe" v-if="radioGroupValue === '2'">
              <iframe
                ref="iframe2"
                class="full"
                :src="particulars"
                frameborder="0"
              ></iframe>
            </div>
            <!-- {{ group }} -->
            <br />
            <div class="iframe" v-if="radioGroupValue === '3'">
              <iframe
                ref="iframe3"
                class="full"
                :src="group"
                frameborder="0"
              ></iframe>
            </div>
            <!-- 未选人员 -->
            <div class="iframe" v-if="radioGroupValue === '4'">
              <iframe
                ref="iframe4"
                class="full"
                :src="oldChoosePeople"
                frameborder="0"
              ></iframe>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 学生调配弹窗 -->
    <a-modal
      class="deploy_modal"
      v-model="deployVisible"
      title="学生调配"
      :destroyOnClose="true"
      :maskClosable="false"
      width="600px"
    >
      <template slot="footer">
        <a-button type="primary" @click="deployConfirm"> 确定 </a-button>
        <a-button @click="deployClose"> 取消 </a-button>
      </template>

      <a-row class="combination_filtrate" style="margin-bottom: 20px">
        <a-col :span="4"> 组合筛选： </a-col>
        <a-col :span="20">
          <a-checkbox-group @change="changeCheckbox">
            <a-checkbox
              v-for="item in subjectList"
              :key="item.subjectId"
              :value="item.subjectId"
              style="margin: 0 20px 10px 0"
            >
              {{ item.subjectName }}
            </a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>

      <a-row class="curricula_variable_pattern">
        <a-col :span="4"> 选课组合： </a-col>
        <a-col :span="20">
          <a-radio-group v-model="radioValue" @change="changeRadio">
            <a-radio
              v-for="item in patternList"
              :key="item.courseGroupItemId"
              :value="item.courseGroupItemId"
              style="margin-bottom: 20px"
            >
              {{ item.courseGroupItemName }}
              <span
                style="
                  color: #3e86ce;
                  backgroundcolor: #f4f6f7;
                  padding: 2px 6px;
                  border-radius: 8px;
                  margin-left: 6px;
                "
                >{{ item.selectStuCount }}人已选</span
              >
            </a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 导入 -->
    <a-modal
      class="import_modal"
      v-model="importVisible"
      title="导入"
      :destroyOnClose="true"
      :maskClosable="false"
      width="600px"
    >
      <template slot="footer">
        <a-button type="primary" @click="importConfirm"> 确认导入 </a-button>
        <a-button @click="importClose"> 取消 </a-button>
      </template>
      <div class="upload">
        <p
          style="
            color: #2e8ae6;
            text-decoration: underline;
            margin-bottom: 20px;
            text-align: center;
            cursor: pointer;
          "
        >
          <span @click="uploadTemplate">下载模板</span>
        </p>
        <a-upload-dragger
          name="files"
          accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :multiple="false"
          :headers="headers"
          :action="baseUrl + 'api/StudentSelections/uploadExcel'"
          :beforeUpload="beforeUpload"
          @change="uploadChange"
          :fileList="fileList"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或将选定文件拖拽至框内上传</p>
          <p class="ant-upload-hint" style="margin-bottom: 10px">
            支持扩展名：Excel
          </p>
          <!-- <p style="color:#2E8AE6;text-decoration:underline;margin-bottom:20px;position:absolute;left:50%;margin-left:-28px;z-index:999999;">
            <span @click="uploadTemplate">下载模板</span>
          </p> -->
        </a-upload-dragger>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { downloadFile } from "../../../Utils/util";
import { baseUrl } from "../../../Utils/global";
const { pandect, particulars, group, oldChoosePeople } = window.g;
const columns = [
  {
    title: "学生姓名",
    dataIndex: "studentName",
    key: "studentName",
    width: "10%",
    scopedSlots: { customRender: "studentName" },
  },
  {
    title: "所属班级",
    dataIndex: "className",
    key: "className",
    width: "10%",
    scopedSlots: { customRender: "className" },
  },
  {
    title: "已选选考组合",
    dataIndex: "courseGroupItemName",
    key: "courseGroupItemName",
    width: "10%",
    scopedSlots: { customRender: "courseGroupItemName" },
  },
  {
    title: "已选学考组合",
    dataIndex: "xueKaoCombinationName",
    key: "xueKaoCombinationName",
    width: "10%",
    scopedSlots: { customRender: "xueKaoCombinationName" },
  },
  {
    title: "调配选考组合",
    dataIndex: "oldCourseGroupItemName",
    key: "oldCourseGroupItemName",
    width: "10%",
    scopedSlots: { customRender: "oldCourseGroupItemName" },
  },
  {
    title: "调配学考组合",
    dataIndex: "oldXueKaoCombinationName",
    key: "oldXueKaoCombinationName",
    width: "10%",
    scopedSlots: { customRender: "oldXueKaoCombinationName" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    width: "10%",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      baseUrl,
      xuanke_orgcode: "",
      courseGroupInfo: {},
      courseGroupId: "", // 活动id
      radioGroupValue: "1", // 选课统计内切换
      reload: true,
      groupSelectList: [], // 所属组合

      dataList: [], // 列表数据
      columns, //列表结构
      tableLoading: false,

      stuRecord: {}, // 选中的学生信息
      subjectList: [], //组合筛选
      patternList: [], //选课组合
      patternList1: [],
      deployVisible: false,
      radioValue: "", // radio选项

      importVisible: false,
      headers: {
        token: "",
      },
      fileList: [],
      excelurl: "", // 导入文件成功的地址

      fetchData: {
        coursegroupitemids: [], //所属组合
        studentName: "", //学生姓名
        current: 1, // 当前页
        pageSize: 10, // 每页显示的条数
        // type: "0"
      },

      //分页器
      pagination: {
        size: "middle",
        current: 1,
        showQuickJumper: true,
        showSizeChanger: false,
        total: 0,
        defaultPageSize: 10,
        // pageSizeOptions: ["10", "25", "50"],
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onSizeChange.bind(this), // 改变每页条数
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`,
      },
    };
  },
  watch: {
    "fetchData.coursegroupitemids"(newData, oldData) {
      // console.log("newData", newData, "oldData", oldData);
      if (newData.length > 1 && oldData.includes("0")) {
        this.fetchData.coursegroupitemids = ["-1"];
      } else if (newData.length > 1 && oldData.includes("-1")) {
        this.fetchData.coursegroupitemids = ["0"];
      } else if (newData.length > 1 && newData.includes("0")) {
        this.fetchData.coursegroupitemids = ["0"];
      } else if (newData.length > 1 && newData.includes("-1")) {
        this.fetchData.coursegroupitemids = ["-1"];
      }
    },
  },
  mounted() {
    this.headers.token = sessionStorage.getItem("xuanke_token");
    this.courseGroupInfo = JSON.parse(sessionStorage.getItem("courseResult"));

    this.courseGroupId = JSON.parse(
      sessionStorage.getItem("courseResult")
    ).courseGroupId;
    this.xuanke_orgcode = sessionStorage.getItem("xuanke_orgcode");
    // 获取所属组合
    this.getGroup();
    // 获取学生列表
    this.getStudentSelectionPageList();
    /* this.bus.$emit(
      "changeSelectedKey",
      "/TeacherExam"
    ) */
  },
  computed: {
    // 总览地址
    pandect() {
      return (
        pandect.url +
        "?CourseGroupId=" +
        this.courseGroupId +
        "&" +
        "OrganizationId=" +
        this.xuanke_orgcode +
        "&" +
        pandect.shareToken
      );
    },
    // 明细地址
    particulars() {
      return (
        particulars.url +
        "?CourseGroupId=" +
        this.courseGroupId +
        "&" +
        "OrganizationId=" +
        this.xuanke_orgcode +
        "&" +
        particulars.shareToken
      );
    },
    // 组合地址
    group() {
      return (
        group.url +
        "?CourseGroupId=" +
        this.courseGroupId +
        "&" +
        "OrganizationId=" +
        this.xuanke_orgcode +
        "&" +
        group.shareToken
      );
    },
    // 新增未选人员
    oldChoosePeople() {
      return (
        oldChoosePeople.url +
        "?CourseGroupId=" +
        this.courseGroupId +
        "&" +
        "OrganizationId=" +
        this.xuanke_orgcode +
        "&" +
        oldChoosePeople.shareToken
      );
    },
  },
  methods: {
    // 回退
    goback() {
      this.$router.push({
        path: "/TeacherExam",
        query: {
          pageIndex: this.$store.state.teacherExam.pageInfo.pageIndex,
          pageSize: this.$store.state.teacherExam.pageInfo.pageSize,
        },
      });
    },
    // 改变tabs
    tabsChange(key) {},
    // 获取所属组合
    async getGroup() {
      try {
        const res = await this.$api.courseResult.getCourseGroupItemList({
          courseGroupId: this.courseGroupId,
        });
        if (res.code === "200" || res.code === 200) {
          this.groupSelectList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 点击之后才会改变所属组合  changeGroup调用的方法比watch监听要早，所以要再方法中处理参数
    changeGroup(value) {
      // 点击未选
      if (this.equar(value, ["0", "-1"])) {
        this.fetchData.coursegroupitemids = ["-1"];
      } else if (this.equar(value, ["-1", "0"])) {
        // 点击已选
        this.fetchData.coursegroupitemids = ["0"];
      } else if (
        this.fetchData.coursegroupitemids.length >= 2 &&
        this.fetchData.coursegroupitemids.includes("0")
      ) {
        // 点击组合,再点击已选人员，去除剩下的id，保留0
        let arr = [];
        this.fetchData.coursegroupitemids.map((item) => {
          if (item === "0") {
            arr.push(item);
          }
        });
        this.fetchData.coursegroupitemids = [...arr];
      } else if (
        this.fetchData.coursegroupitemids.length >= 2 &&
        this.fetchData.coursegroupitemids.includes("-1")
      ) {
        // 点击组合,再点击未选人员，去除剩下的id，保留1
        let arr = [];
        this.fetchData.coursegroupitemids.map((item) => {
          if (item === "-1") {
            arr.push(item);
          }
        });
        this.fetchData.coursegroupitemids = [...arr];
      }
      // 点击下拉框选项-重置页数
      this.fetchData.current = 1;
      this.pagination.current = 1;
      this.getStudentSelectionPageList();
      // }
    },
    // 获取学生列表
    async getStudentSelectionPageList() {
      this.tableLoading = true;
      let { coursegroupitemids } = this.fetchData;
      if (coursegroupitemids.length === 0) {
        coursegroupitemids = ["0"];
      }
      try {
        const res = await this.$api.courseResult.getStudentSelectionPageList({
          courseGroupId: this.courseGroupId,
          ...this.fetchData,
          coursegroupitemids,
        });
        if (res.code === "200" || res.code === 200) {
          this.dataList = res.data.list;
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    },
    // 判断数组的长度
    equar(a, b) {
      if (a.length !== b.length) {
        return false;
      } else {
        // 循环遍历数组的值进行比较
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      }
    },
    // 搜索
    search() {
      this.getStudentSelectionPageList();
    },

    // 导入
    importExcel() {
      this.fileList = [];
      this.excelurl = "";
      this.importVisible = true;
    },
    // 上传文件之前
    beforeUpload(file, fileList) {
      const isXLSX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isXLSX) {
        this.$message.warning("请选择Excel文件！");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error("出错了"));
        });
      }
      this.fileList = [file];
    },
    // 上传文件
    uploadChange(info) {
      this.fileList = info.fileList;
      const status = info.file.status;
      if (status !== "uploading") {
      }
      if (status === "done") {
        if (
          info.file.response.code === 200 ||
          info.file.response.code === "200"
        ) {
          this.$message.success(`${info.file.name} 上传成功`);
          this.excelurl = info.file.response.data.excelurl;
        } else {
          this.$message.error(info.file.response.message);
          this.fileList = [];
          this.excelurl = "";
        }
      } else if (status === "removed") {
        this.fileList = [];
        this.excelurl = "";
      } else if (status === "error") {
        this.$message.error(`${info.file.name} 上传失败`);
      }
    },
    // 下载模板
    async uploadTemplate() {
      try {
        const res = await this.$api.courseResult.downExcelTep({
          key: "4a0a7d3dce3144ed94d4d6f1cf421fa4",
        });

        let fileName = "学生选课结果模板.xls";
        downloadFile(res, fileName);
      } catch (error) {
        console.log(error);
      }
    },
    // 导入modal确定
    async importConfirm() {
      if (this.excelurl !== "") {
        try {
          const res = await this.$api.courseResult.importExcel({
            excelurl: this.excelurl,
            courseGroupId: this.courseGroupId,
          });

          if (res.code === "200" || res.code === 200) {
            this.$message.success(res.message);
            this.fileList = [];
            this.importVisible = false;

            this.getStudentSelectionPageList();
          } else {
            this.$message.error(res.message);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$message.warn("请上传文件！");
      }
    },
    // 导入modal取消
    importClose() {
      this.fileList = [];
      this.importVisible = false;
    },
    // 导出
    async exportExcel() {
      try {
        const res = await this.$api.courseResult.exportExcel({
          coursegroupid: this.courseGroupId,
          coursegroupitemid: this.fetchData.coursegroupitemids,
          // type: this.fetchData.type,
          stuname: this.fetchData.studentName,
        });
        let fileName = this.courseGroupInfo.name + "的学生选课结果.xls";
        downloadFile(res, fileName);
      } catch (error) {
        console.log(error);
      }
    },

    // 翻页改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getStudentSelectionPageList();
    },
    // 改变每页数量
    onSizeChange(current, size) {
      this.fetchData.current = 1;
      this.fetchData.pageSize = size;
      this.pagination.current = 1;
      this.getStudentSelectionPageList();
    },

    // 点击调配
    deploy(record) {
      this.stuRecord = record;
      this.radioValue = record.courseGroupItemId;
      this.deployVisible = true;
      this.getCourse();
      this.getPattern();
    },
    // 获取参选课目
    async getCourse() {
      try {
        const res = await this.$api.courseSet.getCourse({
          courseGroupId: this.courseGroupId,
        });

        if (res.code === "200" || res.code === 200) {
          this.subjectList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 改变参选课目
    changeCheckbox(checkedValues) {
      let arr = [...this.patternList1];
      for (let index = 0; index < checkedValues.length; index++) {
        const element = checkedValues[index];
        arr = arr.filter((item) => item.courseGroupItemNum.match(element));
      }
      this.patternList = arr;
    },
    // 获取选课组合
    async getPattern() {
      try {
        const res = await this.$api.courseResult.getCourseGroupItemList({
          courseGroupId: this.courseGroupId,
        });

        if (res.code === "200" || res.code === 200) {
          this.patternList = res.data;
          this.patternList1 = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 改变选课组合
    changeRadio(e) {
      // console.log("radio checked", e.target.value);
    },
    // 调配modal确定
    deployConfirm() {
      this.saveStudentSelectionsCourseItem();
    },
    // 调配modal取消
    deployClose() {
      this.deployVisible = false;
    },
    // 保存调配结果
    async saveStudentSelectionsCourseItem() {
      try {
        const res =
          await this.$api.courseResult.saveStudentSelectionsCourseItem({
            courseGroupItemId: this.radioValue,
            studentSelectionId: this.stuRecord.studentSelectionId,
            /* studentSelectionId: "ff1a6b8a50664fbcb36d5fcfa8a90a2b",
          courseGroupItemId: "1b70bc7578e14ca696fa29306f59203f" */
          });

        if (res.code === "200" || res.code === 200) {
          this.$message.success(res.message);
          this.stuRecord = {};
          this.deployVisible = false;
          this.getStudentSelectionPageList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="less">
.curricula_variable_result {
  padding: 0 20px;
  .result_top {
    height: 60px;
    line-height: 60px;
  }
  .result_bottom {
    .ant-tabs-nav-wrap {
      background-color: #f7f9fa;
    }
    .tabs {
      height: 100%;
      .operation {
        display: flex;
        justify-content: space-between;
      }
      .iframe {
        .full {
          width: 100%;
          height: calc(100vh - 268px);
        }
      }
    }
  }
}
.deploy_modal {
  .ant-modal-footer {
    text-align: center;
  }
}
.import_modal {
  .ant-modal-footer {
    text-align: center;
  }
}
</style>
