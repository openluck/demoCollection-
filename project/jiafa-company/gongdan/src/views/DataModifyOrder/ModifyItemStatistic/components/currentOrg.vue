<template>
  <div>
    <div class="select">
      <a-form layout="inline">
        <a-form-item label="变更项">
          <a-select
            :showSearch="true"
            :allowClear="true"
            :filter-option="filterOption"
            v-model="changeItemCondition"
            @change="changeItemChange"
            style="width: 160px"
          >
            <a-select-option
              v-for="item in changeItemConditionList"
              :key="item.updateKey"
              :value="item.updateKey"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="机构">
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
            v-model="commitOrgId"
            style="width: 160px"
            placeholder="请选择~"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">
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
    <!-- <div class="bread">
      <h5 v-if="addr">{{ addr }}</h5>
      <h5 v-else>{{ curUserOrgName }}</h5>
    </div>-->
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
    <a-table
      :pagination="false"
      :columns="columns"
      :loading="tableLoading"
      :data-source="dataSource"
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
      <!-- 变更项申请总次数 -->
      <span slot="totalNumber" slot-scope="text, record">
        <span
          style="text-decoration:underline"
          @click="toDetailList('1', record)"
          >{{ text }}</span
        >
      </span>
      <!-- 已修改变更项申请次数 -->
      <span slot="changedApplyNumber" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toDetailList('2', record)"
          >{{ text }}</span
        >
      </span>
      <!-- 待修改变更项申请次数 -->
      <span slot="toChangeApplyNumber" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toDetailList('3', record)"
          >{{ text }}</span
        >
      </span>
      <!-- 待审核变更项次数 -->
      <span slot="toAuditChangeItem" slot-scope="text, record">
        <span
          style="text-decoration: underline"
          @click="toDetailList('4', record)"
          >{{ text }}</span
        >
      </span>
      <template slot="footer" slot-scope="currentPageData">
        <!-- Footer{{currentPageData}} -->
        <div class="footer">
          <div class="text">合计</div>
          <div class="text">
            {{ getArrayObjAdd(currentPageData, 'totalNumber') }}
          </div>
          <div class="text">
            {{ getArrayObjAdd(currentPageData, 'changedApplyNumber') }}
          </div>
          <div class="text">
            {{ getArrayObjAdd(currentPageData, 'toChangeApplyNumber') }}
          </div>
          <div class="text">
            {{ getArrayObjAdd(currentPageData, 'toAuditChangeItem') }}
          </div>
        </div>
      </template>
    </a-table>
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
export default {
  data() {
    return {
      changeItemConditionList: [], //变更项查询条件列表
      changeItemCondition: '', //变更项值
      tableHeight: null,
      screenHeight: null,
      columns,
      tableLoading: false,
      dataSource: [],
      commitOrgList: [], // 提交机构列表
      commitOrgId: '', //提交机构Code
      commitOrg: '', //提交机构Id
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
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 300
    },
  },
  created() {
    this.curUserOrgId = JSON.parse(sessionStorage.getItem('userInfo')).orgId
    this.getChangeItemConditionList()
    this.getAffiliationTree()
  },
  mounted() {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    // setTimeout(() => {
    // this.setDefaultOrg()
    // this.getAlterStatList()
    // }, 500)
  },
  methods: {
    // 获取提交机构树
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
        this.commitOrgList = [...data]
        this.setDefaultOrg()
      } else {
        this.$message.error(res.message)
      }
    },
    setDefaultOrg() {
      this.commitOrgId = this.commitOrgList[0].orgCode
      this.commitOrg = this.commitOrgList[0].orgId
      this.curUserOrgName = this.commitOrgList[0].orgName
      this.orgType = this.commitOrgList[0].orgType
      this.getAlterStatList()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },

    // 获取某个对象数组某一项的和
    getArrayObjAdd(data, objName) {
      let sum = 0
      data.map((item) => {
        sum += Number(item[objName])
      })
      return sum
    },
    search() {
      this.commitOrgName = this.orgName
      this.getAlterStatList()
    },

    // 跳转变更项考生列表
    toDetailList(type, record) {
      this.$router.push({
        name: 'ModifyExamineeItemList',
        query: {
          type: type,
          updateKey: record.updateKey,
          commitOrgId: this.commitOrg ? this.commitOrg : this.curUserOrgId,
        },
      })
    },
    /**********************************************************/

    // 提交机构改变事件
    commitOrgChange(val, label, extra) {
      if (val) {
        this.commitOrg = extra.triggerNode.dataRef.orgId
        this.orgName = label
        this.commitOrgId = val
        this.commitOrgName = label
        this.addrList = []
        this.dealBread(val)
        this.addrList = this.addrList.reverse()
      } else {
        this.addrList = []
      }
    },
    dealBread(orgCode) {
      let a = this.commitOrgList.find((item) => item.orgCode === orgCode)
      this.addrList.push(a)
      let accountName = JSON.parse(sessionStorage.getItem('userInfo'))
        .accountName
      if (a.orgCode !== accountName) {
        this.dealBread(a.parentCode)
      }
    },
    // 获取变更项查询条件
    async getChangeItemConditionList() {
      const res = await this.$api.ModifyItemStatistic.getChangeItemConditionList()
      if (res.code === '200') {
        this.changeItemConditionList = [...res.data.list]
      } else {
        this.$message.error(res.message)
      }
    },
    // 变更项变化事件
    changeItemChange(e) {
      console.log(e)
    },
    /**********************************************************/

    // 获取变更统计列表
    async getAlterStatList() {
      const data = {
        commitOrg: this.commitOrg ? this.commitOrg : '',
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize,
        updateKey: this.changeItemCondition,
      }
      this.tableLoading = true
      const res = await this.$api.ModifyItemStatistic.getStatisticChangeItemList(
        data
      )
      if (res.code === '200') {
        this.dataSource = [...res.data.list]
        this.tableLoading = false
      } else {
        this.tableLoading = false
        this.$message.error(res.message)
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize
      this.pagination.current = 1
      this.fetchData.current = 1
    },
  },
}
</script>

<style lang="less" scoped>
.bread {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  margin: 8px 0;
}
</style>
