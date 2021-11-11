<!--
 * @Desc: 课表表格组件
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-10-18 16:57:20
-->

<template>
  <div
    class="wt-timetable"
    v-if="$store.state.app.isRouterAlive"
  >
    <div
      class="wt-p-left"
      v-show="!(pageType===1&&isEditType)"
      @click="$parent.lastWeek()"
    >
      <svg-icon
        icon-class="com_cg_week"
        :scale="0.8"
      ></svg-icon>
    </div>
    <div
      class="wt-p-right"
      v-show="!(pageType===1&&isEditType)"
      @click="$parent.nextWeek()"
    >
      <svg-icon
        icon-class="com_cg_week"
        :scale="0.8"
      ></svg-icon>
    </div>
    <!-- 课表 -->
    <a-table
      :columns="columns"
      :data-source="timetableData"
      bordered
      :pagination="false"
      :loading="classTbLoading"
      :row-key="(record,index) => index"
    >
      <!--标题名字  -->
      <template
        v-for="(item,index) in slotList"
        v-slot:[item]
      >
        <div :key="index"> {{filertWeek(item)}}
          <span
            v-if="slotDay[index]"
            style="margin-left:11px;color: #797c7f;"
          >( {{slotDay[index]}} )
          </span>
        </div>
      </template>
      <!-- 课表内容 -->
    </a-table>
  </div>
</template>
 
<script>
import TableCell from "../PlaceAdjustChild/TableCell";
import { getWeekInTime } from "@/Utils/util";
import { mapState, mapMutations } from "vuex";
export default {
  name: "timetable",
  components: {},
  props: {
    //页面码表 1：周内换课  2：跨周换课 3：代课调整
    pageType: {
      type: Number
    }
  },
  data() {
    return {
      slotDay: [],
      showItem: {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      },
      timetableData: [],
      classTbLoading: false,
      //课表星期码表
      slotList: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun"
      ],
      //时段序列表（合并时段时使用）
      timeFrameArray: [],
      curTeachLesSortOptIndex: "",
      curLesSortIndex: "",
      curWeekSort: "",
      targetLesSortId: "",
      targetLeWeekSort: "",
      nowSemester: {}
    };
  },
  computed: {
    ...mapState("timetableAdjust", [
      "isEditType",
      "curSelectLes",
      "iwInitSecId",
      "iwInitGradeId",
      "iwInitClassId",
      "iwCurTeachWeek",

      "awInitSecId",
      "awInitGradeId",
      "awInitClassId",
      "awCurTeachWeek",
      "selectLesWeekId"
    ]),

    columns() {
      // 时段、节次列
      let arr = [
        {
          title: "时段",
          dataIndex: "diffNoonName",
          key: "diffNoonName",
          width: 36,
          align: "center",
          customRender: (text, row, index) => {
            const result = this.timeFrameArray.some(i => i.start === index);

            if (result) {
              const temp = this.timeFrameArray.filter(i => i.name === text);
              let rowSpan = 0;
              if (temp.length) {
                rowSpan = temp[0].rowSpan || 0;
              } else {
                rowSpan = 1;
              }
              return {
                children: text,
                attrs: {
                  rowSpan: rowSpan
                }
              };
            } else {
              return {
                children: text,
                attrs: {
                  rowSpan: 0
                }
              };
            }
          }
        },
        {
          title: "节次",
          dataIndex: "lesSortName",
          key: "lesSortId",
          width: 44,
          align: "center",
          customRender: (text, row, index) => {
            if (this.isMergeArray.includes(index)) {
              return {
                children: text,
                attrs: {
                  colSpan: 8
                }
              };
            } else {
              return {
                children: text
              };
            }
          }
        }
      ];
      //循环渲染课堂列
      for (let i = 0; i < this.slotList.length; i++) {
        let obj = {
          dataIndex: this.slotList[i],
          align: "center",
          key: this.slotList[i],
          width: 105,
          slots: { title: this.slotList[i] },
          scopedSlots: { customRender: this.slotList[i] },
          customCell: record => {
            return {
              style: {
                "background-color": "rgb(255,255,255)"
              },
              on: {
                click: () => {
                  this.clickCell(record);
                }
              }
            };
          },
          customRender: (text, row, index) => {
            if (this.isMergeArray.includes(index)) {
              //行合并
              return {
                children: <TableCell />,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              let that = this;
              //冲突弹框内容
              let mapConflict = arr => {
                return arr.map(item => {
                  return (
                    <div class="wt-conflict-popver-item">
                      <div class="wt-conflict-popver-type">
                        {that.formType(item.conflictType)}
                      </div>
                      {item.conflictContent.map(i => {
                        item.conflictType
                        return (
                          <div class="wt-conflict-popver-content">{i}</div>
                        );
                      })}
                    </div>
                  );
                });
              };
              //弹框内容
              let content = () => {
                return text.isReplaceable === "1" ? (
                  <div class="wt-submit-popver">
                    <div class="wt-submit-popver-text">
                      <svg-icon icon-class="switch-tip-icon"></svg-icon>
                      <span title={text}>没有规则冲突</span>
                    </div>
                    <a-button
                      class="wt-submit-popver-btn"
                      onClick={this.setSwitchTimetable}
                      type="primary"
                    >
                      确定调课
                    </a-button>
                  </div>
                ) : (
                    <div class="wt-conflict-popver">
                      <div class="wt-conflict-popver-title">规则冲突</div>
                      <div>{mapConflict(text.lesConflict)}</div>
                    </div>
                  );
              };
              //row:整条数据 （slotDay：时间 i：下标 判断时间，更多弹窗使用） week：星期几 filterValue：前端条件过滤
              return {
                children:
                  (text.isReplaceable === "1" || text.lesConflict.length) &&
                    that.pageType !== 3 ? (

                      // 渲染可调换课堂和冲突课堂
                      <a-popover
                        content={content(text)}
                        trigger="click"
                        getPopupContainer={v => v.parentNode}
                      >
                        <TableCell
                          class={
                            that.isEditType && that.isAdjustable(text, row, this.slotList[i])
                              ? "adjustable-class"
                              : that.isConflict(text, row, this.slotList[i])
                                ? "isConflict-class"
                                : ""
                          }
                          row={row}
                          slotDay={this.slotDay}
                          i={i}
                          hasCheckbox={false}
                          week={this.slotList[i]}
                          filterValue={this.showItem}
                        />
                      </a-popover>
                    ) : (
                      // 渲染选中课堂和普通无样式课堂
                      <TableCell
                        class={
                          that.isEditType && that.isActive(text)
                            ? "active-class"
                            : ""
                        }
                        row={row}
                        hasCheckbox={false}
                        slotDay={this.slotDay}
                        i={i}
                        week={this.slotList[i]}
                        filterValue={this.showItem}
                      />
                    )
              };
            }
          }
        };
        arr.push(obj);
      }
      return arr;
    },
    //遍历创建需要合并的行
    isMergeArray() {
      let arr = [];
      this.timetableData.forEach((item, index) => {
        if (item.showType === "1") {
          arr.push(index);
        }
      });
      return arr;
    },
    //冲突类型转换
    formType() {
      return function (val) {
        switch (val) {
          case "1":
            return "场所冲突";
          case "2":
            return "教师冲突";
          case "3":
            return "学生冲突";
          case "4":
            return "节次冲突";
          default:
        }
      };
    },
    //星期转换
    filertWeek() {
      return function (item) {
        switch (item) {
          case "lesMon":
            return "周一";
          case "lesTue":
            return "周二";
          case "lesWed":
            return "周三";
          case "lesThu":
            return "周四";
          case "lesFri":
            return "周五";
          case "lesSat":
            return "周六";
          case "lesSun":
            return "周日";
        }
      };
    },
    //选中课堂
    isActive() {
      return function (text) {
        if (text.lesList.length) {
          return text.lesList[0].isSelect;
        }
      };
    },
    //可调换选中课堂
    isAdjustable() {
      return function (text, row, week) {
        let obj = {
          lesSort: row.lesSortIndex,
          week: week
        }
        if (text.isReplaceable === "1") {
          return (this.curSelectLes.lesSort === obj.lesSort && this.curSelectLes.week === obj.week);
        }
      };
    },
    //冲突课堂
    isConflict() {
      return function (text, row, week) {
        let obj = {
          lesSort: row.lesSortIndex,
          week: week
        }
        if (text.lesConflict.length) {
          return (this.curSelectLes.lesSort === obj.lesSort && this.curSelectLes.week === obj.week);
        }
      };
    }
  },
  created() {
    this.nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
    //判断刷新页面则将编辑状态置为false
    if (this.iwInitClassId || this.awInitClassId) {
      this.setIsEditType(false)
      //调用局部刷新
      this.reload();
    }
  },
  mounted() { },
  methods: {
    ...mapMutations("timetableAdjust", [
      "setIsEditType",
      "hasSelectedLes",
      "setSelectLesWeekId"
    ]),
    ...mapMutations("app", ["reload"]),

    /**
     * @desc: 获取表格数据
     * @param {Object} params 调用动态参数
     * @param {Boolean} isToEdit 是否是在编辑状态调用
     * @author: went
     */

    async getClassTimetable(params, isToEdit) {
      if (isToEdit) {
        await this.setIsEditType(true);
      }
      this.classTbLoading = true
      const filter = {
        gradeId: "",
        classId: "",
        stuCourseId: "",
        schoolYearId: this.nowSemester.schoolYearId,
        semesterId: this.nowSemester.semesterId,
        ...params
      };
      try {
        const res = await this.$api.common.getClassTimetable(filter);
        if (res.code === "200") {
          this.timetableData = res.data;
          this.slotDay = getWeekInTime(this.$parent.curWeek);
          this.gethb();
          //请求成功才进入编辑状态
        } else {
          this.timetableData = []
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        this.classTbLoading = false
      }
    },

    //表格合并操作数据
    gethb() {
      if (this.timetableData.length > 0) {
        let arr = [];
        this.timetableData.map(item => {
          arr.push(item.diffNoonName);
        });
        let arr1 = [];
        for (var i = 0; i < arr.length;) {
          var count = 0;
          for (var j = i; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              count++;
            }
          }
          arr1.push({
            name: arr[i],
            start: i,
            end: i + count - 1,
            rowSpan: count
          });
          i += count;
        }
        this.timeFrameArray = arr1;
      }
    },
    //格子内容显示隐藏
    filterText(filterValue) {
      this.showItem = {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      };
      for (let i = 0; i < filterValue.length; i++) {
        const element = filterValue[i];
        switch (element) {
          case "1":
            this.showItem.sub = true;
            break;
          case "2":
            this.showItem.place = true;
            break;
          case "3":
            this.showItem.tea = true;
            break;
          case "4":
            this.showItem.class = true;
            break;
          case "5":
            this.showItem.time = true;
            break;
        }
      }
    },
    async clickCell(record) {
      //如果是代课调整页面则return
      if (this.pageType === 3) {
        return;
      }
      //非编辑状态
      if (!this.isEditType) {
        //判断课堂是空数据则不调接口查询课表
        if (!record.lesIdList.length) {
          return
        }

        this.curTeachLesSortOptIndex = record.teachLesSortOptIndex;
        this.curLesSortIndex = record.lesSortIndex;
        this.curWeekSort = record.lesIdList[0];
        if (this.pageType === 1) {
          //周内查询课表
          await this.getClassTimetable(
            {
              secId: this.iwInitSecId,
              gradeId: this.iwInitGradeId,
              classId: this.iwInitClassId,
              teachWeekId: this.iwCurTeachWeek.teachWeekId,
              selectLesGroup: {
                lesSortId: this.curTeachLesSortOptIndex, //节次序号
                weekSort: this.slotList.indexOf(this.curWeekSort) + 1, //1134567
                selectLesWeekId: this.iwCurTeachWeek.teachWeekId
              }
            },
            true
          );
        } else {
          //跨周查询课表
          this.setSelectLesWeekId(this.awCurTeachWeek);
          await this.getClassTimetable(
            {
              secId: this.awInitSecId,
              gradeId: this.awInitGradeId,
              classId: this.awInitClassId,
              teachWeekId: this.awCurTeachWeek.teachWeekId,
              selectLesGroup: {
                lesSortId: this.curTeachLesSortOptIndex, //节次序号
                weekSort: this.slotList.indexOf(this.curWeekSort) + 1, //1134567
                selectLesWeekId: this.awCurTeachWeek.teachWeekId
              }
            },
            true
          );
        }
      } else {
        //编辑状态
        this.targetLesSortId = record.teachLesSortOptIndex;
        this.targetLeWeekSort = this.slotList.indexOf(record.lesIdList[0]) + 1;
        this.targetLesSortIndex = record.lesSortIndex
      }
    },
    /**
     * @desc: 获取勾选选中课堂
     * @param {*}
     * @author: went
     */

    //课程调换确认操作
    async setSwitchTimetable() {
      let filter = {};
      if (this.pageType === 1) {
        filter = {
          schoolYearId: this.nowSemester.schoolYearId,
          semesterId: this.nowSemester.semesterId,
          secId: this.iwInitSecId,
          gradeId: this.iwInitGradeId,
          classId: this.iwInitClassId,
          selectLesGroup: {
            lesSortId: this.curTeachLesSortOptIndex,
            weekSort: this.slotList.indexOf(this.curWeekSort) + 1,
            teachWeekId: this.iwCurTeachWeek.teachWeekId,
            lesSortIndex: this.curLesSortIndex
          },
          targetLesGroup: {
            lesSortId: this.targetLesSortId,
            lesSortIndex: this.targetLesSortIndex,
            weekSort: this.targetLeWeekSort,
            teachWeekId: this.iwCurTeachWeek.teachWeekId
          }
        };

        const res = await this.$api.SwitchTimetable.setSwitchTimetable(filter);
        if (res.code === "200") {
          this.getClassTimetable({
            secId: this.iwInitSecId,
            gradeId: this.iwInitGradeId,
            classId: this.iwInitClassId,
            teachWeekId: this.iwCurTeachWeek.teachWeekId,
            selectLesGroup: null
          });
          this.reload();
          this.setIsEditType(false);
        } else {
          this.$message.warning(res.message)
        }
      } else {
        filter = {
          schoolYearId: this.nowSemester.schoolYearId,
          semesterId: this.nowSemester.semesterId,
          secId: this.awInitSecId,
          gradeId: this.awInitGradeId,
          classId: this.awInitClassId,
          selectLesGroup: {
            lesSortId: this.curTeachLesSortOptIndex,
            weekSort: this.slotList.indexOf(this.curWeekSort) + 1,
            teachWeekId: this.selectLesWeekId.teachWeekId,
            lesSortIndex: this.curLesSortIndex
          },
          targetLesGroup: {
            lesSortId: this.targetLesSortId,
            weekSort: this.targetLeWeekSort,
            teachWeekId: this.awCurTeachWeek.teachWeekId,
            lesSortIndex: this.targetLesSortIndex
          }
        };

        const res = await this.$api.SwitchTimetable.setSwitchTimetable(filter);
        if (res.code === "200") {
          this.getClassTimetable({
            secId: this.awInitSecId,
            gradeId: this.awInitGradeId,
            classId: this.awInitClassId,
            teachWeekId: this.awCurTeachWeek.teachWeekId,
            selectLesGroup: null
          });
          this.reload();
          this.setIsEditType(false);
        } else {
          this.$message.warning(res.message)
        }
      }
    }
  },
  beforeDestroy() {
    this.setIsEditType(false);
  }
};
</script>
 
<style scoped lang = "less">
.adjustable-class {
  background: rgba(42, 191, 142, 0.1);
  outline: 3px solid #2abf8e;
}
.isConflict-class {
}
.active-class {
  background: rgba(255, 129, 87, 0.2);
  outline: 3px solid #f67246;
}
.wt-timetable {
  position: relative;
  background: #ffffff;
  .wt-p-left {
    z-index: 9;
    position: absolute;
    left: -13px;
    top: 14px;
  }
  .wt-p-right {
    z-index: 9;
    transform: rotate(180deg);
    position: absolute;
    right: -13px;
    top: 14px;
  }
  svg {
    width: 26px;
    height: 26px;
    opacity: 1;
    cursor: pointer;
    box-shadow: 0px 6px 8px 0px rgba(42, 191, 142, 0.15);
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 0;
  }
}
.wt-submit-popver {
  width: 216px;
  height: 105px;
  opacity: 1;
  background: #ffffff;
  .wt-submit-popver-text {
    font-size: 16px;
    height: 64px;
    line-height: 64px;
    span {
      margin-left: 10px;
      color: #494b4d;
    }
  }
  .wt-submit-popver-btn {
    margin-left: 120px;
  }
}
.wt-conflict-popver {
  width: 456px;
  height: 180px;
  padding: 12px;
  .wt-conflict-popver-title {
    font-family: @font-family;
    font-size: 16px;
    font-weight: 700;
    color: #303233;
    margin-bottom: 6px;
  }
  .wt-conflict-popver-item {
    margin-bottom: 6px;
    .wt-conflict-popver-type {
      color: #f57246;
      font-weight: 700;
    }
    .wt-conflict-popver-content {
      color: #303233;
    }
  }
}
</style>