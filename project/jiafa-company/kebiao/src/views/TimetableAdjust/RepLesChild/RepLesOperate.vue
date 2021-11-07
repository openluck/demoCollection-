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
        v-for="item in secList"
        :value="item.secId"
        :key="item.secId"
      >{{ item.secName }}</a-select-option>
    </a-select>
    <a-select
      style="width:120px;margin-right:10px"
      v-model="subjectId"
      @change="handleChangeSub"
      :dropdownStyle="{zIndex:'10'}"
      :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }"
    >
      <a-select-option

        v-for="item in subjectList"
        :value="item.subjectId"
        :key="item.subjectId"
      >{{ item.subjectName }}</a-select-option>
    </a-select>
    <a-select
      show-search 
      :filter-option="filterOption" 
      style="width:120px;margin-right:10px"
      v-model="teacherId"
      :dropdownStyle="{zIndex:'10'}"
      @change="handleChangeTeacher"
      :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }"
    >
      <a-select-option
        v-for="item in teacherList"
        :key="item.teacherId"
        :value="item.teacherId"
      >{{ item.teacherName }}</a-select-option>
    </a-select>
    <a-button
      type="primary"
      @click="onSearch"
    >
      <svg-icon
        icon-class="com_search"
        :scale="1.2"
        class="com-btn-icon"
      >
      </svg-icon>查询
    </a-button>
    <span class="operate-control-btn">
      <a-button
        icon="reload"
        @click="openRecord"
      >调整记录</a-button>
      <a-button
        icon="check"
        type="primary"
        @click="showReLesModal"
      >代课</a-button>
    </span>

    <global-modal
      :visible="reLesVisible"
      :title="reLesTitle"
      :width="680"
      :defaultBtn="false"
      @cancel="reLesCancel"
    >
      <div class="wt-modal-select-inner">
        <a-form-model
          ref="searchData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="可代课老师">
            <a-select
              class="wt-modal-select-item"
              label-in-value
              @change="setReLesAbleTeacher"
            >
              <a-select-option
                v-for="(item) in reLesAbleTeacherList"
                :key="item.repLesTeacherId"
              >{{item.repLesTeacherName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="应用到其他周次"
            style="margin-top:8px"
          >
            <div class="">
              <div class="">
                <a-checkbox
                  style="width: 114px;"
                  @change="(e) => checkAll(e, 0)"
                  :checked="all"
                >全部</a-checkbox>
                <a-checkbox
                  style="width: 114px;"
                  @change="(e) => checkAll(e, 1)"
                  :checked="two"
                >全部双周</a-checkbox>
                <a-checkbox
                  @change="(e) => checkAll(e, 2)"
                  :checked="one"
                >全部单周</a-checkbox>
              </div>
            </div>
          </a-form-model-item>
          <a-checkbox-group
            v-model="value"
            @change="onChange"
            class="wt-week-item"
          >
            <a-row>
              <a-col
                :title="item.label"
                :span="6"
                v-for="(item,index) in options"
                :key="index"
              >
                <a-checkbox
                  :title="item.label"
                  :disabled='item.value === curTeachWeek.teachWeekId ? true : false'
                  style="width: 120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                  :value="item.value"
                >{{item.label}}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model>

      </div>
      <template #selfBtn>
        <a-button
          type="default"
          @click="reLesCancel"
        >取消</a-button>
        <a-button
          type="primary"
          :loading="requestLoading"
          @click="reLesSubmit"
        >确定</a-button>
      </template>
    </global-modal>
    <RecordModal ref="RecordModal" />

  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import GlobalModal from "@/components/common/GlobalModal";
import RecordModal from "@/components/common/RecordModal";

export default {
  name: "",
  components: { GlobalModal, RecordModal },
  props: {
    operateType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      secId: "",
      subjectId: "",
      teacherId: "",
      secList: "",
      subjectList: "",
      teacherList: "",
      curWeek: null,

      defaultGrade: "",
      defaultClass: "",
      showDefaultClass: false,

      reLesVisible: false,
      reLesTitle: "代课调整",
      reLesAbleTeacherId: "",
      reLesAbleTeacherName: "",
      reLesAbleTeacherList: [],
      statusGraphicList: [
        { id: 1, text: "选中的课程", color: "rgba(251, 173, 74,1)" },
        { id: 2, text: "可对调课程", color: "rgba(43, 193, 125,1)" },
        { id: 3, text: "历史课程不可操作", color: "rgba(236, 239, 242,1)" },
        { id: 4, text: "已换课程", color: "rgba(254, 239, 219,1)" }
      ],
      //应用到其他周次
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      selectedWeek: [],
      options: [],
      value: [],
      exParam: {},
      all: false,
      one: false,
      two: false,
      weekTextList: [],
      resTips: "",
      requestLoading: false

    };
  },
  computed: {
    ...mapState("replaceLes", [
      "isEditType",
      "curTeachWeek",
      "reLesSecList",
      "reLesSubjectList",
      "reLesTeacherList",
      "reLesInitSecId",
      "reLesInitSubjectId",
      "reLesInitTeacherId"
    ])
  },
  created() {
    this.initFilterData();
  },
  mounted() {
    this.value.push(this.curTeachWeek.teachWeekId)
    this.transformWeek(JSON.parse(sessionStorage.getItem("teachWeekList")));
  },
  methods: {
    ...mapMutations("replaceLes", [
      "setReLesInitSecId",
      "setReLesInitSubjectId",
      "setReLesInitTeacherId",
      "setReLesSecList",
      "setReLesSubjectList",
      "setReLesTeacherList"
    ]),
    /**
     * @desc: 初始化筛选框数据
     * @param {*}
     * @author: went
     */

    initFilterData() {
      this.secId = this.reLesInitSecId;
      this.subjectId = this.reLesInitSubjectId;
      this.teacherId = this.reLesInitTeacherId;
      this.secList = this.reLesSecList;
      this.subjectList = this.reLesSubjectList;
      this.teacherList = this.reLesTeacherList;
    },
    /**
     * @desc: 切换学段
     * @param {*}
     * @author: went
     */
    async handleChangeSec(val) {
      this.secId = val;
      this.subjectId = "";
      this.teacherId = "";
      this.subjectList = [];
      const params = {
        secId: this.secId
      };
      const res = await this.$api.common.getSubjecByStudySec(params);
      if (res.code === "200") {
        this.subjectList = res.data;
      }
    },

    /**
     * @desc:选择科目
     * @param {*}
     * @author: went
     */

    async handleChangeSub(val) {
      this.subjectId = val;
      this.teacherId = "";
      this.teacherList = [];
      const params = {
        secId: this.secId,
        subjectId: this.subjectId
      };
      const res = await this.$api.common.getTeacherBySub(params);
      if (res.code === "200") {
        this.teacherList = res.data;
      } else {
        this.$message.warning(res.message)
      }
    },
    /**
     * @desc:选择教师
     * @param {*}
     * @author: went
     */

    handleChangeTeacher(val) {
      this.teacherId = val;
    },
    /** 查询
     * @desc:
     * @param {*}
     * @author: went
     */

    onSearch() {
      this.setReLesInitSecId(this.secId);
      this.setReLesInitSubjectId(this.subjectId);
      this.setReLesInitTeacherId(this.teacherId);
      this.setReLesSecList(this.secList);
      this.setReLesSubjectList(this.subjectList);
      this.setReLesTeacherList(this.teacherList);

      this.$nextTick(() => {
        this.$parent.$parent.getTeacherCourseList(this.reLesInitTeacherId);
        this.$parent.$parent.getTableData();
        this.$parent.$parent.clearCurCourseId()
      });
    },
    async showReLesModal() {
      const arr = this.$parent.$parent.$refs.timetable.getSelectedCell(1);
      if (!arr.length) {
        this.$message.warning("请选择课堂！");
        return;
      }
      const params = {
        teachWeekId: this.curTeachWeek.teachWeekId,
        lesGroupList: [...arr],
        secId: this.reLesInitSecId,
        subjectId: this.reLesInitSubjectId
      };

      const res = await this.$api.ReplaceLes.getReplaceLesTeachers(params);
      if (res.code === "200") {
        this.reLesAbleTeacherList = res.data;
      } else {
        this.$message.warning(res.message)
      }
      this.reLesVisible = true;
      //默认添加当前周
      this.selectedWeek.push(this.curTeachWeek.teachWeekId)
    },
    setReLesAbleTeacher(val) {
      this.reLesAbleTeacherId = val.key;
      this.reLesAbleTeacherName = val.label;
    },
    // 选择周次
    checkAll(e, type) {
      this.value = [];
      if (e.target.checked) {
        switch (type) {
          case 0:
            this.all = true;
            this.one = true;
            this.two = true;
            this.options.map(item => {
              this.value.push(item.value);
            });
            break;
          case 1:
            this.all = false;
            this.one = false;
            this.two = true;
            this.options.map((item, index) => {
              if (index % 2 !== 0) {
                this.value.push(item.value);
              }
            });
            break;
          case 2:
            this.all = false;
            this.one = true;
            this.two = false;
            this.options.map((item, index) => {
              if (index % 2 === 0) {
                this.value.push(item.value);
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
              this.options.map((item, index) => {
                if (index % 2 === 0) {
                  this.value.push(item.value);
                }
              });
            }
            break;
          case 2:
            this.all = false;
            this.one = false;
            if (this.two) {
              this.options.map((item, index) => {
                if (index % 2 !== 0) {
                  this.value.push(item.value);
                }
              });
            }
            break;
          default:
            break;
        }
      }
      if (!this.value.includes(this.curTeachWeek.teachWeekId)) {
        this.value.push(this.curTeachWeek.teachWeekId)
      }
      this.selectedWeek = [...this.value];
    },
    transformWeek(defaultList) {
      if (defaultList) {
        defaultList.forEach(item => {
          let obj = {};
          obj.label = item.teachWeekName;
          obj.value = item.teachWeekId;
          this.options.push(obj);
        });
      }
    },
    onChange(val) {
      this.selectedWeek = [...this.selectedWeek, ...val];
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    /**
     * @desc:代课调整提交操作
     * @param {*}
     * @author: went
     */

    async reLesSubmit() {
      // this.requestLoading = true
      if (!this.reLesAbleTeacherId) {
        this.$message.warning("请选择代课老师")
        return
      }
      const arr = this.$parent.$parent.$refs.timetable.getSelectedCell(0);
      const params = {
        secId: this.reLesInitSecId,
        subjectId: this.reLesInitSubjectId,
        lesGroupList: [...arr],
        repLesTeacherId: this.reLesAbleTeacherId,
        repLesTeacherName: this.reLesAbleTeacherName,
        applyWeek: [...new Set(this.selectedWeek)]
      };
      try {
        const res = await this.$api.ReplaceLes.operateRepleceLes(params);
        if (res.code === "200") {
          this.$parent.$parent.getTableData();
          this.reLesVisible = false;
          this.weekTextList = res.data?.weekTextList.join(", ");
          if (res.data?.succes) {
            this.resTips = "代课成功！应用到以下周次：";
            this.showSuccess();
          } else {
            this.resTips = "代课失败！以下周次存在冲突：";
            this.showWarning();
          }
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("err", error);
      } finally {
        this.requestLoading = false
        this.selectedWeek = [];
        this.value = [];
        this.all = false;
        this.one = false;
        this.two = false;
      }
    },
    showSuccess() {
      this.$success({
        title: `${this.resTips}`,
        content: `${this.weekTextList}`,
        okText: "知道了",
        onOk() { }
      });
    },
    showWarning() {
      this.$warning({
        title: `${this.resTips}`,
        content: `${this.weekTextList}`,
        okText: "知道了",
        onOk() { }
      });
    },
    reLesCancel() {
      this.reLesVisible = false;
      this.selectedWeek = [];
      this.value = []
      this.all = false;
      this.one = false;
      this.two = false;
    },
    /**
     * @desc:调整记录
     * @param {*}
     * @author: went
     */

    openRecord() {
      let data = {
        changeType: "3",
        secId: this.secId,
        subjectId: this.subjectId,
        personId: this.teacherId
        // teachWeekId: this.curTeachWeek.teachWeekId
      };
      this.$refs.RecordModal.showModal(data);
    }

  }
};
</script>

<style scoped lang="less">
.wt-operate-control {
  width: 100%;
  position: relative;
  .operate-control-btn {
    position: absolute;
    right: 10px;
  }
}
.wt-modal-select-inner {
  // display: flex;
  // justify-content: center;
  margin: 22px 0;
  .wt-modal-select-item {
    width: 200px;
  }
  .wt-week-item {
    margin: 0 34px 0 130px;
    padding: 14px 12px;
    background-color: #fafbfc;
  }
  /deep/.ant-form-item {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    margin-bottom: 0px;
    vertical-align: top;
  }
}
</style>
