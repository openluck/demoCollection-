<template>
  <div class="statistic">
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="当前机构">
        <currentOrg />
      </a-tab-pane>
      <a-tab-pane key="2" tab="下级机构" force-render>
        <LowerOrg />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
const columns = [
  {
    title: '变更项名称',
    dataIndex: 'updateName',
    key: 'updateName',
    width: '20%',
    align: 'center',
  },
  {
    title: '变更项申请总次数',
    dataIndex: 'totalNumber',
    key: 'totalNumber',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'totalNumber' },
  },
  {
    title: '已审核变更项申请次数',
    children: [
      {
        title: '已修改变更项申请次数',
        key: 'changedApplyNumber',
        dataIndex: 'changedApplyNumber',
        align: 'center',
        scopedSlots: { customRender: 'changedApplyNumber' },
      },
      {
        title: '待修改变更项申请次数',
        key: 'toChangeApplyNumber',
        dataIndex: 'toChangeApplyNumber',
        align: 'center',
        scopedSlots: { customRender: 'toChangeApplyNumber' },
      },
    ],
  },
  {
    title: '待审核变更项次数',
    dataIndex: 'toAuditChangeItem',
    key: 'toAuditChangeItem',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'toAuditChangeItem' },
  },
]
const LowerColumns = [
  {
    title: '变更项名称',
    dataIndex: 'orgName',
    key: 'orgName',
    align: 'center',
  },
  {
    title: '考生姓名',
    dataIndex: 'examineeName',
    key: 'examineeName',
    align: 'center',
  },
  {
    title: '邮寄地址',
    dataIndex: 'postAddress',
    key: 'postAddress',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'IdNumber',
    key: 'IdNumber',
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
    title: '民族',
    dataIndex: 'national',
    key: 'national',
    align: 'center',
  },
  {
    title: '政治面貌',
    dataIndex: 'politicalLandscape',
    key: 'politicalLandscape',
    align: 'center',
  },
  {
    title: '应往届',
    dataIndex: 'previousOrCurrent',
    key: 'previousOrCurrent',
    align: 'center',
  },
  {
    title: ' 考生评语	',
    dataIndex: 'examineeReviews',
    key: 'examineeReviews',
    align: 'center',
  },
]
import currentOrg from './components/currentOrg'
import LowerOrg from './components/LowerOrg'

export default {
  components: { currentOrg, LowerOrg },
  data () {
    return {
      changeItemConditionList: [], //变更项查询条件列表
      changeItemCondition: '', //变更项值
      tableHeight: null,
      screenHeight: null,
      columns,
      tableLoading: false,
      dataSource: [],
      commitOrgList: [], // 提交机构列表
      commitOrgId: '', //提交机构Id
      commitOrgName: '', //提交机构名称
      OrgName: '', //暂存commitOrgName
      curUserOrgId: '', //当前登录用户所属机构
      curUserOrgName: '',
      addrList: [], //面包屑地址数组
      addr: '', //面包屑地址字符串
      fetchData: {
        // pageSize: 20,
        // current: 1,
      },
      // pagination: {
      //   current: 1,
      //   defaultPageSize: 20,
      //   showSizeChanger: false, // 显示可改变每页数量
      //   showQuickJumper: true, // 是否可以快速跳转至某页
      //   showTotal: (total, range) =>
      //     `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
      //   onChange: this.onPageChange.bind(this), // 点击页码事件
      //   total: 0, // 总条数
      //   size: 'middle',
      //   pageSizeOptions: ['2', '5', '10', '20', '50'], // 每页数量选项
      //   buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
      //   onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      // }, // table的分页器

      LowerColumns,
    }
  },
  watch: {
    // 监听屏幕高度
    screenHeight (val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 300
    },
  },
  created () {
    this.curUserOrgId = JSON.parse(sessionStorage.getItem('userInfo')).orgId
    this.curUserOrgName = JSON.parse(sessionStorage.getItem('userInfo')).orgName
  },
  mounted () {
    this.commitOrgList = JSON.parse(sessionStorage.getItem('commitOrgList'))
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    // this.getChangeItemConditionList()
    // this.getAlterCommitOrgList()
    // this.getAlterStatList()
  },
  methods: {
    tabChange (e) {
      console.log(e, 'eeee')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 获取某个对象数组某一项的和
    getArrayObjAdd (data, objName) {
      let sum = 0
      data.map((item) => {
        sum += Number(item[objName])
      })
      return sum
    },
    search () {
      this.commitOrgName = this.orgName
      // this.getAlterStatList()
    },

    // 跳转变更项考生列表
    toDetailList (type, record) {
      this.$router.push({
        name: 'ModifyExamineeItemList',
        query: {
          type: type,
          updateKey: record.updateKey,
          commitOrgId: this.commitOrgId ? this.commitOrgId : this.curUserOrgId,
        },
      })
    },
    /**********************************************************/

    // // 获取提交机构树列表
    // async getAlterCommitOrgList() {
    //   const res = await this.$api.ModifyStatistic.getAlterCommitOrgList()
    //   let data = res.data.list
    //   console.log(res.data.list, 'list')
    //   if (res.code === '200') {
    //     data.map((item) => {
    //       item['id'] = item['orgId']
    //       item['pId'] = item['parentId']
    //       item['title'] = item['orgName']
    //       item['value'] = item['orgId']
    //     })
    //     this.commitOrgList = [...data]
    //     console.log(this.commitOrgList, '机构列表')
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // },
    // // 提交机构改变事件
    // commitOrgChange(val, label, extra) {
    //   if (val) {
    //     this.orgName = extra.triggerNode.dataRef.orgName
    //     this.addrList = []
    //     this.dealBread(val)
    //     this.addr = this.addrList.reverse().join(' / ')
    //   } else {
    //     this.addrList = []
    //     this.addr = ''
    //   }
    // },
    // dealBread(orgId) {
    //   let a = this.commitOrgList.find((item) => item.orgId === orgId)
    //   this.addrList.push(a.orgName)
    //   if (a.parentId && a.orgId !== this.curUserOrgId) {
    //     this.dealBread(a.parentId)
    //   }
    // },
    // // 获取变更项查询条件
    // async getChangeItemConditionList() {
    //   const res = await this.$api.ModifyItemStatistic.getChangeItemConditionList()
    //   if (res.code === '200') {
    //     this.changeItemConditionList = [...res.data.list]
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // },
    // 变更项变化事件
    // changeItemChange (e) {
    //   console.log(e)
    // },
    /**********************************************************/

    // 获取变更统计列表
    // async getAlterStatList () {
    //   const data = {
    //     commitOrg: this.commitOrgId ? this.commitOrgId : this.curUserOrgId,
    //     current: this.fetchData.current,
    //     pageSize: this.fetchData.pageSize,
    //     updateKey: this.changeItemCondition,
    //   }
    //   this.tableLoading = true
    //   const res = await this.$api.ModifyItemStatistic.getStatisticChangeItemList(
    //     data
    //   )
    //   if (res.code === '200') {
    //     this.dataSource = [...res.data.list]
    //     this.tableLoading = false
    //   } else {
    //     this.tableLoading = false
    //     this.$message.error(res.message)
    //   }
    // },
    // // 表格页面改变事件
    // onPageChange (page) {
    //   this.pagination.current = page
    // },
    // // 改变每页数量时更新显示
    // onShowSizeChangeMethod (i, pageSize) {
    //   this.fetchData.pageSize = pageSize
    //   this.pagination.current = 1
    //   this.fetchData.current = 1
    // },
  },
}
</script>

<style lang="less" scoped>
.statistic {
  padding: 0 16px 16px 16px;
  .select {
    margin-bottom: 8px;
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
