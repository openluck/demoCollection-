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
      :loading="resLesLoading"
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
  name: "reslestimetable",
  components: {},
  props: {
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
      resLesLoading: false,
      //课表数据
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
      curLesSortId: "",
      curWeekSort: "",
      targetLesSortId: "",
      targetLeWeekSort: "",
      curText: "",
      nowSemester: {}
    };
  },
  computed: {
    ...mapState("timetableAdjust", [
      "isEditType",
      "curSelectLes",
      "reLesInitSecId",
      "reLesInitSubjectId",
      "reLesInitTeacherId"
    ]),

    columns() {
      let arr = [
        {
          title: "时段",
          dataIndex: "diffNoonName",
          key: "diffNoonName",
          width: 36,
          align: "center",
          customRender: (text, row, index) => {
            const result = this.timeFrameArray.some(i => i.start === index);
            // debugger;
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
              return {
                children: <TableCell />,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              let that = this;
              that.curText = text;
              let mapConflict = arr => {
                return arr.map(item => {
                  return (
                    <div class="wt-conflict-popver-item">
                      <div class="wt-conflict-popver-type">
                        {item.conflictType}
                      </div>
                      {item.conflictContent.map(i => {
                        item.conflictType;
                        return (
                          <div class="wt-conflict-popver-content">{i}</div>
                        );
                      })}
                    </div>
                  );
                });
              };
              let content = () => {
                return text.isReplaceable === "true" ? (
                  <div class="wt-submit-popver">
                    <div class="wt-submit-popver-text">
                      <svg-icon icon-class="tip-icon"></svg-icon>
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
                  (text.isReplaceable === "true" || text.lesConflict.length) &&
                    this.pageType !== 3 ? (
                      <a-popover content={content(text)} trigger="click">
                        <TableCell
                          class={
                            that.isEditType && that.isActive(text)
                              ? "adjustable-class"
                              : that.isConflict(text)
                                ? "isConflict-class"
                                : ""
                          }
                          row={row}
                          slotDay={this.slotDay}
                          i={i}
                          week={this.slotList[i]}
                          filterValue={this.showItem}
                        />
                      </a-popover>
                    ) : (
                      <TableCell
                        class={
                          that.isEditType &&
                            that.isActive(text) &&
                            this.pageType !== 3
                            ? "adjustable-class"
                            : ""
                        }
                        row={row}
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

    isMergeArray() {
      let arr = [];
      this.timetableData.forEach((item, index) => {
        if (item.showType === "1") {
          arr.push(index);
        }
      });
      return arr;
    }
  },
  created() {
    this.nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
  },
  mounted() { },
  methods: {
    isActive(text) {
      if (text.isReplaceable === "true") {
        return this.curSelectLes.lesList[0].lesId === text.lesList[0].lesId;
      }
    },
    isConflict(text) {
      if (text.lesConflict.length) {
        return this.curSelectLes.lesList[0].lesId === text.lesList[0].lesId;
      }
    },
    ...mapMutations("timetableAdjust", ["setIsEditType"]),
    ...mapMutations("app", ["reload"]),
    async getStuTimetable(params) {
      this.resLesLoading = true
      const filter = {
        gradeId: "",
        classId: "",
        stuCourseId: "",
        schoolYearId: this.nowSemester.schoolYearId,
        semesterId: this.nowSemester.semesterId,
        ...params
      };

      const res = await this.$api.common.getStuTimetable(filter);
      try {
        if (res.code === "200") {
          this.timetableData = res.data;
          this.slotDay = getWeekInTime(this.$parent.curWeek);
          this.gethb();
        } else {
          this.$message.warning(res.message);
          this.timetableData = []
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        this.resLesLoading = false
      }
    },
    filertWeek(item) {
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
    clickCell(record) {
      if (this.pageType === 3) {
        return;
      }
      if (!this.isEditType) {
        this.curLesSortId = record.lesSortId;
        this.curWeekSort = record.lesIdList[0];

        this.setIsEditType(true);

        this.getStuTimetable();
      } else {
        this.targetLesSortId = record.lesSortId;
        this.targetLeWeekSort = record.lesIdList[0];
      }
    },
    /**
     * @desc: 获取勾选选中课堂
     * @param {*}
     * @author: went
     */

    getSelectedCell(type) {
      let arr = [];
      for (let i = 0; i < this.timetableData.length; i++) {
        const obj = this.timetableData[i];
        for (let j = 0; j < this.slotList.length; j++) {
          const week = this.slotList[j];
          if (obj[week] && obj[week].lesList) {
            for (let k = 0; k < obj[week].lesList.length; k++) {
              const item = obj[week].lesList[k];
              if (item.isSelect) {
                if (type) {
                  let temp = {
                    lesSortId: obj.teachLesSortOptIndex,
                    week: j + 1,
                    lesId: item.lesId
                  };

                  arr.push(temp);
                } else {
                  arr.push({ lesId: item.lesId });
                }
              }
            }
          }
        }
      }
      return arr;
    },
    async setSwitchTimetable() {
      const filter = {
        secId: "",
        gradeId: "",
        classId: "",
        selectLesGroup: {
          lesSortId: this.curLesSortId,
          weekSort: this.curWeekSort
        },
        targetLesGroup: {
          lesSortId: this.targetLesSortId,
          weekSort: this.targetLeWeekSort
        }
      };
      const res = await this.$api.SwitchTimetable.setSwitchTimetable(filter);
      if (res.code === "200") {
        this.getStuTimetable();
        this.reload();
        this.setIsEditType(false);
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.adjustable-class {
  background: rgba(42, 191, 142, 0.1);
  border: 3px solid #2abf8e;
}
.isConflict-class {
  background: rgba(255, 129, 87, 0.2);
  border: 3px solid #f67246;
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