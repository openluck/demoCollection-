<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-09-29 10:24:08
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-29 11:08:27
-->
<template>
  <div class="schoolTable">
    <div class="check">
      筛选：
      <a-checkbox-group
        :value="checkedList"
        name="checkboxgroup"
        :options="plainOptions"
        @change="onChange"
      />
    </div>
    <div class="content">
      <a-table
        class="timetable"
        :columns="columns"
        :data-source="timetableList"
        :loading="tableLoading"
        :rowKey="(row, index) => index"
        bordered
        :pagination="false"
      >
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
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "年级",
    dataIndex: "gradeName",
    key: "gradeName",
    align: "center",
    width: "120px",
    scopedSlots: { customRender: "gradeName" },
    customCell() {
      return {
        style: {
          background: "#fafafa",
        },
      };
    },
    customRender(_, row) {
      return {
        children: row.gradeName,
        attrs: {
          rowSpan: row.gradeNameRowSpan,
        },
      };
    },
  },
  {
    title: "时段",
    dataIndex: "diffNoon",
    key: "diffNoon",
    align: "center",
    width: "80px",
    scopedSlots: { customRender: "diffNoon" },
    customCell() {
      return {
        style: {
          background: "#fafafa",
        },
      };
    },
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
export default {
  name: "",
  data() {
    return {
      checkedList: ["教师", "教室", "班级", "课程"],
      plainOptions: ["教师", "教室", "班级", "课程"],
      columns,
      timetableList: [],
      tableLoading: false,
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
  mounted() {
    this.getWholeTable();
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
    // 获取全校课表
    async getWholeTable() {
      let orgCode = sessionStorage.getItem("paike_orgcode");
      this.tableLoading = true;
      const data = await this.$api.PreviewTimetable.getWholeSchoolTimetable({
        orgCode,
      });
      if (data.code == 200) {
        this.timetableList = data.data.list;
        this.rowSpanMerge(["gradeName", "diffNoon"]);
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.tableLoading = false;
    },
    // 表格第一列合并
    rowSpanMerge(keyList) {
      let arr = this.timetableList;

      keyList.map((key) => {
        let mark = 0;
        let name = "";
        arr.map((item, index) => {
          if (item[key] === name) {
            item[`${key}RowSpan`] = 0;
            arr[mark][`${key}RowSpan`] = arr[mark][`${key}RowSpan`] + 1;
          } else {
            name = item[key];
            mark = index;
            arr[mark][`${key}RowSpan`] = 1;
          }
        });
      });
      this.timetableList = arr;
    },
  },
};
</script>

<style lang="less" scoped>
.schoolTable {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
}
.content {
  height: calc(100% - 52px);
  margin-top: 10px;
  overflow: auto;
}
.timetable {
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
}
/deep/ .ant-table-thead > tr > th {
  background-color: #409fff;
  border-color: #79bcff;
  color: #fff;
  text-align: center;
}
</style>