<!--
 * @Author: ylc
 * @Date: 2021-08-10 15:44:23
 * @LastEditTime: 2021-10-13 15:33:04
 * @LastEditors: ylc
 * @Description: 手动导入页面
 * @FilePath: \Web\src\views\TimetableManage\ImportManually.vue
-->

<template>
  <div class="ylc-manually-content">
    <div class="ylc-manually-head"
      @click="goBack()">
      <svg-icon icon-class="com_back"
        class="ylc-back-icon" />
      {{ fetchData.type === "校本课" ? "手动导入校本课" : "手动导入非校本课" }}
    </div>
    <div class="ylc-manually-body">
      <div class="ylc-manually-left">
        <a-form-model ref="ruleForm"
          :model="formData"
          :rules="rules"
          class="ylc-manually-week"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-form-model-item ref="checkList"
            label="课表应用周次范围"
            prop="checkList">
            <div style="margin-left: 32px">
              <a-checkbox @change="(e) => checkAll(e, 0)"
                :checked="all">全部</a-checkbox>
              <a-checkbox @change="(e) => checkAll(e, 1)"
                :checked="two">全部双周</a-checkbox>
              <a-checkbox @change="(e) => checkAll(e, 2)"
                :checked="one">全部单周</a-checkbox>
            </div>
            <div class="ylc-week-group">
              <a-checkbox-group v-model="formData.checkList"
                name="checkboxgroup"
                :options="weekList"
                @change="onChange" />
            </div>
          </a-form-model-item>
          <a-form-model-item ref="importType"
            label="导入数据"
            prop="importType">
            <a-select style="width: 360px"
              v-model="formData.importType">
              <a-select-option v-for="item in fetchData.type === '校本课'
                  ? typeNorList
                  : typeList"
                :title="item.name"
                style="width: 360px; overflow: hidden; text-overflow: ellipsis"
                :key="item.value"
                :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <div v-if="formData.importType !== '2'">
            <div class="ylc-model-title">
              <span class="ylc-model-icon">*</span>{{
                fetchData.type === "校本课"
                  ? "校本课课表安排"
                  : "非校本课课表安排"
              }}：
            </div>
            <a-form-model-item label="1. 下载表格">
              <a @click="load(1)">
                <svg-icon icon-class="imp_load" />
                点击下载
              </a>
            </a-form-model-item>
            <a-form-model-item ref="timeTableFile"
              label="2. 导入数据"
              prop="timeTableFile">
              <a-upload :file-list="fileList"
                @change="handleChange"
                :beforeUpload="beforeUpload"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :action="null">
                <a-button style="color: #616366; border-color: #ced3d9">
                  <svg-icon icon-class="com_add"
                    style="margin-right: 4px" />
                  上传文件
                </a-button><span
                  style="margin-left: 15px; color: #929599">导入会覆盖原有数据，请做好数据备份准备！</span>
              </a-upload>
            </a-form-model-item>
          </div>
          <div class="ylc-model-title"
            v-if="formData.importType !== '1'">
            <span class="ylc-model-icon">*</span>{{
              fetchData.type === "校本课"
                ? "校本课程学生人员关系表"
                : "走班学生人员关系表"
            }}：
            <span
              style="color: #f64646; margin-left: 2px; font-size: 14px">上课学生来源不同行政班时需上传该表格</span>
          </div>
          <a-form-model-item label="1. 下载表格"
            v-if="formData.importType !== '1'">
            <a @click="load(2)">
              <svg-icon icon-class="imp_load" />
              点击下载
            </a>
          </a-form-model-item>
          <a-form-model-item v-if="formData.importType !== '1'"
            ref="personRelFile"
            label="2. 导入数据"
            prop="personRelFile">
            <a-upload :file-list="fileList2"
              @change="handleChange2"
              :beforeUpload="beforeUpload2"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :action="null">
              <a-button style="color: #616366; border-color: #ced3d9">
                <svg-icon icon-class="com_add"
                  style="margin-right: 4px" />
                上传文件
              </a-button><span style="margin-left: 15px; color: #929599">导入会覆盖原有数据，请做好数据备份准备！</span>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item>
            <div style="margin-left: 14%">
              <a-button @click="goBack">取消</a-button>
              <a-button class="ylc-import-btn"
                @click="submit">确定导入</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="ylc-manually-right">
        <div class="ylc-explain-title">导入说明</div>
        <div class="ylc-explain-text"
          style="margin-top: 27px; color: #f64646">
          <div class="ylc-explain-serial">1.</div>
          <div>手动导入：支持上传03版本以上的文件</div>
        </div>
        <div class="ylc-explain-text"
          style="margin-top: 27px">
          <div class="ylc-explain-serial">2.</div>
          <div>上课教师有多个时用 “ ； ” 连接；</div>
        </div>
        <div class="ylc-explain-table">
          <table>
            <tr class="ylc-table-tr"
              style="background-color: #bae8d9">
              <th class="ylc-table-th">教师姓名</th>
            </tr>
            <tr class="ylc-table-tr">
              <td class="ylc-table-th">张一凡；刘倩</td>
            </tr>
            <tr class="ylc-table-tr">
              <td class="ylc-table-th">刘洋</td>
            </tr>
          </table>
        </div>
        <div class="ylc-explain-text">
          <div class="ylc-explain-serial">3.</div>
          <div>相同地点相同教师有多个班级上课时需合班用 “ ； ” 连接；</div>
        </div>
        <div class="ylc-explain-table">
          <table>
            <tr class="ylc-table-tr"
              style="background-color: #bae8d9">
              <th class="ylc-table-th">班级名称</th>
            </tr>
            <!-- <tr class="ylc-table-tr">
              <td class="ylc-table-th">高2019级3班 ；高2019级1班</td>
            </tr> -->
            <tr class="ylc-table-tr">
              <td class="ylc-table-th">高2019级7班</td>
            </tr>
          </table>
        </div>
        <div class="ylc-explain-text">
          <div class="ylc-explain-serial">4.</div>
          <div>
            上课班级学生不是行政班全部学生时（即为走班班级）,需自行编辑
            班级名称，规则为ZB+3位数字；（例如：ZB001）
          </div>
        </div>
        <div class="ylc-explain-table">
          <table>
            <tr class="ylc-table-tr"
              style="background-color: #bae8d9">
              <th class="ylc-table-th">班级名称</th>
            </tr>
            <!-- <tr class="ylc-table-tr">
              <td class="ylc-table-th">高2019级3班 ；高2019级1班</td>
            </tr> -->
            <tr class="ylc-table-tr">
              <td class="ylc-table-th">ZB001</td>
            </tr>
          </table>
        </div>
        <div class="ylc-explain-text">
          <div class="ylc-explain-serial">5.</div>
          <div>
            科目管理、教师管理、场所管理、行政班级管理及班级人员管理 需到 ”
            基础管理平台 ” 进行管理
          </div>
        </div>
      </div>
      <GlobalModal :visible="visible"
        title="下载表格"
        :defaultBtn="false"
        :footer="'false'"
        @cancel="cancel">
        <div class="ylc-import-modal">
          <div class="ylc-modal-box">
            <div class="ylc-modal-title">情况一</div>
            <div class="ylc-modal-description">
              第一次导入数据或需要空模板时，请点击下载模板进行编辑
            </div>
            <a v-if="num === 1"
              @click="loadTemplete(0)">
              <svg-icon icon-class="imp_load" />
              {{
                fetchData.type === "校本课"
                  ? "校本课课表安排"
                  : "非校本课课表安排"
              }}
              - 空模板表格xlsx
            </a>
            <a v-else
              @click="loadTemplete(0)">
              <svg-icon icon-class="imp_load" />
              {{
                fetchData.type === "校本课"
                  ? "校本课程人员关系"
                  : "走班学生人员关系"
              }}
              - 空模板表格xlsx
            </a>
          </div>
          <div class="ylc-modal-box"
            v-if="classList.length > 0">
            <div class="ylc-modal-title">情况二</div>
            <div v-if="num === 1">
              修改现有课表数据或增加课表数据时，请点击下载已有课表数据进行编辑
            </div>
            <div v-else>
              修改现有人员数据或增加人员数据时，请点击下载已有人员数据进行编辑
            </div>
            <div style="margin: 10px 0">
              <a-select @change="select"
                style="width: 360px; line-height: 32px"
                v-model="loadClass"
                mode="multiple">
                <a-select-option v-for="item in classList"
                  style="
                    width: 360px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                  :key="item.className"
                  :value="
                    item.classType === '1'
                      ? item.className
                      : item.subjectName + item.className
                  ">
                  {{
                    item.classType === "1"
                      ? item.className
                      : item.subjectName + item.className
                  }}
                </a-select-option>
              </a-select>
            </div>
            <a v-if="num === 1"
              @click="loadTemplete(2)">
              <svg-icon icon-class="imp_load" />
              {{ loadClass.length > 0 ? loadClass.join("、") + "-" : "" }}
              {{
                fetchData.type === "校本课"
                  ? "校本课课表安排"
                  : "非校本课课表安排"
              }}
              - 已有数据表格xlsx
            </a>
            <a v-else
              @click="loadTemplete(2)">
              <svg-icon icon-class="imp_load" />
              {{ loadClass.length > 0 ? loadClass.join("、") + "-" : "" }}
              {{
                fetchData.type === "校本课"
                  ? "校本课程人员关系"
                  : "非校本课走班人员关系"
              }}
              - 已有数据表格xlsx
            </a>
          </div>
        </div>
      </GlobalModal>
    </div>
  </div>
</template>

<script>
import { downloadFile } from "../../Utils/util";
import svgIcon from "../../components/common/svgIcon.vue";
import GlobalModal from "../../components/common/GlobalModal.vue";
export default {
  components: { svgIcon, GlobalModal },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      visible: false,
      fetchData: {}, // 路由传入参数
      num: 0, // 控制下载弹出框为课表还是人员关系表
      fileList: [], // 课表上传文件列表
      fileList2: [], // 人员关系上传文件列表
      classList: [], // 可选班级列表
      classIdList: [], // 选中班级id列表
      formData: {
        checkList: [],
        importType: "",
        timeTableFile: {},
        personRelFile: {}
      }, // 表单参数
      typeList: [
        {
          name: "非校本课课表安排",
          value: "1"
        },
        {
          name: "非校本课课表安排 + 走班课程学生人员关系表",
          value: "3"
        }
      ],
      typeNorList: [
        {
          name: "校本课课表安排",
          value: "1"
        },
        {
          name: "校本课课表安排 + 校本课程学生人员关系表",
          value: "3"
        }
      ],
      previewList: [], // 导入预览数据
      loadClass: [], // 下载班级
      rules: {},
      all: false,
      one: false,
      two: false,
      weekList: [] // 教学周
    };
  },
  created() {
    this.fetchData = this.$route.query;
    this.fetchData.isNormal = this.fetchData.type === "校本课" ? "0" : "1"
    this.formData.importType =
      this.fetchData.type === "校本课"
        ? this.typeNorList[0].value
        : this.typeList[0].value;
    this.getWeekList();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.push({
        path: "/TimetableManage/ImportCheck",
        query: {
          ...this.fetchData
        }
      });
    },
    // 选择周次
    onChange(checkedKeys) {
    },
    // 上传课表文件结果
    handleChange(info) {
      if (info.file.status !== "uploading") {
        if (info.file.status === "removed") {
          this.fileList = [];
          this.formData.timeTableFile = "";
        }
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "warn") {
        this.$message.warn(`${info.file.name} 上传失败`);
      }
    },
    // 上传人员关系文件结果
    handleChange2(info) {
      if (info.file.status !== "uploading") {
        if (info.file.status === "removed") {
          this.fileList2 = [];
          this.formData.personRelFile = "";
        }
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "warn") {
        this.$message.warn(`${info.file.name} 上传失败`);
      }
    },
    // 上传课表文件
    beforeUpload(file) {
      this.formData.timeTableFile = file;
      this.fileList = [file];
      return false;
    },
    // 上传人员关系文件
    beforeUpload2(file) {
      this.formData.personRelFile = file;
      this.fileList2 = [file];
      return false;
    },
    // 下载弹出框
    load(num) {
      this.visible = true;
      this.num = num;
      this.getClassList();
    },
    // 选择周次
    checkAll(e, type) {
      this.formData.checkList = [];
      if (e.target.checked) {
        switch (type) {
          case 0:
            this.all = true;
            this.one = true;
            this.two = true;
            this.weekList.map((item) => {
              this.formData.checkList.push(item.value);
            });
            break;
          case 1:
            this.all = false;
            this.one = false;
            this.two = true;
            this.weekList.map((item, index) => {
              if (index % 2 !== 0) {
                this.formData.checkList.push(item.value);
              }
            });
            break;
          case 2:
            this.all = false;
            this.one = true;
            this.two = false;
            this.weekList.map((item, index) => {
              if (index % 2 === 0) {
                this.formData.checkList.push(item.value);
              }
            });
            break;
          default:
            break;
        }
      } else {
        switch (type) {
          case 0:
            this.all = false;
            this.one = false;
            this.two = false;
            break;
          case 1:
            this.all = false;
            this.two = false;
            if (this.one) {
              this.weekList.map((item, index) => {
                if (index % 2 === 0) {
                  this.formData.checkList.push(item.value);
                }
              });
            }
            break;
          case 2:
            this.all = false;
            this.one = false;
            if (this.two) {
              this.weekList.map((item, index) => {
                if (index % 2 !== 0) {
                  this.formData.checkList.push(item.value);
                }
              });
            }
            break;
          default:
            break;
        }
      }
    },
    // 确定导入
    submit() {
      let weekIdList = this.formData.checkList
      this.previewImport(weekIdList);
    },
    // 取消下载
    cancel() {
      this.visible = false;
    },
    // 选择班级
    select(list) {
      let arr = [];
      if (list.indexOf("全部") !== -1) {
        this.loadClass = ["全部"];
        list = ["全部"];
      }
      this.classList.map((item) => {
        for (let i = 0; i < list.length; i++) {
          if (item.classType === "1") {
            if (item.className === list[i]) {
              arr.push(item);
            }
          } else {
            if (item.subjectName + item.className === list[i]) {
              arr.push(item);
            }
          }
        }
      });
      this.classIdList = arr;
    },
    // 获取教学周
    async getWeekList() {
      const res = await this.$api.common.getTeachWeekBySemester({
        ...this.fetchData
      });
      if (res.code === "200" || res.code === 200) {
        res.data.map((item) => {
          let k = {
            value: item.teachWeekId,
            label: item.teachWeekName
          };
          this.weekList.push(k);
        });
      } else {
        this.$message.warn(res.message);
      }
    },
    // 导入
    async previewImport(weekIdList) {
      if (weekIdList.length === 0) {
        return this.$message.warn("请选择周次")
      }
      if (this.formData.timeTableFile.uid === undefined && this.formData.personRelFile.uid === undefined) {
        return this.$message.warn("请选择上传文件")
      }
      let form = new FormData();
      form.append("weekIdList", weekIdList);
      form.append("isNormal", this.fetchData.type === "校本课" ? "0" : "1");
      form.append("schoolYearId", this.fetchData.schoolYearId);
      form.append("semesterId", this.fetchData.semesterId);
      form.append("gradeId", this.fetchData.gradeId);
      console.log(this.formData.importType === "3", 'formData')
      if (this.formData.importType === "1") {
        form.append("timeTableFile", this.formData.timeTableFile);
      }
      if (this.formData.importType === "3") {
        if (this.formData.timeTableFile.name) {
          form.append("timeTableFile", this.formData.timeTableFile);
        } else {
          return this.$message.warn("请上传课表安排文件")
        }
        if (this.formData.personRelFile.name) {
          form.append("personRelFile", this.formData.personRelFile);
        } else {
          return this.$message.warn("请上传人员关系文件")
        }
      }
      const res = await this.$api.TimetableManage.previewImportTimeTable(form);
      if (res.code === "200" || res.code === 200) {
        this.previewList = res.data;
        this.fetchData.weekIdList = weekIdList
        this.$router.push({
          path: "/TimetableManage/ImportVerify",
          query: {
            fetchData: JSON.stringify(this.fetchData),
            classList: JSON.stringify(this.previewList)
          }
        });
      } else {
        this.$message.warn(res.message);
      }
    },
    // 查询可选班级
    async getClassList() {
      const res = await this.$api.TimetableManage.getTimetableClassInfo({
        ...this.fetchData,
        dataType: this.num
      });
      if (res.code === "200" || res.code === 200) {
        this.classList = res.data;
        if (this.classList.length > 0) {
          this.classList.push({
            className: "全部",
            classId: "1",
            classType: "1"
          });
        } else {
          this.$message.warn("系统内暂无已有数据")
        }
      } else {
        this.$message.warn(res.message);
      }
    },
    // 下载课表导入模板
    async loadTemplete(key) {
      let type = "";
      if (key === 0) {
        type = "1";
      } else if (this.loadClass.length === 0) {
        return this.$message.warn("请选择下载模板范围")
      } else if (this.loadClass.length === 1 && this.loadClass[0] === "全部") {
        type = "2";
      } else {
        type = "3";
      }
      const res = await this.$api.TimetableManage.downloadTemplate({
        ...this.fetchData,
        templateType: this.num === 1 ? "1" : "2",
        templateDataType: type,
        classList: this.classIdList
      });
      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
      this.visible = false;
    },
    // 最终导入
    async importFinal() {
      const res = await this.$api.TimetableManage.importTimeTableFinally({
        ...this.fetchData
      });
      if (res.code === "200" || res.code === 200) {
        this.$router.push({
          path: "/TimetableManage/ImportSuccess",
          query: { res: JSON.stringify(res.data) }
        });
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ylc-import-modal {
  padding: 29px 32px;
  .ylc-modal-box {
    margin-bottom: 40px;
    .ylc-modal-title {
      font-size: 16px;
      color: #494b4d;
      font-weight: bold;
      margin-bottom: 14px;
    }
    .ylc-modal-description {
      color: #494b4d;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
.ylc-manually-content {
  .ylc-manually-head {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #e6e8eb;
    font-size: 18px;
    padding-left: 24px;
    .ylc-back-icon {
      width: 22px;
      height: 22px;
      color: #929599;
      margin-right: 5px;
    }
  }
  .ylc-manually-body {
    display: flex;
    .ylc-manually-left {
      width: 70%;
      padding: 29px 66px;
      border-right: 1px solid #e6e9eb;
      .ylc-manually-week {
        .ylc-week-group {
          padding: 16px 32px;
          background-color: #fafbfc;
        }
      }
      .ylc-model-title {
        margin-bottom: 20px;
        font-size: 16px;
        margin-left: 16px;
        color: #47484a;
        .ylc-model-icon {
          color: #ac1c1c;
          margin-right: 5px;
        }
      }
      .ylc-import-btn {
        background-color: #2abf8e;
        color: #fff;
      }
    }
    .ylc-manually-right {
      width: 30%;
      padding: 28px 38px;
      .ylc-explain-title {
        color: #494b4d;
        font-size: 18px;
        font-weight: bold;
      }
      .ylc-explain-text {
        color: #494b4d;
        font-size: 14px;
        display: flex;
        line-height: 21px;
        .ylc-explain-serial {
          font-size: 20px;
          font-weight: bold;
          margin-right: 6px;
        }
      }
      .ylc-explain-table {
        margin: 13px 26px;
        .ylc-table-tr {
          color: #494b4d;
          border: 1px solid #afe8d5;
          .ylc-table-th {
            padding: 5px 51px 5px 15px;
          }
        }
      }
    }
  }
  /deep/ .ant-checkbox-group-item {
    min-width: 100px;
    margin: 5px 0;
  }
}
</style>