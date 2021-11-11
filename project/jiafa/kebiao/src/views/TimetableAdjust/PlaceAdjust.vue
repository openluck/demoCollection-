<!--
 * @Description: 场所调整主页面
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: cb
 * @LastEditTime: 2021-10-18 16:25:07
-->
<template>
  <div class="cb-container">
    <div class="common-title">场所调整</div>
    <a-skeleton :loading="skeletonLoading">
      <div class="cb-p-filter">
        <div style="position: relative;">
          <a-tree-select v-model="searchData.placeId"
            show-search
            :replace-fields="replaceFields"
            style="width:200px;"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto',zIndex:'9' }"
            :tree-data="treeData"
            placeholder="请选择场所"
            :load-data="onLoadData"
            :filterTreeNode="filterOption"
            :treeDefaultExpandedKeys='treeDefaultExpandedKeys'
            :getPopupContainer="(v) => v.parentNode"
            @change='treeChange' />
        </div>
        <div class="cb-p-btn">
          <a-button @click="openRecord">
            <svg-icon icon-class="com_adjust_record"
              :scale="0.8"
              style="margin-right:8px"></svg-icon>
            调整记录
          </a-button>
          <a-button @click="adjustment"
            type="primary">
            <svg-icon icon-class="com_apply"
              :scale="0.8"
              style="margin-right:8px;"></svg-icon>
            调整
          </a-button>
          <!-- <a-button type="primary"  @click="ApplyOtherWeek">
           <svg-icon icon-class="com_apply" :scale="0.8" style="margin-right:8px;"></svg-icon>
          应用于其他周次
        </a-button> -->
        </div>
      </div>

      <div class="cb-p-tb">
        <!-- 时间 -->
        <a-week-picker id="selectWeek"
          :allowClear="false"
          v-model="week"
          @change="dateChange"
          placeholder="请选择时间"
          style="width: 235px;z-index:8"
          :format="placeTime"
          :disabled-date="disabledDate"
          :getCalendarContainer="(v) => v.parentNode">
          <template #suffixIcon>
            <svg-icon icon-class="com_calendar"
              style="margin-top:-8px"></svg-icon>
          </template>

        </a-week-picker>
        <!-- 教学周 -->
        <div class="cb-p-week">{{teachWeek.teachWeekName}}</div>
        <!-- 课程 -->
        <div style="position: relative;">
          <a-select style="width: 243px;"
            @change="handleChange"
            v-model="searchData.courseId"
            allowClear
            placeholder="批量选择课程"
            :getPopupContainer="(v) => v.parentNode"
            :dropdownStyle="{zIndex:'9'}">
            <a-select-option v-for="(item,index) in courseList"
              :key="index"
              :title="item.courseName"
              :value='item.courseId'>
              {{item.courseName}}
            </a-select-option>
          </a-select>
        </div>

        <!-- 条件过滤 -->
        <a-checkbox-group :options="options"
          style="margin-left: 49px;"
          :value="filterValue"
          @change="onChange" />
      </div>
    </a-skeleton>
    <!-- 课表 -->
    <div class="cb-p-list"
      v-show="!skeletonLoading">
      <div @click="getWeek('1')"
        class="cb-p-left">
        <svg-icon class="gSvg"
          icon-class="com_cg_week"
          :scale="0.8"></svg-icon>
      </div>
      <div @click="getWeek('2')"
        class="cb-p-right">
        <svg-icon class="gSvg"
          icon-class="com_cg_week"
          :scale="0.8"></svg-icon>
      </div>
      <!-- 课表 -->
      <a-table :columns="columns"
        :data-source="timetableData"
        bordered
        :pagination="false"
        :row-key="(record,index) => index"
        :loading='tableLoading'>
        <!--标题名字  -->
        <span v-for="(item,index) in slotList"
          :key='index'
          :slot="item">
          {{filertWeek(item)}}
          <span v-if="slotDay[index]"
            style="margin-left:11px;color: #797c7f;">( {{slotDay[index]}} )</span>
        </span>
        <!-- 课表内容 -->
      </a-table>
      <TableCell v-if="false" />
    </div>
    <PlaceModal ref="PlaceModal"
      @partObj='partObj' />
    <RecordModal ref="RecordModal" />
    <OperatePlace ref="OperatePlace"
      @init="init" />
    <!-- <ApplyOtherWeek ref="ApplyOtherWeek" /> -->
  </div>
</template>
 
<script>
import { mapState, mapMutations } from "vuex";
import TableCell from "./PlaceAdjustChild/TableCell";
import PlaceModal from "./PlaceAdjustChild/PlaceModal";
import RecordModal from "@/components/common/RecordModal";
import OperatePlace from "./PlaceAdjustChild/OperatePlace";
// import ApplyOtherWeek from "@/components/common/ApplyOtherWeek";
import moment from 'moment'
import { getWeekInTime, findAllParent } from '@/Utils/util'

const options = [
  { label: '科目', value: '1' },
  { label: '场所', value: '2' },
  { label: '教师', value: '3' },
  { label: '班级', value: '4' },
  { label: '时间', value: '5' }
];
export default {
  components: { TableCell, PlaceModal, RecordModal, OperatePlace },
  name: "",
  data() {
    return {
      options, //筛选项
      timetableData: [], //课表数据
      skeletonLoading: true,
      tableLoading: false,
      slotList: ["lesMon", "lesTue", "lesWed", "lesThu", "lesFri", "lesSat", "lesSun"],
      slotDay: [],
      filterValue: ['1', '3', '4'],
      isShow: {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      },
      teachWeek: { //教学周数据
        teachWeekId: '',
        teachWeekName: ''
      },
      replaceFields: {
        key: 'buildingId',
        title: 'buildingName',
        value: 'buildingId'
      },
      week: '', // 日期
      timeFrameArray: [], //时段序列表（合并时段时使用）
      date: {
        startTime: '',
        endTime: ''
      },
      searchData: { //课表请求参数
        courseId: undefined,
        placeId: undefined,
        teachWeekId: ''
      },
      courseList: [], //课程下拉相关数据
      nowSemester: {}
    };
  },
  computed: {
    ...mapState("placeAdjust", ["placeId", 'treeData', 'treeDefaultExpandedKeys']),
    placeTime() {
      return (
        this.date.startTime + ' ' + '  ~  ' + ' ' + this.date.endTime
      )
    },
    columns() {
      let arr = [
        {
          title: "时段",
          dataIndex: "diffNoonName",
          key: "diffNoonName",
          width: 36,
          align: 'center',
          customRender: (text, row, index) => {
            const result = this.timeFrameArray.some(i => i.start === index)
            if (result) {
              const temp = this.timeFrameArray.filter((i) => i.name === text);
              let rowSpan = 0;
              if (temp.length) {
                rowSpan = temp[0].rowSpan || 0;
              } else {
                rowSpan = 1;
              }
              return {
                children: text,
                attrs: {
                  rowSpan: rowSpan
                }
              };
            } else {
              return {
                children: text,
                attrs: {
                  rowSpan: 0
                }
              };
            }
          }
        },
        {
          title: "节次",
          dataIndex: "lesSortName",
          key: "lesSortName",
          width: 44,
          align: 'center',
          customRender: (text, row, index) => {
            if (this.isMergeArray.includes(index)) {
              return {
                children: text,
                attrs: {
                  colSpan: 8
                }
              };
            } else {
              return {
                children: text
              };
            }
          }
        }
      ]
      for (let i = 0; i < this.slotList.length; i++) {
        let obj = {
          dataIndex: this.slotList[i],
          align: "center",
          width: 105,
          key: this.slotList[i],
          slots: { title: this.slotList[i] },
          scopedSlots: { customRender: this.slotList[i] },
          customCell: () => {
            return {
              style: {
                'background-color': 'rgb(255,255,255)'
              }
            }
          },
          customRender: (text, row, index) => {
            if (this.isMergeArray.includes(index)) {
              return {
                children: <TableCell />,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              //row:整条数据 （slotDay：时间 i：下标 判断时间，更多弹窗使用） week：星期几 filterValue：前端条件过滤
              return {
                children: <TableCell row={row} slotDay={this.slotDay} i={i} week={this.slotList[i]} filterValue={this.isShow} />
              };
            }
          }
        }
        arr.push(obj)
      }
      return arr
    },
    isMergeArray() {
      let arr = [];
      this.timetableData.forEach((item, index) => {
        if (item.showType === '1') {
          arr.push(index);
        }
      });
      return arr;
    }
  },
  async mounted() {
    //1.先进入页面判断vuex中是否有值，无值打开弹窗，有值先赋值
    this.nowSemester = JSON.parse(sessionStorage.getItem('nowSemester'))
    this.searchData.schoolYearId = this.nowSemester.schoolYearId
    this.searchData.semesterId = this.nowSemester.semesterId
    if (this.placeId) {
      this.searchData.placeId = this.placeId
      this.skeletonLoading = false;
      this.init()
    } else {
      this.showPlaceModal()
    }
  },
  methods: {
    findAllParent,
    ...mapMutations("placeAdjust", ["setTreeData", 'setPlace']),
    init() {
      //1初始化获取课程
      // this.getplaceCourseList()
      //2初始化获取周次时间
      this.getWeek()
      //3初始化表格内容显示隐藏
      this.filterText()
    },
    disabledDate(current) {
      return moment(this.nowSemester.semesterEndTime) < current || current < moment(this.nowSemester.semesterStartTime)
    },
    //初始化获取当前时间，周次
    getWeek(type) {
      if (type) {
        if (type === '1') { //往前翻页
          if (this.week.endOf('week') < moment(this.nowSemester.semesterStartTime).add(7, "days")) {
            this.$message.warning('已经是第一周了')
            return
          } else {
            this.week = this.week.subtract(1, "weeks")
          }
        } else { //往后翻页
          if (this.week.startOf('week') > moment(this.nowSemester.semesterEndTime).subtract(7, "days")) {
            this.$message.warning('已经是最后一周了')
            return
          } else {
            this.week = this.week.subtract(-1, "weeks")
          }
        }
      } else {
        if (!this.week) {
          // if (this.nowSemester.inSemester) {
          //     this.week = moment(new Date())
          //   } else {
          //     this.week = moment(this.nowSemester.semesterEndTime)
          //   }
          this.week = moment(this.nowSemester.defaultTime) ? moment(this.nowSemester.defaultTime) : moment(new Date());
        }
      }
      this.dateChange()
    },
    treeChange(value, label, extra) {
      this.searchData.courseId = undefined
      let arr = this.findAllParent(extra.triggerNode.dataRef, this.treeData)
      console.log(arr);
      let arr1 = []
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        arr1.push(element.buildingId)
      }
      this.courseList = []
      this.getPlaceTimetable()
      this.setPlace({ placeIdTemp: this.searchData.placeId, treeDataTemp: this.treeData, treeDefaultExpandedKeys: arr1.reverse() });
      this.getplaceCourseList()
    },
    //选择日期
    async dateChange() {
      let startDate = moment(this.week).startOf('week').format('YYYY-MM-DD');
      let endDate = moment(this.week).endOf('week').format('YYYY-MM-DD');
      this.date.startTime = startDate
      this.date.endTime = endDate
      await this.getTeachWeekByDate(startDate, endDate)
      //获取课表数据
      this.getPlaceTimetable()
    },
    showPlaceModal() {
      this.$refs.PlaceModal.showModal()
    },
    partObj(id) {
      this.searchData.placeId = id
      this.skeletonLoading = false;
      this.init()
    },
    async onLoadData(treeNode) {
      let item = treeNode.dataRef
      if (item.buildingType === '3' || item.buildingType === 3) {
        const children = await this.getClassroom(item.buildingId)
        this.setTreeData(this.getArrayObj(this.treeData, item.buildingId, children))
      } else {

      }
    },
    getArrayObj(data, id, children) {
      for (var i in data) {
        if (data && id && children) {
          if (data[i].buildingId === id) {
            data[i].children = children
          } else {
            this.getArrayObj(data[i].children, id, children);
          }
        } else {
          if (!data[i].isLeaf) {
            data[i].disabled = true
            this.getArrayObj(data[i].children);
          }
        }
      }
      return data
    },
    //打开调整记录弹窗
    openRecord() {
      let data = {
        changeType: '4'
        // placeId: this.searchData.placeId
        // teachWeekId: this.searchData.teachWeekId
      }
      this.$refs.RecordModal.showModal(data)
    },
    // //打开应用到其他周次弹窗,传入查询参数即可
    // ApplyOtherWeek() {
    //   this.$refs.ApplyOtherWeek.showModal();
    //   const params = {
    //     changeType: 3 //1. 周内调课  2. 代课 3 场所调课 4. 取消课程
    //   };
    //   Object.assign(params, this.searchData)
    //   this.$refs.ApplyOtherWeek.initExParam(params);
    // },
    //条件过滤change事件
    onChange(checkedValues) {
      if (checkedValues.length < 1) {
        this.$message.warning('至少勾选一个')
      } else {
        this.filterValue = checkedValues
        this.filterText()
      }
    },
    //课程change事件
    handleChange() {
      this.getPlaceTimetable()
    },
    filertWeek(item) {
      switch (item) {
        case 'lesMon':
          return '周一'
        case 'lesTue':
          return '周二'
        case 'lesWed':
          return '周三'
        case 'lesThu':
          return '周四'
        case 'lesFri':
          return '周五'
        case 'lesSat':
          return '周六'
        case 'lesSun':
          return '周日'
      }
    },
    //表格合并操作数据
    gethb() {
      if (this.timetableData.length > 0) {
        let arr = []
        this.timetableData.map(item => {
          arr.push(item.diffNoonName)
        })
        let arr1 = []
        for (var i = 0; i < arr.length;) {
          var count = 0;
          for (var j = i; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              count++;
            }
          }
          arr1.push({
            name: arr[i],
            start: i,
            end: i + count - 1,
            rowSpan: count
          })
          i += count;
        }
        this.timeFrameArray = arr1
      }
    },
    //格子内容显示隐藏
    filterText() {
      this.isShow = {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      }
      for (let i = 0; i < this.filterValue.length; i++) {
        const element = this.filterValue[i];
        switch (element) {
          case '1':
            this.isShow.sub = true
            break;
          case '2':
            this.isShow.place = true
            break;
          case '3':
            this.isShow.tea = true
            break;
          case '4':
            this.isShow.class = true
            break;
          case '5':
            this.isShow.time = true
            break;
        }
      }
    },
    //调整调整
    adjustment() {
      let arr = []
      for (let i = 0; i < this.timetableData.length; i++) {
        const obj = this.timetableData[i];
        for (let j = 0; j < this.slotList.length; j++) {
          const week = this.slotList[j];
          if (obj[week] && obj[week].lesList) {
            for (let k = 0; k < obj[week].lesList.length; k++) {
              const item = obj[week].lesList[k];
              if (item.isSelect) {
                let temp = {
                  lesSortId: obj.teachLesSortOptIndex,
                  weekSort: j + 1,
                  lesId: item.lesId
                }
                arr.push(temp)
              }
            }
          }
        }
      }
      if (arr.length > 0) {
        this.$refs.OperatePlace.showModal(arr, this.searchData.placeId, this.teachWeek.teachWeekId)
      } else {
        this.$message.warning('请先勾选课堂')
      }
    },
    filterOption(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    //接口请求
    //获取课表数据
    async getPlaceTimetable() {
      this.tableLoading = true
      try {
        const res = await this.$api.common.getPlaceTimetable(this.searchData);
        if (res.code === '200' && res.result) {
          this.timetableData = res.data.sort((a, b) => a.lesSortIndex - b.lesSortIndex)
          this.gethb()
          this.tableLoading = false
          this.slotDay = getWeekInTime(this.week)
        } else {
          this.$message.warning(res.message)
          this.tableLoading = false
          this.timetableData = []
        }
      } catch {
        this.tableLoading = false
        this.timetableData = []
      }
    },
    //获取场所的课程
    async getplaceCourseList() {
      const res = await this.$api.placeAdjust.getplaceCourseList({ 
        'placeId': this.searchData.placeId,
        'teachWeekId': this.searchData.teachWeekId
        });
      if (res.code === '200' && res.result) {
        this.courseList = res.data
      }
    },
    //根据时间获取教学周
    async getTeachWeekByDate(startDate) {
      // if (startDate < this.nowSemester.semesterStartTime) {
      //   startDate = this.nowSemester.semesterStartTime
      // }
      let data = {
        startDate: startDate
      }
      const res = await this.$api.common.getTeachWeekByDate(data);
      if (res.code === "200" && res.result) {
        this.teachWeek = res.data
        if (res.data.teachWeekId) {
          this.searchData.teachWeekId = res.data.teachWeekId
          this.searchData.courseId = undefined
          this.courseList = []
          await this.getplaceCourseList()
        }
      }
    },
    // 根据楼层获取房间
    async getClassroom(value) {
      const data = { buildingId: value };
      const res = await this.$api.common.getClassroom(data);
      if (res.code === '200' && res.result) {
        return res.data.map(i => ({ ...i, buildingId: i.classroomId, isLeaf: true, value: i.classroomId, buildingName: i.classroomName }))
      } else {
        return []
      }
    }
  }
};
</script>
 
<style  lang = "less">
</style>