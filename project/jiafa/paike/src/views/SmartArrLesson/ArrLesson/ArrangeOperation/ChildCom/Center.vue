<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-01 13:51:55
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-12 15:29:27
-->

<template>
  <div class="center">
    <!-- 表格顶部 -->
    <div class="header">
      <div class="title">
        <!-- <a-popover trigger="hover" placement="right">
          <template slot="content" v-if="tips.length">
            <label>规则颜色标识：</label>
            <div v-for="item in tips" :key="item.value" class="tableTips">
              <span :style="{ backgroundColor: item.color }"></span>
              <label>{{ item.title }}</label>
            </div>
          </template>
          <span style="font-size: 12px">
            规则颜色标识：
            <svg-icon iconClass="28" color="#409fff"
          /></span>
        </a-popover> -->
        <!-- 编辑节次和时间 -->
        <!-- <div v-for="item in tips" :key="item.value" class="titleItem">
          <span :style="{ backgroundColor: item.color }"></span>
          <label>{{ item.title }}</label>
        </div> -->
        <!-- 查看冲突规则 -->
        <span>查看冲突规则：</span>
        <a-select
          placeholder="请选择规则"
          v-model="fatchRuleId"
          style="width: 150px"
          @change="ChangeRules"
          allowClear
        >
          <a-select-option
            v-for="item in searchSelectRule"
            :value="item.rulesId"
            :key="item.rulesId"
            :title="item.name"
          >
            <span slot="label"
              ><i
                class="yuan"
                :style="{ backgroundColor: item.backgroundColor }"
              />{{ item.name }}</span
            >
          </a-select-option>
        </a-select>
      </div>

      <div class="rules">
        <!-- <div class="rule-item">
          <a-button @click="goBack"> <a-icon type="left" />返回 </a-button>
        </div> -->
        <div class="more-rules">
          <a-dropdown :trigger="['click']">
            <a-icon
              type="menu-fold"
              style="font-size: 25px"
              @click="(e) => e.preventDefault()"
            />
            <a-menu slot="overlay">
              <a-menu-item
                v-for="item in selectRulesList"
                :key="item.id"
                @click="selectChange"
              >
                {{ item.name }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class="rule-item" style="margin-right: 10px">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="getbackUpListModel"
          >
            <a-icon type="book" />还原
          </a-button>
        </div>
        <div class="rule-item" style="margin-right: 10px">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="backUpCourseTable"
          >
            <a-icon type="book" />备份
          </a-button>
        </div>

        <!-- 课程安排 -->
        <!-- <div class="rule-item" style="margin-right: 10px">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="() => (!isDividRoom ? courseClick() : null)"
          >
            <a-icon type="book" />课程安排
          </a-button>
        </div> -->
        <!-- 教师任教 -->
        <!-- <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="() => (!isDividRoom ? teacherClick() : null)"
          >
            <a-icon type="user" />教师任教
          </a-button>
        </div> -->
        <!-- 教室安排 -->
        <!-- <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="() => (!isDividRoom ? roomClick() : null)"
          >
            <a-icon type="bank" />教室安排
          </a-button>
        </div> -->
        <!-- 排课规则 -->
        <!-- <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? '' : 'themeBtnDefault'}`"
            @click="() => (!isDividRoom ? ruleClick() : null)"
          >
            <a-icon type="exclamation-circle" />排课规则
          </a-button>
        </div> -->
        <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? 'themeBtn' : 'themeBtn themeBtnDefault'}`"
            icon="eye"
            @click="DelAllCourseTable()"
            >清空排课结果</a-button
          >
          <!-- @click="() => (!isDividRoom ? autoDivideRoom() : null)" -->
        </div>
        <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? 'themeBtn' : 'themeBtn themeBtnDefault'}`"
            icon="eye"
            @click="autoSchedulClick('preview')"
            >课表预览</a-button
          >
          <!-- @click="() => (!isDividRoom ? autoDivideRoom() : null)" -->
        </div>
        <div class="rule-item">
          <a-button
            :class="`${!isDividRoom ? 'themeBtn' : 'themeBtn themeBtnDefault'}`"
            @click="() => (!isDividRoom ? autoSchedul() : null)"
          >
            <a-icon type="form" />检测/自动排课
          </a-button>
        </div>
      </div>
    </div>
    <div class="table">
      <a-table
        bordered
        size="large"
        :scroll="{ y: 'calc(100vh - 200px)' }"
        :pagination="false"
        :loading="conflictLoading"
        :columns="columns"
        :data-source="tableData"
        :rowKey="(row) => row.id"
      >
        <!-- 节次 -->
        <div slot="lesSort" slot-scope="text" class="lesSort">{{ text }}</div>
        <!-- 周一到周日课程 -->
        <template v-for="item in testWeek" :slot="item.name" slot-scope="text">
          <!-- 
            draggble可以被拖动元素
            disabled是否启用拖拽组件
          -->
          <draggable
            class="dragClass"
            v-model="lesWeek"
            :options="{ group: { name: 'table', pull: 'clone' }, sort: false }"
            :key="item.name"
            chosenClass="chosen"
            ghostClass="ghost"
            :move="dragMove"
            @start="dragStart"
            @unchoose="dragTable"
            @add="dragRight"
            :disabled="!text.isDisabled ? true : false"
            :data-sectionid="text.sectionId"
            :data-rowkey="item.name"
            :data-islock="text.isLock.toString()"
          >
            <!-- :data-属性名 绑定的时候  无法接受boolean值  需先转换成字符串 -->
            <!-- :data-属性名  也不能大写 只能全部小写 -->
            <div
              :class="[
                !text.isDisabled && !isCoflict ? 'lesson lessonDis' : 'lesson',
              ]"
              :data-sectionid="text.sectionId"
              :data-islock="text.isLock.toString()"
            >
              <!-- text为每个格子里面的整个数据(lesFri...) -->
              <!-- isAccordRule 相同规则的格子 -->
              <!-- commonGrid 相同老师，课程的格子 -->
              <div
                class="lesson-item"
                :class="[
                  les.courseTableType === 3 || les.courseTableType === 4
                    ? 'lesson-item les-itemWeek'
                    : 'lesson-item',
                  text.isNoTeacher === true && contactIsNoTeacher === true
                    ? 'isNoTeacher'
                    : '',
                  les.isAccordRule ? 'isAccordRule' : '',
                  les.commonGrid ? 'commonGrid' : '',
                ]"
                v-for="(les, index) in text.classArr"
                :key="les.courseTableId"
              >
                <!-- les为格子数据列表 -->
                <div class="les-name" :title="les.lesName">
                  <span @click="findSameCourse(les, text)">{{
                    les.lesName
                  }}</span>
                  {{
                    les.courseTableType === 3
                      ? "[单周]"
                      : les.courseTableType === 4
                      ? "[双周]"
                      : ""
                  }}
                </div>
                <div
                  class="les-place"
                  v-if="les.teacherName || les.place"
                  :title="`${les.teacherName || '-'} / ${les.place || '-'}`"
                >
                  <span @click="findSameTeacher(les, text)">{{
                    les.teacherName || "-"
                  }}</span>
                  / {{ les.place || "-" }}
                </div>

                <!-- 有冲突的提示 -->
                <a-popover v-if="les.confictRulesNum !== 0" placement="right">
                  <template slot="content">
                    <div>冲突规则：</div>
                    <!-- backgroundColor: `${les.configColor}`, -->
                    <div
                      v-for="confictItem in les.confictRuleList"
                      :key="confictItem"
                    >
                      <!-- :style="{ marginLeft: '16px' }" -->
                      <span
                        :style="{
                          display: 'inline-block',
                          marginLeft: '10px',
                        }"
                      >
                        <!-- width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: colorGet(confictItem), -->
                      </span>
                      {{ `${confictItem}` }}
                    </div>
                  </template>
                  <span
                    class="errorNum"
                    :style="{ backgroundColor: les.configColor }"
                  >
                    <!-- :style="{ backgroundColor: les.configColor }" -->
                    {{ les.confictRulesNum }}
                  </span>
                </a-popover>

                <!-- 单双周切换按钮 -->
                <div
                  v-if="
                    (les.courseTableType === 3 || les.courseTableType === 4) &&
                    index === 0
                  "
                  class="weekRetweet"
                >
                  <a-icon
                    type="retweet"
                    @click="() => weekChange(text.classArr)"
                  />
                </div>
              </div>

              <!-- <div v-if="!text.isDisabled && !isCoflict">
                <span v-for="n in 40" :key="n" class="disabledSpan"></span>
              </div> -->

              <!-- 冲突验证 无冲突 遮罩 -->
              <!-- isDrop:true可放下 isDisable：true可用 isContentClash：true链条内容冲突 -->
              <!-- noConflict：可用 可放下 无链条冲突  (完全可放置) -->
              <!-- :class="[
                  text.isDisabled && text.isDrop && !text.isContentClash
                    ? 'noConflict'
                    : 'tableGray',
                ]" -->
              <!-- text.isLock?'': -->
              <div
                :class="[
                  text.isDisabled
                    ? text.isDrop && !text.isContentClash
                      ? 'noConflict'
                      : 'tableGray'
                    : '',
                ]"
                v-if="isCoflict"
              ></div>

              <!-- 冲突验证 禁用 -->
              <div
                :class="[
                  isCoflict && !text.isDisabled
                    ? 'conflictDisabled'
                    : 'conflictNone',
                ]"
              ></div>

              <!-- 格子删除按钮 -->
              <div
                v-if="deleShow(text.classArr)"
                @click="() => deleSection(text)"
                class="deleTable"
              >
                <a-icon type="delete" />
              </div>
              <!-- 格子锁定状态 -->
              <div
                class="islock"
                :class="[text.isLock ? 'colorLock' : '']"
                @click="() => unlockOpration(text)"
              >
                <a-icon
                  v-show="text.isDisabled"
                  :type="text.isLock ? 'lock' : ''"
                />
              </div>
              <!-- 格子未锁定状态 -->
              <div
                class="islock lockNone"
                :class="[text.isLock ? 'colorLock' : '']"
                @click="() => unlockOpration(text)"
              >
                <a-icon
                  v-show="text.isDisabled"
                  :type="text.isLock ? '' : 'unlock'"
                />
              </div>
            </div>
          </draggable>
        </template>
      </a-table>
    </div>

    <!-- 校验/自动排课弹窗 -->
    <a-modal
      title
      :visible="autoSchedulModal"
      :footer="null"
      @cancel="() => autoSchedulClick('cancel')"
    >
      <div class="errorInfo">
        <a-icon
          type="info-circle"
          v-if="autoSchedulInfo.type === '1'"
          class="errorOk"
        />
        <a-icon
          type="exclamation-circle"
          v-if="autoSchedulInfo.type !== '1'"
          class="errorNo"
        />
        <label class="label-con">{{ autoSchedulInfo.txt }}</label>
      </div>
      <div class="btnList">
        <!-- <a-button
          v-if="autoSchedulInfo.type !== 1 && autoSchedulInfo.type !== 2"
          class="btnCancel"
          @click="() => autoSchedulClick('cancel')"
          >取消</a-button
        > -->
        <a-button
          v-for="item in autoSchedulInfo.btnList"
          :key="item.btnId"
          type="primary"
          @click="() => autoSchedulClick(item.btnId)"
          >{{ item.btnName }}</a-button
        >
      </div>
    </a-modal>

    <!-- 规则冲突弹窗 -->
    <a-modal
      title
      :visible="ruleCoflictModal"
      :footer="null"
      @cancel="ruleCoflictCancel"
    >
      <div class="errorInfo">
        <a-icon type="exclamation-circle" class="errorNo" />
        <label v-if="!sectionInfo.isContentClash">
          {{ `当前排课动作存在${sectionInfo.currentConflictName || ""}冲突！` }}
        </label>
        <label v-else>
          {{ `当前课程，影响到关联班级的课程，如仍要放置，将替换掉关联数据` }}
        </label>
      </div>
      <div class="btnList">
        <a-button class="btnCancel" @click="ruleCoflictCancel">取消</a-button>
        <a-button @click="ruleCoflictGo">仍要放置</a-button>
      </div>
    </a-modal>

    <!-- 添加教室选择课程弹窗 -->
    <a-modal
      title="确定放置数据"
      class="seleLes"
      :visible="seleLesModal"
      :footer="null"
      :width="400"
      @cancel="() => seleLesOption('cancel', {})"
    >
      <div
        v-for="item in seleLes"
        :key="item.courseTableId"
        class="seleLesItem"
        @click="() => seleLesOption('ok', item)"
      >
        <p>{{ item.lesName }}</p>
        <label>{{ item.teacherName || "-" }}</label>
      </div>
    </a-modal>

    <!-- 清空排课结果 -->
    <a-modal
      v-model="clearAllCourseTableVisible"
      title="清空排课结果提示"
      @ok="sureDelAllCourseTable"
    >
      <div class="clear-con">
        <a-icon type="info-circle" style="color: #ffd6af; font-size: 23px" />
        <p>
          <span v-show="clearAllCourseTableType === 1"
            >该课表已校验完成，无任何人员或场所的时间冲突；</span
          >如进行清空排课结果则会将所有排课结果全部清空（包含手动置课结果和自动排课结果）请谨慎操作！
        </p>
      </div>
    </a-modal>
    <!-- 排队 -->
    <Lineup v-if="showLineup" :planId="planId" pageType="option" />
    <!-- 还原备份列表弹窗 -->
    <backupList ref="backupList" :planId="planId" />
    <!-- 支持排课次数抽屉 -->
    <AutoPkNumber ref="AutoPkNumber"></AutoPkNumber>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import draggable from "vuedraggable";
import Lineup from "./../../../ArrLessonList/ChildCom/Lineup/Lineup.vue";
import backupList from "./Modal/backupList.vue"; // 还原备份列表弹窗
import AutoPkNumber from "./Modal/AutoPkNumber.vue"; // 支持排课次数
const columns = [
  {
    title: "",
    dataIndex: "diffNoon",
    key: "diffNoon",
    align: "center",
    width: "5%",
    scopedSlots: { customRender: "diffNoon" },
    customRender(_, row) {
      return {
        children: row.diffNoon,
        attrs: {
          rowSpan: row.diffNoonRowSpan,
        },
      };
    },
  },
  {
    title: "节次",
    dataIndex: "lesSort",
    key: "lesSort",
    align: "center",
    width: "6%",
    scopedSlots: { customRender: "lesSort" },
  },
  {
    title: "星期一",
    dataIndex: "lesMon",
    key: "lesMon",
    width: "12.7%",
    scopedSlots: { customRender: "lesMon" },
  },
  {
    title: "星期二",
    dataIndex: "lesTue",
    key: "lesTue",
    width: "12.7%",
    scopedSlots: { customRender: "lesTue" },
  },
  {
    title: "星期三",
    dataIndex: "lesWed",
    key: "lesWed",
    width: "12.7%",
    scopedSlots: { customRender: "lesWed" },
  },
  {
    title: "星期四",
    dataIndex: "lesThu",
    key: "lesThu",
    width: "12.7%",
    scopedSlots: { customRender: "lesThu" },
  },
  {
    title: "星期五",
    dataIndex: "lesFri",
    key: "lesFri",
    width: "12.7%",
    scopedSlots: { customRender: "lesFri" },
  },
  {
    title: "星期六",
    dataIndex: "lesSat",
    key: "lesSat",
    width: "12.7%",
    scopedSlots: { customRender: "lesSat" },
  },
  {
    title: "星期日",
    dataIndex: "lesSun",
    key: "lesSun",
    width: "12%",
    scopedSlots: { customRender: "lesSun" },
  },
];
export default {
  components: { draggable, Lineup, backupList, AutoPkNumber },
  props: [],
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "956eeb4f27e64419adc1d98037d70e5c", //计划id
      classIdSele: "", //左侧班级id
      tabKey: sessionStorage.getItem("tabKey") || "1", //右侧tab选中
      tips: [
        { value: "1", title: "不能排/只能排", color: "#FF6565" },
        // { value: "2", title: "单双周", color: "#FFB520" },
        { value: "3", title: "连堂", color: "#52E071" },
        { value: "4", title: "教案齐平", color: "#39CBE8" },
        { value: "5", title: "课程不相邻", color: "#938AFF" },
        { value: "6", title: "互斥/同步授课", color: "#9384BD" },
        { value: "7", title: "合班", color: "#99D061" },
        // { value: "8", title: "周内集中", color: "#DEA35D" },
        // { value: "9", title: "周内分散", color: "#E56BF0" },
      ],
      searchSelectRule: [
        {
          name: "只能排",
          rulesId: 1,
          backgroundColor: "#FF6565",
        },
        {
          name: "不能排",
          rulesId: 2,
          backgroundColor: "#FF6565",
        },
        {
          name: "教师冲突",
          rulesId: 90,
          backgroundColor: "#FFB520",
        },
        {
          name: "教室冲突",
          rulesId: 91,
          backgroundColor: "#52E071",
        },
        {
          name: "教案平齐",
          rulesId: 5,
          backgroundColor: "#39CBE8",
        },
        {
          name: "课程不相邻",
          rulesId: 6,
          backgroundColor: "#938AFF",
        },
        {
          name: "互斥",
          rulesId: 8,
          backgroundColor: "#E56BF0",
        },
        {
          name: "同步",
          rulesId: 9,
          backgroundColor: "#E56BF0",
        },
      ],
      fatchRuleId: undefined,
      fatchRuleIdTem: 0,
      autoSchedulModal: false, //自动排课弹窗
      autoSchedulInfo: {}, //自动排课结果
      columns, //center -  表头
      tableData: [], //center - 课表数据
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun",
      ], // center - 用于渲染表格数据
      testWeek: [
        { name: "lesMon" },
        { name: "lesTue" },
        { name: "lesWed" },
        { name: "lesThu" },
        { name: "lesFri" },
        { name: "lesSat" },
        { name: "lesSun" },
      ],
      rightDragItem: {}, //右侧拖拽项
      isCoflict: false, //是否是验证冲突课表
      ruleCoflictModal: false, //规则冲突弹窗
      isTableDrag: false, //是否是表格拖拽
      dragTableId: "", //表格被拖拽id
      sectionInfo: {}, //被放置格子信息
      // isDeleModal: false, //格子删除操作
      deleSectionId: "", //删除格子id
      // lockSectionId: "", // 解锁格子id
      // isCourseSeleModal: false, //教师分组课程存在多个类型选择弹窗
      conflictLoading: false, //表格加载中
      isDividRoom: false, //自动分配教室中
      // isAutoArrange: false, //自动排课中
      seleLesModal: false, //添加教室选择课程弹窗
      seleLes: [], //添加教室课程选择列表
      seleLesParams: {}, //添加教室 选择课程 参数暂存
      showLineup: false, //排队
      recordDragCourse: {
        // 拖拽过程
        startDrag: false,
        dragMove: false,
        dragDown: false,
        dragRight: false,
      },
      selectRulesList: [
        {
          id: 1,
          name: "排课规则",
        },
        {
          id: 2,
          name: "教室安排",
        },
        {
          id: 3,
          name: "教师任教",
        },
        {
          id: 4,
          name: "课程安排",
        },
      ], // 规则冲突下拉框
      selectRules: undefined, // 选中的规则
      clearAllCourseTableVisible: false, // 清空表格数据
      clearAllCourseTableType: null, // 清空表格数据提示语显示
      isAutoResetPkBtn: false, // 按钮为自动排课还是重新排课
    };
  },
  computed: {
    ...mapState("arrangeOperation", [
      "classId",
      "dragItem",
      "isRefresh",
      "contactIsNoTeacher",
    ]),
    /**
     * @desc 处理格子上的冲突背景颜色
     * 注：后期因产品修改UI，要求颜色全部一致，且提示中不要颜色
     */
    colorGet() {
      return (colorItem) => {
        let colorTrans =
          colorItem === "不能排" || colorItem === "只能排"
            ? "不能排/只能排"
            : colorItem === "互斥" || colorItem === "同步"
            ? "互斥/同步授课"
            : colorItem;
        const item = this.tips.find((tipsItem) => {
          return tipsItem.title === colorTrans;
        });
        return (item && item.color) || "#CC6B6B";
      };
    },
    /**
     * @desc 删除按钮显隐：格子无数据，或全为(courseTableType === 2)走班课时不展示
     * @params arr {Array} 格子数据
     */
    deleShow() {
      return (arr) => {
        let n = 0;
        arr &&
          arr.map((item) => {
            if (item.courseTableType === 2) {
              n++;
            }
          });
        return !(!arr || arr.length === n);
      };
    },
  },
  watch: {
    classId() {
      this.classIdSele = this.classId;
      this.getTimeTable("classId");
    },
    /**
     * @desc 监听右侧拖拽项切换
     */
    dragItem() {
      // debugger;
      this.rightDragItem = this.dragItem;
      if (this.dragItem.dragId) {
        this.conflictLoading = true;
        let {
          ruleId,
          planId,
          classId,
          dragId,
          dragType,
          courseType,
          courseId,
          selfStudyType,
        } = this.dragItem;
        //处理拖拽id：课程拖拽 有规则为ruleId否则为课程id  教师、教室、表格内容：拖拽id
        //先判断ruleId是否存在原因：dragType在存在ruleId情况为4不存在规则时为1
        let dragIdCheck = ruleId || (dragType === 1 ? courseId : dragId);
        this.getConflictTimeTable({
          planId,
          classId,
          dragId: dragIdCheck,
          dragType,
          courseType,
          courseId,
          selfStudyType,
        });
      }
    },
    /**
     * @desc 当只是右侧内部拖动时，刷新表格数据
     */
    isRefresh() {
      if (this.isRefresh) this.getTimeTable();
    },
  },
  created() {
    this.isAutoSchedul();
  },
  mounted() {},
  methods: {
    ...mapMutations("arrangeOperation", [
      "setRoomDrawerVisible",
      "setTeacherDrawerVisible",
      "setCourseDrawerVisible",
      "setRuleDrawerVisible",
      "setDragItem",
      "getConflictTimeTable",
      "cancleOpration",
      "setDroped",
      "exchangeSingleDoubleInfo",
      "refreshTableData",
      "setContactIsNoTeacher",
    ]),
    ...mapMutations("dialog", ["setTeacherListVisible"]),
    /**
     *格子内容拖动:获取冲突课表
     islock判断 该格子是否锁定，锁定不能拖拽
     */
    dragStart(e) {
      // 拖拽拿id
      const { sectionid, islock } = e.item.dataset;
      this.recordDragCourse.startDrag = true;
      if (this.judgeLock(islock) && this.recordDragCourse.startDrag) {
        this.recordDragCourse.startDrag = false;
        return;
      }
      let params = {
        planId: this.planId,
        classId: this.classIdSele,
        courseType: 0,
        dragType: 4,
        dragId: sectionid,
        courseId: "",
        selfStudyType: 0,
      };

      this.isTableDrag = true;
      this.dragTableId = sectionid;
      this.setDragItem(params);
    },
    /**
     * @desc 拖拽过程自定义控制
     */
    dragMove(e, originalEvent) {
      //当拖拽到右侧时不可用
      const { sectionid } = e.to.dataset;
      if (!sectionid) return false;
      return true;
    },
    /**
     * @desc 拖拽放置
     * sectionid格子id, rowkey星期几的key
     * dragTable 表格格子拖动放置
     * dragRight 右侧拖动放置
     */
    dragTable(e) {
      if (this.dragItem.dragType === 4) {
        this.dragAdd(e);
      }
    },
    /**
     * @name: 左侧被拖拽
     * @msg:
     * @param {*} e
     * @return {*}
     */
    dragRight(e) {
      if (this.dragItem.dragType !== 4) {
        this.dragAdd(e);
      }
    },
    /**
     * @name:
     * @msg:
     * @param {*} e
     * @return {*}
     */
    dragAdd(e) {
      const noTitleKey = sessionStorage.getItem("tabKey");
      const { sectionid, rowkey } = e.to.dataset;
      //表格内部拖动，且放置在被拖动格子
      if (this.dragTableId === sectionid && this.dragItem.dragType === 4) {
        this.isTableDrag = false;
        this.getTimeTable();
      } else {
        this.conflictLoading = true;
        let params = {};

        const list = this.tableData;
        let seleObj = {}; //被放置的单元格数据
        //item 表格一行数据  itemKey被放置的单元格
        list.map((item) => {
          let itemKey = item[rowkey];
          if (itemKey && itemKey.sectionId === sectionid) {
            seleObj = itemKey;
          }
        });
        this.sectionInfo = seleObj;

        // isDrop:true可以放下  false不能放下
        // isContentClash:true 存在链条冲突-不可放置
        // isDisabled:true可用  false禁用
        // 无冲突 可放置
        if (seleObj.isDrop && !seleObj.isContentClash) {
          //表格拖动--反向验证
          if (this.isTableDrag) {
            let reverseParams = {
              dragTableId: this.dragTableId,
              dropTableId: sectionid,
            };
            this.exchangeLesson(reverseParams);
          } else {
            //右拖左 直接添加数据
            const { dragType, dragList, ruleId, courseId } = this.dragItem;
            let classArr = seleObj.classArr || [];
            let courseTableIdPa = "";
            //格子内有多个课程
            if (classArr && classArr.length > 1) {
              let isSeleModal = true;
              classArr.map((classItem) => {
                const type = classItem.courseTableType;
                // if (type === 3 || type === 4) {
                if (type === 3 || type === 4 || type === 2) {
                  isSeleModal = false;
                }
              });

              //非单双周、非走班情况 -- 添加教室
              if (noTitleKey === "2" && isSeleModal) {
                this.seleLesModal = true;
                this.seleLes = classArr;
                params = {
                  ruleId: ruleId || "",
                  tableId: sectionid,
                  addType: dragType === 5 ? 4 : dragType,
                  courseTableId: "",
                  dragList,
                };
                this.seleLesParams = params;
                return;
              } else {
                //针对教师--被放置的格子存在单双周的时候，需要查找是否存在有与教师所在教研组对应的课程
                const courseObj = classArr.find((classItem) => {
                  return classItem.lesId === courseId;
                });
                if (courseObj) {
                  courseTableIdPa = courseObj.courseTableId || "";
                } else {
                  //courseTableType：1 本身 2 走班 3 单周 4 双周
                  const { courseTableType, courseTableId } = classArr[0];
                  courseTableIdPa =
                    courseTableType === 3 ||
                    courseTableType === 4 ||
                    courseTableType === 1
                      ? courseTableId
                      : classArr[1].courseTableId;
                }
              }
            } else {
              courseTableIdPa =
                (classArr && classArr[0] && classArr[0].courseTableId) || "";
            }

            params = {
              ruleId: ruleId || "",
              tableId: sectionid,
              addType: dragType === 5 ? 4 : dragType,
              courseTableId: courseTableIdPa,
              dragList,
            };
            this.addTableData(params);
          }
        } else if (!seleObj.isDisabled) {
          //不可放置
        } else {
          //有冲突 强行放置
          this.ruleCoflictModal = true;
        }
      }
    },
    // 表格第一列合并
    rowSpanMerge(key) {
      const arr = this.tableData
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key]);
          }
          return result;
        }, [])
        .reduce((result, keys) => {
          const children = this.tableData.filter((item) => item[key] === keys);
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0,
            }))
          );
          return result;
        }, []);
      this.tableData = arr;
    },
    /**
     * @desc 获取课表数据
     * @params type:classId:左侧班级选中加载表格-拖动添加课程时会导致加载中出现两次问题
     */
    async getTimeTable(type) {
      if (type) this.conflictLoading = true;
      const params = {
        planId: this.planId,
        classId: this.classId,
        rulesId: this.fatchRuleIdTem,
      };
      let res = await this.$api.ArrangeOperation.getTimeTable(params);
      if (res.code === "200") {
        const data = res.data;
        let timeTable = [];
        if (data && data.length) {
          timeTable = data;
        }
        this.tableData = timeTable;
        this.rowSpanMerge("diffNoon");
        this.refreshTableData(false);
        //在表格数据刷新后清空拖拽数据：
        //null：右侧拖拽会判断是否是右侧放下，右侧放下则重新获取表格;在冲突情况下则不能将拖拽信息重置
        this.ruleCoflictModal ? null : this.setDragItem({});
      } else this.$message.error(res.message, 5);
      this.conflictLoading = false;
      this.isCoflict = false;
    },
    /**
     * @desc 获取冲突课表
     * params {Object} 冲突课表入参
     */
    async getConflictTimeTable(params) {
      this.isCoflict = true;
      let res = await this.$api.ArrangeOperation.getConflictTimeTable(params);
      if (res.code === "200") {
        const data = res.data;
        let timeTable = [];
        if (data && data.length) {
          timeTable = data;
        }
        this.tableData = timeTable;
        this.rowSpanMerge("diffNoon");
        this.conflictLoading = false;
      } else {
        this.$message.error(res.message, 5);
        this.isCoflict = false;
        this.conflictLoading = false;
        this.getTimeTable();
      }
    },
    /**
     * @desc 添加表格数据
     * params
     */
    async addTableData(params) {
      let ret = {
        planId: this.planId,
        classId: this.classId,
      };
      let res = await this.$api.ArrangeOperation.addTableData({
        ...ret,
        ...params,
      });
      if (res.code === "200") {
        this.setDroped(true);
      } else {
        this.isCoflict = false;
        this.$message.warning(res.message, 5);
      }
      this.setDragItem({});
      this.getTimeTable();
    },
    /**
     * @desc 删除操作
     */
    deleSection(text) {
      const { sectionId, isLock } = text;
      if (this.judgeLock(isLock)) {
        return;
      }
      this.deleSectionId = sectionId;
      // this.isDeleModal = true;
      this.$confirm({
        title: "确定删除该排课安排？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.conflictLoading = true;
          this.cancleOpration();
        },
      });
    },
    /**
     * @desc 单双周切换
     */
    async weekChange(sectionList) {
      let courseTableIdSingle = "";
      let courseTableIdDouble = "";
      sectionList.map((item) => {
        if (item.courseTableType === 3) {
          courseTableIdSingle = item.courseTableId;
        } else if (item.courseTableType === 4) {
          courseTableIdDouble = item.courseTableId;
        }
      });
      let res = await this.$api.ArrangeOperation.exchangeSingleDoubleInfo({
        courseTableIdSingle,
        courseTableIdDouble,
      });
      if (res.code === "200") {
        this.getTimeTable();
        this.setDroped(true);
      } else this.$message.warning(res.message, 5);
    },
    /**
     * @desc 表格间拖动--数据保存
     */
    async exchangeLesson(exchaPa) {
      let params = {
        planId: this.planId,
        classId: this.classIdSele,
      };
      const res = await this.$api.ArrangeOperation.exchangeLesson({
        ...params,
        ...exchaPa,
      });
      if (res.code === "200") {
        this.getTimeTable();
        this.setDroped(true);
      } else this.$message.warning(res.message, 5);
      this.isTableDrag = false;
    },
    /**
     * @desc 删除表格数据
     */
    async cancleOpration() {
      let params = {
        planId: this.planId,
        classId: this.classIdSele,
        sectionId: this.deleSectionId,
      };
      const res = await this.$api.ArrangeOperation.cancleOpration(params);
      if (res.code === "200") {
        this.getTimeTable();
        this.setDroped(true);
      } else {
        this.conflictLoading = false;
        this.$message.warning(res.message, 5);
      }
    },
    /**
     * @desc 规则冲突弹窗操作
     */
    ruleCoflictCancel() {
      this.getTimeTable();
      this.ruleCoflictModal = false;
    },
    ruleCoflictGo() {
      const noTitleKey = sessionStorage.getItem("tabKey");
      //表格拖动--反向验证
      if (this.isTableDrag) {
        let reverseParams = {
          dragTableId: this.dragTableId,
          dropTableId: this.sectionInfo.sectionId,
        };
        this.exchangeLesson(reverseParams);
        // this.reverseTimeTable(reverseParams);
      } else {
        let params = {};
        const { dragType, dragList, ruleId } = this.dragItem;
        let classArr = this.sectionInfo.classArr || [];
        let courseTableIdSe = "";
        if (classArr && classArr.length > 1) {
          let isSeleModal = true;
          classArr.map((classItem) => {
            const type = classItem.courseTableType;
            // if (type === 3 || type === 4) {
            if (type === 3 || type === 4 || type === 2) {
              isSeleModal = false;
            }
          });

          //非单双周、非走班情况 -- 添加教室
          if (noTitleKey === "2" && isSeleModal) {
            this.ruleCoflictModal = false;
            this.seleLesModal = true;
            this.seleLes = classArr;
            params = {
              ruleId: ruleId || "", //为0表示连堂、单双周
              tableId: this.sectionInfo.sectionId || "",
              addType: dragType === 5 ? 4 : dragType,
              courseTableId: "",
              dragList,
            };
            this.seleLesParams = params;
            return;
          } else {
            const { courseTableType, lesId, courseTableId } = classArr[0];
            courseTableIdSe =
              courseTableType === 3 ||
              courseTableType === 4 ||
              courseTableType === 1
                ? courseTableId
                : classArr[1].courseTableId;
          }
        } else {
          courseTableIdSe =
            (classArr && classArr[0] && classArr[0].courseTableId) || "";
        }

        params = {
          ruleId: ruleId || "", //为0表示连堂、单双周
          tableId: this.sectionInfo.sectionId || "",
          addType: dragType === 5 ? 4 : dragType,
          courseTableId: courseTableIdSe,
          dragList,
        };
        this.addTableData(params);
      }
      this.ruleCoflictModal = false;
    },
    /**
     * @desc 放置教室课程选择弹窗操作
     * type cancel取消 ok选中
     * params选中项
     */
    seleLesOption(type, params) {
      if (type === "ok") {
        let courseTableId = params.courseTableId;
        this.addTableData({ ...this.seleLesParams, ...{ courseTableId } });
      }
      this.seleLesModal = false;
      this.seleLesParams = {};
    },

    // 右侧 - 自动分配教室
    async autoDivideRoom() {
      this.isDividRoom = true;
      this.conflictLoading = true;
      let res = await this.$api.ArrangeOperation.autoDivideRoom({
        planId: this.planId,
      });
      if (res.code === "200" || res.code === 200) {
        this.$message.success(res.message, 5);
        this.getTimeTable();
        this.setDroped(true);
      } else {
        this.$message.error(res.message, 5);
        this.conflictLoading = false;
      }
      this.isDividRoom = false;
    },
    /**
     * @desc 点击自动排课，进入排队页面
     */
    async isAutoSchedul() {
      const res = await this.$api.ArrlessonList.getQueueup({
        planId: this.planId,
      });
      if (res.code == 200) {
        //0-排队，1-进行中，2-结束，3-退出
        if (res.data.status === 1 || res.data.status === 0) {
          this.showLineup = true;
        } else {
          // this.autoSchedul();
        }
      } else {
        this.$message.error(res.message, 5);
      }
    },
    /**
     * @desc 自动排课
     */
    async autoSchedul() {
      const params = { planId: this.planId, classId: this.classId };
      let res = await this.$api.ArrangeOperation.checkArrLesson(params);
      if (res.code === "200") {
        const { type, errorList } = res.data;
        // 显示自动排课还是重新排课按钮，同时提示语句也要变
        this.isAutoResetPkBtn = res.data.isAuto;
        let txt = "";
        let btnList = [];
        let errors = [];
        //1验证完成无冲突(无按钮) 2课程未完成 3教师未完成(手动/自动) 4教师冲突 5规则冲突 6场所冲突(无按钮)
        switch (type) {
          case 1:
            if (this.isAutoResetPkBtn) {
              txt =
                "该课表已校验完成，无任何人员或场所的时间冲突，可直接发布该课表；可进行课表预览或重新进行排课（重新排课则将只清空掉自动排课结果）";
              btnList = [
                { btnName: "继续手动排课", btnClick: "", btnId: "41" },
                { btnName: "重新排课（清空）", btnClick: "", btnId: "42" },
              ];
            } else {
              txt =
                "该课表已校验完成，无任何人员或场所的时间冲突，可直接发布该课表；";
              btnList = [];
            }
            break;
          case 2:
            // 显示自动排课还是重新排课按钮，同时提示语句也要变
            if (this.isAutoResetPkBtn) {
              txt =
                "您的排课未完成，请对剩余课程继续排课；可进行重新进行排课（重新排课则将只清空掉自动排课结果）";
              btnList = [
                { btnName: "继续手动排课", btnClick: "", btnId: "41" },
                { btnName: "重新排课（清空）", btnClick: "", btnId: "42" },
              ];
            } else {
              txt = "您的排课未完成，请对剩余课程继续排课";
              btnList = [
                { btnName: "继续手动排课", btnClick: "", btnId: "41" },
                { btnName: "自动排课", btnClick: "", btnId: "42" },
              ];
            }
            errors = errorList;
            break;
          case 3:
            // txt = "您的排课未完成，请对剩余教师继续排课；可进行重新进行排课（重新排课则将只清空掉自动排课结果）";
            // btnList = [
            //   { btnName: "继续手动排课", btnClick: "", btnId: "41" },
            //   { btnName: "自动排课", btnClick: "", btnId: "42" },
            // ];
            if (this.isAutoResetPkBtn) {
              txt =
                "您的排课未完成，请对剩余教师继续排课；可进行重新进行排课（重新排课则将只清空掉自动排课结果）";
              btnList = [
                { btnName: "继续手动排课", btnClick: "", btnId: "41" },
                { btnName: "重新排课（清空）", btnClick: "", btnId: "42" },
              ];
            } else {
              txt = "您的排课未完成，请对剩余教师继续排课";
              btnList = [
                { btnName: "继续手动排课", btnClick: "", btnId: "41" },
                { btnName: "自动排课", btnClick: "", btnId: "42" },
              ];
            }
            this.setContactIsNoTeacher(true);
            this.fatchRuleIdTem = 0;
            this.fatchRuleId = undefined;
            this.getTimeTable();
            break;
          case 4:
            txt = "您的排课存在教师冲突";
            btnList = [];
            break;
          case 5:
            txt = "您的排课存在规则冲突";
            btnList = [];
            break;
          case 6:
            txt = "您的排课存在教室冲突";
            btnList = [];
            break;
          default:
            break;
        }
        this.autoSchedulModal = true;
        this.autoSchedulInfo = { type, txt, btnList, errors };
      } else this.$message.warning(res.message, 5);
    },
    /**
     * @desc 自动检测结果弹出框 各按钮操作
     * type 各按钮标志：cancel取消，1,2,3直接预览，41手动排课，42自动排课，5分配教室
     */
    autoSchedulClick(type) {
      // if (type === "1" || type === "2") {
      if (type === "preview") {
        //预览跳转
        // const backPath = this.$route.query.prePath;
        // this.$router.push({
        //   path: "/PreviewTimetable",
        //   query: {
        //     prePath: this.$route.query.prePath,
        //   },
        // });
        const { href } = this.$router.resolve({
          path: "/PreviewTimetable",
          query: {
            prePath: this.$route.query.prePath,
          },
        });
        window.open(href, "_blank");
      } else if (type === "1" || type === "2") {
      } else if (type === "41") {
        //手动排课 留在此页面
      } else if (type === "42") {
        //自动排课 并且通过public下的showAutoPkNumber 来判断是否显示排课次数抽屉
        // this.autoArrange();
        if (window.G.showAutoPkNumber) {
          this.$refs.AutoPkNumber.showDrawer();
        } else {
          this.autoArrange();
        }
      } else if (type === "5") {
        //教室分配
      }
      this.autoSchedulModal = false;
    },
    /**
     * @desc 自动排课
     */
    async autoArrange() {
      let res = await this.$api.ArrangeOperation.autoArrange({
        planId: this.planId,
      });
      if (res.code === "200" || res.code === 200) {
        this.showLineup = true;
        // this.$message.success(res.message);
        //数据刷新
        // this.setDroped(true);
        // this.getTimeTable();
      } else {
        this.$message.error(res.message, 5);
      }
    },

    /**
     * @desc 队列操作刷新所有数据
     */
    refreshAllData() {
      this.setDroped(true);
      this.getTimeTable();
    },

    /**
     * @desc 排课规则弹窗
     */
    ruleClick() {
      this.setRuleDrawerVisible(true);
    },
    // 课程点击事件
    courseClick() {
      this.setCourseDrawerVisible(true);
    },
    //教室安排
    roomClick() {
      // 打开弹窗
      this.setRoomDrawerVisible(true);
    },
    // 教师任教安排
    teacherClick() {
      this.setTeacherDrawerVisible(true);
    },
    // 备份
    backUpCourseTable() {
      this.$confirm({
        title: "确定备份该方案?",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.sureBackUpCourseTable();
        },
      });
    },
    async sureBackUpCourseTable() {
      const res = await this.$api.ArrangeOperation.backUpCourseTable({
        planId: this.planId,
      });
      try {
        if (res.code === "200") {
          this.$message.success("备份成功");
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 备份弹窗显示
    getbackUpListModel() {
      this.$refs.backupList.showModel();
    },
    /**
     * @name: 查看冲突规则
     * @msg:
     * @param {*} value
     * @return {*}
     */
    ChangeRules(value) {
      this.conflictLoading = true;
      if (typeof value === "undefined") {
        // this.fatchRuleId = 0;
        this.fatchRuleIdTem = 0;
      } else {
        this.fatchRuleId = value;
        this.fatchRuleIdTem = value;
      }
      this.setContactIsNoTeacher(false);
      this.getTimeTable();
    },

    /**
     * @name: 解锁格子
     * @msg:
     * @param {*} text
     * @return {*}
     */
    async unlockOpration(text) {
      this.conflictLoading = true;
      const { sectionId, isLock } = text;
      let params = {
        planId: this.planId,
        classId: this.classIdSele,
        sectionWeekId: sectionId,
        isLock: !isLock,
      };
      const res = await this.$api.ArrangeOperation.unlockOpration(params);
      if (res.code === "200") {
        this.getTimeTable();
        this.setDroped(true);
        if (isLock) {
          this.$message.success("解锁成功", 5);
        } else {
          this.$message.success("锁定成功", 5);
        }
      } else {
        this.conflictLoading = false;
        this.$message.warning(res.message, 5);
      }
    },
    /**
     * @name: 判断该节次是否锁定，如果是锁定状态无法做设置节次内容
     * @msg:
     * @param {*} islock  为字符串是为了判断 拖拽
     * @return {*}
     */
    judgeLock(islock) {
      // debugger;
      if (typeof islock === "string" && islock === "true") {
        this.$info({
          content: "该节次已锁定,如需设置节次内容，请解锁！",
        });
        return true;
      } else {
        if (islock && typeof islock !== "string") {
          this.$info({
            content: "该节次已锁定,如需设置节次内容，请解锁！",
          });
          return true;
        }
      }
    },
    /**
     * @name: les 每个课程信息 text每个格子信息
     * @msg:
     * @param {*} les
     * @return {*}
     */
    async findSameTeacher(les, text) {
      this.setContactIsNoTeacher(false);
      const { teacherId } = les;
      this.conflictLoading = true;
      this.fatchRuleIdTem = 0;
      this.fatchRuleId = undefined;
      const params = {
        planId: this.planId,
        classId: this.classId,
        // rulesId: this.fatchRuleIdTem,
        commonId: teacherId,
        commonType: 2,
      };
      let res = await this.$api.ArrangeOperation.getTimeTable(params);
      if (res.code === "200") {
        const data = res.data;
        let timeTable = [];
        if (data && data.length) {
          timeTable = data;
        }
        this.tableData = timeTable;
        this.rowSpanMerge("diffNoon");
        this.refreshTableData(false);
        //在表格数据刷新后清空拖拽数据：
        //null：右侧拖拽会判断是否是右侧放下，右侧放下则重新获取表格;在冲突情况下则不能将拖拽信息重置
        this.ruleCoflictModal ? null : this.setDragItem({});
      } else this.$message.error(res.message, 5);
      this.conflictLoading = false;
      this.isCoflict = false;
    },
    /**
     * @name: 查找有相同课程的格子
     * @msg:
     * @param {*} les 每个课程信息 text每个格子信息
     * @return {*}
     */
    async findSameCourse(les, text) {
      this.setContactIsNoTeacher(false);
      const { lesId } = les;
      this.conflictLoading = true;
      this.fatchRuleId = undefined;
      this.fatchRuleIdTem = 0;
      const params = {
        planId: this.planId,
        classId: this.classId,
        // rulesId: this.fatchRuleIdTem,
        commonId: lesId,
        commonType: 1,
      };
      let res = await this.$api.ArrangeOperation.getTimeTable(params);
      if (res.code === "200") {
        const data = res.data;
        let timeTable = [];
        if (data && data.length) {
          timeTable = data;
        }
        this.tableData = timeTable;
        this.rowSpanMerge("diffNoon");
        this.refreshTableData(false);
        //在表格数据刷新后清空拖拽数据：
        //null：右侧拖拽会判断是否是右侧放下，右侧放下则重新获取表格;在冲突情况下则不能将拖拽信息重置
        this.ruleCoflictModal ? null : this.setDragItem({});
      } else this.$message.error(res.message, 5);
      this.conflictLoading = false;
      this.isCoflict = false;
    },
    /**
     * @name:
     * @msg: 将排课规则，教室安排，教师任教，课程安排放入下拉框
     * @param {*}
     * @return {*}
     */
    selectChange({ key }) {
      switch (key) {
        case 1:
          this.ruleClick();
          break;
        case 2:
          this.roomClick();
          break;
        case 3:
          this.teacherClick();
          break;
        case 4:
          this.courseClick();
          break;
        default:
          break;
      }
    },
    /**
     * @name: 显示清空表格数据弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    async DelAllCourseTable() {
      this.clearAllCourseTableVisible = true;
      const params = { planId: this.planId };
      let res = await this.$api.ArrangeOperation.checkArrLesson(params);
      if (res.code === "200") {
        this.clearAllCourseTableType = res.data.type;
      }
    },
    /**
     * @name: 全部清空表格数据
     * @msg:
     * @param {*}
     * @return {*}
     */
    async sureDelAllCourseTable() {
      this.conflictLoading = true;
      const params = { planId: this.planId };
      let res = await this.$api.ArrangeOperation.DelAllCourseTable(params);
      try {
        if (res.code === "200") {
          this.$message.success("清除成功");
          // 刷新整个页面
          this.getTimeTable(); // 刷新表格数据
          this.setDroped(true); // 刷新右侧数据
          this.$parent.getAdminClassList(); // 刷新左侧数据
        } else {
          this.$message.warning(res.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.clearAllCourseTableVisible = false;
        this.isCoflict = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.center {
  position: relative;
  width: calc(100% - 470px); //-230*2+24
  min-width: 600px;
  background-color: #f2f5f7;
  // display: flex;
  display: inline-block;
  flex-direction: column;
  vertical-align: top;
  .header {
    position: absolute;
    top: 0;
    right: -240px;
    display: flex;
    width: calc(100% + 210px);
    height: 64px;
    align-items: center;
    .title {
      margin-left: 16px;
      width: 400px;
      line-height: 40px;
      .titleItem {
        display: inline-block;
        margin-left: 10px;
        padding-top: 4px;
        span {
          display: inline-block;
          margin-right: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          color: #cc6b6b;
        }
      }
    }
    .rules {
      width: calc(100vw - 400px);
      line-height: 40px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      .rule-item {
        height: 30px;
        line-height: 30px;
        margin-right: 16px;
        .themeBtnDefault {
          cursor: no-drop;
        }
      }
      .more-rules {
        margin-right: 10px;
        display: flex;
        align-items: center;
      }
    }
  }

  .table {
    position: relative;
    height: calc(100% - 48px);
    background-color: #ffffff;
    margin: 64px 16px 0 16px;
    // border: 1px solid rgb(235, 232, 232);
    .tableLoading {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #00000014;
    }
    /deep/.ant-table-fixed-header
      > .ant-table-content
      > .ant-table-scroll
      > .ant-table-body::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    /deep/.ant-table-tbody > tr > td {
      position: relative;
      padding: 0;
      // border: 1px dashed #04d47c;
      // background-color: #7bffc638;
      > div {
        // padding: 0 10px 10px;
        // min-height: 70px;
        min-height: 64px;
        cursor: pointer;
      }
      .lesSort {
        min-height: unset;
      }
    }
    // /deep/.ant-table-tbody > tr > td:nth-child(1),
    // /deep/.ant-table-tbody > tr > td:nth-child(2),
    /deep/ .ant-table-thead > tr > th {
      background-color: #409fff;
      border-color: #79bcff;
      color: #fff;
      text-align: center;
    }
    /deep/.ant-table-tbody > tr > td:hover {
      .deleTable {
        display: inline-block;
      }
      .lockNone {
        display: inline-block;
      }
      // .lesson .lesson-item:first-child .errorNum {
      //   right: 20px;
      // }
    }
    /deep/
      .ant-table-thead
      > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td,
    /deep/
      .ant-table-tbody
      > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td,
    /deep/
      .ant-table-thead
      > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td,
    /deep/
      .ant-table-tbody
      > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
      > td {
      background-color: #fff;
    }
    .tableGray,
    .noConflict {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .tableGray {
      // background-color: #d1d6da6e;
      border: 1px dashed #ff5959;
      // background-color: #ffe7e7;
      background-color: #ff686829;
    }
    .noConflict {
      border: 1px dashed #04d47c;
      background-color: #7bffc638;
      // background-color: #f1fff9;
    }
    .deleTable {
      position: absolute;
      top: 1px;
      right: 4px;
      display: none;
      cursor: pointer;
      /deep/ .anticon svg {
        width: 16px;
        height: 16px;
        color: #929599;
      }
    }
    .islock {
      position: absolute;
      top: -2px;
      left: 3%;
      cursor: pointer;
      &.lockNone {
        display: none;
      }
      /deep/ .anticon svg {
        width: 16px;
        height: 16px;
        // color: red;
      }
    }
    .colorLock {
      color: red;
    }
    // .dragClass:hover .deleTable {
    //   display: inline-block;
    // }
    // .dragClass {
    //   border: 1px solid red;
    // }
    .lesson {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .lesson-item {
        position: relative;
        margin: 2px 2px;
        margin-top: 16px;
        padding: 0 8px;
        height: 60px;
        align-items: flex-start;
        background-color: #f5f7fa;
        .les-name {
          padding-top: 10px;
          color: #409fff;
          font-size: 15px;
          font-weight: bold;
        }
        .les-place {
          color: #797c80;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .errorNum {
          position: absolute;
          // top: -4px;
          // right: 22px;
          top: 2px;
          right: 20px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 50%;
          color: #fff;
          background-color: #ff4b4b;
        }
        .weekRetweet {
          position: absolute;
          bottom: -20px;
          width: calc(100% - 20px);
          text-align: center;
          color: #409fff;
          .anticon {
            cursor: pointer;
            transform: rotate(90deg);
          }
        }
      }
      :first-child {
        margin-top: 2px;
      }
      .les-itemWeek {
        // background: linear-gradient(
        //   90deg,
        //   #f0f7ff,
        //   rgba(255, 255, 255, 0) 100%
        // );
      }
    }
    .lessonDis {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: url("./../../../../../assets/img/disabled.png") no-repeat;
      // background-size: 100% 100%;
      background-color: #f0f1f2;
      cursor: no-drop;
      overflow: hidden;
    }
    // .disabledSpan {
    //   display: inline-block;
    //   margin: 10px 0 0 10px;
    //   width: 20px;
    //   height: 20px;
    //   background-color: #d2d6da;
    //   border-radius: 50%;
    //   overflow: hidden;
    // }

    //从右侧拖入元素的样式--start
    /deep/.item,
    /deep/.roomItem {
      // position: absolute;
      // top: 0;
      // left: 0;
      // background-color: #fff;
      width: calc(100% - 12px);
      height: 40px;
      line-height: 40px;
      margin: 12px 6px 0;
      border: 1px solid #e0e2e6;
      cursor: pointer;
      div:nth-child(1) {
        flex: 7;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div:nth-child(2) {
        display: none;
        flex: 3;
      }
      .total {
        color: #b9bdc0;
      }
      :hover {
        color: #1ba4b3;
      }
    }
    /deep/.item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding-right: 6px;
    }
    /deep/ .roomItem {
      padding: 0 6px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    //从右侧拖入元素的样式--end

    /deep/.chosen {
      border: 1px solid #409fff;
      // box-shadow: 0px 0px 4px 1px #409fff;
      background-color: #409fff;
      color: #fff;
      z-index: 1;
      .lesson-item {
        background-color: #409fff;
        color: #fff;
        .les-place,
        .les-name {
          color: #fff;
        }
        .weekRetweet {
          color: #fff;
        }
      }
    }
    .ghost {
      border: 1px solid #409fff;
      // box-shadow: 0px 0px 4px 1px #409fff;
      background-color: #409fff;
      color: #fff;
    }
    .conflictDisabled {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: url("./../../../../../assets/img/disabled.png") no-repeat;
      // background-size: 100% 100%;
      background-color: #f0f1f2;
      cursor: no-drop;
      opacity: 0.5;
    }
    .conflictNone {
      display: none;
    }
  }
}
.isNoTeacher {
  border: 1px solid red;
}
.isAccordRule {
  border: 1px solid #042c7c;
}
.commonGrid {
  border: 1px solid rgb(209, 74, 11);
}
.seleLes {
  /deep/ .ant-modal-body {
    padding: 0;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
  .seleLesItem {
    padding: 12px 20px;
    border-bottom: 1px solid #e8e8e8;
    p {
      margin: 0;
      padding: 0;
      color: #303233;
    }
  }
  .seleLesItem:hover {
    background-color: #bae7ff;
  }
}

.tableTips {
  /deep/ span {
    display: inline-block;
    margin-right: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
  }
}
/deep/ .errorInfo {
  margin: 30px 0 20px;
  color: #323435;
  display: flex;
  .errorOk svg,
  .errorNo svg {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    vertical-align: sub;
  }
  .errorOk {
    color: #1ba4b3;
  }
  .errorNo {
    color: #ffd6af;
  }
  .label-con {
    // width: 80%;
  }
}

.btnList {
  text-align: right;
  .ant-btn {
    margin-left: 10px;
    // background-color: #1ba4b3;
    // color: #ffffff;
    // border-color: #1ba4b3;
  }
  .btnCancel {
    // background-color: #fff;
    // color: #000000a6;
    // border-color: #d9d9d9;
  }
}
.yuan {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 100%;
  margin-right: 10px;
}
.clear-con {
  display: flex;
  font-size: 15px;
  color: #000;
  p {
    margin-left: 20px;
  }
}
/deep/ .ant-modal-header {
  text-align: left;
}
</style>
