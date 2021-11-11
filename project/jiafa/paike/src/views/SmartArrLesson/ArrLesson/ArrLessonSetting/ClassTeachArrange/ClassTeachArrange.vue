<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-02 14:05:32
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 13:17:51
-->
<template>
  <div class="class-teacher">
    <div class="tcontainer">
      <div class="left">
        <div class="batch-setting">
          <a-button class="btn" @click="settingHourDialog">
            批量配置课程课时
          </a-button>
        </div>
        <a-tree
          show-icon
          :defaultExpandAll="true"
          :replace-fields="replaceFields"
          v-if="treeData.length > 0"
          :default-selected-keys="defaultClassIdArr"
          :selectedKeys="selectedKeys"
          @select="select"
          class="tree-seleGroup"
        >
          <!-- :tree-data="treeData" -->
          <a-tree-node
            v-for="item in treeData"
            :key="item.gradeId"
            :disabled="true"
          >
            <template #title>
              <span>
                {{ item.gradeName }}
              </span>
            </template>
            <a-tree-node
              v-for="childItem in item.classList"
              :key="childItem.classId"
            >
              <template #title>
                <span>
                  {{ childItem.className }}
                </span>
                <span @click.stop="resetClassCourse(childItem)"
                  ><a-icon type="sync" class="sync"
                /></span>
              </template>
            </a-tree-node>
          </a-tree-node>
        </a-tree>
      </div>
      <div class="right">
        <div style="margin-bottom: 10px">
          <a-button type="primary" @click="allResetClassCourse">
            <a-icon type="sync" />一键重置
          </a-button>
          <a-button
            type="primary"
            style="margin-left: 20px"
            @click="autoAllocation"
          >
            <a-icon type="plus" />分配教师
          </a-button>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSourse"
          :rowKey="(record) => record.id"
          :pagination="pagination"
          :row-class-name="rowClassName"
          :loading="loading"
          :scroll="{ y: 'calc(100vh - 410px)' }"
        >
          <!-- :scroll="{ y: tableHeight }" -->
          <!-- :scroll="{ y: 'calc(100vh - 380px)' }" 最大高度 -->
          <template slot="mainTeacher" slot-scope="text, record">
            <div>
              <a-tree-select
                v-model="record.mainTeacherId"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="暂不指定"
                allow-clear
                tree-default-expand-all
                treeNodeFilterProp="title"
                :getPopupContainer="(v) => v.parentNode"
                @change="
                  (value, label) => saveMainTeacher(value, record, label, 1)
                "
              >
                <a-tree-select-node
                  v-for="item in record.mainTeacherList"
                  :key="item.mainTeacherId"
                  :value="item.mainTeacherId"
                  :title="item.mainTeacherName"
                >
                </a-tree-select-node>
              </a-tree-select>
            </div>
          </template>
          <template slot="weekHour" slot-scope="text, record">
            <a-input-number
              v-model="record.weekHour"
              id="weekHour"
              placeholder="0"
              @blur="onBlur(record, 1)"
              @pressEnter="onBlur(record, 1)"
              @focus="onFocus(record, 1)"
            />
          </template>
          <template slot="morningCourseHour" slot-scope="text, record">
            <!-- :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              id="morningCourseHour"
              v-model="record.morningCourseHour"
              @blur="onBlur(record, 2)"
              placeholder="0"
              @pressEnter="onBlur(record, 2)"
              @focus="onFocus(record, 2)"
            />
          </template>
          <template slot="nightCourseHour" slot-scope="text, record">
            <!-- :disabled="record.courseType === 2 || record.courseType === 3" -->
            <a-input-number
              id="nightCourseHour"
              v-model="record.nightCourseHour"
              @blur="onBlur(record, 3)"
              @pressEnter="onBlur(record, 3)"
              placeholder="0"
              @focus="onFocus(record, 3)"
            />
          </template>
          <template slot="viceTeacherList" slot-scope="text, record">
            <!-- @change="handleChange" -->
            <!-- @change="saveViceTeacher(record)" -->
            <!-- @change="saveViceTeacherData(record, 1)" -->
            <!-- @deselect="saveViceTeacherData(record, 2)" -->
            <a-select
              mode="multiple"
              v-model="record.viceTeacherList"
              style="width: 100%"
              placeholder="暂不指定老师"
              @change="saveViceTeacherBlur(record)"
              optionFilterProp="title"
              :getPopupContainer="(v) => v.parentNode"
            >
              <!-- optionFilterProp="title" -->
              <!-- @change="saveViceTeacherBlur(record)" -->
              <a-select-option
                v-for="item in record.viceTeacherDropDownList"
                :key="item.viceTeacherId"
                :value="item.viceTeacherId"
                :name="item.viceTeacherName"
                :title="item.viceTeacherName"
              >
                {{ item.viceTeacherName }}
              </a-select-option>
            </a-select>
          </template>
        </a-table>
      </div>
    </div>
    <!-- :teacherGroupId="teacherGroupId" -->
    <SettingHourDialog ref="settingHourDialog" />
    <TipsDialog
      :tipsDialogVisible="tipsDialogVisible"
      @ClosetipsDialogModel="ClosetipsDialogModel"
      :teacherGroupId="teacherGroupId"
      ref="TipsDialog"
    ></TipsDialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { TreeSelect } from "ant-design-vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// 表头
const columns = [
  {
    title: "课程",
    dataIndex: "courseName",
    key: "courseName",
    align: "center",
  },
  {
    title: "任教老师",
    dataIndex: "mainTeacher",
    key: "mainTeacher",
    scopedSlots: { customRender: "mainTeacher" },
    align: "center",
  },
  {
    title: "周正课时",
    dataIndex: "weekHour",
    key: "weekHour",
    scopedSlots: { customRender: "weekHour" },
    align: "center",
  },
  {
    title: "早自习课时",
    dataIndex: "morningCourseHour",
    key: "morningCourseHour",
    scopedSlots: { customRender: "morningCourseHour" },
    align: "center",
  },
  {
    title: "晚自习课时",
    dataIndex: "nightCourseHour",
    key: "nightCourseHour",
    scopedSlots: { customRender: "nightCourseHour" },
    align: "center",
  },
  {
    title: "副教师",
    dataIndex: "viceTeacherList",
    key: "viceTeacherList",
    scopedSlots: { customRender: "viceTeacherList" },
    align: "center",
  },
];
import SettingHourDialog from "./childCom/SettingCourseHour";
import TipsDialog from "./childCom/TipsDialog.vue";
export default {
  name: "ClassTeacher",
  data() {
    return {
      columns,
      dataSourse: [],
      viceTeacherArr: [],
      treeData: [],
      temp: [],
      tableHeight: 0,
      replaceFields: {
        children: "classList",
        title: "className",
        key: "classId",
        // slots: "slots",
      },
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      nightCourseHourValue: "",
      weekHourValue: "",
      morningCourseHourValue: "",
      classId: "",
      loading: false,
      arrLessonId: "",
      courseId: "",
      teacherList: [],
      mainTeacherIdList: [],
      mainTeacherList: [{}], // 主老师下拉框列表
      viceTeacherList: [], // 副老师下拉框列表
      viceTeacherValue: [], // 默认副老师值
      viceTeacherIndex: 0, // 保存副老师的index
      defaultClassIdArr: [],
      treeDataViceTeacher: [], // 副老师树结构
      SHOW_PARENT,
      filterTeacher: [], // 保存过滤老师的id列表
      tempHour: {
        // input框输入之后，提示错误，还原输入框内容
        weekHour: 0,
        morningCourseHour: 0,
        nightCourseHour: 0,
      },
      viceTeacherDataList: [], // 保存副教师data参数列表
      viceTeacherTemId: [],
      recordId: "", // 每一行的主键id
      newViceTeacherList: [], // 保存原始数据的副教师列表
      newMainTeacherList: [], //保存主数据的副教师列表
      disabledViceOption: false, //副老师 最多只能选3个
      defaultViceOption: 0, //  默认副老师的选项长度
      selectedKeys: [],
      tipsDialogVisible: false,
      teacherGroupId: "",
    };
  },
  components: {
    SettingHourDialog,
    TipsDialog,
  },
  computed: {
    ...mapState("dialog", ["settingHourVisible"]),
  },
  mounted() {
    this.init();
    // this.getTableHeight()
  },
  watch: {
    $route: function (to, from) {
      this.init();
    },
  },
  methods: {
    init() {
      this.arrLessonId = sessionStorage.getItem("arrLessonId");
      this.getClassList();
    },
    /**
     * @name: 表格隔行变色
     * @msg:
     * @param {*} record
     * @param {*} index
     * @return {*}
     */
    rowClassName(record, index) {
      let className = "";
      if (record.classChainKey === "1") {
        className = "rowColor1";
      } else if (record.classChainKey === "2") {
        className = "rowColor2";
      } else if (record.classChainKey === "3") {
        className = "rowColor3";
      } else if (record.classChainKey === "4") {
        className = "rowColor4";
      } else if (record.classChainKey === "5") {
        className = "rowColor5";
      } else if (record.classChainKey === "6") {
        className = "rowColor6";
      } else if (record.classChainKey === "7") {
        className = "rowColor7";
      } else if (record.classChainKey === "8") {
        className = "rowColor8";
      } else if (record.classChainKey === "9") {
        className = "rowColor9";
      } else if (record.classChainKey === "10") {
        className = "rowColor10";
      } else if (record.classChainKey === "11") {
        className = "rowColor11";
      } else if (record.classChainKey === "12") {
        className = "rowColor12";
      } else if (index % 2 === 1) {
        className = "gray";
      }
      //  else if (index % 2 === 1) {
      // className = "gray";
      // }
      // if (index % 2 === 1) className = "gray";
      return className;
    },

    /**
     * @name: 分页
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.getTeaClassList();
    },

    /**
     * @name: 批量配置课程课时弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setSettingHourVisible"]),
    settingHourDialog() {
      this.setSettingHourVisible(true);
      this.$refs.settingHourDialog.getTeaClassDialogList();
    },
    /**
     * @name: 关闭批量配置课程课时
     * @msg:
     * @param {*} settingHourVisible
     * @return {*}
     */
    closeSettingHourDialog(settingHourVisible) {
      this.settingHourVisible = !settingHourVisible;
    },

    /**
     * @name: 获取班级-左侧
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getClassList() {
      // 不能直接操作treeData， 需要给一个中间值。最后赋值给treedata
      try {
        let data = {
          arrLessonId: this.arrLessonId,
        };
        const res = await this.$api.ArrLessonSetting.getClassList(data);
        if (res.code === "200") {
          this.temp[0] = res.data;
          this.temp[0].classId = this.temp[0].gradeId;
          this.temp[0].className = this.temp[0].gradeName;
          // this.temp[0].slots = { icon: "add" };
          this.temp[0].classList.map((item) => {
            item.classList = [];
            // item.slots = { icon: "minus" };
          });
          this.treeData = this.temp;
          this.defaultClassIdArr.push(this.treeData[0].classList[0].classId);
          this.select(this.defaultClassIdArr);
        } else {
          this.$message.error(res.message, 5);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * @name:  左侧选择
     * @msg:
     * @param {*}
     * @return {*}
     */
    select(selectedKeys, e) {
      if (selectedKeys.length > 0) {
        this.classId = selectedKeys[0];
        this.pagination.current = 1;
        this.getTeaClassList();
        this.selectedKeys = [];
        this.selectedKeys = selectedKeys;
      }
    },

    /**
     * @name: 批量修改课时
     * @msg:
     * @param {*} record
     * @return {*}
     */

    async onBlur(record, type) {
      let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
      let { weekHour, morningCourseHour, nightCourseHour, id } = record;
      if (
        weekHour === null ||
        morningCourseHour === null ||
        nightCourseHour === null
      ) {
        this.$message.warning("课时不能设置为空", 5);
        this.getTeaClassList();
      } else if (weekHour < 0 || morningCourseHour < 0 || nightCourseHour < 0) {
        this.$message.warning("课时不能设置负数", 5);
        this.getTeaClassList();
      } else {
        let pd = false;
        if (type === 1) {
          pd = this.isNum(weekHour);
        } else if (type === 2) {
          pd = this.isNumPositive(morningCourseHour);
        } else {
          pd = this.isNumPositive(nightCourseHour);
        }
        if (pd) {
          let data = {
            weekHour: weekHour,
            morningCourseHour: morningCourseHour,
            nightCourseHour: nightCourseHour,
            id: id,
            sectionSelectNumber: parseInt(sectionSelectNumber),
          };

          try {
            let res = await this.$api.ArrLessonSetting.updateHourArr(data);
            if (res.code === "200") {
              // this.$message.success("修改成功");
              // this.tipsDialogVisible = true;
              // this.getTeaClassList();
              if (res.data.teacherGroupId === null) {
                this.$message.success("修改成功", 5);
                this.getTeaClassList();
              } else {
                this.$message.warning("当前已超过该教师的最大课时数", 5);
                this.tipsDialogVisible = true;
                this.teacherGroupId = res.data.teacherGroupId;
                this.getTeaClassList();
              }
            } else {
              this.$message.warning(res.message, 5);
              this.getTeaClassList();
              // record.weekHour = this.tempHour.weekHour;
              // record.morningCourseHour = this.tempHour.morningCourseHour;
              // record.nightCourseHour = this.tempHour.nightCourseHour;
            }
          } catch (error) {
            this.$message.error("请求失败", error, 5);
          }
        } else {
          // this.getTeaClassList();
          this.$message.warning(
            "周正课时只能设置0,0.5,正整数，早自习，晚自习可以设置为0,正整数",
            5
          );
          this.getTeaClassList();
          // record.weekHour = this.tempHour.weekHour;
          // record.morningCourseHour = this.tempHour.morningCourseHour;
          // record.nightCourseHour = this.tempHour.nightCourseHour;
        }
      }
    },
    // 判断周正课时数，可以设置为0.5的倍数
    isNum(num) {
      if (num >= 0) {
        // if (num % 0.5 === 0) {
        if (num === 0.5 || num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },

    // 只能为0，正整数
    isNumPositive(num) {
      if (num >= 0) {
        if (num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".right");
      this.tableHeight = tableHeight.clientHeight - 100;
    },
    /**
     * @name:  获取表格
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("stateList", ["setClassWeekHour", "setShowClassWeekHour"]),
    async getTeaClassList() {
      this.loading = true;
      let data = {
        classId: this.classId,
        arrLessonId: this.arrLessonId,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      try {
        const res = await this.$api.ArrLessonSetting.getClassHourInfoListNew(
          data
        );
        if (res.code === "200") {
          this.dataSourse = res.data.list;
          this.dataSourse.map((item) => {
            if (item.mainTeacher === "" && item.mainTeacherId === "") {
              item.mainTeacher = null;
              item.mainTeacherId = null;
            }
          });
          this.pagination.total = res.data.pagination.total;
          this.treeDataViceTeacher = res.data.viceTeacherList;
          // 副老师列表
          this.newViceTeacherList = res.data.list[1].viceTeacherDropDownList;
          let data = {
            classWeekHour: res.data.weekCourseHour,
            classMoriningHour: res.data.morningCourseHour,
            classNightHour: res.data.nightCourseHour,
          };
          this.setClassWeekHour(data);
          if (this.defaultViceOption >= 3) {
            this.disabledViceOption = true;
          } else {
            this.disabledViceOption = false;
          }
        } else {
          this.$message.warning(res.message, 5);
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },

    /**
     * @name: 保存主教师
     * @msg:
     * @param n*o value
     * @param n*o record
     * @param n*o label
     * @param n*o type
     * @return n*o
     */
    async saveMainTeacher(value, record, label, type) {
      let { id } = record;
      this.recordId = record;
      let teacherId = value;
      let teacherName = label[0];
      let list = [];
      if (label.length === 0) {
        list = [];
      } else {
        list = [
          {
            teacherId: teacherId,
            teacherName: teacherName,
          },
        ];
      }
      let data = {
        list,
        id,
        type,
      };
      const res = await this.$api.ArrLessonSetting.saveTeacher(data);
      if (res.code === "200") {
        if (res.data.teacherGroupId === null) {
          this.$message.success("修改成功", 5);
          this.getTeaClassList();
        } else {
          this.$message.warning("当前已超过该教师的最大课时数", 5);
          this.tipsDialogVisible = true;
          this.teacherGroupId = res.data.teacherGroupId;
          this.getTeaClassList();
        }
      } else {
        this.$message.warning(res.message, 5);
        this.getTeaClassList();
      }
    },

    /**
     * @name:通过change事件处理参数
     * @msg:
     * @return {*}
     */
    saveViceTeacherData(list) {
      // 选中的副教师id
      let tempList = [];
      if (list.length !== 0) {
        list.map((itemId) => {
          this.newViceTeacherList.map((itemObj, index) => {
            if (itemId === itemObj.viceTeacherId) {
              tempList.push(itemObj);
            }
          });
        });
        // 对tempList 进行处理，转换成参数需要的字段
        tempList = JSON.parse(
          JSON.stringify(tempList)
            .replace(/viceTeacherId/g, "teacherId")
            .replace(/viceTeacherName/g, "teacherName")
        );
        return tempList;
      } else {
        return [];
      }
    },

    /**
     * @name: 保存副老师
     * @msg:
     * @param {*} record
     * @return {*}
     */
    async saveViceTeacherBlur(record) {
      if (record.viceTeacherList.length > 3) {
        record.viceTeacherList = record.viceTeacherList.slice(0, 3);
        this.$message.warning("副老师最多只能选3个", 5);
      } else {
        let { id } = record;
        let list = this.saveViceTeacherData(record.viceTeacherList);
        let data = {
          list: list,
          id,
          type: 2,
        };
        const res = await this.$api.ArrLessonSetting.saveTeacher(data);
        if (res.code === "200") {
          if ((res.message === "请求成功", 5)) {
            this.$message.success("添加成功", 5);
          } else {
            this.$message.success("清空成功", 5);
          }
          this.getTeaClassList();
          this.disabledViceOption = false;
        } else {
          this.$message.warning(res.message, 5);
          // }
          this.viceTeacherTemId = [];
        }
      }
    },

    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.getTeaClassList();
    },

    /**
     * @name: 对输入框进行保存值
     * @msg:
     * @param {*} record
     * @param {*} num
     * @return {*}
     */
    onFocus(record, num) {
      if (num === 1) {
        this.tempHour.weekHour = record.weekHour;
      } else if (num === 2) {
        this.tempHour.morningCourseHour = record.morningCourseHour;
      } else {
        this.tempHour.nightCourseHour = record.nightCourseHour;
      }
    },

    /**
     * @name: 关闭提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ClosetipsDialogModel(tipsDialogVisible) {
      this.tipsDialogVisible = !tipsDialogVisible;
    },
    /**
     * @name: 班级重置
     * @msg:
     * @param {*} childItem
     * @return {*}
     */
    resetClassCourse(childItem) {
      const { className, classId } = childItem;
      this.$confirm({
        title: `确定要重置"${className}"的课时?`,
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.sureResetClassCourse(classId);
        },
      });
    },
    async sureResetClassCourse(classId) {
      let param = {};
      // 一键重置所有班级课时
      if (!classId) {
        param = {
          planId: this.arrLessonId,
        };
      } else {
        // 班级重置
        param = {
          classId,
          planId: this.arrLessonId,
        };
      }
      const res = await this.$api.ArrLessonSetting.resetClassHourTeacher(param);
      if (res.code === "200") {
        await this.getTeaClassList();
        this.$message.success("重置成功");
      } else {
        this.$message.warning(res.message);
      }
    },
    /**
     * @name: 一键重置所有班级课时
     * @msg:
     * @param {*}
     * @return {*}
     */
    allResetClassCourse() {
      this.$confirm({
        title: `确定要重置"所有班级"的课时?`,
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.sureResetClassCourse(null);
        },
      });
    },
    /**
     * @name: 自动分配教师
     * @msg:
     * @param {*}
     * @return {*}
     */
    autoAllocation() {
      this.$confirm({
        // title: `自动分配教师`,
        content: '自动分配将对所有班级的老师进行随机分配。',
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: async () => {
          const param = {
            planId: this.arrLessonId,
          };
          const res = await this.$api.ArrLessonSetting.autoClassHourTeacher(
            param
          );
          if (res.code === "200") {
            await this.getTeaClassList();
            this.$message.success("自动分配教师成功");
          } else {
            this.$message.warning(res.message);
          }
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.class-teacher {
  width: 100%;
  height: calc(100% - 170px);
  .tcontainer {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 208px;
      height: 100%;
      background-color: #f7f8fa;
      /deep/ .ant-tree-node-content-wrapper {
        position: relative;
      }
      overflow-y: scroll;
      .sync {
        position: absolute;
        right: -35%;
        top: 50%;
        transform: translateY(-50%);
      }
      /deep/ .ant-tree-iconEle {
        width: 0px;
      }
      .batch-setting {
        display: flex;
        justify-content: center;
        .btn {
          width: 176px;
          margin-top: 20px;
        }
      }
    }
    .right {
      width: calc(100% - 238px);
      height: 100%;
      margin-left: 20px;
    }
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  /deep/ .rowColor1 {
    background-color: #eb4310;
  }
  /deep/ .rowColor2 {
    background-color: #f6941d;
  }
  /deep/ .rowColor3 {
    background-color: #fbb417;
  }
  /deep/ .rowColor4 {
    background-color: #ffff00;
  }
  /deep/ .rowColor5 {
    background-color: #cdd541;
  }
  /deep/ .rowColor6 {
    background-color: #99cc33;
  }
  /deep/ .rowColor7 {
    background-color: #3f9337;
  }
  /deep/ .rowColor8 {
    background-color: #219167;
  }
  /deep/ .rowColor9 {
    background-color: #239676;
  }
  /deep/ .rowColor10 {
    background-color: #239676;
  }
  /deep/ .rowColor11 {
    background-color: #24998d;
  }
  /deep/ .rowColor12 {
    background-color: #1f9baa;
  }
  /deep/ .ant-tree-iconEle {
    width: 0px;
  }
}
.tree-seleGroup {
  font-weight: bold;
}
/deep/ .ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 7px 16px;
}
</style>