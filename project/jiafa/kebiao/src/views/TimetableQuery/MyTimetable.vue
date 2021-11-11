<template>
  <div class="my-timetable">
    <!-- 搜索区 -->
    <section>
      <div class="head">
        <div class="select">
          <div class="ylc-select-title">我的课表</div>
          <!-- 学年 -->
          <!-- <label for="selectSchoolYear">学年：</label> -->
          <a-select v-model="fetchData.schoolYearId"
            @change="schoolYearChange"
            style="width: 168px">
            <a-select-option v-for="item of schoolYearList"
              :value="item.schoolYearId"
              :key="item.schoolYearId">{{ item.schoolYearName }}</a-select-option>
          </a-select>
          <!-- 学期 -->
          <!-- <label for="selectSemester" style="margin-left:15px;">学期：</label> -->
          <a-select v-model="fetchData.semesterId"
            @change="semesterChange"
            style="width: 120px; margin-left: 16px">
            <a-select-option v-for="item of semesterList"
              :value="item.semesterId"
              :key="item.semesterId">{{ item.semesterName }}</a-select-option>
          </a-select>
          <!-- 学生列表选择 -->
          <a-select v-model="fetchData.personId"
            style="width: 120px; margin-left: 16px"
            v-if="userInfo.curIdentity === 'RYSF_3'">
            <a-select-option v-for="item of stuList"
              :value="item.studentId"
              :key="item.studentId">
              {{ item.studentName }}
            </a-select-option>
          </a-select>
          <a-button class="ylc-search-btn"
            @click="search">
            <svg-icon icon-class="com_search"
              class="ylc-search-icon" />
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
      </div>
    </section>
    <!-- 课表 -->
    <section style="background-color: #fff;"
      :style="{minHeight:height}">
      <TableMenu @checkChange="checkChange"
        @getTeachWeek="getTeachWeek"
        :outCheck="checkList"
        :statu="fetchStatu"
        :defaultWeek="defaultWeek"
        :semesterStartTime="semesterStartTime"
        :semesterEndTime="semesterEndTime" />
      <a-table class="table"
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :rowKey="(row) => row.lesSortId"
        bordered
        :pagination="false">
      </a-table>
    </section>
    <GlobalModal :visible="visible"
      title="导出课表"
      :width="440"
      :defaultBtn="false"
      @cancel="cancel">
      <div style="padding: 56px 64px">
        <div style="display: flex">
          <div style="height: 32px; line-height: 32px">学生范围：</div>
          <div>
            <a-select style="width: 240px"
              v-model="studentId">
              <a-select-option v-for="item in stuList"
                style="width: 240px; overflow: hidden; text-overflow: ellipsis"
                :key="item.studentId"
                :value="item.studentId">
                {{ item.studentName }}
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
          @click="confirmExport">确定</a-button>
      </div>
    </GlobalModal>
  </div>
</template>
 
<script>
import { downloadFile } from "../../Utils/util";
import { mapState, mapMutations } from "vuex";
import moment from "moment";
import LesCell from "./Child/LesCell.vue";
import TableMenu from "./Child/TableMenu.vue";
import GlobalModal from "../../components/common/GlobalModal.vue";
export default {
  name: "",
  components: {
    TableMenu,
    GlobalModal
  },
  data() {
    return {
      data: [], // 课表数据
      visible: false, // 控制导出课表弹窗
      timetableList: [], // 课表列表
      tableLoading: false,
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      stuList: [], // 学生列表
      defaultWeek: {}, // 缓存周次
      userInfo: "", // 用户信息
      height: "", // 控制高度
      studentId: "", // 孩子id
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun"
      ],
      fetchData: {
        schoolYearId: "",
        semesterId: "",
        personId: "",
        teachWeekId: ""
      },
      fetchStatu: true, // 查询状态
      checkList: ["科目", "场所", "教师"],
      lesDay: [],
      semesterEndTime: "", // 学期开始日期
      semesterStartTime: "" // 学期结束日期
    };
  },
  async created() {
    this.init()
  },
  computed: {
    ...mapState("timetableQuery", ["myTimeTable"]),
    columns() {
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
                <LesCell
                  row={row}
                  value={text}
                  list={this.checkList}
                  week={this.filertWeek(this.lesWeek[i])}
                ></LesCell>
              );
            }
          }
        };
        arr.push(obj);
      }
      return arr;
    }
  },
  watch: {},
  mounted() { },
  methods: {
    ...mapMutations("timetableQuery", ["setMyTimeTable"]),
    moment,
    // 初始化数据
    async init() {
      this.height = (window.innerHeight - 210) + "px"
      this.schoolYearList = await JSON.parse(sessionStorage.getItem("schoolYearList"));
      this.userInfo = await JSON.parse(sessionStorage.getItem("userInfo"));
      if (this.userInfo.curIdentity === "RYSF_3") {
        await this.getStudentList();
      }
      if (this.myTimeTable.semesterId) {
        this.fetchData.schoolYearId = this.myTimeTable.schoolYearId
        this.fetchData.semesterId = this.myTimeTable.semesterId
        this.defaultWeek = this.myTimeTable.defaultWeek
        this.semesterList = this.myTimeTable.semesterList
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
        this.getMyTimetable()
      }
    },
    // 缓存数据
    setData() {
      this.setMyTimeTable({
        ...this.fetchData,
        semesterList: this.semesterList,
        defaultWeek: this.defaultWeek
      })
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
      this.getMyTimetable();
      this.setData()
    },
    // 查询
    async search() {
      if (this.fetchStatu) {
        return this.getMyTimetable();
      }
      this.semesterList.map((item) => {
        if (this.fetchData.semesterId === item.semesterId) {
          if (this.semesterStartTime === item.semesterStartTime) {
            this.getMyTimetable();
          } else {
            this.semesterStartTime = item.semesterStartTime;
            this.semesterEndTime = item.semesterEndTime;
          }
        }
      });
      this.fetchStatu = true;
      this.setData()
    },
    // 改变显示项
    checkChange(value) {
      this.checkList = value;
    },
    // 改变学年
    schoolYearChange(e) {
      this.fetchStatu = false
      this.fetchData.schoolYearId = e;
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
    // 改变学期
    semesterChange(e) {
      this.fetchStatu = false
      this.fetchData.semesterId = e;
      this.setData()
    },
    // 点击导出
    handleExport() {
      if (this.userInfo.curIdentity === "RYSF_3") {
        this.studentId = this.fetchData.personId
        if (this.stuList.length > 1) {
          this.visible = true;
          this.stuList.push({
            studentId: "0",
            studentName: "全部"
          });
        } else {
          this.exportTimeTable();
        }
      } else {
        this.exportTimeTable();
      }
    },
    // 导出取消
    cancel() {
      this.stuList.map((item, index) => {
        if (item.studentId === "0") {
          this.stuList.splice(index, 1)
        }
      })
      this.visible = false;
    },
    // 确认导出当前范围课表
    confirmExport() {
      this.stuList.map((item, index) => {
        if (item.studentId === "0") {
          this.stuList.splice(index, 1)
        }
      })
      this.exportTimeTable();
    },
    // 导出课表
    async exportTimeTable() {
      if (this.userInfo.curIdentity === "RYSF_3") {
        this.fetchData.personId = this.studentId === "0" ? "" : this.studentId
      } else {
        this.fetchData.personId = this.userInfo.personId
      }
      const res = await this.$api.MyTimetable.exportMyTimetable({
        ...this.fetchData,
        checkList: this.checkList
      });
      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
      this.visible = false;
    },
    // 家长身份下获取多个学生
    async getStudentList() {
      const res = await this.$api.MyTimetable.getPatriarchStudents();
      if (res.code === "200" || res.code === 200) {
        this.stuList = res.data;
        this.fetchData.personId = this.stuList[0].studentId
      } else {
        this.$message.warn(res.message);
      }
    },
    // 获取我的课表
    async getMyTimetable() {
      if (this.userInfo.curIdentity !== "RYSF_3") {
        this.fetchData.personId = this.userInfo.personId;
      }
      if (!this.fetchData.semesterId || !this.fetchData.teachWeekId) {
        return
      }
      this.tableLoading = true;
      try {
        const res = await this.$api.common.getStuTimetable({
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
 
<style scoped lang="less">
/deep/ .ant-modal-footer {
  text-align: center;
}
.my-timetable {
  background-color: #f2f5f7;
  height: 100%;
  .head {
    //  height: 72px;
    padding-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select {
      .ylc-select-title {
        height: 56px;
        line-height: 56px;
        font-size: 18px;
        color: #303233;
      }
      .ylc-search-btn {
        margin-left: 16px;
        background-color: #1bb280;
        color: #fff;
        border-radius: 4px;
        .ylc-search-icon {
          color: #fff;
          margin-right: 6px;
          width: 14px;
          height: 14px;
        }
      }
    }
    .export {
      margin-top: 55px;
      .export-btn {
        color: #fff;
        background-color: #2abf8e;
        border-radius: 4px;
        box-shadow: 0px 2px 0px 0px rgba(42, 191, 142, 0.1);
        .export-icon {
          width: 14px;
          height: 14px;
          margin-right: 8px;
        }
      }
    }
  }

  /deep/ .ant-checkbox-group-item {
    margin-right: 28px !important;
  }
  .timetable {
    /deep/ .ant-table-row-cell-break-word:nth-child(n<2) {
      background-color: #000 !important;
    }
    /deep/.ant-table-thead tr th {
      position: relative;
    }
    /deep/.ant-table-thead tr th[key="diffNoon"] {
      border-right: 0;
    }
    /deep/ .ant-table-tbody > tr > td {
      padding: 0px;
    }
    /deep/ .ant-table-tbody > tr:hover > td {
      background: #fff;
    }
    /deep/ .vacation {
      color: #fff;
      position: absolute;
      top: 0px;
      right: 0px;
      background-color: #fa887e;
      padding: 2px 8px;
      border-bottom-left-radius: 8px;
    }
    /deep/.lesSort {
      padding: 16px;
    }
    /deep/.unit {
      display: block;
      cursor: pointer;
      padding: 16px;
      position: relative;
      transition: all 0.3s;
      /deep/.little-unit {
        display: block;
        text-align: center;
      }
      /deep/ .cancel {
        color: #fff;
        position: absolute;
        /* top:0px;
          right:0px;
          background-color:#FA887E;
          opacity:0.8;
          padding:2px 8px;
          border-bottom-left-radius: 8px; */
        width: 100%;
        height: 30px;
        line-height: 30px;
        top: 50%;
        left: 0px;
        margin-top: -15px;
        background-color: #fa887e;
        opacity: 0.6;
      }
    }
    .cancelColor {
      background-color: #fff4f3;
    }
    /deep/ .unit:hover {
      background-color: #e6f7ff;
    }
  }
}
</style>