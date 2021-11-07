<template>
  <!-- 考生复查审核 -->
  <div id="reviewAudit">
    <div class="top" style="margin-bottom: 20px">
      <div class="topSearch">
        <div class="query">
          <div>
            <span class="name">机构：</span>
            <a-tree-select
              v-model="search.orgCode"
              style="width: 180px; margin-right: 20px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :replaceFields="treeReplaceFields"
              @select="onSelect"
            >
            </a-tree-select>
          </div>

          <div>
            <span class="name">考生状态：</span>
            <a-select
              style="width: 120px; margin-right: 15px"
              placeholder="请选择"
              allowClear
              v-model="search.examState"
            >
              <a-select-option value> 全部 </a-select-option>
              <a-select-option value="1"> 待审核 </a-select-option>
              <a-select-option value="2"> 待复查 </a-select-option>
              <a-select-option value="4"> 复查完成 </a-select-option>
              <a-select-option value="6"> 审核不通过 </a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="searchList('1')">查询</a-button>
        </div>
        <div class="search">
          <a-input
            placeholder="考生号/姓名/身份证号"
            allowClear
            v-model="search.keyword"
            style="width: 180px; margin-right: 15px"
          />
          <a-button type="primary" @click="searchList('2')">搜索</a-button>
        </div>
      </div>
      <div class="topExport" style="margin-top: 15px">
        <a-button
          type="primary"
          @click="reviewApplyModel"
          style="margin-right: 15px"
        >
          <svg-icon icon-class="fucha" :scale="0.8" style="margin-right: 5px" />
          复查申请
        </a-button>
        <a-button type="primary" @click="allExport">
          <svg-icon
            icon-class="daochu"
            :scale="0.8"
            style="margin-right: 5px"
          />
          导出Excel
        </a-button>
      </div>
    </div>

    <!-- 复查审核列表 -->
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ x: 100, y: tableHeight }"
        size="middle"
      >
        <!-- 考生状态 -->
        <span slot="sex" slot-scope="text">
          {{ text === "1" ? "男" : text === "2" ? "女" : "-" }}
        </span>
        <!-- 复查说明 -->
        <span slot="reviewExplain" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">
              {{ text }}
            </template>
            <span type="primary">{{ text }}</span>
          </a-tooltip>
        </span>
        <!-- 考生状态 -->
        <span
          slot="examState"
          slot-scope="text"
          :class="
            text === '1'
              ? 'colOrange'
              : text === '2'
              ? 'colGray'
              : text === '4'
              ? 'colGreen'
              : text === '6'
              ? 'colRed'
              : ''
          "
        >
          {{
            text === "1"
              ? "待审核"
              : text === "2"
              ? "待复查"
              : text === "4"
              ? "复查完成"
              : text === "6"
              ? "审核不通过"
              : "-"
          }}
        </span>
        <!-- 详情 -->
        <span slot="operation" slot-scope="text, record">
          <a-button
            v-if="record.examState === '1'"
            @click="auditDetails(record, '1')"
          >
            审核
          </a-button>
          <a-button v-else @click="auditDetails(record, '2')"> 详情 </a-button>
        </span>
      </a-table>
    </div>

    <!-- 复查申请model -->
    <a-modal
      v-model="applyVisible"
      title="考生复查申请"
      @ok="reviewDetailsModalHandleOk"
      width="660px"
      :destroyOnClose="true"
      :afterClose="closeApply"
      :maskClosable="false"
      wrapClassName="reviewDetailsModal"
    >
      <span class="title">学生基本信息</span>
      <div class="infoDetails">
        <div style="margin-top: 15px">
          <a-input
            placeholder="请输入考生号"
            v-model="inputExamNum"
            style="width: 200px"
          />
          <a-button
            type="primary"
            @click="queryStuInfo"
            style="margin-left: 15px"
          >
            搜索
          </a-button>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">考生号：</div>
            <div>{{ stuInfo.examNum }}</div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">考生姓名：</div>
            <div>{{ stuInfo.examName }}</div>
          </div>
          <div class="right">
            <div class="name">性别：</div>
            <div>
              {{
                stuInfo.sex === "1" ? "男" : stuInfo.sex === "2" ? "女" : "-"
              }}
            </div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">区县名称：</div>
            <div>{{ stuInfo.countyName }}</div>
          </div>
          <div class="right">
            <div class="name">班级：</div>
            <div>{{ stuInfo.classNum }}</div>
          </div>
        </div>
        <div class="line1">
          <div class="name">体检医院：</div>
          <div>{{ stuInfo.hospitalName }}</div>
        </div>
        <div class="line1">
          <div class="name">报名点名称：</div>
          <div>{{ stuInfo.assignsName }}</div>
        </div>
      </div>
      <span class="title">复查详情</span>
      <div class="reviewDetails">
        <div class="line">
          <div class="left">复查科室：</div>
          <div class="right">
            <a-select
              style="width: 200px; margin-right: 15px"
              placeholder="请选择"
              allowClear
              v-model="applyInfo.reviewDesk"
              @change="changeDesk"
            >
              <a-select-option
                v-for="item in deskList"
                :key="item.deskId"
                :value="item.deskId"
              >
                {{ item.deskName }}
              </a-select-option>
            </a-select>
            <div v-if="applyInfo.reviewDesk" style="margin-top: 5px">
              {{ deskItem }}
            </div>
          </div>
        </div>
        <div class="line">
          <div class="left">复查说明：</div>
          <div class="right">
            <a-textarea
              v-model="applyInfo.reviewExplain"
              style="height: 100px; min-height: 100px; max-height: 100px"
            />
          </div>
        </div>
        <div class="line">
          <div class="left">复查材料：</div>
          <div class="right">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :before-upload="beforeUploadImage"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传材料</div>
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
              wrapClassName="previewImgModal"
            >
              <img alt="pic" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </div>
      </div>

      <template slot="footer">
        <a-button
          type="primary"
          :disabled="disabledButton"
          @click="reviewDetailsModalHandleOk"
          style="margin-right: 10px"
        >
          <svg-icon
            icon-class="queren"
            :scale="0.8"
            style="margin-right: 5px"
          />
          确认
        </a-button>
        <a-button @click="reviewDetailsModalHandleCancel">
          <svg-icon
            icon-class="quxiao"
            :scale="0.7"
            style="margin-right: 5px"
          />
          取消
        </a-button>
      </template>
    </a-modal>

    <!-- 复查审核/详情model -->
    <a-modal
      v-model="auditVisible"
      :title="modelType === '1' ? '考生复查审核' : '考生复查详情'"
      @ok="auditModalHandleOk"
      width="660px"
      :destroyOnClose="true"
      :afterClose="closeAudit"
      :maskClosable="false"
      wrapClassName="reviewDetailsModal"
    >
      <span class="title">学生基本信息</span>
      <div class="infoDetails">
        <div class="line">
          <div class="left">
            <div class="name">考生号：</div>
            <div>{{ examDetails.examNum }}</div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">考生姓名：</div>
            <div>{{ examDetails.examName }}</div>
          </div>
          <div class="right">
            <div class="name">性别：</div>
            <div>
              {{
                examDetails.sex === "1"
                  ? "男"
                  : examDetails.sex === "2"
                  ? "女"
                  : "-"
              }}
            </div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">区县名称：</div>
            <div>{{ examDetails.countyName }}</div>
          </div>
          <div class="right">
            <div class="name">班级：</div>
            <div>{{ examDetails.classNum }}</div>
          </div>
        </div>
        <div class="line1">
          <div class="name">体检医院：</div>
          <div>{{ examDetails.hospitalName }}</div>
        </div>
        <div class="line1">
          <div class="name">报名点名称：</div>
          <div>{{ examDetails.assignsName }}</div>
        </div>
      </div>
      <span class="title">复查详情</span>
      <div class="reviewDetails">
        <div class="line">
          <div class="left">复查科室：</div>
          <div class="right">{{ examDetails.reviewDesk }}</div>
        </div>
        <div class="line">
          <div class="left">复查说明：</div>
          <div class="right">{{ examDetails.reviewExplain }}</div>
        </div>
        <div class="line">
          <div class="left">复查材料：</div>
          <div class="right">
            <img
              v-for="item in examDetails.materials"
              :key="item"
              :src="item"
              alt="复查材料"
              style="
                width: 100px;
                height: 100px;
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
              "
              @click="showImg(item)"
            />
          </div>
        </div>
        <div class="line" v-if="modelType === '1'">
          <div class="left"><span style="color: red">*</span>审核意见：</div>
          <div class="right">
            <a-select
              style="width: 200px"
              placeholder="请选择"
              allowClear
              v-model="auditOpinion"
              @change="changeAuditOpinion"
            >
              <a-select-option value="1"> 审核通过 </a-select-option>
              <a-select-option value="0"> 审核不通过 </a-select-option>
            </a-select>
            <div v-if="auditOpinionHint" style="margin-top: 5px; color: red">
              请填写审核意见
            </div>
          </div>
        </div>
        <div class="line" v-else-if="modelType === '2'">
          <div class="left">审核意见：</div>
          <div class="right">
            {{
              examDetails.auditOpinion === "1"
                ? "审核通过"
                : examDetails.auditOpinion === "0"
                ? "审核不通过"
                : ""
            }}
          </div>
        </div>
        <div class="line" v-if="modelType === '1' && auditOpinion === '0'">
          <div class="left">不通过原因：</div>
          <div class="right">
            <a-textarea
              v-model="cause"
              style="height: 100px; min-height: 100px; max-height: 100px"
            />
          </div>
        </div>
        <div
          class="line"
          v-else-if="modelType === '2' && examDetails.auditOpinion === '0'"
        >
          <div class="left">不通过原因：</div>
          <div class="right">{{ examDetails.cause }}</div>
        </div>
      </div>

      <template slot="footer">
        <a-button
          type="primary"
          @click="auditModalHandleOk"
          style="margin-right: 10px"
        >
          <svg-icon
            icon-class="queren"
            :scale="0.8"
            style="margin-right: 5px"
          />
          确认
        </a-button>
        <a-button @click="auditModalHandleCancel">
          <svg-icon
            icon-class="quxiao"
            :scale="0.7"
            style="margin-right: 5px"
          />
          取消
        </a-button>
      </template>
    </a-modal>

    <!-- 审核/详情 材料预览 -->
    <a-modal
      :visible="auditPreviewVisible"
      :footer="null"
      @cancel="auditHandleCancel"
      wrapClassName="previewImgModal"
    >
      <img alt="pic" style="width: 100%" :src="auditPreviewImage" />
    </a-modal>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>

<script>
import { downloadFile } from "../../utils/util";
// 查询列表结构
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 200,
    fixed: 'left'
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    width: 150,
    align: "center",
    key: "examName",
    fixed: 'left'
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: 150,
    align: "center",
    key: "sex",
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    width: 200,
    key: "idnum"
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    width: 250,
    key: "countyName"
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    width: 250,
    key: "assignsName"
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    width: 250,
    key: "hospitalName"
  },
  {
    title: "复查科室",
    dataIndex: "reviewDesk",
    width: 150,
    align: "center",
    key: "reviewDesk"
  },
  {
    title: "复查说明",
    dataIndex: "reviewExplain",
    width: 250,
    key: "reviewExplain",
    scopedSlots: { customRender: "reviewExplain" },
    ellipsis: true
  },
  {
    title: "考生状态",
    dataIndex: "examState",
    width: 150,
    align: "center",
    key: "examState",
    scopedSlots: { customRender: "examState" }
  },
  {
    title: "申请人",
    dataIndex: "proposer",
    width: 150,
    align: "center",
    key: "proposer"
  },
  {
    title: "申请时间",
    dataIndex: "applyTime",
    width: 200,
    align: "center",
    key: "applyTime"
  },
  {
    title: "复查完成时间",
    dataIndex: "reviewTime",
    width: 200,
    align: "center",
    key: "reviewTime"
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    align: "center",
    fixed: 'right',
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度

      treeData: [], // 机构树数据
      treeReplaceFields: {
        children: 'children',
        title: 'orgName',
        key: 'orgCode',
        value: 'orgCode',
        type: 'orgType',
      },

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,
      stripTotal: null, //查询列表总条数

      search: {
        orgCode: null, //机构id
        orgType: null, //机构层级
        examState: '', //考生状态
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" // 查询或搜索
      },

      applyVisible: false, //复查申请model
      disabledButton: true, //modal框确定按钮状态
      inputExamNum: null, //输入考生号
      stuInfo: { //学生基本信息
        /* examNum: '', 
        examName: '',
        sex: '',
        countyName: '',
        tjzdm: '',
        hospitalName: '',
        assignsName: '',
        classNum: '' */
      },
      deskList: [], //科室列表
      applyInfo: { //申请内容
        reviewDesk: '', //复查科室
        reviewExplain: '', //复查说明
        materials: [] //复查材料
      },
      deskItem: '', //科室分科项
      previewVisible: false, //图片预览modal
      previewImage: '', //图片预览地址
      fileList: [],

      modelType: '', //1：审核   2：详情
      auditVisible: false, //审核model
      examDetails: {}, //考生详情
      auditOpinion: '', // 审核意见
      auditOpinionHint: false, //审核意见选择提示
      cause: '', // 不通过原因
      stuDataId: '', //审核时数据id

      auditPreviewVisible: false, // 材料预览
      auditPreviewImage: '' //材料路径
    }
  },
  watch: {
    "search.orgCode"(value) {
      if (!value) {
        this.search.orgCode = null
        this.search.orgType = null
      }
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.search.orgType = userInfo.orgTypeId
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))
    this.getList()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 47 - 21 - 20;
    },
    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e.$vnode.data.props.orgType);
      this.search.orgType = String(e.$vnode.data.props.orgType)
    },

    // 复查申请 - 打开model
    reviewApplyModel() {
      this.applyVisible = true;
    },
    // 复查申请 - 搜索学生信息
    async queryStuInfo() {
      if (!this.inputExamNum) {
        this.$message.error("请输入考生号！")
      } else {
        try {
          const res = await this.$api.recheckAudit.stuInfoQuery({
            examNum: this.inputExamNum
          });
          if (res.code === "200" || res.code === 200) {
            if (res.data) {
              this.stuInfo = res.data
              console.log(this.stuInfo);

              this.disabledButton = false
              this.getReviewDesk()
            }
          } else {
            this.$message.error(res.message);
          }
        } catch (error) {
          console.log(error);
          this.$message.error("请求失败！" + error);
        }
      }
    },
    // 复查申请 - 获取复查科室
    async getReviewDesk() {
      try {
        const res = await this.$api.recheckAudit.getReviewDesk({
          tjzdm: this.stuInfo.tjzdm
        });
        if (res.code === "200" || res.code === 200) {
          this.deskList = res.data.list
          console.log(this.deskList)
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      }
    },
    // 复查申请 - 改变复查科室显示分科项
    changeDesk(value) {
      console.log(value)
      for (let i = 0; i < this.deskList.length; i++) {
        if (this.deskList[i].deskId === value) {
          this.deskItem = this.deskList[i].deskItem.join("、")
        }
      }
    },
    // 复查申请 - modal框确定
    async reviewDetailsModalHandleOk() {
      if (!this.applyInfo.reviewDesk) {
        this.$message.error("请选择复查科室！")
        return reviewExplain
      }
      if (!this.applyInfo.reviewExplain) {
        this.$message.error("请填写复查说明！")
        return
      }
      if (!this.applyInfo.materials.length) {
        this.$message.error("请上传复查材料！")
        return
      }
      try {
        const res = await this.$api.recheckAudit.reviewApply({
          examNum: this.inputExamNum,
          tjzdm: this.stuInfo.tjzdm,
          deskId: this.applyInfo.reviewDesk,
          reviewExplain: this.applyInfo.reviewExplain,
          materials: this.applyInfo.materials,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res)
          this.applyVisible = false;

          this.getList()
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      }
    },
    // 复查申请 - modal框取消
    reviewDetailsModalHandleCancel() {
      this.applyVisible = false;
    },
    // 复查申请 - 关闭modal框清除数据
    closeApply() {
      this.inputExamNum = null
      this.disabledButton = true
      this.stuInfo = {}
      this.deskList = []
      this.applyInfo = {
        reviewDesk: '',
        reviewExplain: '',
        materials: []
      }
      this.previewImage = ''
      this.fileList = []
    },


    // 审核/详情 - 打开model
    auditDetails(record, type) {
      console.log(record)
      this.stuDataId = record.id
      this.examDetails = record
      this.modelType = type
      this.auditVisible = true
    },
    // 审核/详情 - 选择审核意见
    changeAuditOpinion() {
      this.auditOpinionHint = false
    },
    // 审核/详情 - model确认
    async auditModalHandleOk() {
      if (this.modelType === '1') {
        if (!this.auditOpinion) {
          this.auditOpinionHint = true
        } else {
          try {
            const res = await this.$api.recheckAudit.reviewAudit({
              examNum: this.examDetails.examNum,
              auditOpinion: this.auditOpinion,
              cause: this.cause,
              id: this.stuDataId
            });
            if (res.code === "200" || res.code === 200) {
              console.log(res)
              this.auditVisible = false;
              this.stuDataId = ''

              this.getList()
            }
          } catch (error) {
            console.log(error);
            this.$message.error("请求失败！" + error);
          }
        }
      } else if (this.modelType === '2') {
        this.auditVisible = false;
      }
    },
    // 审核/详情 - model取消
    auditModalHandleCancel() {
      this.auditVisible = false;
    },
    // 审核/详情 - 材料预览
    showImg(item) {
      console.log(item)
      this.auditPreviewImage = item
      this.auditPreviewVisible = true
    },
    // 审核/详情 - 取消
    auditHandleCancel() {
      this.auditPreviewVisible = false;
    },
    // 审核/详情 - 关闭modal框清除数据
    closeAudit() {
      this.auditOpinion = ''
      this.auditOpinionHint = false
      this.cause = ''
    },

    /* // 图片上传 - 转64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    // 图片上传 - 取消
    handleCancel() {
      this.previewVisible = false;
    },
    // 图片上传 - 预览图片
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 图片上传 - 改变上传框
    handleChange({ fileList }) {
      console.log(fileList)
      this.fileList = fileList;
      var imgArr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        imgArr.push(this.fileList[i].pUrl);
      }
      this.applyInfo.materials = imgArr;
    },
    // 图片上传 - 上传图片之前
    async beforeUploadImage(file, fileList) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      if (!isJPG) {
        this.$message.error("请上传图片");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(false);
        });
      }
      const imgBase64 = await this.getBase64(file);
      const res = await this.uploadPicReq(imgBase64);
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: res.url,
        pUrl: res.path
      });
      this.applyInfo.materials.push(res.path);
      return new Promise((resolve, reject) => {
        return reject(false);
      });
    },
    // 图片上传 - 上传图片请求
    async uploadPicReq(imgBase64) {
      try {
        const res = await this.$api.init.uploadPic({ imgBase64 });
        if (res.code === "200") {
          return res.data;
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    }, */
    // 图片上传 - 转64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    // 图片上传 - 取消
    handleCancel() {
      this.previewVisible = false;
    },
    // 图片上传 - 预览图片
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        this.getBase64(this.fileList[0].url).then(res => {
          file.preview = res;
        })
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 图片上传 - 上传图片之前
    async beforeUploadImage(file, fileList) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      if (!isJPG) {
        this.$message.error("请上传图片");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(false);
        });
      }
      console.log(file.size);
      if (file.size > 5 * 1024 * 1024) {
        this.$message.warn("上传图片不能大于5MB");
        return new Promise((resolve, reject) => {
          return reject(false);
        });
      }
      const imgBase64 = await this.getBase64(file);
      let imgBase = imgBase64.substring(imgBase64.indexOf(",") + 1)
      console.log(imgBase64)
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: imgBase64,
      });
      this.applyInfo.materials.push(imgBase);
      console.log(this.applyInfo.materials)
      return new Promise((resolve, reject) => {
        return reject(false);
      });
    },
    // 图片上传 - 改变上传框
    handleChange({ fileList }) {
      this.fileList = fileList;
      var imgArr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        imgArr.push(this.fileList[i].url);
      }
      this.applyInfo.materials = imgArr;
    },

    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        let { orgCode, orgType, examState } = this.search
        if (orgCode === null) orgCode = ""
        if (orgType === null) orgType = ""
        if (examState === undefined) examState = ""
        const res = await this.$api.recheckAudit.getReviewList({
          ...this.search, orgCode, orgType, examState
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 查询或搜索列表内容
    async searchList(type) {
      console.log(type)
      this.search.type = type
      this.$refs.page.pagination.current = 1
      this.search.current = 1;

      if (type === "1") {
        this.search.keyword = ""
      } else if (type === "2") {
        this.search.orgCode = null
        this.search.orgType = null
        this.search.examState = undefined
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },

    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        let { orgCode, orgType, examState } = this.search
        if (orgCode === null) orgCode = ""
        if (orgType === null) orgType = ""
        if (examState === undefined) examState = ""
        const res = await this.$api.recheckAudit.exportExcel({
          ...this.search, orgCode, orgType, examState
        });
        downloadFile(res)
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    }
  }
}
</script>
 
<style lang = "less">
#reviewAudit {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    .topSearch {
      display: flex;
      justify-content: space-between;
      .query {
        display: flex;
        width: 70%;
        flex-wrap: wrap;
      }
      .search {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
      }
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;

    .colOrange {
      color: #ff9b3a;
    }
    .colGray {
      color: #ababab;
    }
    .colGreen {
      color: #4cca75;
    }
    .colRed {
      color: #ff6262;
    }
  }
}

/* 复查申请modal */
.reviewDetailsModal {
  .ant-modal-body {
    .title {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 600;
      padding-left: 10px;
      border-left: 3px solid #595959;
    }
    .infoDetails {
      border-top: 1px solid #e8e8e8;
      margin: 10px 0;
      .line {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        .left {
          width: 50%;
          display: flex;
          .name {
            width: 30%;
            text-align: right;
          }
        }
        .right {
          width: 50%;
          display: flex;
          .name {
            width: 25%;
            text-align: right;
          }
        }
      }
      .line1 {
        display: flex;
        margin-top: 10px;
        .name {
          width: 15%;
          text-align: right;
        }
      }
    }
    .reviewDetails {
      border-top: 1px solid #e8e8e8;
      margin-top: 10px;
      .line {
        display: flex;
        margin-top: 10px;
        .left {
          width: 14%;
          text-align: right;
        }
        .right {
          width: 86%;
        }
      }
    }
  }
  .ant-modal-footer {
    border: 0;
    text-align: center;
  }
}

/* 复查材料预览modal框 */
.previewImgModal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>