<template>
  <div class="statistic">
    <div class="select">
      <a-form layout="inline">
        <a-form-item label="所属机构">
          <a-tree-select
            :tree-data="affiliationList"
            tree-data-simple-mode
            :allowClear="true"
            :replaceFields="{
              children: 'children',
              title: 'title',
              key: 'key',
              value: 'value',
            }"
            v-model="affiliationId"
            @change="affiliationChange"
            style="width: 160px"
            :dropdownStyle="{ 'max-height': '60vh' }"
            placeholder="请选择~"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-select
            :showSearch="true"
            :allowClear="true"
            :filter-option="filterOption"
            v-model="sex"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in sexList"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="民族">
          <a-select
            :showSearch="true"
            :allowClear="true"
            :filter-option="filterOption"
            v-model="national"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in nationalList"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="科类">
          <a-select
            :showSearch="true"
            :allowClear="true"
            :filter-option="filterOption"
            v-model="subject"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in subjectList"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="选考专项">
          <a-select
            :showSearch="true"
            :allowClear="true"
            :filter-option="filterOption"
            v-model="optionalExamItem"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in optionalExamItemList"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search('cx')">
            <svg-icon
              icon-class="sousuo"
              class="icon_item"
              style="margin-right:6px;font-size:12px"
            ></svg-icon
            >查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-divider />
    <div class="breadLine">
      <div class="bread">
        <a-breadcrumb v-if="addrList.length">
          <a-breadcrumb-item v-for="item in addrList" :key="item.orgId">
            <a @click="backTo(item)">{{ item.orgName }}</a>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-breadcrumb v-else>
          <a-breadcrumb-item>{{ curUserOrgName }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="keyword">
        <a-form layout="inline">
          <a-form-item label="考生信息">
            <a-input
              style="width:360px;"
              v-model="keyWords"
              placeholder="请输入考生报名号/身份证号/考生姓名"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search('ss')">
              <svg-icon
                icon-class="sousuo"
                class="icon_item"
                style="margin-right:6px;font-size:12px"
              ></svg-icon
              >搜索
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :loading="tableLoading"
      :data-source="dataSource"
      :row-key="(record) => record.commitOrgId"
      bordered
      size="middle"
      :scroll="{ y: tableHeight }"
      :rowClassName="
        (record, index) => {
          return (index % 2 === 1 ? 'even-row' : '') + ' all'
        }
      "
    >
      <span slot="operation" slot-scope="text, record">
        <a-button @click="goDetail(record)">查看</a-button>
      </span>
    </a-table>
    <LookExamineeRegInfo ref="LookExamineeRegInfo" />
  </div>
</template>

<script>
import LookExamineeRegInfo from '../../WorkOrderApply/ExamineeRegInfo/LookExamineeRegInfo'
const columns = [
  {
    title: '报名号',
    dataIndex: 'bmh',
    key: 'bmh',
    align: 'center',
  },
  {
    title: '报名点',
    dataIndex: 'bmd',
    key: 'bmd',
    align: 'center',
  },
  {
    title: '考生姓名',
    dataIndex: 'examineeName',
    key: 'examineeName',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'IdNumber',
    key: 'IdNumber',
    width: 200,
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 80,
    align: 'center',
  },
  {
    title: '出生日期',
    dataIndex: 'birthDay',
    key: 'birthDay',
    align: 'center',
  },
  {
    title: '民族',
    dataIndex: 'national',
    key: 'national',
    align: 'center',
  },
  {
    title: '户籍性质',
    dataIndex: 'registerNature',
    key: 'registerNature',
    align: 'center',
  },
  {
    title: '科类',
    dataIndex: 'subject',
    key: 'subject',
    align: 'center',
  },
  {
    title: '选考专项',
    dataIndex: 'optionalExamItem',
    key: 'optionalExamItem',
    align: 'center',
  },
  {
    title: '考试类型',
    dataIndex: 'examType',
    key: 'examType',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  components: { LookExamineeRegInfo },
  data() {
    return {
      tableHeight: null,
      screenHeight: null,
      columns,
      tableLoading: false,
      dataSource: [],
      affiliationList: [], // 所属机构列表
      affiliationId: '', //所属机构Id
      affiliationName: '', //所属机构名称
      OrgName: '', //暂存commitOrgName
      curUserOrgId: '', //当前登录用户所属机构
      curUserOrgName: '',
      addrList: [], //面包屑地址数组
      fetchData: {
        pageSize: 10,
        current: 1,
      },
      keyWords: '',
      pagination: {
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: true, // 是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), // 点击页码事件
        total: 0, // 总条数
        size: 'middle',
        pageSizeOptions: ['2', '5', '10', '20', '50'], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      sexList: [],
      sex: '',
      nationalList: [],
      national: '',
      subjectList: [],
      subject: '',
      optionalExamItemList: [],
      optionalExamItem: '',
    }
  },
  watch: {
    // 监听屏幕高度
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 300
    },
  },
  created() {
    this.curUserOrgId = JSON.parse(sessionStorage.getItem('userInfo')).orgId
    // this.curUserOrgName = JSON.parse(
    //   sessionStorage.getItem("userInfo")
    // ).orgName;
  },
  mounted() {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    this.getAffiliationTree()
    this.getExamineeRegInfoCode()
    this.getApplyDataList()
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    search(type) {
      this.commitOrgName = this.orgName
      this.getApplyDataList(type)
    },

    // 跳转变更项考生列表
    goDetail(record) {
      const data = {
        wkId: record.wkId,
        bmh: record.bmh,
        type: 'look',
        status: true,
      }
      this.$refs.LookExamineeRegInfo.showModal(data)

      // this.$router.push({
      //   path: '/WorkOrderApply/LookExamineeRegInfo',
      //   query: {
      //     wkId: record.wkId,
      //     bmh: record.bmh,
      //     type: 'look',
      //     status: true,
      //   },
      // })
    },
    /***********************************************************/
    // 获取码表
    async getExamineeRegInfoCode() {
      const res = await this.$api.WorkOrderApply.getExamineeRegInfoCode({})
      let data = res.data
      if (res.code === '200') {
        this.sexList = data.xb
        this.nationalList = data.mz
        this.subjectList = data.kldm
        this.optionalExamItemList = data.xkzx
      } else {
        this.$message.error(res.message)
      }
    },

    /**********************************************************/
    //点击面包屑事件
    backTo(item) {
      this.affiliationId = item.orgCode
      this.affiliationChange(item.orgCode, item.orgName)
      this.getApplyDataList()
    },

    // 获取所属机构树
    async getAffiliationTree() {
      const res = await this.$api.ApplyDataSearch.getAffiliationTree()
      let data = res.data.list
      if (res.code === '200') {
        data.map((item) => {
          item['id'] = item['orgCode']
          item['pId'] = item['parentCode']
          item['title'] = `[${item['orgCode']}] ${item['orgName']}`
          item['value'] = item['orgCode']
        })
        this.affiliationList = [...data]
        this.curUserOrgName = this.affiliationList[0].orgName
        this.affiliationId = this.affiliationList[0].orgCode
      } else {
        this.$message.error(res.message)
      }
    },
    // 所属机构改变事件
    affiliationChange(val, label) {
      if (val) {
        // this.orgName = extra.triggerNode.dataRef.orgName
        this.orgName = label
        this.affiliationId = val
        this.affiliationName = label
        this.addrList = []
        this.dealBread(val)
        this.addrList = this.addrList.reverse()
      } else {
        this.addrList = []
      }
    },
    dealBread(orgCode) {
      let a = this.affiliationList.find((item) => item.orgCode === orgCode)
      this.addrList.push(a)
      // if (a.orgType !== '1') {
      //   this.dealBread(a.parentCode)
      // }
      let accountName = JSON.parse(sessionStorage.getItem('userInfo'))
        .accountName
      if (a.orgCode !== accountName) {
        this.dealBread(a.parentCode)
      }
    },
    /**********************************************************/

    // 获取报名数据列表
    async getApplyDataList(type = 'ss') {
      const data = {
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize,
        affiliationId: this.affiliationId,
        // commitOrg: this.commitOrgId ? this.commitOrgId : this.curUserOrgId,
        sexId: this.sex,
        nationalId: this.national,
        subjectId: this.subject,
        optionalExamItemId: this.optionalExamItem,
        keyWords: type === 'ss' ? this.keyWords : '',
      }
      this.tableLoading = true
      const res = await this.$api.ApplyDataSearch.getApplyDataList(data)
      if (res.code === '200') {
        this.dataSource = [...res.data.list]
        this.pagination.total = res.data.pagination.total
        this.tableLoading = false
      } else {
        this.tableLoading = false
        this.$message.error(res.message)
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page
      this.fetchData.current = page
      this.getApplyDataList()
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize
      this.pagination.current = 1
      this.fetchData.current = 1
      this.getApplyDataList()
    },
  },
}
</script>

<style lang="less" scoped>
.statistic {
  padding: 16px;
  .ant-divider-horizontal {
    margin: 8px 0;
  }
  .select {
    margin-bottom: 8px;
  }
  .breadLine {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // margin-bottom: 8px;
    .bread {
      .ant-breadcrumb {
        height: 40px;
        line-height: 40px;
      }
    }
  }
  /deep/ .even-row {
    background-color: #f7f8fa;
  }
  /deep/.ant-table-footer {
    padding: 8px 0px;
    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      .text {
        width: 19%;
        text-align: center;
        font-weight: 600;
      }
    }
  }
  /deep/.ant-table-pagination {
    text-align: left;
  }
}
</style>
