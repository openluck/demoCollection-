<!--
 * @Desc: 周内调换课筛选操作组件
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-09-27 16:48:35
-->

<template>
  <div class="wt-operate-control common-operate">
    <a-select
      style="width:120px;margin-right:10px"
      v-model="secId"
      @change="handleChangeSec"
      :dropdownStyle="{zIndex:'10'}"
      :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }"
    >
      <a-select-option
        v-for="item in secIdList"
        :value="item.secId"
        :key="item.secId"
      >{{ item.secName }}</a-select-option>
    </a-select>
    <a-select
      style="width:120px;margin-right:10px"
      v-model="gradeId"
      @change="handleChangeGrade"
      :dropdownStyle="{zIndex:'10'}"
      :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }"
    >
      <a-select-option
        v-for="item in gradeIdList"
        :value="item.gradeId"
        :key="item.gradeId"
      >{{ item.gradeName }}</a-select-option>
    </a-select>
    <a-select
      style="width:140px;margin-right:10px"
      v-model="classId"
      @change="handleChangeClass"
      :dropdownStyle="{zIndex:'10'}"
      :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }"
    >
      <a-select-option
        v-for="item in classIdList"
        :key="item.classId"
        :value="item.classId"
      >{{ item.className }}</a-select-option>
    </a-select>
    <a-button
      class="wt-search-btn"
      type="primary"
      @click="onSearch()"
    >
      <svg-icon
        icon-class="com_search"
        :scale="1.2"
        class="com-btn-icon"
      ></svg-icon>查询
    </a-button>
    <span class="operate-control-btn">
      <a-button @click="openRecord">
        <svg-icon
          icon-class="com_adjust_record"
          :scale="1"
          style="margin-right:5px"
        >
        </svg-icon>调整记录
      </a-button>
      <a-button
        v-if="isEditType"
        icon="cancel"
        class="wt-exit-btn"
        @click="exitEdit"
      >退出
      </a-button>
      <a-button
        v-else
        v-show="operateType===1"
        icon="check"
        type="primary"
        @click="ApplyOtherWeek()"
      >应用于其他周次</a-button>
    </span>
    <RecordModal ref="RecordModal" />
    <ApplyOtherWeek
      v-if="operateType===1"
      ref="ApplyOtherWeek"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import RecordModal from "@/components/common/RecordModal";
import ApplyOtherWeek from "@/components/common/ApplyOtherWeek";
export default {
  name: "",
  components: { RecordModal, ApplyOtherWeek },
  props: {
    operateType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      secId: "",
      gradeId: "",
      classId: "",
      secIdList: [],
      gradeIdList: [],
      classIdList: [],
      curWeek: null,

      defaultGrade: "",
      defaultClass: "",
      showDefaultClass: false,
      statusGraphicList: [
        { id: 1, text: "选中的课程", color: "rgba(251, 173, 74,1)" },
        { id: 2, text: "可对调课程", color: "rgba(43, 193, 125,1)" },
        { id: 3, text: "历史课程不可操作", color: "rgba(236, 239, 242,1)" },
        { id: 4, text: "已换课程", color: "rgba(254, 239, 219,1)" }
      ]
    };
  },
  computed: {
    ...mapState("timetableAdjust", [
      "isEditType",

      "iwSecList",
      "iwGradeList",
      "iwClassList",
      "iwInitSecId",
      "iwInitGradeId",
      "iwInitClassId",
      "iwCurTeachWeek",

      "awSecList",
      "awGradeList",
      "awClassList",
      "awInitSecId",
      "awInitGradeId",
      "awInitClassId",
      "awCurTeachWeek"
    ])
  },
  created() {
    this.initFilterData();
  },
  mounted() { },
  methods: {
    ...mapMutations("timetableAdjust", [
      "setIsEditType",
      "setIwSecList",
      "setIwGradeList",
      "setIwClassList",
      "setIwInitSecId",
      "setIwInitGradeId",
      "setIwInitClassId",

      "setAwSecList",
      "setAwGradeList",
      "setAwClassList",
      "setAwInitSecId",
      "setAwInitGradeId",
      "setAwInitClassId"
    ]),
    /**
     * @desc: 初始化筛选框数据
     * @param {*}
     * @author: went
     */

    initFilterData() {
      if (this.operateType === 1) {
        this.secId = this.iwInitSecId;
        this.gradeId = this.iwInitGradeId;
        this.classId = this.iwInitClassId;
        this.secIdList = this.iwSecList;
        this.classIdList = this.iwClassList;
        this.gradeIdList = this.iwGradeList;
      } else {
        this.secId = this.awInitSecId;
        this.gradeId = this.awInitGradeId;
        this.classId = this.awInitClassId;
        this.secIdList = this.awSecList;
        this.classIdList = this.awClassList;
        this.gradeIdList = this.awGradeList;
      }
    },
    /**
     * @desc: 切换学段
     * @param {*}
     * @author: went
     */

    handleChangeSec(val) {
      this.secId = val;
      this.gradeId = "";
      this.classId = "";

      this.classIdList = [];
      this.secIdList.forEach(item => {
        if (item.secId === val) {
          this.gradeIdList = item.gradeList;
        }
      });
    },
    /**
     * @desc:选择年级
     * @param {*}
     * @author: went
     */

    async handleChangeGrade(val) {
      this.gradeId = val;
      this.classId = "";
      this.classIdList = [];
      const params = {
        secId: this.secId,
        gradeId: this.gradeId
      };
      const res = await this.$api.common.getClassByGrade(params);
      if (res.code === "200") {
        this.classIdList = res.data;
      }
    },
    /**
     * @desc:选择班级
     * @param {*}
     * @author: went
     */

    handleChangeClass(val) {
      this.classId = val;
    },

    /** 查询
     * @desc:
     * @param {*}
     * @author: went
     */
   
    onSearch() {
      if (this.operateType === 1) {
        this.setIwInitSecId(this.secId);
        this.setIwInitGradeId(this.gradeId);
        this.setIwInitClassId(this.classId);
        this.setIwSecList(this.secIdList);
        this.setIwGradeList(this.gradeIdList);
        this.setIwClassList(this.classIdList);
      } else {
        this.setAwInitSecId(this.secId);
        this.setAwInitGradeId(this.gradeId);
        this.setAwInitClassId(this.classId);
        this.setAwSecList(this.secIdList);
        this.setAwGradeList(this.gradeIdList);
        this.setAwClassList(this.classIdList);
      }
      this.exitEdit()
    },
    ApplyOtherWeek() {
      this.$refs.ApplyOtherWeek.showModal();
      const params = {
        secId: this.iwInitSecId,
        gradeId: this.iwInitGradeId,
        classId: this.iwInitClassId,
        palceId: "",
        personId: "",
        teachWeekId: this.iwCurTeachWeek.teachWeekId,
        subjectId: "",
        changeType: 1
      };
      this.$refs.ApplyOtherWeek.initExParam(params);
    },
    /**
     * @desc:调整记录
     * @param {*}
     * @author: went
     */

    openRecord() {
      let data = {
        changeType: this.operateType === 1 ? "1" : "2",
        classId: this.classId,
        secId: this.secId
        // teachWeekId: this.operateType === 1 ? this.iwCurTeachWeek.teachWeekId : this.awCurTeachWeek.teachWeekId

      };
      this.$refs.RecordModal.showModal(data);
    },
    /**
     * @desc:退出编辑
     * @param {*}
     * @author: went
     */

    exitEdit() {
      this.setIsEditType(false);
      this.$parent.$parent.getTableData();
    }
  }
};
</script>

<style scoped lang="less">
.wt-operate-control {
  width: 100%;
  position: relative;
  .wt-search-btn {
    vertical-align: middle;
    color: rgba(255, 255, 255, 0.9);
  }
  .operate-control-btn {
    position: absolute;
    right: 10px;
    .wt-exit-btn {
      background: #f28955;
      color: #ffffff;
    }
  }
}
</style>
