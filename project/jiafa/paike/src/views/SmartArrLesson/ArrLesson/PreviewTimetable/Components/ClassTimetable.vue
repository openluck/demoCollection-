<!--
 * @descripttion: 预览课表-班级课表
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 13:26:12
-->
<template>
  <div class="class-timetable">
    <div class="left">
      <a-spin v-if="spinning" class="spin" />
      <a-menu
        :default-selected-keys="
          classList.length && classList[0].classId ? [classList[0].classId] : []
        "
        :default-open-keys="['sub1']"
        mode="inline"
        v-else
      >
        <a-menu-item
          :key="item.classId"
          v-for="item in classList"
          @click="toggleClass(item.classId)"
        >
          <a-icon type="solution" />
          <span>{{ item.className }}</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="right">
      <div class="select">
        筛选：<a-checkbox-group
          :disabled="tableLoading"
          :value="checkedList"
          :options="plainOptions"
          @change="onChange"
        />
      </div>
      <div class="rightcontent">
        <a-table
          class="timetable"
          :scroll="{ y: 'calc(100vh - 280px)' }"
          :columns="columns"
          :data-source="timetableList"
          :loading="tableLoading"
          :pagination="false"
          :rowKey="(row) => row.id"
          bordered
        >
          <!-- <div class="vacation" v-if="timetableList.length && timetableList[0].lesMon.isHoliday">休假</div> -->
          <!-- 周一到周日课程 -->
          <template
            v-for="(item, index) in lesWeek"
            :slot="item"
            slot-scope="text"
          >
            <div :key="index">
              <div
                class="unit"
                :key="idx"
                v-for="(item, idx) in text"
                v-show="!item.isHoliday"
              >
                <b class="little-unit" v-if="filtrateStatus.course"
                  >{{ item.lesSub
                  }}{{
                    item.dbWeek == 1
                      ? "[单周]"
                      : item.dbWeek == 2
                      ? "[双周]"
                      : ""
                  }}</b
                >
                <div class="little-unit">
                  <!-- <span v-for="(o, q) in item.lesTeacher" :key="q">{{ o.name }}</span> -->
                  <span
                    v-for="(o, q) in item.lesTeacher"
                    :key="q"
                    v-show="filtrateStatus.teacher && o.main"
                    >{{ o.name }}
                    <a-popover
                      trigger="hover"
                      :content="getLesTeacher(item.lesTeacher)"
                      v-show="item.lesTeacher.length > 1"
                    >
                      <a-icon
                        type="user"
                        style="font-size: 15px; cursor: pointer; color: #1890ff"
                      />
                    </a-popover>
                  </span>
                  {{
                    filtrateStatus.classRoom && filtrateStatus.teacher
                      ? "/"
                      : ""
                  }}{{ filtrateStatus.classRoom ? item.lesPlace : "" }}
                </div>
                <div class="little-unit">
                  {{ filtrateStatus.class ? item.classes + "/" : ""
                  }}{{ item.lesStu }}人
                </div>
              </div>
            </div>
            <!-- <div v-if="!text.isHoliday" class="unit" :key="index">
            <span class="little-unit"
              >{{ text.lesSub }}-{{ text.lesTeacher }}</span
            >
            <span class="little-unit">学生（{{ text.lesStu }}）</span>
            <span class="little-unit">{{ text.lesPlace }}</span>
          </div> -->
          </template>
          <template slot="lesSort" slot-scope="text">
            <b>
              {{ text }}
            </b>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
 
<script>
import { list } from "./data";
const columns = [
  {
    title: "时段",
    dataIndex: "diffNoon",
    key: "diffNoon",
    align: "center",
    width: "6%",
    scopedSlots: { customRender: "diffNoon" },
    customCell() {
      return {
        style: {
          background: "#fafafa",
        },
      };
    },
    customRender(_, row) {
      console.log("row", row);
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
    width: "10%",
    scopedSlots: { customRender: "lesSort" },
    customCell() {
      return {
        style: {
          background: "#fafafa",
        },
      };
    },
  },
  {
    title: "星期一",
    dataIndex: "lesMon",
    key: "lesMon",
    // align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesMon" },
    slots: { title: "lesMon" },
  },
  {
    title: "星期二",
    dataIndex: "lesTue",
    key: "lesTue",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesTue" },
    slots: { title: "lesTue" },
  },
  {
    title: "星期三",
    dataIndex: "lesWed",
    key: "lesWed",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesWed" },
    slots: { title: "lesWed" },
  },
  {
    title: "星期四",
    dataIndex: "lesThu",
    key: "lesThu",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesThu" },
    slots: { title: "lesThu" },
  },
  {
    title: "星期五",
    dataIndex: "lesFri",
    key: "lesFri",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesFri" },
    slots: { title: "lesFri" },
  },
  {
    title: "星期六",
    dataIndex: "lesSat",
    key: "lesSat",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesSat" },
    slots: { title: "lesSat" },
  },
  {
    title: "星期日",
    dataIndex: "lesSun",
    key: "lesSun",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "lesSun" },
    slots: { title: "lesSun" },
  },
];
const timetableList = list;
export default {
  name: "ClassTimetable",
  components: {},
  props: {},
  data() {
    return {
      columns,
      timetableList: [],
      plainOptions: ["教师", "教室", "班级", "课程"],
      checkedList: ["教师", "教室", "班级", "课程"],
      tableLoading: false,
      spinning: true,
      classList: [],
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun",
      ],
      arrLessonId: "",
    };
  },
  computed: {
    /**
     * @desc 筛选状态
     */
    filtrateStatus() {
      const { checkedList } = this;
      let obj = {
        teacher: checkedList.includes("教师"),
        classRoom: checkedList.includes("教室"),
        class: checkedList.includes("班级"),
        course: checkedList.includes("课程"),
      };
      return obj;
    },
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");

    this.getClassByGrade();
  },
  methods: {
    onChange(checkedList) {
      if (!checkedList.length) return this.$message.warn("至少勾选一个");
      this.checkedList = checkedList;
    },
    toggleClass(classId) {
      this.getClassTimetable(classId);
    },
    getLesTeacher(lesTeacher) {
      let con = "副教师：";
      let _lesTeacher = lesTeacher.filter((item) => !item.main);
      _lesTeacher.map((item, index) => {
        if (!item.main) {
          if (index == 0) {
            con += item.name;
          } else {
            con = con + "/" + item.name;
          }
        }
      });
      return con;
    },
    // 表格第一列合并
    rowSpanMerge(key) {
      const arr = this.timetableList
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key]);
          }
          return result;
        }, [])
        .reduce((result, keys) => {
          const children = this.timetableList.filter(
            (item) => item[key] === keys
          );
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0,
            }))
          );
          return result;
        }, []);
      this.timetableList = arr;
    },
    async getClassByGrade() {
      const arrLessonId = this.arrLessonId;
      const data = await this.$api.PreviewTimetable.getClassByGrade({
        arrLessonId,
      });
      if (data.code == 200) {
        const classList = data.data.classList;
        this.classList = classList;
        if (classList.length) {
          const classId = classList[0].classId;
          this.getClassTimetable(classId);
        }
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.spinning = false;
    },
    async getClassTimetable(classId) {
      const arrLessonId = this.arrLessonId;
      const params = { arrLessonId, classId };
      this.tableLoading = true;
      const data = await this.$api.PreviewTimetable.getClassTimetable(params);
      if (data.code == 200) {
        this.timetableList = data.data.list;
        this.rowSpanMerge("diffNoon");
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.tableLoading = false;
    },
  },
};
</script>
 
<style scoped lang="less">
// /deep/ table tbody tr:hover > td {
//   background-color: #ffffff !important;
// }
// /deep/tbody tr td {
//   height: 120px;
//   width: 120px;
//   &:hover {
//     background: #13c2c2 !important;
//     color: white;
//   }
// }
.class-timetable {
  width: 100%;
  background: white;
  min-height: 740px;
  display: flex;
  height: calc(100vh - 220px);
  .left {
    width: 280px;
    margin-right: 20px;
    text-align: center;
    overflow: auto;
    .spin {
      margin-top: 50px;
    }
  }
  .right {
    flex: 1;
    .rightcontent {
      height: calc(100% - 32px);
      overflow: auto;
    }
    .timetable {
      min-width: 1299px;
      /deep/.unit {
        display: block;
        position: relative;
        transition: all 0.3s;
        padding: 5px 0 5px 5px;
        background-image: linear-gradient(to right, rgba(#409fff, 0.15), #fff);
        .little-unit {
          display: block;
          text-align: left;
        }

        // &:hover {
        //   background-color: #E6F7FF;
        // }
      }
      .unit + .unit {
        margin-top: 10px;
      }
    }
  }
  .select {
    height: 32px;
    padding-left: 5px;
  }
  /deep/ .ant-table-thead > tr > th {
    background-color: #409fff;
    border-color: #79bcff;
    color: #fff;
    text-align: center;
  }
}
</style>