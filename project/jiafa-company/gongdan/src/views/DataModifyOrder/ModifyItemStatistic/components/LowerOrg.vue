<template>
  <div>
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
            v-model="commitOrgId"
            style="width: 160px;"
            :dropdownStyle="{ 'max-height': '60vh' }"
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
    ></a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeItemConditionList: [], //变更项查询条件列表
      changeItemCondition: '', //变更项值
      tableHeight: null,
      screenHeight: null,
      columns: [],
      tableLoading: false,
      dataSource: [],
      commitOrgList: [], // 提交机构列表
      commitOrgId: '', //提交机构Id
      commitOrgName: '', //提交机构名称
      orgType: '',
      OrgName: '', //暂存commitOrgName
      curUserOrgId: '', //当前登录用户所属机构
      curUserOrgName: '',
      addrList: [], //面包屑地址数组
      addr: '', //面包屑地址字符串
      fetchData: {
        // pageSize: 20,
        // current: 1,
      },
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
    // this.curUserOrgId = JSON.parse(sessionStorage.getItem("userInfo")).orgId;
    // this.curUserOrgName = JSON.parse(
    //   sessionStorage.getItem("userInfo")
    // ).orgName;
    this.getAffiliationTree()
  },
  mounted() {
    // this.commitOrgList = JSON.parse(sessionStorage.getItem('commitOrgList'))
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    // setTimeout(() => {
    //   this.setDefaultOrg();
    //   this.getAlterStatList();
    // }, 500);
  },
  methods: {
    setDefaultOrg() {
      this.commitOrgId = this.commitOrgList[0].orgCode
      this.orgType = this.commitOrgList[0].orgType
      this.getAlterStatList()
    },
    search() {
      this.commitOrgName = this.orgName
      this.getAlterStatList()
    },
    /**********************************************************/

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
    // 提交机构改变事件
    commitOrgChange(val, label, extra) {
      if (val) {
        this.orgType = extra.triggerNode.dataRef.orgType
        this.orgName = extra.triggerNode.dataRef.orgName
        this.addrList = []
        // this.dealBread(val)
        // this.addr = this.addrList.reverse().join(' / ')
      } else {
        this.addrList = []
        this.addr = ''
        this.orgType = ''
      }
    },
    dealBread(orgId) {
      let a = this.commitOrgList.find((item) => item.orgId === orgId)
      this.addrList.push(a.orgName)
      if (a.parentId && a.orgId !== this.curUserOrgId) {
        this.dealBread(a.parentId)
      }
    },
    /**********************************************************/

    // 获取变更统计列表
    async getAlterStatList() {
      const data = {
        orgCode: this.commitOrgId ? this.commitOrgId : '',
        orgType: this.orgType,
      }
      // this.tableLoading = true;
      const res = await this.$api.ModifyItemStatistic.getLowerOrgExamineeChangeItemList(
        data
      )
      if (res.code === '200') {
        this.columns = this.dealTitle(res.data.tableTitle)
        this.dataSource = this.dealData(res.data.tableList)
        this.tableLoading = false
      } else {
        this.tableLoading = false
        this.$message.error(res.message)
      }
    },
    // 处理表格数据
    dealData(data) {
      let c = []
      data.map((item) => {
        let a = {}
        item.map((val) => {
          a[val.id] = val.value
        })
        c.push(a)
      })
      return c
    },
    // 处理表头数据
    dealTitle(Title) {
      if (Title) {
        let data = JSON.parse(JSON.stringify(Title))
        data.map((item) => {
          item.dataIndex = item.id
          item.key = item.id
          item.align = 'center'
        })
        return data
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
