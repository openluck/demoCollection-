<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-05-26 14:39:43
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:56:33
-->
<template>
  <div :class="noTitleKey === '2' ? 'right rightRoom' : 'right'">
    <a-card
      :active-tab-key="noTitleKey"
      :tab-list="tabList"
      @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    >
      <!-- 课程 -->
      <div v-if="noTitleKey === '1'" class="tabContent">
        <draggable
          class="contentBox"
          v-model="courseList"
          :options="{ group: { name: 'table', pull: 'clone' }, sort: false }"
          chosenClass="chosen"
          ghostClass="ghost"
          :move="dragMove"
          @start="dragStart"
          @unchoose="rightEnd"
        >
          <!-- :class="[item.id === courseSele.id ? 'itemHigh item' : 'item']" -->
          <div
            v-for="item in courseList"
            :key="item.id"
            :class="`${item.restNum > 0 ? 'item' : 'item itemDefault'}`"
            :data-dataid="item.id"
            :data-restnum="item.restNum"
            @click="() => courseChan(item)"
          >
            <!-- :style="{
              width: 'calc(100% - 24px)',
              height: '40px',
              lineHeight: '40px',
              margin: '12px 12px 0 12px',
              border: '1px solid #e0e2e6',
              display: `${item.restNum > 0 ? 'flex' : 'none'}`,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingRight: '6px',
              border: '1px solid #e0e2e6',
            }" -->
            <div>
              <span
                v-for="(lesItem, index) in item.lessonList"
                :key="lesItem.lessonId"
                :title="item.txt"
                >{{
                  `${index > 0 ? "-" : ""}${lesItem.lessonName}
                  ${
                    lesItem.selfStudyType === 1
                      ? "早自习"
                      : lesItem.selfStudyType === 2
                      ? "晚自习"
                      : ""
                  }`
                }}</span
              >
              <span
                v-if="item.ruleName"
                :style="{
                  color: `${
                    item.ruleName === '单双周'
                      ? '#FFB520'
                      : item.ruleName === '连堂'
                      ? '#52E071'
                      : item.ruleName === '合班'
                      ? '#042b60'
                      : ''
                  } `,
                }"
              >
                {{ `[${item.ruleName}]` }}
              </span>
            </div>
            <div :title="`未排:${item.restNum} 总课时:${item.totalNum}`">
              {{ item.restNum }}
              <span
                class="total"
                :title="`未排:${item.restNum} 总课时:${item.totalNum}`"
                >/{{ item.totalNum }}</span
              >
            </div>
          </div>

          <div class="noneData" v-if="courseList.length < 1">
            <img :src="require('./../../../../../assets/img/noData.png')" />
            <p>暂无数据</p>
          </div>
        </draggable>
      </div>
      <!-- 教室 -->
      <div v-if="noTitleKey === '2'" class="tabContent">
        <div>
          <a-form-model
            style="margin: 8px 8px 0 0"
            :v-model="tree"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 16 }"
          >
            <div class="rule-item">
              <a-button
                :class="`${
                  !isDividRoom ? 'themeBtn' : 'themeBtn themeBtnDefault'
                }`"
                icon="retweet"
                @click="() => (!isDividRoom ? autoDivideRoom() : null)"
                >自动分配教室</a-button
              >
            </div>
            <a-form-model-item>
              <a-tree-select
                v-model="tree.treeId"
                :dropdownStyle="{ maxHeight: '400px !important' }"
                :tree-data="treeData"
                tree-default-expand-all
                :replaceFields="{
                  children: 'children',
                  title: 'placeName',
                  key: 'placeId',
                  value: 'placeId',
                }"
                @change="treeNodeChange"
              >
              </a-tree-select>
            </a-form-model-item>
          </a-form-model>
        </div>
        <draggable
          class="contentBox contentRoom"
          v-model="roomList"
          :options="{ group: { name: 'table', pull: 'clone' }, sort: false }"
          chosenClass="chosen"
          ghostClass="ghost"
          @start="dragStart"
          @unchoose="rightEnd"
        >
          <!-- :class="[
              item.roomId === roomSele.roomId
                ? 'roomItemHigh roomItem'
                : 'roomItem',
            ]" -->
          <div
            class="roomItem"
            v-for="item in roomList"
            :key="item.roomId"
            @click="() => roomChan(item)"
            :title="item.roomName"
            :data-dataid="item.roomId"
          >
            <span>{{ item.roomName }}</span>
          </div>

          <div
            class="noneData"
            v-if="roomList.length < 1"
            :style="{ paddingTop: '79%' }"
          >
            <img :src="require('./../../../../../assets/img/noData.png')" />
            <p>暂无数据</p>
          </div>
        </draggable>
      </div>
      <!-- 教师 -->
      <div v-if="noTitleKey === '3'" class="tabContent">
        <a-form-model style="margin: 8px 8px 0 0" :model="group">
          <a-form-model-item>
            <a-select
              :value="group.groupId"
              @change="groupSelect"
              placeholder="请选择教研组"
              width="400px"
            >
              <a-select-option
                v-for="item in teachGroupList"
                :key="item.groupId"
                :value="item.groupId"
              >
                {{ item.groupName }}
              </a-select-option>
            </a-select>

            <a-radio-group
              v-if="group.courseType && group.courseType.length > 1"
              :value="switchChecked"
              button-style="solid"
              @change="switchChan"
            >
              <a-radio-button :value="2"> 选考 </a-radio-button>
              <a-radio-button :value="3"> 学考 </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <draggable
          class="contentBox contentTeacher"
          v-model="teacherList"
          :options="{ group: { name: 'table', pull: 'clone' }, sort: false }"
          chosenClass="chosen"
          ghostClass="ghost"
          :move="dragMove"
          @start="dragStart"
          @unchoose="rightEnd"
        >
          <!-- :class="`${item.restNum > 0 ? 'item' : 'item itemDefault'}`" -->
          <div
            v-for="item in teacherList"
            :key="item.teacherId"
            class="item"
            @click="() => teacherChange(item)"
            :data-dataid="item.teacherId"
            :data-restnum="item.restNum"
          >
            <div :title="item.teacherName">{{ item.teacherName }}</div>
            <div :title="`未排:${item.restNum} 总课时:${item.totalNum}`">
              {{ item.restNum }}
              <span
                class="total"
                :title="`未排:${item.restNum} 总课时:${item.totalNum}`"
                >/{{ item.totalNum }}</span
              >
            </div>
          </div>

          <div
            class="noneData"
            :style="{ paddingTop: '79%' }"
            v-if="teacherList.length < 1"
          >
            <img :src="require('./../../../../../assets/img/noData.png')" />
            <p>暂无数据</p>
          </div>
        </draggable>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
export default {
  components: { draggable },
  props: [],
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "956eeb4f27e64419adc1d98037d70e5c", //方案id
      classIdSele: "", //左侧 班级选中id
      //right - tab切换List
      tabList: [
        { key: "1", tab: "课程" },
        { key: "2", tab: "教室" },
        { key: "3", tab: "教师" },
      ],
      noTitleKey: "", //right - 当前选中的tabkey

      courseList: [], // right - 课程List(未排课)
      courseSele: { id: "" }, //课程 选中
      lessonTxt: "",

      isDividRoom: false, //自动分配教室中
      treeData: [], // right - 场所树
      tree: { treeId: "" }, // right - 场所树选中
      roomList: [], //right - 教室List（未排课）
      roomSele: { roomId: "" }, //教室 选中

      teachGroupList: [], // 教室分组list
      group: { groupId: "" }, // right - 教师分组选中
      switchChecked: 2, //2选考 3学考切换开关值
      teacherList: [], // right - 教师List（未排课）
      teacherSele: { teacherId: "" }, //教师 选中
    };
  },
  computed: {
    ...mapState("arrangeOperation", ["classId", "isDroped"]),
  },
  watch: {
    classId() {
      // console.log(this.classId);
      this.classIdSele = this.classId;
    },
    isDroped() {
      if (this.isDroped) {
        const noTitleKey = this.noTitleKey;
        if (noTitleKey === "1") {
          this.getNolessonList(this.classIdSele); //获取未派课 课程列表
        } else if (noTitleKey === "2") {
          this.getNoRoomList({ placeId: this.tree.treeId }); //获取未排课 教室列表
        } else if (noTitleKey === "3") {
          this.getNoTeacherList(this.group.groupId, this.switchChecked); //获取未排课 教师列表
        }
        this.setDroped(false);
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    this.tree = { treeId: "" };
    this.group = { groupId: "" };
  },
  methods: {
    ...mapMutations("arrangeOperation", [
      "setDragItem",
      "setDroped",
      "refreshTableData",
    ]),
    /**
     * @desc 拖拽过程自定义控制
     */
    dragMove(e, originalEvent) {
      // const { isDrop, isDisabled } = e.relatedContext.component.$attrs;
      // if (
      //   (e.draggedContext.element.restNum === 0 && this.noTitleKey !== "3") ||
      //   isDisabled
      // )
      //   return false;
      // return true;
    },
    /**
     * @desc 拖拽开始
     * dataid数据id
     */
    dragStart(e) {
      const { dataid } = e.item.dataset;
      //params包含冲突验证的所有入参、右拖左的所有入参：dragList为本名  *表示此传参必须
      let params = {
        planId: this.planId, //*
        classId: this.classIdSele, //*
        dragId: dataid, //*
        ruleId: "", //*
        dragType: 1, //*
        courseType: 0, //*
        courseId: "", //*
        selfStudyType: 0, //*
        list: {},
        dragList: [], //*
      };
      if (this.noTitleKey === "1") {
        //课程拖动dragType有规则为5 无规则为1
        const item = this.courseList.find((courseItem) => {
          return JSON.stringify(courseItem.id) === dataid;
        });
        let dragList = [];
        item &&
          item.lessonList &&
          item.lessonList.map((lessonItem) => {
            dragList.push({
              dragId: lessonItem.lessonId,
              courseType: lessonItem.lessonType,
              dragName: lessonItem.lessonName,
              selfStudyType: lessonItem.selfStudyType,
              courseId: "",
            });
          });
        let courseSI = {
          dragId: item.id,
          ruleId: item.ruleId,
          dragType: item.ruleId ? 5 : 1,
          courseType: item.ruleId ? 0 : item.lessonList[0].lessonType, //为0表示连堂、单双周
          courseId: item.lessonList[0].lessonId,
          selfStudyType: item.lessonList[0].selfStudyType,
          list: item,
          dragList,
        };
        // console.log(courseSI);
        params = { ...params, ...courseSI };
        item.restNum > 0 ? this.setDragItem(params) : null;
      } else if (this.noTitleKey === "2") {
        const item = this.roomList.find((roomItem) => {
          return roomItem.roomId === dataid;
        });
        let dragList = [
          {
            dragId: item.roomId,
            courseType: 0,
            dragName: item.roomName,
            selfStudyType: 0,
            courseId: "",
          },
        ];
        let courseSI = {
          dragType: 3,
          list: item,
          dragList,
        };
        params = { ...params, ...courseSI };
        this.setDragItem(params);
      } else if (this.noTitleKey === "3") {
        const item = this.teacherList.find((teacherItem) => {
          return teacherItem.teacherId === dataid;
        });
        // console.log(this.group);
        //courseType:1正课 2选考 3学考
        let dragList = [
          {
            dragId: item.teacherId,
            courseType: this.group.courseTypeSele,
            dragName: item.teacherName,
            selfStudyType: 0,
            courseId: this.group.courseId,
          },
        ];
        let courseSI = {
          dragType: 2,
          courseType: this.group.courseTypeSele,
          courseId: this.group.courseId,
          grupSele: this.group,
          teacherSele: this.teacherSele,
          list: item,
          dragList,
        };
        // console.log(courseSI);
        params = { ...params, ...courseSI };
        this.setDragItem(params);
        // item.restNum > 0 ? this.setDragItem(params) : null;
      }
    },
    /**
     * @desc 仅在右侧拖动：需要重新加载表格数据
     * sectionid被放置格子id：用于判断是否是放置在表格上，未放置在表格上时为undefind
     * restnum：课程、教师：>0才能拖动  教室：不存在，都可以拖动
     */
    rightEnd(e) {
      this.refreshTableData(true);
    },
    // 右侧 - tab切换
    onTabChange(key, type) {
      this[type] = key;
      sessionStorage.setItem("tabKey", key);
      if (key === "1") {
        this.getNolessonList(this.classIdSele); //获取未派课 课程列表
      } else if (key === "2") {
        // this.getClassroomTree(); //获取 教室 场所树
        this.tree.treeId
          ? this.getNoRoomList({ placeId: this.tree.treeId })
          : this.getClassroomTree();
      } else if (key === "3") {
        this.getGroupOfTeacher(this.classId); //获取教师分组列表
        // this.group.groupId
        //   ? this.getNoTeacherList(this.group.groupId,this.switchChecked)
        //   : this.getGroupOfTeacher(this.classId);
      }
    },

    /**
     * @desc 获取课程 未排课列表
     */
    async getNolessonList(classId) {
      let res = await this.$api.ArrangeOperation.getNolessonList({
        planId: this.planId,
        classId,
      });
      if (res.code === "200" || res.code === 200) {
        let data = res.data;
        let courseData = [],
          courseSele = { id: "" };
        if (data && data.length) {
          data.map((item) => {
            let lessonLi = item.lessonList || [];
            let txt =
              item.ruleName === "单双周"
                ? lessonLi[0].lessonName +
                  "-" +
                  lessonLi[1].lessonName +
                  "[单双周]"
                : item.ruleName === "连堂"
                ? lessonLi[0].lessonName + "连堂"
                : lessonLi[0].lessonName;
            item.txt = txt;
          });
          courseData = data;
          courseSele = data[0];
        }
        this.courseList = courseData;
        this.courseSele = courseSele;
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 课程 未排课选中切换
     * item 选中项
     */
    courseChan(item) {
      this.courseSele = item;
    },

    // 右侧 - 自动分配教室
    async autoDivideRoom() {
      this.isDividRoom = true;
      let res = await this.$api.ArrangeOperation.autoDivideRoom({
        planId: this.planId,
      });
      if (res.code === "200" || res.code === 200) {
        this.setDroped(true);
        // this.getTimeTable();
        this.refreshTableData(true);
        this.$message.success("自动分配成功",5);
      } else {
        this.$message.error("自动分配失败",5);
      }
      this.isDividRoom = false;
    },
    /**
     * @desc 获取教室 场所树
     */
    async getClassroomTree() {
      let req = {
        arrLessonId: this.planId,
        type: 0,
      };
      let res = await this.$api.ArrangeOperation.getClassroomTree(req);
      if (res.code === "200") {
        let list = res.data && res.data.length ? res.data : [];
        list = this.dealRoomData(list);
        let placeId = "",
          treeList = [];
        if (list.length) {
          placeId = list[0].placeId;
          treeList = list;
          this.getNoRoomList({ placeId });
        }
        this.tree.treeId = placeId;
        this.treeData = treeList;
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 处理树数据：name为null处理为--
     */
    dealRoomData(list) {
      list.map((item) => {
        if (item.children) {
          this.dealRoomData(item.children);
        }
        item.placeName = item.placeName ? item.placeName : "--";
      });
      return list;
    },
    /**
     * @desc 获取教室 未排课列表
     * params: planId:计划id，  placeId：场所id
     */
    async getNoRoomList(params) {
      let req = {
        planId: this.planId,
        classId: this.classId,
      };
      //头部数据改变后，调用未传入树值
      req =
        params && params.placeId
          ? { ...req, ...params }
          : { ...req, ...{ placeId: this.tree.treeId } };
      let res = await this.$api.ArrangeOperation.getNoRoomList(req);
      if (res.code === "200" || res.code === 200) {
        const data = res.data;
        let roomData = [],
          roomSele = { roomId: "" };
        if (data && data.length) {
          roomData = data;
          roomSele = data[0];
        }
        this.roomList = roomData;
        this.roomSele = roomSele;
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 教室 - 场所树节点切换
     * id 选中节点id
     */
    treeNodeChange(id, label) {
      this.tree.treeId = id;
      // console.log(id);
      this.getNoRoomList({ placeId: id });
    },
    /**
     * @desc 教室 未排课选中切换
     * item 选中项
     */
    roomChan(item) {
      this.roomSele = item;
    },

    /**
     * @desc 获取教师 分组列表
     * params: planId:计划id，  classId:班级id
     */
    async getGroupOfTeacher(classId) {
      const params = {
        planId: this.planId,
        classId,
      };
      let res = await this.$api.ArrangeOperation.getGroupOfTeacher(params);
      if (res.code === "200" || res.code === 200) {
        const data = res.data;
        let teachList = [],
          teachSele = { groupId: "" };
        if (data && data.length) {
          teachList = data;
          let idItem = data.find((item) => {
            return item.groupId === this.group.groupId;
          });
          // console.log(idItem);
          teachSele = idItem ? idItem : data[0];
        }
        this.teachGroupList = teachList;
        teachSele.courseTypeSele =
          (teachSele && teachSele.courseType && teachSele.courseType[0]) || 0;
        this.switchChecked = teachSele.courseTypeSele;
        this.group = teachSele;
        teachSele.groupId
          ? this.getNoTeacherList(teachSele.groupId, this.switchChecked)
          : null;
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 获取 教师未排课列表
     * id 教师分组id
     * courseType:1正课 2选考 3学考
     */
    async getNoTeacherList(id, courseType) {
      const params = {
        planId: this.planId,
        classId: this.classIdSele,
        groupId: id ? id : this.group.groupId,
        courseType,
      };
      let res = await this.$api.ArrangeOperation.getNoTeacherList(params);
      if (res.code === "200") {
        const data = res.data;
        let teacherData = [],
          teacherId = { teacherId: "" };
        if (data && data.length) {
          teacherData = data;
          teacherId = data[0];
        }
        this.teacherList = teacherData;
        this.teacherSele = teacherId;
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 教师 教研组切换
     * id 选中数据id
     */
    groupSelect(id) {
      let groupItem = this.teachGroupList.find((item) => {
        return item.groupId === id;
      });
      groupItem.courseTypeSele = groupItem.courseType[0];
      this.switchChecked = groupItem.courseTypeSele;
      this.group = groupItem;
      this.getNoTeacherList(id, this.switchChecked);
    },
    /**
     * @desc 选考 学考切换开关
     * checked 是否打开
     */
    switchChan(e) {
      const val = e.target.value;
      this.switchChecked = val;
      this.group.courseTypeSele = val;
      this.getNoTeacherList(this.group.groupId, val);
    },
    /**
     * @desc 教师选中切换
     * item 选中项
     */
    teacherChange(item) {
      this.teacherSele = item;
    },
  },
};
</script>

<style lang="less" scoped>
.right {
  display: inline-block;
  margin-top: 64px;
  height: calc(100% - 48px);
  width: 230px; //200
  vertical-align: top;
  /deep/.ant-tabs-nav {
    width: 100%;
    // text-align: center;
  }
  /deep/ .ant-card-head {
    padding: 0 16px;
  }
  /deep/ .ant-tabs-tab {
    padding: 16px 0;
    font-size: 15px;
  }
  /deep/ .ant-card {
    // height: 100%;
    height: calc(100vh - 126px);
    box-shadow: 0px 0px 10px 1px #b3b3b373;
  }
  /deep/ .ant-row {
    margin: 0 0 0 12px !important;
  }
  /deep/ .ant-card-body {
    height: calc(100% - 55px);
    padding: 0;
    .tabContent {
      height: 99%;
      .ant-btn {
        margin: 12px;
        width: calc(100% - 24px);
        height: 32px;
        color: #409fff;
        background-color: #fff;
      }
      .ant-select {
        max-width: 107px;
        font-size: 13px;
      }
      // .ant-select-selection {
      //   border: none;
      // }
      .ant-select-arrow {
        right: 6px;
      }
      // .ant-select-focused .ant-select-selection,
      // .ant-select-selection:focus,
      // .ant-select-selection:active {
      //   box-shadow: none;
      // }
      .contentBox {
        height: calc(100% - 10px);
        width: 100%;
        // display: flex;
        // justify-content: flex-start;
        // flex-wrap: wrap;
        align-items: center;
        overflow: auto;
        .item,
        .roomItem {
          width: calc(100% - 24px);
          height: 38px;
          line-height: 38px;
          margin: 12px 12px 0 12px;
          border: 1px solid #99cdff;
          background-color: #fafcff;
          cursor: pointer;
          font-size: 13px;
          div:nth-child(1) {
            flex: 7;
            padding: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          div:nth-child(2) {
            flex: 3;
            text-align: right;
          }
          .total {
            color: #b9bdc0;
          }
          :hover {
            color: #409fff;
          }
        }
        .item {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          padding-right: 6px;
          // font-size: 13px;
        }
        .itemDefault {
          display: none;
          cursor: no-drop;
          background-color: #0000000f;
          :hover {
            color: unset;
          }
        }
        .chosen {
          border: 1px solid #409fff;
          box-shadow: 0px 0px 2px 2px #409fff;
          // background-color: #409fff;
          // color: #fff;
        }
        .ghost {
          // background-color: red;
          // :hover {
          //   color: #fff;
          // }
        }
        .roomItem {
          padding: 0 6px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .itemHigh,
        .roomItemHigh {
          color: #1ba4b3;
          border-color: #1ba4b3;
          .total {
            color: #1ba4b3;
          }
        }
      }
      .contentBox::-webkit-scrollbar {
        display: none !important;
      }
      .contentRoom {
        height: calc(100% - 70px);
      }
      .contentTeacher {
        height: calc(100% - 50px);
      }
      .ant-radio-group {
        margin-left: 10px;
      }
      .ant-radio-button-wrapper {
        padding: 0 8px;
      }
      .ant-radio-button-wrapper:first-child {
        border-radius: 16px 0 0 16px;
      }
      .ant-radio-button-wrapper:last-child {
        border-radius: 0 16px 16px 0;
      }
    }
  }
}
.rightRoom {
  /deep/ .ant-card-body {
    height: calc(100% - 95px);
  }
}
.noneData {
  padding-top: 100%;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #bfbfbf;
  p {
    margin-top: 10px;
  }
}
</style>
