<style lang="less" >
.ant-tabs .ant-tabs-top-content.ant-tabs-content-animated {
  height: 100%;
  // padding:  0 0 20px 0;
  // width: 100%;
  // overflow-y: auto;
  // border: 1px solid #dae0e6;
}
.addplan {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #ebf0f5;
  .taskcontainer {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    .taskTitle {
      width: 100%;
      height: 52px;
      padding: 10px 20px;
      border-bottom: 1px solid #e6ecf2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tit {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .taskInfo {
      width: 100%;
      padding: 20px 32px 0 20px;
      .ant-form-item {
        height: 45px;
        width: 30%;
        margin-bottom: 10px;
        //  &:last-child{
        // width: 50% !important;
        // }
        // .ant-form-item-control {
        // width: 200px;
        // }
      }
    }
    .tabs_container {
      width: 100%;
      height: 700px;
      padding: 0 20px 20px 20px;
      margin-top: 20px;
      flex-grow: 1;
      position: relative;
      // display: flex;
      .paperInfo {
        width: calc(100% - 40px);
        height: 100%;
        position: absolute;
        bottom: 20px;
        left: 20px;
        // overflow: hidden;

        .paperContent {
          width: 100%;
          height: 100%;
          // background-color: #ebf0f5;
          overflow-y: scroll;
          // padding: 10px 10px 20px 10px;
          margin-top: -16px;
          // border: 1px solid #dae0e6;
        }
        .line-plan {
          width: 100%;
          height: 100%;
          margin-top: -8px;
          border-left: 1px solid rgba(232, 232, 232);
          border-right: 1px solid rgba(232, 232, 232);
        }
      }
    }
    // .export-btn{

    // }
    .paper-title {
      padding: 0 20px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 600;
      height: 36px;
      line-height: 36px;
      position: relative;
      &::before {
        content: "";
        width: 5px;
        height: 18px;
        background-color: #565e66;
        position: absolute;
        top: 8px;
        left: 20px;
      }
      h6 {
        padding-left: 10px;
      }
    }
    .flex-com {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #e8e8e8;
    }
    .no-paper {
      min-height: 500px;
      .paper-title1 {
        .border-wrap {
          border-bottom: 1px dashed #e8e8e8;
          h6 {
            padding-left: 10px;
          }
        }
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 600;
        height: 36px;
        line-height: 36px;
        padding: 0 20px;
        position: relative;
        // &::before{
        //   content: '';
        //   width: 5px;
        //   height: 18px;
        //   background-color: #565E66;
        //   position: absolute;
        //   top: 8px;
        //   left: 20px;
        // }
      }
    }
  }
}
.box {
  .changci-wrap {
    margin-top: 10px;
    width: 100%;
    min-height: 32px;
    display: flex;
    margin-bottom: 10px;
    padding-left: 40px;

    .ant-checkbox-group-item {
      display: block;
      min-height: 40px;
      line-height: 40px;
    }
    .ant-checkbox-wrapper {
      border-bottom: 1px dashed #e8e8e8;
    }
    .cc-wrap {
      flex: 1;
    }
  }
}
</style>
<template>
  <div class="addplan">
    <div class="taskcontainer">
      <div class="taskTitle">
        <div class="tit">任务制定</div>
        <div>
          <a-button
            :disabled="disableInfo"
            @click="addPlannew"
            type="primary"
            class="btn"
          >
            <icon-font style="font-size: 20px" type="iconfabu" />发布任务
          </a-button>
          <a-button @click="callback" class="btn">
            <a-icon type="left" />返回
          </a-button>
        </div>
      </div>
      <div class="paper-title" style="margin-top: 20px">
        <h6 style="border-bottom: 1px dashed #e8e8e8">任务基础信息</h6>
      </div>
      <div class="taskInfo">
        <a-form-model
          class="from_model"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="inline"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item ref="taskName" label="任 务 名 称" prop="taskName">
            <a-input
              :disabled="disableInfo"
              v-model="form.taskName"
              placeholder="示例：XX中学第一场送卷任务"
              @blur="
                () => {
                  $refs.taskName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>

          <a-form-model-item label="押 运 类 型" prop="escortTypeId">
            <a-select
              :disabled="disableInfo"
              v-model="form.escortTypeId"
              @change="escortType"
              placeholder="请选择押运类型"
            >
              <a-select-option value="1">领卷</a-select-option>
              <a-select-option value="2">返卷</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="开启测试任务">
            <a-checkbox
              :disabled="disableInfo"
              v-model="form.isTest"
              @change="onCheckboxChange"
            />
          </a-form-model-item>

          <a-form-model-item label="起 始 机 构" prop="startOrgCode">
            <!-- <a-cascader
              :disabled="disableInfo"
              :value="startArr"
              change-on-select
              :options="options"
              :allowClear="false"
              :fieldNames="fieldNames"
              placeholder="请选择~"
              @change="changeOrgcodeStart"
            />-->
            <a-tree-select
              :disabled="disableInfo"
              v-model="form.startOrgName"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="options"
              placeholder="请选择起始机构"
              @change="changeOrgcodeStart"
            />
          </a-form-model-item>
          <a-form-model-item label="目 的 机 构" prop="endOrgCode">
            <!-- <a-cascader
              :disabled="disableInfo"
              :value="endArr"
              change-on-select
              :options="options"
              :allowClear="false"
              :fieldNames="fieldNames"
              placeholder="请选择"
              @change="changeOrgcodeEnd"
            />-->
            <a-tree-select
              :disabled="disableInfo"
              v-model="form.endOrgName"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="options"
              placeholder="请选择目的机构"
              @change="changeOrgcodeEnd"
            ></a-tree-select>
          </a-form-model-item>

          <!-- <a-form-model-item ref="escortPerson" label="押运人员">
            <a-select
              :disabled="disableInfo"
              v-model="form.escortPerson"
              @change="getPersonCode"
              @focus="handleChangePerson"
              placeholder="请选择押运人员"
            >
              <a-select-opt-group label="起始机构">
                <a-select-option
                  v-for="item in startPerson"
                  :key="item.index"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select-opt-group>

              <a-select-opt-group label="目的机构">
                <a-select-option
                  v-for="item in endPerson"
                  :key="item.index"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-model-item> -->

          <a-form-model-item label="计划开始时间">
            <a-date-picker
              :disabled="disableInfo"
              v-model="form.planStartTime"
              @change="changeStartTime"
              :disabled-date="disabledStartDate"
              show-time
              type="date"
              :allowClear="false"
              placeholder="请选择开始时间"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item label="计划结束时间">
            <a-date-picker
              :disabled="disableInfo"
              v-model="form.planEndTime"
              @change="changeEndTime"
              :allowClear="false"
              :disabled-date="disabledEndDate"
              show-time
              type="date"
              placeholder="请选择结束时间"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            v-show="startorgtypeid == '4' || endorgtypeid == '4'"
            label="押运场次"
            prop="cc"
          >
            <a-tooltip>
              <template slot="title">
                {{ info }}
              </template>
              <a
                @click="handleChooseChangci"
                style="
                  display: inline-block;
                  max-width: 600px;
                  text-decoration: underline;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
                >{{ info }}</a
              >
            </a-tooltip>
            <!-- <a @click="handleChooseChangci" style="text-decoration: underline;">{{info}}</a> -->
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="paper-title">
        <div class="flex-com">
          <h6>试卷信息</h6>
        </div>
      </div>
      <!-- <div class="export-btn"><a-button>导出试卷信息</a-button></div> -->
      <div class="tabs_container">
        <a-tabs class="paperInfo" tabPosition="top" animated type="card">
          <!-- v-if="isShow && isPaperDemand===true" -->
          <a-tab-pane
            v-if="isShow"
            class="paperContent"
            key="1"
            tab="试卷信息"
            forceRender
          >
            <div style="width: 100%; height: 94%">
              <!-- <iframe :src="iframeUrl" frameborder="0" style="width:100%;height:100%"></iframe> -->
              <PaperList
                v-if="
                  form.endOrgCode &&
                  !(startorgtypeid == '4' || endorgtypeid == '4')
                "
                :orgCode="form.endOrgCode"
                :orgName="form.endOrgName"
                :esCode="form.escortCount"
              />
              <!-- 选择了考点任务时候，无试卷信息 -->
              <div v-else class="no-paper">
                <div class="paper-title1"></div>
                <div class="no-paper-info">
                  <a-result title="当前任务无试卷信息！">
                    <template #icon>
                      <!-- <a-icon type="smile" theme="twoTone" /> -->
                      <a-icon type="frown" theme="twoTone" />
                    </template>
                  </a-result>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane class="line-plan" key="2" tab="线路规划" forceRender>
            <div>
              <div class="taskMap">
                <line-plan
                  ref="linePlan"
                  :startPo="this.startOrg || []"
                  :planType="this.planType"
                  :newDriveArea="this.driveArea"
                  :taskStatus="this.taskStatus"
                  :endPo="this.endOrg || []"
                ></line-plan>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="box" ref="box">
        <a-modal
          :width="800"
          :getContainer="() => $refs.box"
          title="押运场次设置"
          @cancel="() => (visible = false)"
          :maskClosable="false"
          :destroyOnClose="true"
          :visible="visible"
        >
          <!-- 押运场次选择 只有在考点任务才会显示 -->
          <div class="changci-wrap">
            <label style="width: 70px" for="">押运场次：</label>
            <div class="cc-wrap">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onChangeChangciAll"
                style="display: block; height: 30px"
                >全选</a-checkbox
              >
              <a-checkbox-group
                v-model="form.escortCount"
                :options="plainOptions"
                @change="onChangeChangci"
              />
            </div>
          </div>
          <template slot="footer">
            <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
            <a-button key="submit" type="primary" @click="handleOk"
              >保存</a-button
            >
          </template>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/utils/global";
import {
  findParent,
  getArrayObj,
  getStore,
  findAllParent,
  debounce,
} from "../../../utils/util.js";
import Vue from "vue";
import LinePlan from "./ChildCon/LinePlan";
import PaperList from "../EscortTask/ChildCon/PaperList";
import moment from "moment";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortPlan"
);
import {
  Select,
  Button,
  Icon,
  Input,
  Form,
  FormModel,
  DatePicker,
  Tabs,
  Cascader,
  message,
  TreeSelect,
  Checkbox,
  Result,
  Modal,
  Tooltip,
  Spin,
} from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js",
});
Vue.use(Select)
  .use(TreeSelect)
  .use(Form)
  .use(Cascader)
  .use(Spin)
  .use(FormModel)
  .use(Button)
  .use(Icon)
  .use(DatePicker)
  .use(Tabs)
  .use(Checkbox)
  .use(Modal)
  .use(Result)
  .use(Tooltip)
  .use(Input);
Vue.prototype.$message = message;
Vue.prototype.$warning = Modal.warning;
const iframeUrlExid = JSON.parse(getStore("examId"));
const iframeUrlOrgCode = JSON.parse(getStore("userInfo")).orgcode;

export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      taskStatus: "",
      disableInfo: false,
      // isPaperDemand: JSON.parse(getStore("systemConf")).functionStatus
      //   .paperDemand,
      // iframeUrl:
      //   baseUrl +
      //   "PaperDemand/GetSubjectInfoDetailApp?exid=" +
      //   iframeUrlExid +
      //   "&orgcode=" +
      //   iframeUrlOrgCode +
      //   "&detail=true",
      startArr: [],
      statusArrSE: true,
      endArr: [],
      istaskId: "",
      isShow: false,
      planType: "", //传到地图组件的线路类型
      driveArea: "", //电子围栏
      startOrg: [], //起始点坐标
      endOrg: [], // 结束点坐标
      // personList:,
      startOrgName: "",
      endOrgName: "",
      visible: false,
      escortCount: [],
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      orgtypeid: "",
      loading: false,
      form: {
        escortTypeId: undefined,
        carsPersons: {
          dutyPersonName: "",
          dutyPersonId: "",
        },
        taskId: "",
        taskName: "",
        escortPerson: "",
        escortPersonId: "",
        startOrgCode: "",
        endOrgCode: "",
        startOrgName: undefined,
        endOrgName: undefined,
        planStartTime: null,
        planEndTime: null,
        paperCnt: "",
        createOrgCode: JSON.parse(getStore("userInfo")).orgcode,
        mapCircuit: {
          circuitType: "",
          circuitArea: "",
        },
        examId: "",
        cars: [],
        isTest: false,
        escortCount: [],
      },
      options: this.$store.state.app.orgs,
      fieldNames: {
        label: "orgName",
        value: "orgCode",
        children: "children",
        longitude: "longitude",
        latitude: "latitude",
      },
      // mapCircuit: {
      //   circuitType: "",
      //   circuitArea: ""
      // },
      rules: {
        taskName: [
          { required: true, message: "请填写任务名称！", trigger: "blur" },
        ],
        escortTypeId: [
          { required: true, message: "请选择任务类型！", trigger: "blur" },
        ],
        startOrgCode: [
          { required: true, message: "请选择起始机构！", trigger: "change" },
        ],
        endOrgCode: [
          { required: true, message: "请选择目的机构！", trigger: "change" },
        ],
        cc: [{ required: true, message: "请选择场次！", trigger: "change" }],
      },
      startorgtypeid: "",
      endorgtypeid: "",
      info: "点击设置押运场次",
      startOrgInfo: {},
      endOrgInfo: {},
    };
  },
  components: {
    LinePlan,
    IconFont,
    PaperList,
  },
  created() {
    this.istaskId = this.$route.query.taskId;
    this.taskStatus = this.$route.query.taskStatus;
    // 获取当前用户是否考点
    // this.orgtypeid=JSON.parse(getStore("userInfo")).orgtypeid;
    // console.log(this.taskStatus)
    this.delateX();
    if (this.istaskId != "") {
      if (
        this.taskStatus == "3" ||
        this.taskStatus == "4" ||
        this.taskStatus == "5"
      ) {
        this.disableInfo = true; //当任务状态为完成时任务不能修改，disabled为true
      }
      this.isChange = true;
      this.getEscortDetailAsync(this.istaskId);
    } else {
      this.isChange = false;
    }
  },
  mounted() {
    console.log(this.$store.state.app.orgs);
    //获取考试场次及科目
    this.$api.init.getSessionAndSubject().then((res) => {
      if (res.result) {
        this.escortCount = res.data;
        // 将返回的数据格式处理成CheckBoxGroup需要的格式
        let arr = [];
        this.escortCount.map((item) => {
          let obj = {};
          const subName = item.subjects.map((item) => item.subjectName);
          obj["label"] = item.sessionName + " " + " " + subName.join("、");
          obj["value"] = item.sessionCode;
          arr.push(obj);
        });
        this.plainOptions = arr;
      }
    });
  },

  computed: {
    ...mapState(["changeInfoX", "addPersonList", "startPerson", "endPerson"]),
  },
  watch: {
    "$store.state.app.orgs": function (val) {
      this.options = val;
    },
    "$store.state.escortPlan.changeInfoX": function () {
      this.changeItem();
    },
    "$store.state.escortPlan.changeInfoX.escortCount": function (val) {
      if (val && val.length) {
        this.changeItem();
      }
    },
    "form.startOrgCode"(val) {
      if (val) {
        this.startOrgInfo = this.returnOrgInfo(val) || {};
        this.startorgtypeid = this.startOrgInfo.orgTypeId;
        console.log(this.startorgtypeid);
      }
    },
    "form.endOrgCode"(val) {
      if (val) {
        this.endOrgInfo = this.returnOrgInfo1(val) || {};
        this.endorgtypeid = this.endOrgInfo.orgTypeId;
        console.log(this.endorgtypeid);
      }
    },
  },
  methods: {
    moment,
    debounce,
    ...mapActions([
      "getEscortDetailAsync",
      "setEscortAsync",
      "getPersonAsync",
      "getPersonStartAsync",
      "getPersonendAsync",
    ]),
    ...mapMutations([
      "changeEscortTypeId",
      "addPlanFabu",
      "assionPerson",
      "delateX",
    ]),
    changeItem() {
      if (this.istaskId != "") {
        this.form = JSON.parse(JSON.stringify(this.changeInfoX));
        if (this.form.session) {
          this.form.escortCount = JSON.parse(
            JSON.stringify(this.changeInfoX.escortCount)
          );
        }
        // 处理后端返回的session场次
        this.form.escortCount = this.form.escortCount || [];
        this.indeterminate =
          !!this.form.escortCount.length &&
          this.form.escortCount.length < this.plainOptions.length;
        this.checkAll =
          this.form.escortCount.length === this.plainOptions.length;
        // 页面显示场次
        this.changeText();
        if (this.form.planStartTime) {
          this.form.planStartTime = moment(
            this.changeInfoX.planStartTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (this.form.planEndTime) {
          this.form.planEndTime = moment(this.changeInfoX.planEndTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (this.form.escortTypeId == "1") {
          //判断tab页试卷详情是否显示
          this.isShow = true;
        }
        if (
          this.form.startOrgCode != undefined ||
          this.form.endOrgCode != undefined
        ) {
          //  console.log(this.form.startOrgCode,this.form.endOrgCode)
          if (this.statusArrSE) {
            this.startOrg = getArrayObj(
              this.$store.state.app.orgTree,
              this.form.startOrgCode
            );
            this.endOrg = getArrayObj(
              this.$store.state.app.orgTree,
              this.form.endOrgCode
            );
          }
          this.getPersonStartAsync(this.form.startOrgCode);
          this.getPersonendAsync(this.form.endOrgCode);

          if (this.form.mapCircuit.circuitType) {
            this.planType = this.form.mapCircuit.circuitType;
          }
          if (this.form.mapCircuit.circuitArea) {
            this.driveArea = this.form.mapCircuit.circuitArea;
          }
          // console.log(this.driveArea, this.planType);
        }
      }
      // return "";
    },
    //返回目的机构的信息
    returnOrgInfo(val) {
      const tree = this.$store.state.app.orgTree;
      // let type = null
      for (let item of tree) {
        if (item.orgCode == val) {
          return item;
        }
      }
    },
    returnOrgInfo1(val) {
      const tree = this.$store.state.app.orgTree;
      // let type = null
      for (let item of tree) {
        if (item.orgCode == val) {
          return item;
        }
      }
    },
    // 保存场次
    handleOk() {
      if (!this.form.escortCount.length) {
        return this.$message.warn("请选择押运场次！");
      }
      this.visible = false;
      // 页面显示场次
      this.changeText();
    },
    changeText() {
      const { escortCount } = this; // 请求回来的场次列表
      console.log(escortCount, "escortCount");
      const escortCount1 = this.form.escortCount; // 选择的场次id

      let sessionNameArr = [];
      for (let i = 0; i < escortCount1.length; i++) {
        for (let j = 0; j < escortCount.length; j++) {
          if (escortCount[j].sessionCode === escortCount1[i]) {
            sessionNameArr.push(escortCount[j].sessionName);
          }
        }
      }
      this.info = sessionNameArr.join("、") || "点击设置押运场次";
    },

    // 点击选择场次
    handleChooseChangci() {
      this.visible = true;
      // 设置场次文字样式
      this.$nextTick(() => {
        const ele =
          document.getElementsByClassName("ant-checkbox-group-item") || [];
        Array.from(ele).map((item) => {
          item.childNodes[1].innerHTML = `<span style="font-weight: 600; font-size: 14px;margin-right:10px;">${item.childNodes[1].textContent.substring(
            0,
            6
          )}</span>  ${item.childNodes[1].textContent.slice(6)} `;
        });
      });
      // 页面显示场次
      this.changeText();
    },

    // 单选
    onChangeChangci(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
      this.changeInfoX.escortCount = checkedList;
    },
    // 全选
    onChangeChangciAll(e) {
      const { plainOptions } = this;
      let value = plainOptions.map((item) => item.value);
      this.form.escortCount = e.target.checked ? value : [];
      this.changeInfoX.escortCount = e.target.checked ? value : [];
      this.indeterminate = false;
      this.checkAll = e.target.checked;
      // this.form.escortCount = this.checkedList;
      // this.changeInfoX.escortCount = this.checkedList;
    },

    onCheckboxChange() {},
    //更改押运工作人员
    changeUpdataPersonSome(value, option) {
      // console.log("duePersonArr.arr1",this.duePersonArr.arr1)

      let arr = this.tempPersons.filter((item) => item.personType == 1);
      for (let i in value) {
        arr.push({
          personType: 2,
          personId: value[i],
          personName: option[i].componentOptions.children[0].text,
        });
      }
      this.tempPersons = JSON.parse(JSON.stringify(arr));
    },
    //禁选日期
    disabledStartDate(startValue) {
      const endValue = moment(this.form.planEndTime);
      return (
        endValue < startValue || startValue <= moment().subtract(1, "days")
      );
    },
    //禁选日期
    disabledEndDate(endValue) {
      const startValue = moment(this.form.planStartTime, "YYYY-MM-DD HH:mm:ss");
      return startValue > endValue || endValue <= moment().subtract(1, "days");
    },
    forGetItem(state, id) {
      for (let i = 0; i < state.orgTree.length; i++) {
        if (state.orgTree[i].orgCode == id) {
          // console.log(state.orgTree[i])
          return state.orgTree[i];
        }
      }
    },
    getArrCode(id) {
      let item = this.forGetItem(this.$store.state.app, id);
      // console.log(item)
      if (item != undefined) {
        let arr = [];
        let arrr = findAllParent(item, this.options, arr).reverse();
        arrr.push(item);
        let brr = [];
        for (let i = 0; i < arrr.length; i++) {
          brr.push(arrr[i].orgCode);
        }
        // console.log(brr);
        return brr;
      }
    },
    escortType(v) {
      this.escortTypeId = v;
      if (v == 1) {
        this.isShow = true;
      } else if (v == 2) {
        this.isShow = false;
      }
    },
    changeOrgcodeStart(value, data, extra) {
      console.log(extra.triggerNode.dataRef);
      //  startorgtypeid=4 是否为考点
      this.startorgtypeid = extra.triggerNode.dataRef.orgTypeId;
      this.form.startOrgCode = value;
      if (data) {
        this.form.escortPerson = "";
        this.statusArrSE = false;

        let arr = [];
        arr.push(parseFloat(extra.triggerNode.dataRef.longitude));
        arr.push(parseFloat(extra.triggerNode.dataRef.latitude));

        // console.log(arr);
        this.startOrg = arr;
        let code = "";
        if (value.length > 0) {
          code = value;
        } else {
          code = "";
        }
        // [long,lat]

        this.getPersonStartAsync(code);
      }
    },
    changeOrgcodeEnd(value, data, extra) {
      console.log(extra.triggerNode.dataRef.orgTypeId);
      //  endorgtypeid=4 是否为考点
      this.endorgtypeid = extra.triggerNode.dataRef.orgTypeId;
      this.form.endOrgCode = value;
      if (data) {
        console.log(value);
        this.form.escortPerson = "";
        this.statusArrSE = false;

        let arr = [];
        arr.push(parseFloat(extra.triggerNode.dataRef.longitude));
        arr.push(parseFloat(extra.triggerNode.dataRef.latitude));
        // console.log(arr);
        this.endOrg = arr;
        let code = "";
        if (value) {
          code = value;
        } else {
          code = "";
        }
        this.getPersonendAsync(code);
      }
    },
    changeStartTime(value) {
      this.form.planStartTime = moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    changeEndTime(value) {
      this.form.planEndTime = moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    callback(key) {
      const { keepAlive, search } = this.$route.query;
      if (keepAlive) {
        //判断是否从计划过来并且是否需要缓存页面数据
        this.$router.push({
          path: "/EscortPlan",
          query: {
            search,
            keepAlive,
          },
        });
      } else {
        this.$router.go(-1);
      }

      this.form = {};
    },
    addPlan() {
      if (!this.form.escortTypeId) {
        this.$message.error("请先选择任务类型~！");
        return;
      }
      if (!this.form.taskName) {
        this.$message.error("请先填写任务名称~！");
        return;
      }
      if (!this.form.startOrgCode) {
        this.$message.error("请先选择起始机构~！");
        return;
      }
      if (!this.form.endOrgCode) {
        this.$message.error("请先选择结束机构~！");
        return;
      }
      if (this.form.planStartTime > this.form.planEndTime) {
        this.$message.error("开始时间不能大于结束时间~！");
        return;
      }
      if (this.isChange) {
        //修改
        if (this.$refs.linePlan.isDriveArea == true) {
          this.$refs.linePlan.saveArea();
        } else {
          this.$refs.linePlan.driveArea = "";
        }

        this.form.mapCircuit = {
          circuitType: this.$refs.linePlan.drivingOption,
          circuitArea: this.$refs.linePlan.driveArea,
        };
      } else {
        //新增
        if (this.$refs.linePlan.isDriveArea == true) {
          this.$refs.linePlan.saveArea();
        } else {
          this.$refs.linePlan.driveArea = "";
        }

        this.form.mapCircuit = {
          circuitType: this.$refs.linePlan.drivingOption,
          circuitArea: this.$refs.linePlan.driveArea,
        };
      }

      // 将场次更改数组更改为字符串
      this.form.escortCount = this.form.escortCount.toString();
      this.form.createOrgCode = JSON.parse(getStore("userInfo")).orgcode;

      // 如果目的机构是考点任务，则半段押运场次是否选择
      if (
        (this.startorgtypeid == "4" || this.endorgtypeid == "4") &&
        !this.form.escortCount.length
      ) {
        return this.warning();
      }
      console.log(this.form);
      this.addPlanFabu(this.form);
      setTimeout(() => {
        this.setEscortAsync();
        this.callback();
      }, 100);
    },
    // 如果目的机构是考点任务，则半段押运场次是否选择
    warning() {
      this.$warning({
        title: "当前任务为考点任务，请先设置好押运场次后再发布！",
        content: "",
        onOk: () => {
          this.visible = true;
        },
      });
    },
    addPlannew() {
      // console.log('in');
      debounce(this.addPlan(), 20000, true);
    },
    handleChangePerson() {
      if (this.form.startOrgCode == "" || this.form.endOrgCode == "") {
        this.$message.error("请先选择机构");
      }
      // this.assionPerson();
    },
    getPersonCode(value, option) {
      this.form.escortPersonId = value;
      this.form.escortPerson = option.componentOptions.children[0].text;
      // console.log(this.form.escortPersonId, this.form.escortPerson);
    },
  },
};
</script>

