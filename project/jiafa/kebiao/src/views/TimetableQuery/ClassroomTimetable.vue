<!--
 * @Author: ylc
 * @Date: 2021-08-03 10:06:18
 * @LastEditTime: 2021-10-15 14:42:02
 * @LastEditors: ylc
 * @Description: 班级课表
 * @FilePath: \Web\src\views\TimetableQuery\ClassroomTimetable.vue
-->
<template>
  <div class="ylc-class-content">
    <!-- 搜索区 -->
    <section>
      <div class="head">
        <div class="select">
          <div class="ylc-select-title">教室课表</div>
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
      <div style="display: flex">
        <div class="ylc-class-list">
          <div class="ylc-search-div">
            <svg-icon icon-class="com_search"
              class="ylc-search-icon" />
            <a-input placeholder="场所名称"
              class="ylc-search-inp"
              @change="searchChange" />
          </div>
          <a-tree :expanded-keys="expandedKeys"
            :replaceFields="replaceFields"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect">
            <template slot="title"
              slot-scope="{ buildingName }">
              <span :title="buildingName"
                v-html="
                  buildingName.replace(
                    new RegExp(searchValue, 'g'),
                    '<span style=color:#f50>' + searchValue + '</span>'
                  )
                "></span>
            </template>
          </a-tree>
        </div>
        <div style="margin-left: 16px; background-color: #fff; width: 85%;"
          :style="{minHeight: height}">
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
        </div>
      </div>
    </section>
    <GlobalModal :visible="visible"
      title="导出课表"
      :width="440"
      :defaultBtn="false"
      @cancel="visible = false">
      <div style="padding: 56px 64px;max-height: 500px;overflow-y:auto;">
        <div style="display: flex">
          <div style="height: 32px; line-height: 32px">教室范围：</div>
          <div>
            <a-tree-select v-model="checkedKeys2"
              @change="checkIn"
              show-search
              :filterTreeNode="filterOption"
              style="min-width: 240px;"
              :replaceFields="replaceFields"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择教室"
              tree-default-expand-all>
            </a-tree-select>
          </div>
        </div>
      </div>
      <div slot="selfBtn"
        style="text-align: center">
        <a-button style="width: 72px"
          @click="visible = false">取消</a-button>
        <a-button style="width: 72px; background: #2abf8e; color: #fff"
          @click="confirmExport">确定</a-button>
      </div>
    </GlobalModal>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapMutations } from "vuex";
import { downloadFile } from "../../Utils/util";
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
        teachWeekId: "",
        placeId: ""
      }, // 查询参数
      fetchStatu: true, // 查询状态
      height: "", // 控制高度
      visible: false, // 控制导出弹框
      searchValue: "",
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      tableLoading: false, // 表格加载
      checkList: ["科目", "教师", "班级"], // 显示项列表
      lesWeek: [
        "lesMon",
        "lesTue",
        "lesWed",
        "lesThu",
        "lesFri",
        "lesSat",
        "lesSun"
      ], // 星期列表 
      selectedKeys: [], // 导出树选择项
      checkedKeys: [], // 树选中项
      defaultWeek: {}, // 缓存周次
      checkedKeys2: undefined, // 导出书选中项
      treeData: [], // 树数据
      expandedKeys: [], // 树展开项
      backupsExpandedKeys: [],
      autoExpandParent: true, // 自动展开父节点
      replaceFields: {
        key: 'buildingId',
        title: 'buildingName',
        value: 'buildingId'
      },
      dataList: [],
      lesDay: [],
      semesterEndTime: "", // 学期开始日期
      semesterStartTime: "" // 学期结束日期
    };
  },
  computed: {
    ...mapState("timetableQuery", ["classRoomTimeTable"]),
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
  async created() {
    this.init()
  },
  methods: {
    ...mapMutations("timetableQuery", ["setClassRoomTimeTable"]),
    moment,
    filterOption(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 变化
    checkIn(e) {
      // console.log(e, this.selectedKeys, this.checkedKeys2, 'change')
    },
    // 初始化获取参数
    async init() {
      this.schoolYearList = JSON.parse(sessionStorage.getItem("schoolYearList"));
      this.height = (window.innerHeight - 210) + "px"
      if (this.classRoomTimeTable.semesterId) {
        this.fetchData.schoolYearId = this.classRoomTimeTable.schoolYearId
        this.semesterList = this.classRoomTimeTable.semesterList
        this.fetchData.semesterId = this.classRoomTimeTable.semesterId
        this.fetchData.placeId = this.classRoomTimeTable.placeId
        this.treeData = this.classRoomTimeTable.treeData
        this.selectedKeys = this.classRoomTimeTable.selectedKeys
        this.expandedKeys = this.classRoomTimeTable.expandedKeys
        this.defaultWeek = this.classRoomTimeTable.defaultWeek
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
        await this.getPlaceTree()
        this.getDefaultPlace()
        this.getPlaceTimetable()
      }
    },
    // 获取默认场所
    getDefaultPlace() {
      if (this.treeData[0].children[0].children[0].children[0].children.length > 0) {
        this.expandedKeys = [
          this.treeData[0].buildingId,
          this.treeData[0].children[0].buildingId,
          this.treeData[0].children[0].children[0].buildingId,
          this.treeData[0].children[0].children[0].children[0].children[0].buildingId
        ]
        this.selectedKeys = [this.treeData[0].children[0].children[0].children[0].children[0].buildingId]
        this.fetchData.placeId = this.selectedKeys[0]
      } else {
        this.expandedKeys = [
          this.treeData[0].buildingId,
          this.treeData[0].children[0].buildingId,
          this.treeData[0].children[0].children[0].buildingId,
          this.treeData[0].children[0].children[0].children[0].buildingId
        ]
        this.selectedKeys = [this.treeData[0].children[0].children[0].children[0].buildingId]
        this.fetchData.placeId = this.selectedKeys[0]
      }
    },
    // 缓存数据
    setData() {
      this.setClassRoomTimeTable({
        ...this.fetchData,
        semesterList: this.semesterList,
        defaultWeek: this.defaultWeek,
        expandedKeys: this.expandedKeys,
        selectedKeys: this.selectedKeys,
        treeData: this.treeData
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
    // 获取教学周
    getTeachWeek(teachWeek) {
      this.lesDay = teachWeek.lesDay;
      this.fetchData.teachWeekId = teachWeek.teachWeekId;
      this.defaultWeek = teachWeek.week
      this.getPlaceTimetable();
      this.setData()
    },
    // 查询
    async search() {
      if (this.fetchStatu) {
        return this.getPlaceTimetable();
      }
      this.semesterList.map((item) => {
        if (this.fetchData.semesterId === item.semesterId) {
          if (this.semesterStartTime === item.semesterStartTime) {
            this.getPlaceTimetable();
          } else {
            this.semesterStartTime = item.semesterStartTime;
            this.semesterEndTime = item.semesterEndTime;
          }
        }
      });
      this.fetchStatu = true;
      this.setData()
    },
    // 点击导出
    handleExport() {
      this.visible = true;
      this.checkedKeys2 = this.selectedKeys[0]
    },
    // 确定导出
    confirmExport() {
      this.exportClassroomTimetable();
    },
    // 树展开
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 选择班级
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys;
      this.fetchData.placeId = this.selectedKeys[0];
      this.getPlaceTimetable();
      this.setData()
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
    // 场所模糊搜索
    searchChange(searchStr) {
      var vm = this;
      //如果搜索值为空，则不展开任何项，expandedKeys置为空
      vm.searchValue = searchStr.target.value;
      //如果搜索值不位空，则expandedKeys的值要为搜索值的父亲及其所有祖先
      if (vm.searchValue === "") {
        vm.expandedKeys = [];
      } else {
        //首先将展开项与展开项副本置为空
        vm.expandedKeys = [];
        vm.backupsExpandedKeys = [];
        //获取所有存在searchValue的节点
        let candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, []);
        //遍历满足条件的所有节点
        candidateKeysList.map((item) => {
          //获取每个节点的母亲节点
          var key = vm.getParentKey(item, vm.treeData);
          //当item是最高一级，父key为undefined，将不放入到数组中
          //如果母亲已存在于数组中，也不放入到数组中
          if (!vm.backupsExpandedKeys.some((item) => item === key)) {
            vm.backupsExpandedKeys.push(key);
          }
        });
        let length = this.backupsExpandedKeys.length;
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData);
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice();
      }
    },
    //该递归主要用于获取key的父亲节点的key值
    getParentKey(key, tree) {
      let parentKey, temp;
      //遍历同级节点
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          //如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
          //如果不存在，继续遍历其子节点
          if (node.children.some((item) => item.buildingId === key)) {
            parentKey = node.buildingId;
          } else if ((temp = this.getParentKey(key, node.children))) {
            //parentKey = this.getParentKey(key,node.children)
            //改进，避免二次遍历
            parentKey = temp;
          }
        }
      }
      return parentKey;
    },
    //获取该节点的所有祖先节点
    getAllParentKey(key, tree) {
      var parentKey;
      if (key) {
        //获得父亲节点
        parentKey = this.getParentKey(key, tree);
        if (parentKey) {
          //如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some((item) => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey);
          }
          //继续向上查找祖先节点
          this.getAllParentKey(parentKey, tree);
        }
      }
    },
    //获取节点中含有value的所有key集合
    getkeyList(value, tree, keyList) {
      //遍历所有同一级的树
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        //如果该节点存在value值则push
        if (node.buildingName.indexOf(value) > -1) {
          keyList.push(node.buildingId);
        }
        //如果拥有孩子继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList);
        }
      }
      //因为是引用类型，所有每次递归操作的都是同一个数组
      return keyList;
    },
    // searchChange(e) {
    //   const value = e.target.value;
    //   const expandedKeys = this.treeData
    //     .map((item) => {
    //       if (item.title.indexOf(value) > -1) {
    //         return this.getParentKey(item.key, treeData);
    //       }
    //       return null;
    //     })
    //     .filter((item, i, self) => item && self.indexOf(item) === i);
    //   Object.assign(this, {
    //     expandedKeys,
    //     searchValue: value,
    //     autoExpandParent: true
    //   });
    // },
    // 导出课表
    async exportClassroomTimetable() {
      if (!this.checkedKeys2) {
        return this.$message.warn("请选择导出教室")
      }
      const res = await this.$api.ClassroomTimetable.exportClassroomTimetable({
        ...this.fetchData,
        placeIdList: [this.checkedKeys2],
        checkList: this.checkList
      });
      downloadFile(res, "1", (message) => {
        this.$message.warning(message);
      });
    },
    // 只能选择最下层数据
    getDisabled(data) {
      data.forEach((item) => {
        if (item.buildingType !== 4 && item.children.length > 0) {
          item.disabled = true;
          this.getDisabled(item.children);
        }
      });
    },
    // 获取场所树
    async getPlaceTree() {
      const res = await this.$api.common.getAllPlaceTree();
      if (res.code === "200" || res.code === 200) {
        this.treeData = [res.data];
        this.getDisabled(this.treeData);
      } else {
        this.$message.warn(res.message);
      }
    },
    // 获取教室课表
    async getPlaceTimetable() {
      if (!this.fetchData.placeId || !this.fetchData.teachWeekId) return
      this.tableLoading = true;
      try {
        const res = await this.$api.common.getPlaceTimetable({
          ...this.fetchData
        });
        if (res.code === "200" || res.code === 200) {
          this.data = res.data;
        } else {
          this.data = []
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
    background-color: #fff;
    max-height: 785px;
    overflow: auto;
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
  /deep/ .ant-tree-title {
    width: 100%;
  }
}
</style>