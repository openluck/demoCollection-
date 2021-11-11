<!--
 * @descripttion: 预览课表-教室课表
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 13:26:12
-->
<template>
  <div class="classroom-timetable">
    <div class="left">
      <a-tree
        v-if="showTree"
        :tree-data="treeData"
        :replaceFields="{
          children: 'children',
          key: 'placeId',
          value: 'placeId',
          title: 'placeName',
          parentCode: 'parentCode',
          placeType: 'placeType',
          disabled: 'disabled',
        }"
        :expandedKeys="expandedKeys"
        @expand="expand"
        showLine
        @select="handleSelect"
        :selectedKeys="selectedKeys"
      />

      <div class="left-spin" v-else>
        <a-spin />
      </div>
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
                v-show="!text.isHoliday"
                class="unit"
                :key="d"
                v-for="(i, d) in text"
              >
                <b class="little-unit" v-if="filtrateStatus.course"
                  >{{ i.lesSub
                  }}{{
                    i.dbWeek == 1 ? "[单周]" : i.dbWeek == 2 ? "[双周]" : ""
                  }}</b
                >
                <div class="little-unit">
                  <!-- <span v-for="(o, q) in i.lesTeacher" :key="q">{{ o.name }}</span> -->
                  <span
                    v-for="(o, q) in i.lesTeacher"
                    :key="q"
                    v-show="filtrateStatus.teacher && o.main"
                    >{{ o.name }}
                    <a-popover
                      trigger="hover"
                      :content="getLesTeacher(i.lesTeacher)"
                      v-show="i.lesTeacher.length > 1"
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
                  }}
                  <span>{{ filtrateStatus.classRoom ? i.lesPlace : "" }}</span>
                </div>
                <div class="little-unit">
                  {{ filtrateStatus.class ? i.classes + "/" : ""
                  }}{{ i.lesStu }}人
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
  </div>
</template>
 
<script>
import { list, treeData } from "./data";
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
    align: "center",
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
const timetableList = [];
export default {
  name: "ClassroomTimetable",
  components: {},
  props: {},
  data() {
    return {
      columns,
      timetableList,
      tableLoading: true,
      plainOptions: ["教师", "教室", "班级", "课程"],
      checkedList: ["教师", "教室", "班级", "课程"],
      showTree: false,
      treeData: [],
      expandedKeys: [],
      selectedKeys: [""], //左侧树选中项
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun",
      ],
      seleLoading: false,
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
    this.getClassroomTree();
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
    expand(expand) {
      this.expandedKeys = expand;
    },
    // 左侧树选择事件
    handleSelect(selectedKeys, e) {
      let hasChildren =
        e.node.dataRef.children && e.node.dataRef.children.length;
      if (this.seleLoading || !selectedKeys.length || hasChildren) return;
      this.seleLoading = true;
      this.selectedKeys = selectedKeys;
      this.getClassroomTimetable(selectedKeys[0]);
    },
    treeDataFormat(list) {
      return list.map((item, index) => {
        if (item.children && item.children.length) {
          // item.disabled = true;
          item.children = this.treeDataFormat(item.children);
        }
        return item;
      });
    },
    getFirstClassId(item, id) {
      if (item.children && item.children.length) {
        return this.getFirstClassId(item.children[0], id);
      }
      return item.placeId;
    },
    getFirstExpande(item, list) {
      if (item.children && item.children.length) {
        return this.getFirstExpande(item.children[0], [...list, item.placeId]);
      }
      return [...list, item.placeId];
    },
    async getClassroomTimetable(placeId) {
      const arrLessonId = this.arrLessonId;
      this.tableLoading = true;
      const data = await this.$api.PreviewTimetable.getClassroomTimetable({
        placeId,
        arrLessonId,
      });
      console.log("dataafcafs", data);
      if (data.code == 200) {
        this.timetableList = data.data && data.data.list ? data.data.list : [];
        this.rowSpanMerge("diffNoon");
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.seleLoading = false;
      this.tableLoading = false;
    },
    async getClassroomTree() {
      const arrLessonId = this.arrLessonId;
      const data = await this.$api.PreviewTimetable.getClassroomTree({
        type: 1,
        arrLessonId,
        isUse: true,
      });
      if (data.code == 200) {
        const list = data.data;
        this.treeData = this.treeDataFormat(list);
        const firstClassId = list.length ? this.getFirstClassId(list[0]) : "";
        this.selectedKeys = [firstClassId];
        const expande = list.length ? this.getFirstExpande(list[0], []) : [];
        this.expandedKeys = expande;
        this.getClassroomTimetable(firstClassId);
      } else {
        this.$message.error("请求失败！" + data.message);
      }
      this.showTree = true;
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
.classroom-timetable {
  width: 100%;
  background: white;
  min-height: 740px;
  display: flex;
  height: calc(100vh - 220px);
  .left {
    width: 280px;
    margin-right: 20px;
    overflow: auto;
    .left-spin {
      width: 100%;
      height: calc(100% - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
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
        background-image: linear-gradient(to right, rgba(#409fff, 0.15), #fff);
        padding: 5px 0 5px 5px;
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