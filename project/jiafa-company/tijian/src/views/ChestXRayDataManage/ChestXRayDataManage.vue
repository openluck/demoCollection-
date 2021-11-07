<template>
  <div class="ChestXRayDataManage">
    <div class="ChestXRayDataManageT">
      <div class="ChestXRayDataManageTL">
        <div class="conditionOrg">
          <div>机构 ：</div>
          <div>
            <a-select v-model="search.orgCode" @change="orgChange" style="width: 180px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option
                v-for="(item, index) in orgList"
                :key="index"
                :value="item.orgCode"
                :title="item.orgName"
              >
                {{ item.orgName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="conditionOrg">
          <div>参检日期 ：</div>
          <div>
            <!-- <a-date-picker :inputReadOnly='true' :allowClear='false'  style="width: 120px" v-model="search.date">
              <template slot="dateRender" slot-scope="current, today">
                <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                  {{ current.date() }}
                </div>
              </template>
            </a-date-picker> -->
           <div>
            <a-select v-model="search.date" @change="dateChange" style="width: 120px">
               <a-select-option value="">全部</a-select-option>
              <a-select-option
                v-for="(item, index) in dateList"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          </div>
        </div>
        <div class="conditionOrg">
          <div>胸透结果 ：</div>
          <div>
            <a-select v-model="search.xrayResult" style="width: 120px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="2">其他</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="conditionOrg">
          <div>科室状态 ：</div>
          <div>
            <a-select v-model="search.deskSta" style="width: 120px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="1">已体检</a-select-option>
              <a-select-option value="2">未体检</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="conditionOrg">
          <div>是否下结论 ：</div>
          <div>
            <a-select v-model="search.isResult" style="width: 120px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="1">已下结论</a-select-option>
              <a-select-option value="2">未下结论</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="searchBtn">
          <a-button @click="searchList('1')" type="primary"> 查 询 </a-button>
        </div>
      </div>
      <div class="conditionOrgr">
        <div class="conditionOrg">
          <div style="width: 60px"></div>
          <div>
            <a-input
              v-model="search.keyWord"
              placeholder="考生号/姓名/身份证号"
              allow-clear
              style="width: 220px; margin-right: 10px"
            />
          </div>
        </div>
        <div class="searchBtn">
          <a-button @click="searchList('2')" type="primary"> 搜 索 </a-button>
        </div>
      </div>
    </div>
    <div class="ChestXRayDataManageB">
      <div class="export">
        <a-popconfirm
            :title="commitTitle"
            ok-text="确定"
            cancel-text="取消"
            @confirm="label"
          >
        <a-button  type="primary">
          <svg-icon icon-class="tijiao" :scale="0.8" style="margin-right: 5px"></svg-icon
          >批量提交未体检考生
        </a-button>
         </a-popconfirm>
      </div>
      <div class="toDay">
        <div class="item">
          {{ this.today.date }}体检考生：<span class="num"
            >{{ this.today.toDayNum }}人</span
          >
        </div>
        <div class="item">
          本科室已体检人数：<span class="num">{{ this.today.checkUp }}人</span>
        </div>
        <div class="item">
          本科室未体检人数：<span class="num">{{ this.today.noCheckUp }}人</span>
        </div>
      </div>
    </div>

    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.examNum"
        bordered
        :pagination="false"
        :scroll="{ x: 2350, y: tableHeight }"
        :loading="tableLoading"
      >
        <div slot="XRayResult" slot-scope="text">
          <p v-if="text === '1'">正常</p>
          <p v-else-if="text === '2'">其他</p>
          <p v-else>-</p>
        </div>
        <div slot="action"  slot-scope="text, record">
          <a-button :record="record" @click="vision(record)" >{{ record.examState === "未下结论" ? "编辑" : "详情" }}</a-button>
          <a-button  style="margin-left:10px" :record="record" :disabled='filterDisabled(record)' @click="markUndetected(record.examNum)" >标记未体检</a-button>
        </div>
        
        
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
    <a-modal
      v-model="visibleXRay"
      wrapClassName="ChestXRay"
      title="编辑"
      :footer="null"
      width="700px"
    >
      <div class="modalTitle">学生基本信息</div>
      <div class="studentInfo">
        <div class="infoItem" style="width: 100%">考生号：{{ studentItem.examNum }}</div>
        <div class="infoItem" style="width: 50%">
          考生姓名：{{ studentItem.examName }}
        </div>
        <div class="infoItem" style="width: 50%">性别：{{ studentItem.sex }}</div>
        <div class="infoItem" style="width: 50%">
          区县名称：{{ studentItem.areaName }}
        </div>
        <div class="infoItem" style="width: 50%">
          体检医院：{{ studentItem.hospitalName }}
        </div>
        <div class="infoItem" style="width: 50%">
          报名点名称: {{ studentItem.assignsName }}
        </div>
        <div class="infoItem" style="width: 50%">班级：{{ studentItem.class }}</div>
      </div>
      <div class="modalTitle">肝功能</div>
      <div class="XRayForm">
        <div class="XRayFormItem">
          <div style="margin-right: 20px">胸 透 :</div>
          <a-radio-group
            :disabled="modelDisadled"
            v-model="studentItem.XRayResult"
            @change="radioChange"
          >
            <a-radio value="1"> 正常 </a-radio>
            <a-radio value="2"> 其他 </a-radio>
          </a-radio-group>
        </div>
        <div class="XRayFormItem">
          <div style="margin-right: 20px">其 他 :</div>
          <a-textarea
            :disabled="disabled"
            v-model="studentItem.XRayOthor"
            style="width: 500px"
            :auto-size="{ minRows: 1, maxRows: 2 }"
          />
        </div>
      </div>
      <div class="modalTitle">医师意见</div>
      <div class="XRayForm">
        <!-- <a-radio-group :disabled="disabled" v-model="studentItem.doctorOptionId" @change="radioChangeDoctor">
          <a-radio v-for="item in options" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-radio>
        </a-radio-group> -->
        <a-checkbox-group :disabled="disabled" v-model="doctorOptionIds" @change="radioChangeDoctor">
          <a-checkbox v-for="item in options" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-checkbox>
        </a-checkbox-group>
      </div>
      <div style="border-bottom: 1px solid #e6ecf2"></div>
      <div>
        <div class="modalDoctor">
          <div>
            <!-- <a-input
              :disabled="modelDisadled"
              v-model="studentItem.doctorName"
              style="width: 150px; margin-right: 20px"
              placeholder="总检医生"
            /> -->
             <div style="margin-right: 50px" v-if="studentItem.doctorName">总检医生 : {{studentItem.doctorName}}</div>
          </div>
         <span v-if=" studentItem.verifyTime">确认时间 :</span>  {{ studentItem.verifyTime }}
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: center">
        <a-button
          style="margin-right: 10px"
          type="primary"
          :disabled="modelDisadled"
          @click="closeVisibleCommit"
        >
          确认</a-button
        >
        <a-button style="margin-left: 10px" @click="closeVisible">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 200,
    align: "center",
    fixed: "left",
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
    width: 150,
    align: "center",
    fixed: "left",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: 100,
    align: "center",
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    key: "IDNum",
    width: 200,
    align: "center",
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    key: "assignsName",
    width: 300,
    align: "center",
  },
  {
    title: "胸透",
    dataIndex: "XRaySta",
    key: "XRaySta",
    width: 100,
    align: "center",
  },
  {
    title: "胸透检查结果",
    dataIndex: "XRayResult",
    key: "XRayResult",
    width: 150,
    align: "center",
    scopedSlots: { customRender: "XRayResult" },
  },
  {
    title: "胸透其他",
    dataIndex: "XRayOthor",
    key: "XRayOthor",
    width: 200,
    align: "center",
  },

  {
    title: "医生姓名",
    dataIndex: "doctorName",
    key: "doctorName",
    width: 150,
    align: "center",
  },
  {
    title: "参检日期",
    dataIndex: "participateDate",
    key: "participateDate",
    width: 200,
    align: "center",
  },  
  {
    title: "胸透检查日期",
    dataIndex: "date",
    key: "date",
    width: 200,
    align: "center",
  },
  {
    title: "是否下结论",
    dataIndex: "examState",
    key: "examState",
    width: 150,
    align: "center",
  },
  {
    title: "下结论时间",
    dataIndex: "resultTime",
    key: "resultTime",
    width: 200,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "examNum",
    key: "operation",
    fixed: "right",
    width: 210,
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      columns,
      visibleXRay: false,
      tableHeight: 0, //table高度
      modelDisadled: false,
      disabled: false,
      tableLoading: false,
      options: [],
      dataList: [], // 查询列表数据
      dateList: [], //体检日期
      orgList: "",
      search: {
        current: 1, //当前页
        pageSize: 20, //每页条数
        orgCode: "", //机构代码
        deskSta: "", //科室状态id
        isResult: "", //是否下结论
        xrayResult: "", //胸透结果
        date: '', //体检日期
        keyWord: "", //关键字
      },
      today: {
        //今日总情况
        date: "今日",
        toDayNum: "0",
        checkUp: "0",
        noCheckUp: "0",
      },
      doctorOptionIds: [],
      studentItem: {},
      stripTotal: null,
      userCode: "",
      commitTitle: '请确认是否要对当前体检医院范围内全部[胸透]未体检的考生进行批量提交操作？',
      orgTitle: '',
    };
  },
  created() {
    this.orgList = JSON.parse(localStorage.getItem("hospitalOrgList"));
    // this.search.date = moment();
    this.userCode = JSON.parse(sessionStorage.getItem("userInfo")).orgCode;
    this.getDate(this.userCode);
  },
  computed: {},
  mounted() {
    this.getList();
    this.toDay();
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    moment,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 55 - 21 - 20;
    },
    filterDisabled(item) {
      if (item.XRaySta === '已体检' && item.examState === "未下结论") {
        return false
      } else {
        return true
      }
    },
    // dateChange(date, dateString) {
    //   console.log(this.search.date);
    //   if (!this.search.date) {
    //     this.search.date = moment().format("YYYY-MM-DD")
    //   }
    // },
    orgChange(value, e) {
       this.orgTitle = e.componentOptions.propsData.title
      this.changePopTitle()
      if (!value) {
        this.getDate(this.userCode);
      } else {
        this.getDate(this.search.orgCode);
      }
    },
    dateChange() {
      this.changePopTitle()
    },
    changePopTitle() {
      if (!this.orgTitle && !this.search.date) {
        this.commitTitle = '请确认是否要对当前体检医院范围内全部[胸透]未体检的考生进行批量提交操作？'
      } else if (this.orgTitle && this.search.date) {
        this.commitTitle = '请确认是否要对当前体检医院范围内' + this.orgTitle + '下' + this.search.date + '日[胸透]未体检的考生进行批量提交操作？'
      } else if (!this.orgTitle && this.search.date) {
        this.commitTitle = '请确认是否要对当前体检医院范围内' + this.search.date + '日[胸透]未体检的考生进行批量提交操作？'
      } else if (this.orgTitle && !this.search.date) {
        this.commitTitle = '请确认是否要对当前体检医院范围内' + this.orgTitle + '下[胸透]未体检的考生进行批量提交操作？'
      }
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (this.dateList.includes(current.format("YYYY-MM-DD"))) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },
    vision(item) {
      // console.log(item);
      this.studentItem = {};
      this.doctorOptionIds = []
      this.studentItem = JSON.parse(JSON.stringify(item));
      this.doctorOptionIds.push(this.studentItem.doctorOptionId)
      if (item.examState === "已下结论") {
        this.modelDisadled = true;
        this.disabled = true
      } else {
        this.modelDisadled = false;
        this.disabled = false
      }
      if (item.XRayResult === '1') {
        this.disabled = true
      }
        if (this.studentItem.date === '-') {
         this.studentItem.date = ''
      } if (this.studentItem.doctorName === '-') {
         this.studentItem.doctorName = ''
      } if (this.studentItem.resultTime === '-') {
         this.studentItem.resultTime = ''
      } if (this.studentItem.XRayOthor === '-') {
         this.studentItem.XRayOthor = ''
      } 
      // console.log(this.studentItem);
      this.getDoctorOption();
      this.visibleXRay = true;
    },
    closeVisible() {
      this.visibleXRay = false;
    },
    closeVisibleCommit() {
      const data = {
        examNum: this.studentItem.examNum,
        XRayResult: this.studentItem.XRayResult,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        doctorName: this.studentItem.doctorName,
        doctorOptionId: this.studentItem.doctorOptionId,
        XRayOthor: this.studentItem.XRayOthor,
      };
      this.listItemChange(data);
    },
    radioChange(value) {
      this.doctorOptionIds = []
       if (value.target.value === '1') {
        this.studentItem.doctorOptionId = '4'
        this.doctorOptionIds.push('4')
        this.studentItem.XRayOthor = ''
        this.disabled = true
      } else if (value.target.value === '2') {
        this.disabled = false
        this.studentItem.doctorOptionId = ''
      }
    },
    radioChangeDoctor(value) {
      if (value.length > 1) {
        this.doctorOptionIds = []
        this.doctorOptionIds.push(value[1]) 
      }
      this.studentItem.doctorOptionId = this.doctorOptionIds[0]
    },
    async getList() {
      this.tableLoading = true;
      try {
        // let { date } = this.search;
        // if (date) {
        //   date = moment(date).format("YYYY-MM-DD");
        // }
        const res = await this.$api.ChestXRayDataManage.getList(this.search);
        if (res.code === 200) {
          this.dataList = res.data.list;
          this.stripTotal = res.data.pagination.total;
          this.isMounted = true;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    async toDay() {
      try {
        const res = await this.$api.ChestXRayDataManage.toDay({
          date: this.search.date,
        });
        if (res.code === 200) {
          this.today = res.data;
          // console.log(this.today);
          if (this.search.date === moment().format("YYYY-MM-DD")) {
            this.today.date = "今日";
          } else if (!this.search.date) {
            this.today.date = '全部'
          } else {
            this.today.date = this.search.date
          }
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async listItemChange(data) {
      try {
        const res = await this.$api.ChestXRayDataManage.change(data);
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.visibleXRay = false;
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    // 查询或搜索列表内容
    async searchList(type) {
      this.search.type = type;
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;

      if (type === "1") {
        this.search.keyWord = "";
        this.toDay();
      } else if (type === "2") {
        this.search.orgCode = "";
        this.search.date = '';
        this.today.date = "全部";
        this.getDate(this.userCode);
        this.search.xrayResult = "";
        this.search.deskSta = "";
        this.search.isResult = "";
      }

      await this.getList();
      this.$refs.page.returnPageTotal();
    },
    async label() {
      const data = {
        orgCode: this.search.orgCode,
        isResult: this.search.isResult,
        deskSta: this.search.deskSta,
        xrayResult: this.search.xrayResult,
        date: this.search.date,
        keyWord: this.search.keyWord,
      };
      console.log(data);
      try {
        const res = await this.$api.ChestXRayDataManage.label(data);
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.getList();
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getDoctorOption() {
      const data = {
        type: "1",
      };
      try {
        const res = await this.$api.ChestXRayDataManage.getDoctorOption(data);
        if (res.code === 200) {
          this.options = res.data.list;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getDate(code) {
      const data = {
        orgCode: code,
      };
      try {
        const res = await this.$api.ChestXRayDataManage.getMedicalDate(data);
        if (res.code === 200) {
           this.dateList = res.data.Datelist
        //  this.dateList.unshift(moment().format("YYYY-MM-DD"))
        //  this.dateList = [...new Set(this.dateList)]
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    //标记为未体检
    async markUndetected(id) {
      const data = {
        type: 'xt',
        examNum: id
      };
      try {
        const res = await this.$api.ChestXRayDataManage.markUndetected(data);
        if (res.code === 200 || res.code === "200") {
          this.$message.success('操作成功');
          this.getList();
        } else {
          this.$message.error('操作失败');
        }
      } catch (error) {
        // this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>

<style lang="less">
.ChestXRayDataManage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ChestXRayDataManageT {
    width: 100%;
    // height: 34px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .ChestXRayDataManageTL {
      width: 80%;
      display: flex;
      flex-wrap: wrap;
      .conditionOrg {
        margin-right: 20px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
      }
      .searchBtn {
        margin-right: 20px;
        margin-bottom: 5px;
        display: flex;
      }
    }

    .conditionOrgr {
      display: flex;
      height: 100%;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .ChestXRayDataManageB {
    height: 32px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .toDay {
      // width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .item {
        font-size: 14px;
        margin-left: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .num {
          font-weight: 600;
          color: #797c80;
        }
      }
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
}
//新增对话框
.ChestXRay {
  // padding: 0 20px;
  .ant-modal-header {
    display: flex;
    justify-content: flex-start;
  }
  .modalTitle {
    font-size: 16px;
    margin-bottom: 5px;
    color: #565e66;
    font-weight: 600;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #e6ecf2;
  }
  .studentInfo {
    margin: 15px 20px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    width: 100%;
    .infoItem {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .XRayForm {
    width: 100%;
    margin: 15px 20px;
    .XRayFormItem {
      width: 100%;
      margin: 15px 0;
      // height: 30px;
      display: flex;
      align-items: center;
    }
  }
  .modalDoctor {
    margin: 20px 0 30px 20px;
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
