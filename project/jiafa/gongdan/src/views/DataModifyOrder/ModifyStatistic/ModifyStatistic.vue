<template>
  <div class="statistic">
    <div class="select">
      <a-form layout="inline">
        <a-form-item label="提交机构">
          <a-tree-select
            :tree-data="commitOrgList"
            tree-data-simple-mode
            :allowClear="true"
            :replaceFields="{
              children: 'children',
              title: 'title',
              key: 'key',
              value: 'value',
            }"
            @change="commitOrgChange"
            v-model="commitOrg"
            style="width: 160px"
            placeholder="请选择~"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">
            <svg-icon icon-class="sousuo" class="icon_item" style="margin-right:6px;font-size:12px"></svg-icon>查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="dataSource"
      :loading="tableLoading"
      :row-key="(record) => record.commitOrgId"
      bordered
      size="small"
      :scroll="{ y: tableHeight }"
      :rowClassName="
        (record, index) => {
          return (index % 2 === 1 ? 'even-row' : '') + ' all'
        }
      "
    >
      <!-- 已审核工单 -->
      <span slot="auditedWorkOrder" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toOrderList('auditedWorkOrder', record)"
        >{{ text }}</span>
      </span>
      <!-- 已审核学生 -->
      <span slot="auditedExaminee" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toExamineeList('auditedExaminee', record)"
        >{{ text }}</span>
      </span>
      <!-- 待审核工单 -->
      <span slot="toAuditWorkOrder" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toOrderList('toAuditWorkOrder', record)"
        >{{ text }}</span>
      </span>
      <!-- 待审核学生 -->
      <span slot="toAuditExaminee" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toExamineeList('toAuditExaminee', record)"
        >{{ text }}</span>
      </span>
      <!-- 工单合计 -->
      <span slot="workOrderTotal" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toOrderList('workOrderTotal', record)"
        >{{ text }}</span>
      </span>
      <!-- 考生合计 -->
      <span slot="examineeTotal" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toExamineeList('examineeTotal', record)"
        >{{ text }}</span>
      </span>
      <template slot="footer" slot-scope="currentPageData">
        <!-- Footer{{currentPageData}} -->
        <div class="footer">
          <div class="text">合计</div>
          <div class="text">{{ getArrayObjAdd(currentPageData, 'auditedWorkOrder') }}</div>
          <div class="text">{{ getArrayObjAdd(currentPageData, 'auditedExaminee') }}</div>
          <div class="text">{{ getArrayObjAdd(currentPageData, 'toAuditWorkOrder') }}</div>
          <div class="text">{{ getArrayObjAdd(currentPageData, 'toAuditExaminee') }}</div>
          <div class="text">
            {{
            getArrayObjAdd(currentPageData, 'workOrderTotal')
            ? getArrayObjAdd(currentPageData, 'workOrderTotal')
            : 0
            }}
          </div>
          <div class="text">
            {{
            getArrayObjAdd(currentPageData, 'examineeTotal')
            ? getArrayObjAdd(currentPageData, 'examineeTotal')
            : 0
            }}
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '提交机构',
    dataIndex: 'commitOrg',
    key: 'commitOrg',
    // width: '20%',
    align: 'center',
  },
  {
    title: '已审核',
    children: [
      {
        title: '已审核工单',
        key: 'auditedWorkOrder',
        dataIndex: 'auditedWorkOrder',
        align: 'center',
        scopedSlots: { customRender: 'auditedWorkOrder' },
      },
      {
        title: '已审核考生',
        key: 'auditedExaminee',
        dataIndex: 'auditedExaminee',
        align: 'center',
        scopedSlots: { customRender: 'auditedExaminee' },
      },
    ],
  },
  {
    title: '待审核',
    children: [
      {
        title: '待审核工单',
        key: 'toAuditWorkOrder',
        dataIndex: 'toAuditWorkOrder',
        align: 'center',
        scopedSlots: { customRender: 'toAuditWorkOrder' },
      },
      {
        title: '待审核考生',
        key: 'toAuditExaminee',
        dataIndex: 'toAuditExaminee',
        align: 'center',
        scopedSlots: { customRender: 'toAuditExaminee' },
      },
    ],
  },
  {
    title: '合计',
    children: [
      {
        title: '工单合计',
        key: 'workOrderTotal',
        dataIndex: 'workOrderTotal',
        align: 'center',
        scopedSlots: { customRender: 'workOrderTotal' },
      },
      {
        title: '考生合计',
        key: 'examineeTotal',
        dataIndex: 'examineeTotal',
        align: 'center',
        scopedSlots: { customRender: 'examineeTotal' },
      },
    ],
  },
]
export default {
  data () {
    return {
      tableHeight: null,
      screenHeight: null,
      columns,
      tableLoading: false,
      dataSource: [],
      commitOrgList: [], // 提交机构列表
      commitOrg: '',
      commitOrgId: '',
      fetchData: {
        pageSize: 20,
        current: 1,
      },
      pagination: {
        current: 1,
        defaultPageSize: 20,
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
    }
  },
  watch: {
    // 监听屏幕高度
    screenHeight (val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 300
    },
  },
  mounted () {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    this.getAffiliationTree()
    setTimeout(() => {
      this.getAlterStatList()
      // this.setDefaultOrg()
    }, 300)
  },
  methods: {
    handleChange (e) {
      console.log(e)
      this.commitOrg = e
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
      // for (var i in data) {
      //   sum += parseInt(data[i][objName])
      // }
      data.map((item) => {
        sum += Number(item[objName])
      })
      return sum
    },
    search () {
      this.getAlterStatList()
    },
    // 表格页面改变事件
    onPageChange (page) {
      this.pagination.current = page
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod (i, pageSize) {
      this.fetchData.pageSize = pageSize
      this.pagination.current = 1
      this.fetchData.current = 1
    },
    // 获取提交机构树
    async getAffiliationTree () {
      // const res = await this.$api.ApplyDataSearch.getAffiliationTree();
      const res = await this.$api.common.getLowerCommitTree()
      let data = res.data.list
      if (res.code === '200') {
        if (data.length) {
          data.map((item) => {
            item['id'] = item['orgCode']
            item['pId'] = item['parentCode']
            item['title'] = `[${item['orgCode']}] ${item['orgName']}`
            item['value'] = item['orgCode']
          })
          this.commitOrgList = [...data]
          this.setDefaultOrg()
        }
      } else {
        this.$message.error(res.message)
      }
    },
    setDefaultOrg () {
      this.commitOrg = this.commitOrgList[0].orgCode
      this.commitOrgId = this.commitOrgList[0].orgId
      this.orgType = this.commitOrgList[0].orgType
    },
    // 提交机构改变事件
    commitOrgChange (val, label, extra) {
      if (val) {
        this.commitOrgId = extra.triggerNode.dataRef.orgId
        this.orgType = extra.triggerNode.dataRef.orgType
        this.commitOrg = val
      } else {
        this.commitOrg = ''
      }
    },
    async getAlterStatList () {
      const data = {
        commitOrg: this.commitOrgId ? this.commitOrgId : '',
        orgCode: this.commitOrg,
        orgType: this.orgType ? this.orgType : '',
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize,
      }
      this.tableLoading = true
      const res = await this.$api.ModifyStatistic.getAlterStatList(data)
      if (res.code === '200') {
        this.dataSource = [...res.data.list]
        this.tableLoading = false
      } else {
        this.$message.error(res.message)
        this.tableLoading = false
      }
    },
    // 点击查看工单详情
    toOrderList (type, record) {
      this.$router.push({
        name: 'ModifyOrderList',
        query: { type: type, commitOrgId: record.commitOrgId },
      })
    },
    // 考生列表
    toExamineeList (type, record) {
      this.$router.push({
        name: 'ModifyStatistic/ModifyExamineeList',
        query: { type: type, commitOrgId: record.commitOrgId },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.statistic {
  padding: 16px;
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
        width: 12%;
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
