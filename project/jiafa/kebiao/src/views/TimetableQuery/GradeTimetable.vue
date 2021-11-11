<!--
 * @Author: ylc
 * @Date: 2021-08-03 10:06:18
 * @LastEditTime: 2021-10-20 09:34:49
 * @LastEditors: ylc
 * @Description: 年级课表
 * @FilePath: \Web\src\views\TimetableQuery\GradeTimetable.vue
-->

<template>
  <div class="ylc-grade-content">
    <div class="common-title">年级课表</div>

    <head
      style="display: flex; justify-content: space-between; padding-right: 5px;height: 32px;margin-bottom: 24px;">
      <div class="common-operate">
        <a-select id="selectSchoolYear"
          v-model="fetchData.schoolYearId"
          style="width: 168px"
          @select="handleSchoolYearSelect">
          <a-select-option v-for="item of schoolYearList"
            :value="item.schoolYearId"
            :key="item.schoolYearId">{{ item.schoolYearName }}</a-select-option>
        </a-select>
        <!-- 学期选择框 -->
        <!-- <label for="selectSemester" style="margin-left:15px;">学期：</label> -->
        <a-select id="selectSemester"
          v-model="fetchData.semesterId"
          style="width: 120px; margin-left: 16px"
          @select="handleSemesterSelect">
          <a-select-option v-for="item of semesterList"
            :value="item.semesterId"
            :key="item.semesterId">{{ item.semesterName }}</a-select-option>
        </a-select>
        <!-- 学段列表选择 -->
        <a-select v-model="fetchData.secId"
          @change="secChange"
          style="width: 120px; margin-left: 16px">
          <a-select-option v-for="item of secList"
            :value="item.secId"
            :key="item.secId">{{ item.secName }}</a-select-option>
        </a-select>
        <a-button type="search"
          class="ylc-select-button"
          @click="search">
          <svg-icon icon-class="com_search"
            class="ylc-select-icon" />
          查询
        </a-button>
      </div>
      <!-- 导出 -->
      <div class="export">
        <a-button class="export-btn"
          @click="handleExport">
          <svg-icon icon-class="que_export"
            class="export-icon" />导出课表
        </a-button>
      </div>
    </head>
    <div class="ylc-grade-body">
      <div class="
         ylc-grade-left">
        <div class="ylc-grade-list">
          <div :class="
              item.gradeId === fetchData.gradeId
                ? 'ylc-grade-item ylc-checked'
                : 'ylc-grade-item'
            "
            v-show="item.gradeId !== ''"
            v-for="item of gradeList"
            :key="item.gradeId"
            @click="chooseGrade(item.gradeId)">
            <div>{{ item.gradeName }}</div>
          </div>
        </div>
      </div>
      <div class="ylc-grade-right"
        :style="{height: height}">
        <TableMenu @checkChange="checkChange"
          @getTeachWeek="getTeachWeek"
          :defaultWeek="defaultWeek"
          :outCheck="checkList"
          :statu="fetchStatu"
          :semesterStartTime="semesterStartTime"
          :semesterEndTime="semesterEndTime" />
        <a-table class="table"
          :columns="columns"
          :data-source="data"
          :loading="tableLoading"
          :rowKey="(row, index) => index"
          bordered
          :pagination="false">
        </a-table>
      </div>
    </div>
    <GlobalModal :visible="visible"
      title="导出课表"
      :width="440"
      :defaultBtn="false"
      @cancel="cancel"
      @confirm="exportGradeTable">
      <div style="padding: 56px 64px">
        <div style="display: flex">
          <div style="height: 32px; line-height: 32px">年级范围：</div>
          <div>
            <a-select style="width: 240px"
              v-model="fetchData.gradeId">
              <a-select-option v-for="item in gradeList"
                style="width: 240px; overflow: hidden; text-overflow: ellipsis"
                :key="item.gradeId"
                :value="item.gradeId">
                {{ item.gradeName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div slot="selfBtn"
        style="text-align: center">
        <a-button style="width: 72px"
          @click="cancel">取消</a-button>
        <a-button style="width: 72px; background: #2abf8e; color: #fff"
          @click="exportGradeTable">确定</a-button>
      </div>
    </GlobalModal>
  </div>
</template>

<script>
import { downloadFile } from "../../Utils/util";
import { mapState, mapMutations } from "vuex";
import TableMenu from "./Child/TableMenu.vue";
import GradeCell from "./Child/GradeCell.vue";
import GlobalModal from "../../components/common/GlobalModal.vue";
export default {
  components: {
    TableMenu,
    GlobalModal
  },
  data() {
    return {
      data: [],
      schoolYearList: [],
      semesterList: [],
      secList: [],
      height: "",
      defaultWeek: {}, // 默认周次
      fetchData: {
        schoolYearId: "",
        semesterId: "",
        teachWeekId: "20006_2020_2021_D1A3A60708734B5A9022923333B39F1E_10",
        secId: "",
        gradeId: ""
      },
      fetchStatu: true, // 查询状态
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun"
      ],
      lesWeekWidth: [], // 最大宽度数组
      lesWeekHeight: [], // 最大高度数组
      gradeList: [],
      gradeShowList: [],
      checkList: ["科目", "教师", "班级"],
      lesDay: [],
      tableLoading: false, //课表加载
      semesterEndTime: "",
      semesterStartTime: "",
      visible: false,
      columns: []
    };
  },
  watch: {
    data() {
      this.dataLength()
      this.dataHeight()
      let arr = [
        {
          title: "时段",
          dataIndex: "diffNoonName",
          align: "center",
          width: 73,
          ellipsis: true,
          customRender: (text, row) => {
            const temp = this.data.filter((i) => i.diffNoonName === text);
            this.data.map((item) => {
              if (item.diffNoonName === text) {
                item.rowSpan = 0;
              }
            });
            let arr = [];
            this.data.map((inkey, index) => {
              if (inkey.diffNoonName === text) {
                return arr.push(index);
              }
            });
            this.data[arr[0]].rowSpan = temp.length;
            return {
              children: text,
              attrs: {
                rowSpan: row.rowSpan || 0
              }
            };
          }
        },
        {
          title: "节次",
          dataIndex: "lesSortName",
          align: "center",
          width: 88,
          ellipsis: true,
          customRender: (text, row) => {
            if (row.showType === "1") {
              return {
                children: text,
                attrs: {
                  colSpan: 8
                }
              };
            } else {
              return {
                children: text,
                attrs: {
                  colSpan: 1
                }
              };
            }
          }
        }
      ];
      for (let i = 0; i < this.lesWeek.length; i++) {
        let obj = {
          title: () => {
            return (
              <div>
                {this.filertWeek(this.lesWeek[i])}
                <span
                  style={{
                    color: "#797C7F",
                    marginLeft: "10px",
                    fontWeight: "400"
                  }}
                >
                  ({this.lesDay[i]})
                </span>
              </div>
            );
          },
          dataIndex: this.lesWeek[i],
          align: "center",
          key: this.lesWeek[i],
          width:
            this.lesWeekWidth[i] > 3 ? 185 * 3 : 185 * this.lesWeekWidth[i],
          slots: { title: this.lesWeek[i] },
          scopedSlots: { customRender: this.lesWeek[i] },
          customRender: (text, row) => {
            if (row.showType === "1") {
              return {
                children: text,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              return (
                <GradeCell
                  row={row}
                  value={text}
                  i={i}
                  remark={this.data[0].remarkList[i]}
                  week={this.filertWeek(this.lesWeek[i])}
                  maxWidth={this.lesWeekWidth[i]}
                  maxHeight={row.maxHeight}
                  list={this.checkList}
                ></GradeCell>
              );
            }
          }
        };
        arr.push(obj);
      }
      this.columns = arr;
    }
  },
  computed: {
    ...mapState("timetableQuery", ["gradeTimeTable"])
  },
  created() {
    this.init()
  },
  methods: {
    ...mapMutations("timetableQuery", ["setGradeTimeTable"]),
    // 初始化数据
    async init() {
      this.schoolYearList = JSON.parse(sessionStorage.getItem("schoolYearList"));
      this.height = (window.innerHeight - 210) + "px"
      if (this.gradeTimeTable.secId) {
        this.secList = this.gradeTimeTable.secList
        this.semesterList = this.gradeTimeTable.semesterList
        this.fetchData.schoolYearId = this.gradeTimeTable.schoolYearId
        this.fetchData.semesterId = this.gradeTimeTable.semesterId
        this.fetchData.secId = this.gradeTimeTable.secId
        this.defaultWeek = this.gradeTimeTable.defaultWeek
        this.fetchStatu = false
        this.search()
      } else {
        this.schoolYearList.map(item => {
          if (item.isCurrentSchoolYear) {
            this.fetchData.schoolYearId = item.schoolYearId;
            this.semesterList = item.semesterList;
          }
        })
        this.semesterList.map(item => {
          if (item.isCurrentSchoolSemester) {
            this.fetchData.semesterId = item.semesterId;
          }
        })
        await this.getGradeList();
      }
    },
    // 缓存数据
    setData() {
      this.setGradeTimeTable({
        ...this.fetchData,
        semesterList: this.semesterList,
        secList: this.secList,
        defaultWeek: this.defaultWeek
      })
    },
    // 计算宽度最长
    maxLength(arr) {
      if (Math.max(...arr) > 0) {
        this.lesWeekWidth.push(Math.max(...arr));
      } else {
        this.lesWeekWidth.push(1);
      }
    },
    // data长度格式处理
    dataLength() {
      this.lesWeekWidth = [];
      let MonArr = [];
      let TueArr = [];
      let WedArr = [];
      let ThuArr = [];
      let FriArr = [];
      let SatArr = [];
      let SunArr = [];
      this.data.map((item) => {
        MonArr.push(item.lesMon[0] ? item.lesMon.length : 0);
        TueArr.push(item.lesTue[0] ? item.lesTue.length : 0);
        WedArr.push(item.lesWed[0] ? item.lesWed.length : 0);
        ThuArr.push(item.lesThu[0] ? item.lesThu.length : 0);
        FriArr.push(item.lesFri[0] ? item.lesFri.length : 0);
        SatArr.push(item.lesSat[0] ? item.lesSat.length : 0);
        SunArr.push(item.lesSun[0] ? item.lesSun.length : 0);
      });
      this.maxLength(MonArr);
      this.maxLength(TueArr);
      this.maxLength(WedArr);
      this.maxLength(ThuArr);
      this.maxLength(FriArr);
      this.maxLength(SatArr);
      this.maxLength(SunArr);
    },
    // data高度格式处理
    dataHeight() {
      this.data.map((item) => {
        item.arr = []
        item.arr.push(item.lesMon.length)
        item.arr.push(item.lesTue.length)
        item.arr.push(item.lesWed.length)
        item.arr.push(item.lesThu.length)
        item.arr.push(item.lesFri.length)
        item.arr.push(item.lesSat.length)
        item.arr.push(item.lesSun.length)
        item.maxHeight = Math.ceil(Math.max(...item.arr) / 3)
        if (item.maxHeight === 0) {
          item.maxHeight = 1
        }
      });
    },
    // 查询
    search() {
      if (this.fetchStatu) {
        return this.getGradeTable();
      }
      this.secList.map((item) => {
        if (this.fetchData.secId === item.secId) {
          this.gradeList = item.gradeList;
          if (this.gradeList.length > 0) {
            this.fetchData.gradeId = this.gradeList[0].gradeId;
          } else {
            this.$message.warn("暂无年级数据");
          }
        }
      });
      this.semesterList.map((item) => {
        if (this.fetchData.semesterId === item.semesterId) {
          if (this.semesterStartTime === item.semesterStartTime) {
            this.getGradeTable();
          } else {
            this.semesterStartTime = item.semesterStartTime;
            this.semesterEndTime = item.semesterEndTime;
          }
        }
      });
      this.fetchStatu = true
      this.setData()
    },
    // 学年选择事件
    handleSchoolYearSelect(e) {
      this.fetchStatu = false
      this.schoolYearList.map((item) => {
        if (e === item.schoolYearId) {
          this.semesterList = item.semesterList;
          if (this.semesterList.length > 0) {
            this.fetchData.semesterId = this.semesterList[0].semesterId;
          } else {
            this.fetchData.semesterId = ""
            this.$message.warn("当前学年暂无学期")
          }
        }
      });
      this.setData()
    },
    // 学期选择事件
    handleSemesterSelect(e) {
      this.fetchStatu = false
      this.setData()
    },
    // 改变显示项
    checkChange(e) {
      this.checkList = e;
    },
    // 替换星期
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
    // 获取教学周
    getTeachWeek(teachWeek) {
      this.lesDay = teachWeek.lesDay;
      this.fetchData.teachWeekId = teachWeek.teachWeekId;
      this.defaultWeek = teachWeek.week
      this.getGradeTable();
      this.setData()
    },
    // 选择学段
    secChange(e) {
      this.fetchStatu = false
      this.fetchData.secId = e;
      this.setData()
    },
    // 选择年级
    chooseGrade(id) {
      this.fetchData.gradeId = id;
      this.getGradeTable();
    },
    // 点击导出
    handleExport() {
      this.gradeList.map((item, index) => {
        if (item.gradeId === "") {
          this.gradeList.splice(index, 1);
        }
      });
      if (this.gradeList.length > 0) {
        this.visible = true;
        this.gradeList.push({
          gradeId: "",
          gradeName: "全部"
        });
      } else {
        this.$message.warn("暂无年级信息");
      }
    },
    // 导出取消
    cancel() {
      this.gradeList.map((item, index) => {
        if (item.gradeId === "") {
          this.gradeList.splice(index, 1);
        }
      });
      if (this.fetchData.gradeId === "") {
        this.fetchData.gradeId = this.gradeList[0].gradeId;
      }
      this.visible = false;
    },
    // 导出年级课表
    exportGradeTable() {
      this.exportTimeTable();
    },
    // 导出课表
    async exportTimeTable() {
      const res = await this.$api.GradeTimetable.exportGradeTimetable({
        ...this.fetchData,
        gradeIdList:
          this.fetchData.gradeId === "" ? [] : [this.fetchData.gradeId],
        checkList: this.checkList
      });
      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
      if (this.fetchData.gradeId === "0") {
        this.fetchData.gradeId = this.gradeList[0].gradeId;
      }
      this.visible = false;
    },
    // 获取学段列表
    async getGradeList() {
      const res = await this.$api.common.getGradeList({
        ...this.fetchData,
        appId: sessionStorage.getItem("appId")
      });
      if (res.code === "200" || res.code === 200) {
        this.secList = res.data;
        this.fetchData.secId = this.secList[0].secId;
        if (this.secList[0].gradeList.length > 0) {
          this.gradeList = this.secList[0].gradeList
          this.fetchData.gradeId = this.gradeList[0].gradeId
          this.getGradeTable()
        } else {
          this.$message.warn("暂无年级信息")
        }
      } else {
        this.$message.warn(res.message);
      }
    },
    // 获取年级课表
    async getGradeTable() {
      if (!this.fetchData.gradeId || !this.fetchData.teachWeekId) return
      this.tableLoading = true;
      try {
        const res = await this.$api.GradeTimetable.getGradeTimetable({
          ...this.fetchData
        });
        if (res.code === "200" || res.code === 200) {
          this.data = res.data;
        } else {
          this.$message.warn(res.message);
        }
      } catch (warn) {
        this.$message.warn("请求失败！" + warn);
      } finally {
        this.tableLoading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ylc-grade-content {
  height: 100%;
  background-color: #f2f5f7;
  .ylc-select-button {
    margin-left: 24px;
    background-color: #1bb280;
    border-radius: 4px;
    color: #fff;
    .ylc-select-icon {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
  }
  .export {
    height: 32px;
    .export-btn {
      color: #fff;
      background-color: #2abf8e;
      border-radius: 4px;
      // box-shadow: 0px 2px 0px 0px rgba(42, 191, 142, 0.1);
      .export-icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }
  .ylc-grade-body {
    display: flex;
    margin-top: 12px;
    .ylc-grade-left {
      width: 15%;
      min-width: 200px;
      background: #fff;
      max-height: 785px;
      overflow: auto;
      .ylc-grade-list {
        .ylc-grade-item {
          height: 48px;
          line-height: 48px;
          div {
            padding: 0 32px;
            font-size: 16px;
            cursor: pointer;
          }
          div:hover {
            color: #4fc49d;
            background-color: #dff6ee;
          }
        }
      }
    }
    .ylc-grade-right {
      overflow-y: auto;
      width: 85%;
      margin-left: 16px;
      background: #fff;
    }
  }
  .ylc-checked {
    background: #dff6ee;
    color: #1bb280;
  }
}
</style>
