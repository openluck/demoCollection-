<!--
 * @Description: 删除课程主页面
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-12 14:29:17
 * @LastEditors: cb
 * @LastEditTime: 2021-10-15 11:46:29
-->
<template>
  <div class="cb-container">
    <div class="common-title">删除课程</div>
    <a-skeleton :loading="skeletonLoading">
    </a-skeleton>
    <div v-show="!skeletonLoading"
      class="cb-p-filter">
      <div>
        <FilterDelCouese ref="FilterDelCouese"
          @filterTimetable='filterTimetable' />
      </div>
      <div class="cb-p-btn">
        <a-button @click="openRecord">
          <svg-icon icon-class="com_adjust_record"
            :scale="0.8"
            style="margin-right:8px"></svg-icon>
          操作记录
        </a-button>
        <a-button style="background:#f28955;border-color:#f28955"
          @click="adjustment($event)"
          type="primary">
          <svg-icon icon-class="com_close"
            :scale="0.8"
            style="margin-right:8px;color:#fff"></svg-icon>
          删除课程
        </a-button>
        <a-button type="primary"
          @click="ApplyOtherWeek">
          <svg-icon icon-class="com_apply"
            :scale="0.8"
            style="margin-right:8px;"></svg-icon>
          应用于其他周次
        </a-button>
      </div>
    </div>
    <div v-show="!skeletonLoading"
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

      <!-- 条件过滤 -->
      <a-checkbox-group :options="options"
        style="margin-left: 49px;"
        :value="filterValue"
        @change="onChange" />
    </div>
    <!-- 课表 -->
    <div v-show="!skeletonLoading"
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
    <DeleteCoueseModal @partObj='partObj'
      ref="DeleteCoueseModal" />
    <RecordModal ref="RecordModal" />
    <ApplyOtherWeek ref="ApplyOtherWeek" />
  </div>
</template>
 
<script>
import { mapState } from "vuex";
import TableCell from "./DeleteCoueseChild/TableCell";
import FilterDelCouese from "./DeleteCoueseChild/FilterDelCouese";
import DeleteCoueseModal from "./DeleteCoueseChild/DeleteCoueseModal";
import ApplyOtherWeek from "@/components/common/ApplyOtherWeek";
import RecordModal from "@/components/common/RecordModal";
import moment from 'moment'
import { getWeekInTime } from '@/Utils/util'
const treeData = [
  {
    title: '逸夫楼',
    value: '0-0',
    key: '0-0',
    disabled: true,
    children: [
      {
        title: '逸夫楼302室',
        value: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '希望楼',
    value: '0-1',
    key: '0-1'
  }
];
const options = [
  { label: '科目', value: '1' },
  { label: '场所', value: '2' },
  { label: '教师', value: '3' },
  { label: '班级', value: '4' },
  { label: '时间', value: '5' }
];
export default {
  components: { TableCell, FilterDelCouese, DeleteCoueseModal, RecordModal, ApplyOtherWeek },
  name: "",
  data() {
    return {
      treeData, //场所树
      options, //筛选项
      timetableData: [], //课表数据
      skeletonLoading: true,
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
        startTime: '',
        endTime: ''
      },
      //课表请求参数
      searchData: {
        secId: '',
        gradeId: '',
        personId: '',
        classId: "",
        placeId: '',
        teachWeekId: ""
      },
      nowSemester: {}
    };
  },
  computed: {
    ...mapState("deleteCouese", ["searchDataAll"]),
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
  mounted() {
    this.nowSemester = JSON.parse(sessionStorage.getItem('nowSemester'))
    this.searchData.schoolYearId = this.nowSemester.schoolYearId
    this.searchData.semesterId = this.nowSemester.semesterId
    if (this.searchDataAll.secId) {
      this.searchData.secId = this.searchDataAll.secId
      this.searchData.gradeId = this.searchDataAll.gradeId
      this.searchData.classId = this.searchDataAll.classId
      this.searchData.personId = this.searchDataAll.personId
      this.searchData.placeId = this.searchDataAll.placeId
      this.skeletonLoading = false;
      this.init()
    } else {
      this.$refs.DeleteCoueseModal.showModal()
    }
  },
  methods: {
    init() {
      //初始化获取周次时间
      this.getWeek()
      //初始化表格内容显示隐藏
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
          //   this.week = moment(new Date())
          // } else {
          //   this.week = moment(this.nowSemester.semesterEndTime)
          // }
          this.week = moment(this.nowSemester.defaultTime) ? moment(this.nowSemester.defaultTime) : moment(new Date());
        }
      }
      this.dateChange()
    },
    //选择日期
    async dateChange() {
      let startDate = moment(this.week).startOf('week').format('YYYY-MM-DD');
      let endDate = moment(this.week).endOf('week').format('YYYY-MM-DD');
      this.date.startTime = startDate
      this.date.endTime = endDate
      await this.getTeachWeekByDate(startDate, endDate)
      //获取课表数据
      if (this.searchDataAll.typeId === '1') { //班级
        this.getClassTimetable()
      } else if (this.searchDataAll.typeId === '2') { //教师
        this.getStuTimetable()
      } else { //场所
        this.getPlaceTimetable()
      }
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
    //接收弹窗的对象id，数组
    async partObj(item) {
      Object.assign(this.searchData, item)
      this.$refs.FilterDelCouese.receive()
      this.skeletonLoading = false;
      this.init()
    },
    async filterTimetable(item) {
      Object.assign(this.searchData, item)
      this.init()
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
    adjustment(e) {
      e.stopPropagation()
      let arr = []
      for (let i = 0; i < this.timetableData.length; i++) {
        const obj = this.timetableData[i];
        for (let j = 0; j < this.slotList.length; j++) {
          const week = this.slotList[j];
          if (obj[week] && obj[week].lesList) {
            for (let k = 0; k < obj[week].lesList.length; k++) {
              const item = obj[week].lesList[k];
              if (item.isSelect) {
                arr.push(item.lesId)
              }
            }
          }
        }
      }
      if (arr.length === 0) {
        this.$message.warning('请先选择课堂')
        return
      }
      this.$confirm({
        title: (
          <p>
            确定要删除该课程吗?
          </p>
        ),
        okText: '确定删除',
        cancelText: '取消',
        onOk: (e) => {
          this.deleteCouese(arr, e)
        },
        onCancel() { }
      })
    },
    //打开调整记录弹窗,传入查询参数即可
    openRecord() {
      let data = {
        changeType: '7'
        // personId: this.searchData.personId,
        // classId: this.searchData.classId,
        // placeId: this.searchData.placeId
        // teachWeekId: this.searchData.teachWeekId
      }
      this.$refs.RecordModal.showModal(data)
    },
    //打开应用到其他周次弹窗,传入查询参数即可
    ApplyOtherWeek() {
      if (this.timetableData.length === 0) {
        this.$message.warning('暂无课表！')
        return
      }
      this.$refs.ApplyOtherWeek.showModal();
      const params = {
        changeType: 4 //1. 周内调课  2. 代课 3 场所调课 4. 取消课程
      };
      Object.assign(params, this.searchData)
      this.$refs.ApplyOtherWeek.initExParam(params);
    },
    //接口请求
    //获取场所课表数据
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
    //获取人员课表数据
    async getStuTimetable() {
      this.tableLoading = true
      try {
        const res = await this.$api.common.getStuTimetable(this.searchData);
        if (res.code === '200' && res.result) {
          this.timetableData = res.data.sort((a, b) => a.lesSortIndex - b.lesSortIndex)
          this.gethb()
          this.tableLoading = false
          this.slotDay = getWeekInTime(this.week)
        } else {
          this.$message.warning(res.message)
          this.tableLoading = false
        }
      } catch {
        this.tableLoading = false
      }
    },
    //获取班级课表数据
    async getClassTimetable() {
      this.tableLoading = true

      try {
        const res = await this.$api.common.getClassTimetable(this.searchData);
        if (res.code === '200' && res.result) {
          this.timetableData = res.data.sort((a, b) => a.lesSortIndex - b.lesSortIndex)
          this.gethb()
          this.tableLoading = false
          this.slotDay = getWeekInTime(this.week)
        } else {
          this.$message.warning(res.message)
          this.tableLoading = false
        }
      } catch {
        this.tableLoading = false
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
      console.log(data);
      const res = await this.$api.common.getTeachWeekByDate(data);
      if (res.code === "200" && res.result) {
        this.teachWeek = res.data
        this.searchData.teachWeekId = res.data.teachWeekId
      }
    },
    //删除课程
    async deleteCouese(arr, e) {
      let data = {
        lesIdList: arr
      }
      Object.assign(data, this.searchData)
      const res = await this.$api.deleteCouese.abolishACourse(data);
      if (res.code === "200" && res.result) {
        this.$message.success('操作成功')
        e()
        this.init()
      } else {
        e()
        this.$message.warning(res.message)
      }
    }
  }
};
</script>
 
<style  lang = "less">
</style>