<!--
 * @descripttion: 预览课表-年级课表
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 13:26:12
-->
<template>
  <div class="grade-timetable">
    <div class="select">
      筛选：<a-checkbox-group
        :disabled="tableLoading"
        :value="checkedList"
        :options="plainOptions"
        @change="onChange"
      />
    </div>
    <div class="container">
      <!-- :scroll="{ y: 'calc(100vh - 280px)' }" -->
      <a-table
        class="timetable"
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
          <div class="unit-wrap" :key="index">
            <div
              class="unit"
              v-for="(c, i) in text"
              :key="i"
              :style="{ borderTop: i > 2 ? '1px solid #ccc' : 'none' }"
            >
              <b class="little-unit" v-if="filtrateStatus.course"
                >{{ c.lesSub
                }}{{
                  c.dbWeek == 1 ? "[单周]" : c.dbWeek == 2 ? "[双周]" : ""
                }}</b
              >
              <div class="little-unit">
                <span
                  v-for="(o, q) in c.lesTeacher"
                  :key="q"
                  v-show="filtrateStatus.teacher && o.main"
                  >{{ o.name }}
                  <a-popover
                    trigger="hover"
                    :content="getLesTeacher(c.lesTeacher)"
                    v-show="c.lesTeacher.length > 1"
                  >
                    <a-icon
                      type="user"
                      style="font-size: 15px; cursor: pointer; color: #1890ff"
                    />
                  </a-popover>
                </span>
                {{
                  filtrateStatus.classRoom && filtrateStatus.teacher ? "/" : ""
                }}
                {{ filtrateStatus.classRoom ? c.lesPlace : "" }}
              </div>
              <div class="little-unit">
                {{ filtrateStatus.class ? c.classes + "/" : ""
                }}{{ c.lesStu }}人
              </div>
            </div>
          </div>
        </template>
        <template slot="lesSort" slot-scope="text">
          <b>
            {{ text }}
          </b>
        </template>
        <!-- <template slot="diffNoon" slot-scope="text">
          <span style="background: #fafafa">{{ text }}11</span>
        </template> -->
      </a-table>
    </div>
  </div>
</template>
 
<script>
import { grade } from "./data";
const columns = [
  {
    title: "时段",
    dataIndex: "diffNoon",
    key: "diffNoon",
    align: "center",
    width: "89px",
    customCell() {
      return {
        style: {
          background: "#fafafa",
        },
      };
    },
    customRender(_, row) {
      // console.log("row", row);
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
    width: "80px",
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
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesMon" },
    slots: { title: "lesMon" },
  },
  {
    title: "星期二",
    dataIndex: "lesTue",
    key: "lesTue",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesTue" },
    slots: { title: "lesTue" },
  },
  {
    title: "星期三",
    dataIndex: "lesWed",
    key: "lesWed",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesWed" },
    slots: { title: "lesWed" },
  },
  {
    title: "星期四",
    dataIndex: "lesThu",
    key: "lesThu",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesThu" },
    slots: { title: "lesThu" },
  },
  {
    title: "星期五",
    dataIndex: "lesFri",
    key: "lesFri",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesFri" },
    slots: { title: "lesFri" },
  },
  {
    title: "星期六",
    dataIndex: "lesSat",
    key: "lesSat",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesSat" },
    slots: { title: "lesSat" },
  },
  {
    title: "星期日",
    dataIndex: "lesSun",
    key: "lesSun",
    align: "center",
    width: "497px",
    scopedSlots: { customRender: "lesSun" },
    slots: { title: "lesSun" },
  },
];
const timetableList = grade;
export default {
  name: "GradeTimetable",
  components: {},
  props: {},
  data() {
    return {
      columns,
      plainOptions: ["教师", "教室", "班级", "课程"],
      checkedList: ["教师", "教室", "班级", "课程"],
      timetableList: [],
      tableLoading: true,
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun",
      ],
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
    // this.setZoom(`${(window.screen.width / 1920) * 100}%`)
    this.$nextTick(() => {
      this.getTableTdHeight();
    });
    this.getGradeTimetable();
  },
  methods: {
    onChange(checkedList) {
      if (!checkedList.length) return this.$message.warn("至少勾选一个");
      this.checkedList = checkedList;
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
          // console.log("result", result);
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
    getTableTdHeight() {
      const ele = document.getElementsByTagName("tbody")[0];
      const tr = Array.from(ele.children);
      const td = tr.map((item) => item.children);
      td.map((item) => {
        // const height = Array.from(item).map(c => c.offsetHeight)
        // const tdHeight = Array.from(item).map(c => c.getBoundingClientRect().height)
        // tdHeight.sort((a, b) => a - b);
        // const [max] = tdHeight;
        const unitWrap = Array.from(item).map((d) => d.children);
        const unitHeight = unitWrap.map((node) =>
          node[0] ? node[0].offsetHeight : ""
        );
        const a = unitHeight.filter((i) => {
          if (i) {
            return i;
          }
        });
        a.sort((a, b) => b - a);
        const [max] = a;
        console.log(max);
        unitWrap.forEach((i) => {
          if (i[0]) {
            i[0].style.height = `${max}px`;
          }
        });
      });
    },
    async getGradeTimetable() {
      const arrLessonId = sessionStorage.getItem("arrLessonId");
      const params = { arrLessonId };
      this.tableLoading = true;
      const data = await this.$api.PreviewTimetable.getGradeTimetable(params);
      // console.log("data", data);
      if (data.code == 200) {
        // console.log("data", data);
        this.timetableList = data.data.list;
        this.rowSpanMerge("diffNoon");
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.tableLoading = false;
    },
    setZoom(percent) {
      let style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = "html{zoom:" + percent + "}";
      document.getElementsByTagName("head")[0].appendChild(style);
    },
  },
};
</script>
 
<style scoped lang="less">
// /deep/ table tbody tr:hover > td {
//   background-color: #ffffff !important;
// }

.grade-timetable {
  width: 100%;
  height: calc(100vh - 225px);
  background: white;
  // min-height: 740px;
  // overflow: auto;
  .select {
    height: 32px;
    padding-left: 5px;
  }
  .container {
    min-width: 1612px;
    overflow: auto;
    height: calc(100% - 32px);
  }
  .timetable {
    width: 100%;
    /deep/.ant-table-tbody > tr > td {
      padding: 16px 16px !important;
    }
    /deep/ table {
      width: 100%;
      // table-layout: fixed;
    }

    /deep/.unit-wrap {
      height: 100%;
      // width: 100%;
      width: 465px;
      display: grid;
      // gap: 10px;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(auto-fill, minmax(90px, 0fr));
      .unit {
        display: block;
        position: relative;
        transition: all 0.3s;
        min-height: 90px;
        padding-top: 7px;
        padding-left: 5px;
        background-image: linear-gradient(to right, rgba(#409fff, 0.15), #fff);
        .little-unit {
          display: block;
          text-align: left;
          // font-size: 12px;
          &:not(:last-child) {
            margin-bottom: 4px;
          }
        }
        // &:hover {
        //   background-color: #E6F7FF;
        // }
      }
    }
    // /deep/.unit-wrap {
    //   height: 100%;
    //   width: 100%;
    //   .unit {
    //     display: block;
    //     position: relative;
    //     transition: all 0.3s;
    //     .little-unit {
    //       display: block;
    //       text-align: left;
    //       &:not(:last-child) {
    //         margin-bottom: 4px;
    //       }
    //     }

    //     // &:hover {
    //     //   background-color: #E6F7FF;
    //     // }
    //   }
    //   .unit + .unit {
    //     margin-top: 10px;
    //   }
    // }
  }
  /deep/ .ant-table-thead > tr > th {
    background-color: #409fff;
    border-color: #79bcff;
    color: #fff;
    text-align: center;
  }
}
</style>