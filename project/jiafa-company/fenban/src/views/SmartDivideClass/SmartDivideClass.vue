<template>
  <div class="samrt-divide-class">
    <div class="bread">
      <span>智能分班</span> / <span>新高考分班</span> /
      <span>{{
        divideclassType === "1"
          ? "选考分班"
          : divideclassType === "2"
          ? "学考分班"
          : ""
      }}</span>
    </div>
    <div class="opration">
      <div class="opration-left">
        <span class="fh">
          <a-icon
            type="left-circle"
            style="margin-right: 8px"
            @click="goBack"
          />
          {{
            divideclassType === "1"
              ? "选考分班"
              : divideclassType === "2"
              ? "学考分班"
              : "--"
          }}
        </span>
        <span>剩余未分班人员<span class="count">{{ count }}</span>人</span>
      </div>

      <div class="opration-right">
        <!-- DivideclassType 1 - 选考分班  2 - 学考分班 -->
        <a-button
          class="mr themeBtn"
          :loading="DCbtnLoadingStatus"
          :disabled="DCbtnLoadingStatusDisabled"
          @click="handleSetDivideClassType"
        >
          <!-- <a-icon v-if="!DCbtnLoadingStatus" type="retweet" /> -->
          <svg-icon
            class="op_daoru"
            icon-class="menu_2"
            v-if="!DCbtnLoadingStatus"
          ></svg-icon>
          {{
            divideclassType === "1"
              ? "学考分班"
              : divideclassType === "2"
              ? "选考分班"
              : "--"
          }}
        </a-button>

        <a-button
          class="mr yellowBtn"
          :loading="checkBntLoading"
          :disabled="checkBntDisabled"
          @click="handleOpenDetectionAndAutoModalCopy"
        >
          <svg-icon
            class="op_daoru"
            icon-class="menu_2"
          ></svg-icon>
          检测/自动分班
        </a-button>
        <a-tooltip
          v-if="!isStuList"
          trigger="click"
        >
          <template slot="title"> 无人员名单下不可导入 </template>
          <a-button
            disabled
            @click="handleOpenImportFileDrawer"
          >
            <svg-icon
              class="op_daoru"
              icon-class="op_daoru"
            ></svg-icon>
            导入
          </a-button>
        </a-tooltip>
        <a-button
          v-else
          @click="handleOpenImportFileDrawer"
        >
          <svg-icon
            class="op_daoru"
            icon-class="op_daoru"
          ></svg-icon>导入
        </a-button>
      </div>
    </div>
    <div class="con-header">
      <div class="header-left">
        <a-button
          class="themeBtn add-group"
          v-if="divideclassType === '1'"
          :disabled="DCbtnLoadingStatus"
          @click="handleOpenAddGropuDrawer($event, { type: 'create' })"
        >
          <a-icon
            type="plus"
            class=""
          />添加分组
        </a-button>
        <span :style="divideclassType === '1' ? 'margin-left:20px;' : ''">
          开班人数检测：
          <a-input-number
            v-model="minValue"
            :min="1"
            :max="1000"
            :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
            :parser="(value) => value"
          />
          <span style="margin: 0 5px">~</span>
          <a-input-number
            v-model="maxValue"
            :min="1"
            :max="1000"
            :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
            :parser="(value) => value"
          />
          <a-button
            class="themeBtn ml"
            @click="checkNum"
          >检测</a-button>
        </span>
      </div>
      <div class="header-right">
        <span class="mr">最后一次保存时间：<span class="time">{{
            dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") || "----"
          }}</span></span>
        <a-button @click="goToResults">
          <svg-icon
            class="op_daoru"
            icon-class="ylfbjg"
          ></svg-icon>
          预览分班结果
        </a-button>
      </div>
    </div>
    <a-spin
      :spinning="pageContentLoading"
      :delay="delayTime"
      tip="加载中..."
    >
      <div class="content">
        <GroupAndClass
          v-for="item in groupList"
          :key="item.groupId"
          :group="item"
          @handleOpenAddGropuDrawer="handleOpenAddGropuDrawer"
          @addAdminClass="addAdminClass"
          @getBaseClassData="getBaseClassData"
        />
      </div>
    </a-spin>
    <!-- 行政班级-> 查看人员名单弹窗 -->
    <PersonalList v-if="adminClassStatus" />
    <!-- 行政班级-> 删除组合弹窗 -->
    <DelComModal />
    <!-- 行政班级-> 编辑组合弹窗 -->
    <EditComModal
      v-if="editModalStatus"
      :editComInfo="editComInfo"
    />
    <!-- 行政班级->教学班级查看人员弹窗 -->
    <TeachPersonList v-if="teachPersonModalStatus" />
    <StudyPersonList v-if="studyPersonListStatus" />
    <!-- 教学班操作 ->合并班级 -->
    <MergeClass
      ref="mergeClass"
      v-if="mergeClassModalStatus"
      @getBaseClassData="getBaseClassData"
    />
    <selectStuInMergeModal v-if="stuListInMergeStatus" />
    <!-- 添加行政班级-> 抽屉 -->
    <AddClass
      :combinationList="comList"
      :groupId="groupId"
      :adminClassId="adminClassId"
      :addClassVisible="addClassVisible"
      @closeAddClassVisible="closeAddClassVisible"
      @saveComListByChooseStuEvent="saveComListByChooseStuEvent"
      @getBaseClassData="getBaseClassData"
    />
    <!-- 添加分组-> 抽屉 -->
    <AddGroup
      :combinationList="differentCombinationList"
      :addGropuVisible="addGropuVisible"
      @getBaseClassData="getBaseClassData"
      @closeAddGropuVisible="closeAddGropuVisible"
      @addGroup="addGroup"
      @editGroup="editGroup"
      @saveCombinationListByChooseStuEvent="saveCombinationListByChooseStuEvent"
      ref="AddGroup"
    />
    <!-- 导入-> 抽屉 -->
    <ImportFile
      ref="ImportFile"
      @getBaseClassData="getBaseClassData"
    />
    <!-- 自动分班 -> 输入人数范围 -> 抽屉 -->
    <AutoDCNumScoped
      ref="AutoDCNumScoped"
      :planId="planId"
      @getBaseClassData="getBaseClassData"
    />
    <!-- 检测分班是否完成，自动分班-> 弹框 -->
    <DetectionAndAuto
      ref="DetectionAndAuto"
      :planId="planId"
    />
    <!-- 设置颜色modal -->
    <SettingColorModal @getBaseClassData="getBaseClassData" />
    <!-- 选考页面-选考无冲突，学考有冲突 -->
    <XKConflictDialog1
      ref="XKConflictDialog1"
      :planId="planId"
    ></XKConflictDialog1>
    <!-- 选考页面-选考，学考都无冲突 -->
    <XKXKNoConflicaDialog1
      ref="XKXKNoConflicaDialog1"
      :planId="planId"
    ></XKXKNoConflicaDialog1>
    <!-- 学考页面-选考有冲突 -->
    <XuanKconflictDialog2
      ref="XuanKconflictDialog2"
      :planId="planId"
    ></XuanKconflictDialog2>
    <!-- 学考页面-选考,学考都无冲突 -->
    <XKXKNoConflicaDialog2
      ref="XKXKNoConflicaDialog2"
      :planId="planId"
    ></XKXKNoConflicaDialog2>
  </div>
</template>

<script>
import * as dayjs from "dayjs";

import PersonalList from "./ChildCom/adminClass/PersonalList";
import GroupAndClass from "./ChildCom/GroupAndClass";
import DelComModal from "./ChildCom/adminClass/DelComModal";
import EditComModal from "./ChildCom/adminClass/EditComModal";
import TeachPersonList from "./ChildCom/adminClass/TeachPersonList";
import StudyPersonList from "./ChildCom/adminClass/StudyPersonList";
import AddClass from "./ChildCom/adminClass/AddClass";
import AddGroup from "./ChildCom/Group/AddGroup";
import ImportFile from "./ChildCom/ImportFile";
import AutoDCNumScoped from "./ChildCom/AutoDCNumScoped";
import DetectionAndAuto from "./ChildCom/DetectionAndAuto";
import MergeClass from "./ChildCom/adminClass/MergeClass";
import selectStuInMergeModal from "./ChildCom/adminClass/selectStuInMergeModal";
import SettingColorModal from "@/components/divide/SettingColorModal";
import { mapState, mapActions, mapMutations } from "vuex";
import XKConflictDialog1 from "./ChildCom/NewHintDialog/XKConflictDialog1.vue"; // 选考页面-选考无冲突，学考有冲突
import XKXKNoConflicaDialog1 from "./ChildCom/NewHintDialog/XKXKNoConflicaDialog1.vue"; // 选考页面-选考无冲突，学考有冲突
import XuanKconflictDialog2 from "./ChildCom/NewHintDialog/XuanKconflictDialog2.vue"; // 学考页面-选考有冲突
import XKXKNoConflicaDialog2 from "./ChildCom/NewHintDialog/XKXKNoConflicaDialog2.vue"; // 学考页面-选考，学考都无冲突

export default {
  name: "SmartDivideClass",
  components: {
    GroupAndClass,
    PersonalList,
    DelComModal,
    AddClass,
    AddGroup,
    EditComModal,
    TeachPersonList,
    StudyPersonList,
    ImportFile,
    AutoDCNumScoped,
    DetectionAndAuto,
    MergeClass,
    selectStuInMergeModal,
    SettingColorModal,
    XKConflictDialog1,
    XKXKNoConflicaDialog1,
    XuanKconflictDialog2,
    XKXKNoConflicaDialog2,
  },
  data() {
    return {
      groupList: [], // 整个组合和行政班数据
      addGropuVisible: false, // 添加分组抽屉visible
      combinationList: [], // 科目组合列表
      addGroupCombinationList: [], // 添加组合 请求接口传递的数据
      differentCombinationList: [], // 添加分组和添加人员的 clist
      editComInfo: {},
      delayTime: 3, // 延迟显示加载效果的时间（防止闪烁）
      comList: [], //科目组合列表---组合下新建行政班级时赋值
      groupId: "",
      addClassVisible: false, //添加行政班级弹窗visible
      minValue: 40,
      maxValue: 45,
      DCtype: "0", //  分班类型，string（0-选考，1-学考）
      planId: "", // 方案id
      classConflict: {
        classIsConflict: false, // 班级是否有冲突
        classIsConflictList: [], // 冲突的班级列表
        accomplishState: null, // 选考，学考是否有冲突
      },
      checkBntLoading: false, // 检测/自动分班 loading
      checkBntDisabled: false, // 检测/自动分班 禁用
      DCbtnLoadingStatusDisabled: false, // 学考，选考分班按钮禁用
      adminClassId: '' // 子组件传过来的行政班级id
    };
  },
  provide() {
    return {
      //子组件调用的名字：对应的方法（当前页面，祖父级元素的方法）
      //组合编辑组件中的参数传递
      openList: this.openList,
      getBaseClassData: this.getBaseClassData, //提供给子组件、孙子组件调用
      markClass: this.markClass, // 教学班级标记
    };
  },
  computed: {
    // 从vuex中获取模态框的状态
    // 行政班级-查看人员名单弹窗状态
    ...mapState("adminClass", [
      "count",
      "time",
      "adminClassStatus",
      "teachPersonModalStatus",
      "mergeClassModalStatus",
      "editModalStatus",
      "stuListInMergeStatus",
      "divideclassType",
      "pageContentLoading",
      "DCbtnLoadingStatus",
      "isStuList",
      "studyPersonListStatus",
      "divideclassOrgType",
    ]),
  },
  created() {
    this.planId = this.$route.query.planId || "";
    this.$store.commit("adminClass/setPlanId", this.planId);
  },
  mounted() {
    sessionStorage.setItem("isPersonList", false);
    // this.getSaveData();
    this.getBaseClassData();
  },
  methods: {
    dayjs,
    ...mapActions("adminClass", ["getSaveData"]),
    ...mapMutations("adminClass", ["setCreateOrEdit"]),
    goBack() {
      // this.$router.go(-1);DivideClassList
      const { id, name } = this.$route.query;
      this.$router.push({
        path: "/DivideClassList",
        query: { id, name },
      });
    },
    // provide openList传参
    openList(list) {
      this.editComInfo = list;
    },
    // 标记教学班级
    async markClass(name) {
      let planId = this.$route.query.planId || "";
      const type =
        this.divideclassType === "1"
          ? "0"
          : this.divideclassType === "2"
            ? "1"
            : "";
      let data = { planId, type };

      let res = await this.$api.chooseExam.getBaseClassData(data);
      if (res.code === "200") {
        let list = [...res.data];
        this.groupList.map((item) => {
          if (item.default) {
            this.combinationList = item.combinationList;
          }
        });
        list.map((item) => {
          //是否进行了点击上色：true点击了其中某一个，false未点击
          //目的：标记点击的是学考还是选考，并用于teach、StudyTeach判断有没有点击过
          //但是未用到：产品说暂时只加点击项的效果，先放着预备后期可能加》》现在只给teach传了值，StudyTeach未传
          item.giveColor = "";
          item.adminClassList.map((adminClassItem) => {
            // 1 - 选考分班  2 - 学考分班
            const type =
              this.divideclassType === "1"
                ? "chTeachClassList"
                : this.divideclassType === "2"
                  ? "stTeachClassList"
                  : "";
            adminClassItem[type].map((teachClassItem) => {
              if (teachClassItem.teachClassName.substring(0, 2) === name) {
                teachClassItem.isShowColor = true;
                teachClassItem.markColor = "rgba(242,121,121)";
                teachClassItem.markBgColor = "rgba(242,121,121,0.1)";
                item.giveColor = type;
              } else {
                teachClassItem.isShowColor = false;
              }
            });
          });
        });
        this.groupList = JSON.parse(JSON.stringify(list));
      }

      // this.$message.success('检测完成')
    },
    // 开班人数检测
    async checkNum() {
      const { minValue, maxValue } = this;
      if (minValue > maxValue) {
        return this.$message.warn("起始人数不可超过截止人数！", 5);
      }
      let planId = this.$route.query.planId || "";
      const type =
        this.divideclassType === "1"
          ? "0"
          : this.divideclassType === "2"
            ? "1"
            : "";
      let data = { planId, type };

      let res = await this.$api.chooseExam.getBaseClassData(data);
      if (res.code === "200") {
        let list = [...res.data];
        this.groupList.map((item) => {
          if (item.default) {
            this.combinationList = item.combinationList;
          }
        });
        list.map((item) => {
          item.adminClassList.map((adminClassItem) => {
            if (
              Number(adminClassItem.adminClassInfo.classTotal) <
              this.minValue ||
              Number(adminClassItem.adminClassInfo.classTotal) > this.maxValue
            ) {
              adminClassItem.isInScopeOfAdmin = true;
            }
            // 1 - 选考分班  2 - 学考分班
            const type =
              this.divideclassType === "1"
                ? "chTeachClassList"
                : this.divideclassType === "2"
                  ? "stTeachClassList"
                  : "";

            adminClassItem[type].map((teachClassItem) => {
              if (teachClassItem.isMerge) {
                teachClassItem.isInScopeOfTeach = false;
              } else {
                if (
                  Number(teachClassItem.teachClassNum) +
                  Number(teachClassItem.insertClassNum) <
                  this.minValue ||
                  Number(teachClassItem.teachClassNum) +
                  Number(teachClassItem.insertClassNum) >
                  this.maxValue
                ) {
                  teachClassItem.isInScopeOfTeach = true;
                }
              }
            });
          });
        });
        this.groupList = JSON.parse(JSON.stringify(list));
      }

      this.$message.success("检测完成", 5);
    },

    //打开新建行政班级弹窗并赋值
    addAdminClass(list, id, adminClassId) {
      this.comList = list;
      this.groupId = id;
      this.adminClassId = adminClassId; // 行政班级id
      this.addClassVisible = true;
    },
    //关闭添加行政班级弹窗
    closeAddClassVisible() {
      this.addClassVisible = false;
    },
    // 合并教学班级选择人员后参数传递
    listPassToMerge(list, info) {
      this.$refs.mergeClass.dealList(list, info);
    },
    // 预览分班结果
    goToResults() {
      // const planId = this.$route.query.planId || "";
      const { id, name, planId } = this.$route.query;
      // this.$router.push({
      //   path: "/ViewResult",
      //   query: { id, name, planId },
      // });
      // window.open(routeUrl.href, '_blank');
      //新开页面
      let routeUrl = this.$router.resolve({
        path: "/ViewResult",
        query: { id, name, planId }
      });

      window.open(routeUrl.href, '_blank');
    },
    // 添加分组抽屉
    handleOpenAddGropuDrawer(e, payload) {
      const { reqCombinationList, type, groupId } = payload;
      if (type === "create") {
        this.differentCombinationList = this.combinationList;
        this.setCreateOrEdit("create");
      } else if (type === "edit") {
        this.differentCombinationList = reqCombinationList;
        this.setCreateOrEdit("edit");
      }
      this.addGropuVisible = true;
      this.$refs.AddGroup.showDrawer(groupId);
    },
    // 关闭分组抽屉
    closeAddGropuVisible() {
      this.addGropuVisible = false;
    },

    // ********************
    // 打开导入抽屉
    handleOpenImportFileDrawer() {
      this.$refs.ImportFile.showDrawer();
    },
    // 打开 自动分班 输入人数范围抽屉
    handleOpenAutoDCNumScopedDrawer() {
      this.$refs.AutoDCNumScoped.showDrawer();
    },
    // 打开检测/自动分班模态框-点击切换学考分班-选考分班
    async handleOpenDetectionAndAutoModal() {
      this.$refs.DetectionAndAuto.showModal();
    },

    // 打开检测/自动分班模态框Copy-点击检测/自动分班执行
    async handleOpenDetectionAndAutoModalCopy() {
      this.DCbtnLoadingStatusDisabled = true;
      this.$store.commit("adminClass/setPageContentLoading", true);
      this.checkBntLoading = true;
      const { divideclassType, count } = this;
      await this.getSaveDataCopy();
      await this.getBaseClassDataCopy();
      // 必须再人数分完之后，再提示对应的弹窗
      if (count === 0) {
        // divideclassType 选考-1   学考-2
        // debugger;
        if (divideclassType === "1") {
          console.log(this.classConflict.classIsConflictList.length);
          // 1：先检测选考自身是否有冲突，通过冲突数组的长度来判断，是否有冲突
          // 获取自身有无冲突弹窗
          if (this.classConflict.classIsConflictList.length !== 0) {
            this.$store.commit("adminClass/setPageContentLoading", false);
            this.$warning({
              title: "方案检测",
              content: `检测到该方案“${this.classConflict.classIsConflictList.map(
                (item) => {
                  return item;
                }
              )}”存在人员冲突，请修改冲突后，再对该方案进行发布。`,
              okText: "取消",
            });
          }
          // 2：选考自身无冲突。检测学考是否有冲突
          else if (
            this.classConflict.classIsConflictList.length === 0 &&
            this.classConflict.accomplishState === "1"
          ) {
            this.$store.commit("adminClass/setPageContentLoading", false);
            this.$refs.XKConflictDialog1.showModal();
          }
          // 3：选考页面-学考，选考都无冲突
          else {
            this.$store.commit("adminClass/setPageContentLoading", false);
            this.$refs.XKXKNoConflicaDialog1.showModal();
          }
        } else {
          // 1:判断选考有冲突,this.classConflict.accomplishState === '0'，0 人员没分配 或者 选考有冲突，已经先判断count=0的情况
          if (this.classConflict.accomplishState === "0") {
            this.$store.commit("adminClass/setPageContentLoading", false);
            this.$refs.XuanKconflictDialog2.showModal();
          }
          // 2:学考页面-选考无冲突，学考有冲突
          else if (this.classConflict.classIsConflictList.length !== 0) {
            this.$store.commit("adminClass/setPageContentLoading", false);
            this.$warning({
              title: "方案检测",
              content: `检测到该方案“${this.classConflict.classIsConflictList.map(
                (item) => {
                  return item;
                }
              )}”存在人员冲突，请修改冲突后，再对该方案进行发布。`,
              okText: "取消",
            });
          }
          // 3:学考页面-学考，选考都无冲突
          else {
            // this.$store.commit("adminClass/setPageContentLoading", false);
            this.$refs.XKXKNoConflicaDialog2.showModal();
          }
        }
        //  debugger;
      } else {
        // 弹出人数没有分完的弹窗
        this.$refs.DetectionAndAuto.showModal();
      }
      this.checkBntLoading = false;
      this.DCbtnLoadingStatusDisabled = false;
      this.$store.commit("adminClass/setPageContentLoading", false);
    },

    // 通过getSaveDataCopy 来检测
    // 1：代表选考完成，学考有冲突
    // 2：代表 选考完成，学考也完成，都无冲突
    // 0 人员没分配 或者 选考有冲突
    async getSaveDataCopy() {
      let planId = this.$route.query.planId;
      const res = await this.$api.adminClass.getSaveData({
        planId: planId,
      });
      if (res.code === "200") {
        this.classConflict.accomplishState = res.data.accomplishState;
      } else {
        this.$message.warning(res.message);
      }
    },

    // 保存组合内选择了（有人员名单）的人数，前端缓存。 父组件方法
    saveCombinationListByChooseStuEvent(obj) {
      const { type, combinationId, insertStu, insertStuList } = obj;
      // 当前（父组件）更改props
      this.differentCombinationList = this.differentCombinationList.map(
        (item) => {
          if (item.combinationId === combinationId) {
            // 有人员名单情况下
            if (type === "isStuList") {
              return {
                ...item,
                insertStu,
                insertStuList,
              };
              // 无人员名单情况下
            } else if (type === "unStuList") {
              return {
                ...item,
                insertStu,
              };
            }
          }
          return { ...item };
        }
      );
      // 过滤未选择的组合，请求后台使用。
      this.addGroupCombinationList = this.differentCombinationList.filter(
        (item) => {
          if (item.insertStu) {
            return item;
          }
        }
      );
    },

    // 进行选考分班 或 学考分班
    // DCtype: '0', //  分班类型，string（0-选考，1-学考）
    // divideclassType: '1', // 分班类型： 选考分班还是学考分班 1 - 选考分班  2 - 学考分班
    handleSetDivideClassType() {
      const { divideclassType, count } = this;
      if (count > 0) {
        // return this.$message.warn(`检测到您还有${count}人还未进行选考分班！`)
        return this.handleOpenDetectionAndAutoModal();
      }
      try {
        this.checkBntDisabled = true;
        this.$store.commit("adminClass/setDCbtnLoadingStatus", true);
        this.$store.commit("adminClass/setPageContentLoading", true);
        if (divideclassType === "1") {
          // 当前是 1-选考分班 --> 学考分班
          this.$store.commit("adminClass/setDivideclassType", "2");
          this.DCtype = "1";
          this.getBaseClassData();
        } else if (divideclassType === "2") {
          // 当前是 1-学考分班 --> 选考分班
          this.$store.commit("adminClass/setDivideclassType", "1");
          this.DCtype = "0";
          this.getBaseClassData();
        }
        setTimeout(() => {
          this.$store.commit("adminClass/setPageContentLoading", false);
          this.$store.commit("adminClass/setDCbtnLoadingStatus", false);
          this.checkBntDisabled = false;
        }, 500);
      } catch (error) {
        this.$store.commit("adminClass/setPageContentLoading", false);
        this.$store.commit("adminClass/setDCbtnLoadingStatus", false);
        this.checkBntDisabled = false;
        throw new Error(error);
      }
    },
    // 新增行政班级-保存组合内选择了的人数
    saveComListByChooseStuEvent(obj) {
      const { combinationId, insertStu, insertStuList } = obj;
      this.comList = this.comList.map((item) => {
        if (item.combinationId === combinationId) {
          return {
            ...item,
            insertStu,
            insertStuList,
          };
        }
        return { ...item };
      });
    },
    // 获取组合和行政班级数据
    async getBaseClassData() {
      this.getSaveData();
      try {
        this.$store.commit("adminClass/setPageContentLoading", true);
        const planId = this.$route.query.planId || "";
        let { DCtype, divideclassType } = this;
        divideclassType === "1" ? (DCtype = "0") : (DCtype = "1");
        const params = { planId, type: DCtype };
        const res = await this.$api.chooseExam.getBaseClassData(params);

        if (res.code === "200") {
          this.groupList = [...res.data];
          this.$store.commit("adminClass/setPageContentLoading", false);
          this.groupList.map((item) => {
            if (item.isDefault) {
              this.combinationList = item.combinationList;
              this.differentCombinationList = item.combinationList;
            }
          });
        } else {
          this.groupList = [];
          setTimeout(() => {
            this.$store.commit("adminClass/setPageContentLoading", false);
          }, 1500);
        }
      } catch (error) {
        this.$store.commit("adminClass/setPageContentLoading", false);
        throw new Error(error);
      }
    },

    // 获取组合和行政班级数据-复制相同的方法,检测自身是否有冲突
    async getBaseClassDataCopy() {
      // 清空冲突班级数组
      this.classConflict.classIsConflictList = [];
      try {
        const planId = this.$route.query.planId || "";
        let { DCtype, divideclassType } = this;
        divideclassType === "1" ? (DCtype = "0") : (DCtype = "1");
        const params = { planId, type: DCtype };
        const res = await this.$api.chooseExam.getBaseClassData(params);

        if (res.code === "200") {
          // debugger
          // 分班组合列表
          const classIsConflictList = res.data;
          classIsConflictList.map((item1) => {
            item1.adminClassList.map((item2) => {
              if (item2.isConflict) {
                this.classConflict.classIsConflictList.push(
                  item2.adminClassName
                );
              }
            });
          });
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 添加分组
    async addGroup() {
      try {
        this.$refs.AddGroup.handleOkLoading = true;
        // 替换接口需要的字段名称。
        const addGroupCombinationList = this.addGroupCombinationList.map(
          (item) => ({
            ...item,
            combinationNum: item.insertStu,
            combinationStuList: item.insertStuList,
          })
        );
        // 删除接口不需要的字段名称。
        addGroupCombinationList.forEach((item) => {
          delete item.insertStu;
          delete item.insertStuList;
        });

        const planId = this.$route.query.planId || "";
        const params = { planId, list: [...addGroupCombinationList] };
        const res = await this.$api.chooseExam.addGroup(params);

        if (res.code === "200") {
          this.$message.success("添加分组成功！", 5);
          this.$refs.AddGroup.handleOkLoading = false;
          this.addGropuVisible = false;
          this.getBaseClassData();
          this.getSaveData();
        } else {
          this.$message.error("添加分组失败！" + res.message, 5);
          this.$refs.AddGroup.handleOkLoading = false;
        }
      } catch (error) {
        this.$refs.AddGroup.handleOkLoading = false;
        throw new Error(error);
      }
    },
    // 编辑分组
    async editGroup(groupId) {
      try {
        this.$refs.AddGroup.handleOkLoading = true;
        // 替换接口需要的字段名称。
        const addGroupCombinationList = this.addGroupCombinationList.map(
          (item) => ({
            ...item,
            combinationNum: item.insertStu,
            combinationStuList: item.insertStuList,
          })
        );
        // 删除接口不需要的字段名称。
        addGroupCombinationList.forEach((item) => {
          delete item.insertStu;
          delete item.combinationName;
          delete item.insertStuList;
        });
        const params = { groupId, list: [...addGroupCombinationList] };
        const res = await this.$api.chooseExam.editGroup(params);

        if (res.code === "200") {
          this.$message.success("保存成功！", 5);
          this.$refs.AddGroup.handleOkLoading = false;
          this.addGropuVisible = false;
          this.getBaseClassData();
          this.getSaveData();
        } else {
          this.$message.error("保存失败！" + res.message, 5);
          this.$refs.AddGroup.handleOkLoading = false;
        }
      } catch (error) {
        this.$refs.AddGroup.handleOkLoading = false;
        throw new Error(error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.mr {
  margin-right: 16px;
}
.ml {
  margin-left: 16px;
}
.samrt-divide-class {
  .bread {
    height: 32px;
    line-height: 32px;
  }
  .opration {
    height: 60px;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 60px;
    .opration-left {
      // width: 40%;
      .fh {
        font-size: 20px;
        margin: 0 8px 0 16px;
      }
      .count {
        font-size: 18px;
        font-weight: 600;
        font-style: italic;
        margin: 0 5px;
      }
    }
    .opration-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .con-header {
    height: 48px;
    line-height: 48px;
    margin: 8px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .header-left {
      // height: 48px;
      // line-height: 48px;
      // display: flex;
      /deep/.ant-input-number {
        width: 64px;
      }
    }
    .header-right {
      .time {
        font-size: 14px;
        font-style: italic;
        font-weight: 600;
      }
    }
  }
  .content {
    max-height: calc(100vh - 260px);
    overflow-y: auto;
    // background-color: rgba(0, 0, 0, 0.5);
  }
  .empty {
    min-height: calc(100vh - 240px);
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
  .op_daoru {
    width: 1em;
    height: 1em;
    margin-bottom: 1px;
    margin-right: 4px;
  }
}

/dee/.ant-drawer-content {
  z-index: 9999;
}
</style>
