<!--
 * @Description: 场所调整主页面
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-02 15:07:53
 * @LastEditors: cb
 * @LastEditTime: 2021-10-18 11:19:01
-->
<template>
  <div class="cb-container">
    <div class="common-title">
      学生换课
      <span class="cb-subhead">
        注：所在行政班学生存在同一时间上不同课程时，可进行学生换课
      </span>
    </div>
    <a-skeleton :loading="skeletonLoading">
    </a-skeleton>
    <div v-show="!skeletonLoading"
      class="cb-p-filter">
      <div>
        <FilterStu ref="FilterStu"
          @filterTimetable='filterTimetable' />
      </div>
      <div class="cb-p-btn">
        <a-button v-if="isHave"
          @click="openRecord">
          <svg-icon icon-class="com_adjust_record"
            :scale="0.8"
            style="margin-right:8px"></svg-icon>
          调整记录
        </a-button>
        <a-button v-if="isHave"
          @click="saveTimeTable"
          type="primary">
          <svg-icon icon-class="com_apply"
            :scale="0.8"
            style="margin-right:8px;"></svg-icon>
          换课
        </a-button>
      </div>
    </div>
    <div v-show="!skeletonLoading">
      <div v-if="isHave"
        class="cb-p-tb">
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
        <div style="position: relative;">
          <!-- 课程 -->
          <a-select style="width: 243px;"
            @change="handleChange"
            v-model="searchData.stuCourseId"
            allowClear
            placeholder="批量选择可换课程"
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
    </div>
    <!-- 课表 -->
    <div v-show="!skeletonLoading">
      <div v-if="isHave"
        class="cb-p-list">
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
      <div v-else
        class="cb-p-empty">
        <a-empty :image="require('@/assets/img/empty.png')"
          :image-style="{
            height: '200px',
          }">
          <span slot="description"
            style="color:#616366;">暂无任何数据，请创建学生课表</span>
          <a-button type="primary"
            @click="addTimeTable">
            <svg-icon icon-class="com_add"
              style="margin-right:8px"></svg-icon>
            创建学生课表
          </a-button>
        </a-empty>
      </div>
    </div>

    <StuModal @partObj='partObj'
      ref="StuModal" />
    <RecordModal ref="RecordModal" />
    <SelectCourseModal @addCommit='addCommit'
      ref="SelectCourseModal" />
  </div>
</template>
 
<script>

import { mapState } from "vuex";
import TableCell from "./StuCgLesChild/TableCell";
import StuModal from "./StuCgLesChild/StuModal";
import SelectCourseModal from "./StuCgLesChild/SelectCourseModal";
import FilterStu from "./StuCgLesChild/FilterStu";
import RecordModal from "@/components/common/RecordModal";
import moment from 'moment'
import { getWeekInTime } from '@/Utils/util'
const options = [
  { label: '科目', value: '1' },
  { label: '场所', value: '2' },
  { label: '教师', value: '3' },
  { label: '班级', value: '4' },
  { label: '时间', value: '5' }
];
export default {
  components: { TableCell, FilterStu, StuModal, RecordModal, SelectCourseModal },
  name: "",
  data() {
    return {
      options, //筛选项
      timetableData: [], //课表数据
      skeletonLoading: true,
      isHave: true, //学生是否有课表
      tableLoading: false,
      slotList: ["lesMon", "lesTue", "lesWed", "lesThu", "lesFri", "lesSat", "lesSun"],
      slotDay: [],
      filterValue: ['1', '2', '3'],
      isShow: {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      },
      //教学周数据
      teachWeek: {
        teachWeekId: '',
        teachWeekName: ''
      },
      // 日期
      week: '',
      //时段序列表（合并时段时使用）
      timeFrameArray: [],
      date: {
        startTime: '', //del
        endTime: '' //del
      },
      //课表请求参数
      searchData: {
        secId: '', //学段
        gradeId: '', //年级
        classId: '', //班级
        personId: '', //人员
        teachWeekId: '', //教学周
        stuCourseId: undefined //课程id
      },
      //课程下拉相关数据
      optionDisabled: false,
      stuCourseName: '',
      courseList: [],
      nowSemester: {}
    };
  },
  computed: {
    ...mapState("stuCgLes", ["searchDataAll"]),
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
    if (this.searchDataAll.secId && this.searchDataAll.gradeId && this.searchDataAll.classId && this.searchDataAll.personId) {
      Object.assign(this.searchData, this.searchDataAll)
      console.log(this.searchData);
      this.skeletonLoading = false;
      //2.查询学生是否有课表
      await this.getHaveTimetable()
      //3.如果有课表，初始化周次时间，课程下拉，初始化表格内容显示隐藏
      this.init()
    } else {
      this.showStuModal()
    }
  },
  methods: {
    init() {
      if (this.isHave) {
        this.getplaceCourseList()
        this.getWeek()
        this.filterText()
      }
    },
    disabledDate(current) {
      return moment(this.nowSemester.semesterEndTime) < current || current < moment(this.nowSemester.semesterStartTime)
    },
    //新建学生之后的初始化操作
    async addCommit() {
      this.searchData.stuCourseId = undefined
      await this.getHaveTimetable()
      this.init()
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
          //   this.week = moment(new Date())
          // } else {
          //   this.week = moment(this.nowSemester.semesterEndTime)
          // }
          this.week = moment(this.nowSemester.defaultTime) ? moment(this.nowSemester.defaultTime) : moment(new Date());
        }
      }
      this.dateChange()
    },
    showStuModal() {
      this.$refs.StuModal.showModal()
    },
    //接收弹窗的对象id，数组
    async partObj(item) {
      Object.assign(this.searchData, item)
      this.$refs.FilterStu.receive()
      await this.getHaveTimetable()
      this.skeletonLoading = false;
      //如果有课表，初始化周次时间，课程下拉，初始化表格内容显示隐藏
      this.init()
    },
    //打开调整记录弹窗
    openRecord() {
      let data = {
        changeType: '5'
        // personId: this.searchData.personId,
        // secId: this.searchData.secId
      }
      this.$refs.RecordModal.showModal(data)
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
      this.courseList.map(item => {
        if (item.courseId === this.searchData.stuCourseId) {
          this.stuCourseName = item.courseName
        }
      })
      console.log(this.stuCourseName);
      // this.searchData.stuCourseId=value
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
    async filterTimetable(item) {
      Object.assign(this.searchData, item)
      await this.getHaveTimetable()
      this.courseList = []
      this.searchData.stuCourseId = undefined
      this.init()
    },
    //创建学生课表
    addTimeTable() {
      this.getCgableCourseList('1')
    },
    //学生换课
    saveTimeTable() {
      if (this.searchData.stuCourseId) {
        this.getCgableCourseList('2')
      } else {
        this.$message.warning('请先选择学生课程')
      }
    },
    //接口请求
    //获取学生是否有课表
    async getHaveTimetable() {
      const res = await this.$api.studentAdjustment.getHaveTimetable({
        'studentId': this.searchData.personId,
        'classId': this.searchData.classId
      });
      if (res.code === '200' && res.result) {
        this.isHave = res.data
        if (this.isHave) {
          this.searchData.stuCourseId = ''
        }
      }
    },
    //获取课表数据
    async getPlaceTimetable() {
      this.tableLoading = true
      try {
        const res = await this.$api.common.getStuTimetable(
          this.searchData
        );
        if (res.code === "200" && res.result) {
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
    //获取学生的课程
    async getplaceCourseList() {
      const res = await this.$api.studentAdjustment.getStuCoureseList({ 'personId': this.searchData.personId });
      if (res.code === '200' && res.result) {
        this.courseList = res.data
        // if(res.data.length>0){
        //   this.searchData.stuCourseId=this.courseList[0].stuCourseId
        // }
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
        }
      }
    },
    //获取可换课课程列表
    async getCgableCourseList(type) {
      const res = await this.$api.studentAdjustment.getCgableCourseList(
        { 
          'classId': this.searchData.classId, 
          'electiveClass': this.searchData.stuCourseId 
        });
      if (res.code === '200' && res.result) {
        if (res.data.length > 0) {
          this.$refs.SelectCourseModal.showModal(res.data, type, this.stuCourseName)
        } else {
          if (type === '1') {
            this.isHave = true
            this.init()
          } else {
            this.$message.warning('所在班级没有可以换的课程，如需换课请调换所在班级')
          }
        }
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.cb-subhead{
  margin-left: 10px;
  padding-top: 3px;
  font-size: 12px;
  color: #797c7f;
}
.cb-p-empty {
  width: 100%;
  background-color: white;
  height: calc(100vh - 194px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>