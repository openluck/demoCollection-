<!--
 * @Author: ylc
 * @Date: 2021-08-03 10:06:18
 * @LastEditTime: 2021-10-15 11:00:55
 * @LastEditors: ylc
 * @Description: 班级课表
 * @FilePath: \Web\src\views\TimetableQuery\ClassTimetable.vue
-->
<template>
  <div class="ylc-class-content">
    <!-- 搜索区 -->
    <section>
      <div class="head">
        <div class="select">
          <div class="ylc-select-title">班级课表</div>
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
          <!-- 学段列表选择 -->
          <a-select v-model="fetchData.secId"
            @change="secChange"
            style="width: 120px; margin-left: 16px">
            <a-select-option v-for="item of secList"
              :value="item.secId"
              :key="item.secId">{{ item.secName }}</a-select-option>
          </a-select>
          <!-- 年级列表选择 -->
          <a-select v-model="fetchData.gradeId"
            @change="gradeChange"
            style="width: 120px; margin-left: 16px">
            <a-select-option v-for="item of gradeList"
              :value="item.gradeId"
              :key="item.gradeId">{{ item.gradeName }}</a-select-option>
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
    <section>
      <div style="display: flex;">
        <div class="ylc-class-list">
          <div class="ylc-search-div">
            <svg-icon icon-class="com_search"
              class="ylc-search-icon" />
            <a-input placeholder="班级名称"
              class="ylc-search-inp"
              v-model="searchStr" />
          </div>
          <div v-for="item in classShowList"
            v-show="item.classId !== ''"
            :key="item.classId"
            :class="
              item.classId === fetchData.classId
                ? 'ylc-class-item  ylc-checked'
                : 'ylc-class-item'
            "
            @click="chooseClass(item.classId)">
            {{ item.className }}
          </div>
        </div>
        <div style="margin-left: 16px; background-color: #fff; width: 85%"
          :style="{minHeight:height}">
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
    </section>
    <GlobalModal :visible="visible"
      title="导出课表"
      :width="440"
      :defaultBtn="false"
      @cancel="cancel"
      @confirm="exportClassTable">
      <div style="padding: 56px 64px">
        <div style="display: flex">
          <div style="height: 32px; line-height: 32px">班级范围：</div>
          <div>
            <a-select style="width: 240px"
              v-model="fetchData.classId">
              <a-select-option v-for="item in classShowList"
                style="width: 240px; overflow: hidden; text-overflow: ellipsis"
                :key="item.classId"
                :value="item.classId">
                {{ item.className }}
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
import moment from "moment";
import { downloadFile } from "../../Utils/util";
import { mapState, mapMutations } from "vuex";
import LesCell from "./Child/LesCell.vue";
import TableMenu from "./Child/TableMenu.vue";
import GlobalModal from "../../components/common/GlobalModal.vue";
export default {
  components: {
    TableMenu,
    GlobalModal
  },
  data() {
    return {
      data: [], // 课表列表
      fetchData: {
        schoolYearId: "",
        semesterId: "",
        gradeId: "",
        secId: "",
        classId: "",
        teachWeekId: ""
      }, // 查询参数
      fetchStatu: true, // 查询状态
      // initStatu: false, // 初始化状态
      defaultWeek: {}, // 缓存周次
      visible: false, // 控制导出弹框
      height: "", // 控制高度
      searchStr: "", // 班级搜索框
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      secList: [], // 学段列表
      gradeList: [], // 年级列表
      classList: [], // 班级列表
      classShowList: [], // 展示班级列表
      tableLoading: false, // 表格加载
      checkList: ["科目", "场所", "教师"], // 显示项列表
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun"
      ], // 星期列表
      lesDay: [], // 周次日期列表
      semesterEndTime: "", // 学期结束日期
      semesterStartTime: "" // 学期开始日期
    };
  },
  watch: {
    searchStr(val) {
      if (val) {
        this.classShowList = [];
        this.classList.map((item) => {
          if (item.className.indexOf(val) !== -1) {
            this.classShowList.push(item);
          }
        });
      } else {
        this.classShowList = this.classList;
      }
    }
  },
  async created() {
    await this.init();
  },
  computed: {
    ...mapState("timetableQuery", ["classTimeTable"]),
    columns() {
      let arr = [
        {
          title: "时段",
          dataIndex: "diffNoonName",
          align: "center",
          width: 73,
          ellipsis: true,
          customRender: (text, row) => {
            if (this.data.length > 0) {
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
  methods: {
    ...mapMutations("timetableQuery", ["setClassTimeTable"]),
    moment,
    // 数据初始化
    async init() {
      this.schoolYearList = JSON.parse(sessionStorage.getItem("schoolYearList"));
      this.height = (window.innerHeight - 210) + "px"
      if (this.classTimeTable.secId) {
        this.fetchData.schoolYearId = this.classTimeTable.schoolYearId
        this.fetchData.semesterId = this.classTimeTable.semesterId
        this.fetchData.secId = this.classTimeTable.secId
        this.fetchData.gradeId = this.classTimeTable.gradeId
        this.fetchData.classId = this.classTimeTable.classId
        this.semesterList = this.classTimeTable.semesterList
        this.secList = this.classTimeTable.secList
        this.gradeList = this.classTimeTable.gradeList
        this.defaultWeek = this.classTimeTable.defaultWeek
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
        await this.getClassList();
        this.getClassTable()
        this.fetchStatu = false
      }
    },
    // 缓存数据
    setData() {
      this.setClassTimeTable({
        ...this.fetchData,
        semesterList: this.semesterList,
        secList: this.secList,
        gradeList: this.gradeList,
        defaultWeek: this.defaultWeek
      })
    },
    // 选择学年
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
    // 选择学期
    semesterChange(e) {
      this.fetchStatu = false
      this.fetchData.semesterId = e;
      this.setData()
    },
    // 选择学段
    secChange(e) {
      this.fetchStatu = false
      this.fetchData.secId = e;
      this.secList.map((item) => {
        if (e === item.secId) {
          this.gradeList = item.gradeList;
          this.fetchData.gradeId = this.gradeList[0].gradeId;
        }
      });
      this.setData()
    },
    // 选择年级
    gradeChange(e) {
      this.fetchStatu = false
    },
    // 获取教学周
    getTeachWeek(teachWeek) {
      this.lesDay = teachWeek.lesDay;
      this.fetchData.teachWeekId = teachWeek.teachWeekId;
      this.defaultWeek = teachWeek.week
      this.getClassTable();
      this.setData()
    },
    // 查询
    search() {
      if (this.fetchStatu) {
        return this.getClassTable();
      }
      this.searchStr = "";
      if (!this.classTimeTable.classList) {
        this.gradeList.map((item) => {
          if (this.fetchData.gradeId === item.gradeId) {
            this.classList = item.classList;
            this.classShowList = item.classList;
          }
        });
      } else {
        this.classShowList = this.classList
      }
      var a = 0;
      this.classList.forEach(item => {
        if (item.classId === this.fetchData.classId) {
          a = 1;
        }
      })
      if (this.classList.length > 0 && a === 0) {
        this.fetchData.classId = this.classList[0].classId;
      } else if (this.classList.length === 0) {
        this.fetchData.classId = ""
        this.$message.warn("暂无班级数据");
      }
      this.semesterList.map((item) => {
        if (this.fetchData.semesterId === item.semesterId) {
          if (this.semesterStartTime === item.semesterStartTime) {
            this.getClassTable();
          } else {
            this.semesterStartTime = item.semesterStartTime;
            this.semesterEndTime = item.semesterEndTime;
          }
        }
      });
      this.fetchStatu = true
      this.setData()
    },
    // 点击导出
    handleExport() {
      this.classList.map((item, index) => {
        if (item.classId === "") {
          this.classList.splice(index, 1);
        }
      });
      if (this.classList.length > 0) {
        this.visible = true;
        this.classShowList.push({
          classId: "",
          className: "全部"
        });
      } else {
        this.$message.warn("暂无班级信息");
      }
    },
    // 导出取消
    cancel() {
      this.classShowList = this.classList;
      if (this.fetchData.classId === "") {
        this.fetchData.classId = this.classList[0].classId;
      }
      this.visible = false;
    },
    // 导出班级课表
    exportClassTable() {
      this.exportTimeTable();
    },
    // 确定导入
    confirmExport() {
      this.exportTimeTable();
    },
    // 选择班级
    chooseClass(id) {
      this.fetchData.classId = id;
      this.getClassTable();
    },
    // 改变显示项
    checkChange(value) {
      this.checkList = value;
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
    // 导出课表
    async exportTimeTable() {
      const res = await this.$api.ClassTimetable.exportClassTimetable({
        ...this.fetchData,
        classIdList:
          this.fetchData.classId === "" ? [] : [this.fetchData.classId],
        checkList: this.checkList
      });
      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
      this.classShowList = this.classList;
      if (this.fetchData.classId === "0") {
        this.fetchData.classId = this.classList[0].classId;
      }
      this.visible = false;
    },
    // 获取班级列表
    async getClassList() {
      const res = await this.$api.common.getGradeList({
        ...this.fetchData,
        appId: sessionStorage.getItem("appId")
      });
      if (res.code === "200" || res.code === 200) {
        this.secList = res.data;
        this.fetchData.secId = this.secList[0].secId;
        this.gradeList = this.secList[0].gradeList;
        if (this.gradeList.length > 0) {
          this.fetchData.gradeId = this.gradeList[0].gradeId;
          if (!this.classTimeTable.classList) {
            this.gradeList.map((item) => {
              if (this.fetchData.gradeId === item.gradeId) {
                this.classList = item.classList;
                this.classShowList = item.classList;
              }
            });
          } else {
            this.classShowList = this.classList
          }
          if (this.classList.length > 0) {
            this.fetchData.classId = this.classList[0].classId;
          } else {
            this.$message.warn("暂无班级数据");
          }
        } else {
          this.$message.warn("暂无年级信息")
        }
      } else {
        this.$message.warn(res.message);
      }
    },
    // 获取班级课表
    async getClassTable() {
      if (!this.fetchData.classId || !this.fetchData.teachWeekId) {
        return
      }
      this.tableLoading = true;
      try {
        const res = await this.$api.common.getClassTimetable({
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
.ylc-class-content {
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
  .ylc-class-list {
    width: 15%;
    min-width: 200px;
    max-height: 785px;
    overflow: auto;
    background-color: #fff;
    .ylc-search-div {
      position: relative;
      .ylc-search-inp {
        height: 56px;
        line-height: 56px;
        border: none;
        border-bottom: 1px solid #e6e8eb;
        border-radius: 0;
        padding-left: 48px;
        font-size: 16px;
      }
      .ylc-search-icon {
        position: absolute;
        z-index: 100;
        color: #cdc5c5;
        width: 16px;
        height: 16px;
        top: 21px;
        left: 24px;
      }
    }
    .ylc-class-item {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      padding-left: 32px;
      cursor: pointer;
    }
    .ylc-class-item:hover {
      background: #dff6ee;
      color: #1bb280;
    }
    .ylc-checked {
      background: #dff6ee;
      color: #1bb280;
    }
  }
}
</style>