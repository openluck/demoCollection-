<template>
  <div class="work-order-audit">
    <div class="work-order-audit-title">
      <span v-if="this.fetchData.auditStatus === '1'" class="title"
        >已审核考生</span
      >
      <span v-else-if="this.fetchData.auditStatus === '0'" class="title"
        >待审核考生</span
      >
      <span v-else-if="this.fetchData.auditStatus === '2'" class="title"
        >考生合计</span
      >
      <a-button @click="back"> <a-icon type="arrow-left" />返回 </a-button>
    </div>
    <a-divider />
    <div class="work-order-audit-search">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input
            v-model="fetchData.keywords"
            placeholder="姓名、身份证号"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">
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
    <!-- 表格 -->
    <div class="work-order-audit-table">
      <a-table
        :columns="columns"
        :data-source="examineeList"
        :loading="tableLoading"
        :row-key="(record) => record.bmh"
        :pagination="pagination"
        bordered
        :rowClassName="
          (record, index) => {
            return index % 2 === 1 ? 'even-row' : ''
          }
        "
      >
        <span slot="changeitem" slot-scope="text">
          <a-tooltip>
            <template slot="title">{{ text }}</template>
            {{ text }}
          </a-tooltip>
        </span>
        <span slot="oldValue" slot-scope="text">
          <a-tooltip>
            <template slot="title">{{ text }}</template>
            {{ text }}
          </a-tooltip>
        </span>
        <span slot="newValue" slot-scope="text">
          <a-tooltip>
            <template slot="title">{{ text }}</template>
            {{ text }}
          </a-tooltip>
        </span>
        <!-- 审核状态 -->
        <span slot="auditStatus" slot-scope="text" style="padding:4px 8px">
          <a-tag :color="colorSwitch(text, record)">{{
            changeCodeTable(text) || '--'
          }}</a-tag>
        </span>
        <span slot="operation" slot-scope="text">
          <a-button @click="getDetail(text)">查看</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mergeCellKey2, mergeCellKey3 } from '@/Utils/util'
import { mapState } from 'vuex'

// const
export default {
  name: '',
  components: {},
  data() {
    const columns = [
      {
        title: '报名号',
        dataIndex: 'bmh',
        key: 'bmh',
        align: 'center',
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text}</span> : '',
            attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            text,
            this.examineeList,
            'bmh',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: '考生姓名',
        dataIndex: 'examineeName',
        key: 'examineeName',
        align: 'center',
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : '',
            attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            'examineeName',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: '证件号',
        dataIndex: 'idNumber',
        key: 'idNumber',
        align: 'center',
        width: 200,
        ellipsis: true,
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : '',
            attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            'idNumber',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: '变更项',
        dataIndex: 'changeitem',
        key: 'changeitem',
        align: 'center',
        scopedSlots: { customRender: 'changeitem' },
      },
      {
        title: '原始值',
        dataIndex: 'oldValue',
        key: 'oldValue',
        align: 'center',
        // ellipsis: 'true',
        scopedSlots: { customRender: 'oldValue' },
      },
      {
        title: '变更值	',
        dataIndex: 'newValue',
        key: 'newValue',
        align: 'center',
        // ellipsis: 'true',
        scopedSlots: { customRender: 'newValue' },
      },
      {
        title: '状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        align: 'center',
        // ellipsis: 'true',
        scopedSlots: { customRender: 'auditStatus' },
      },
      {
        title: '最终修改时间',
        dataIndex: 'finalModifyTime',
        key: 'finalModifyTime',
        ellipsis: true,
        align: 'center',
        // scopedSlots: { customRender: 'finalModifyTime' },
        customRender: (text, record, index) => {
          const obj = {
            children: text !== null ? <span>{text.text}</span> : '',
            attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            'idNumber',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        // scopedSlots: { customRender: 'operation' },
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? (
                <a-button
                  onclick={() => {
                    this.getDetail(record)
                  }}
                >
                  {text.text}
                </a-button>
              ) : (
                ''
              ),
            attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey2(
            text.bmh,
            this.examineeList,
            'operation',
            'bmh',
            index
          )
          return obj
        },
      },
    ]
    return {
      examineeList: [],
      columns,
      tableLoading: false,
      fetchData: {
        current: 1, // 当前请求页数，从1开始
        pageSize: 20, // 每页数据条数
        keywords: '',
        auditStatus: '', //审核状态
        commitOrgId: '',
      },
      pagination: {
        current: 1,
        defaultPageSize: 20,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        size: 'middle',
        pageSizeOptions: ['2', '5', '10', '20', '50'], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      pageParams: {}, // 页面参数
    }
  },
  computed: { ...mapState('codeTable', ['auditType']) },
  created() {
    this.pageParams = Object.assign({}, this.$route.query)
    // this.fetchData.auditStatus =
    //   this.pageParams.type === 'auditedExaminee' ? '1' : '0'
    switch (this.pageParams.type) {
      case 'toAuditExaminee':
        this.fetchData.auditStatus = '0'
        break
      case 'auditedExaminee':
        this.fetchData.auditStatus = '1'
        break
      case 'examineeTotal':
        this.fetchData.auditStatus = '2'
        break
    }
    this.fetchData.commitOrgId = this.pageParams.commitOrgId
  },
  mounted() {
    // 获取码表-审核状态列表
    this.auditTypeList = [...this.auditType]
    this.getAuditOrderList()
  },
  methods: {
    search() {
      this.getAuditOrderList()
    },
    // 返回上一页
    back() {
      window.history.go(-1)
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page
      this.fetchData.current = page
      this.getAuditOrderList()
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize
      this.pagination.current = 1
      this.fetchData.current = 1
    },
    // 获取审核考生列表
    async getAuditOrderList() {
      this.tableLoading = true
      const res = await this.$api.ModifyStatistic.getAlterAuditExamineeList(
        this.fetchData
      )
      if (res.code === '200') {
        this.examineeList = res.data.list
        this.pagination.total = res.data.pagination.total
        this.tableLoading = false
      } else {
        this.tableLoading = false
      }
    },
    /**
     * 审核状态颜色转换
     */
    colorSwitch(status) {
      switch (status) {
        // case "40": //审核通过
        //   return "green";
        // case "10": //区县审核中
        //   return "blue";
        // case "11": //上级已退回，区县审核中
        //   return { color: "#4CC2EE" };
        // case "20": //地市审核中
        //   return { color: "#4CC2EE" };
        // case "21": //上级已退回，地市审核中
        //   return { color: "#4CC2EE" };
        // case "30": //省级审核中
        //   return { color: "#4CC2EE" };
        // case "00": //省级审核中
        //   return { color: "#FF6600" };
        // case "01": //省级审核中
        //   return { color: "#FF6600" };
        // default:
        //   return "normal";
        case '40': //审核通过
          return 'green'
        case '10': //区县审核中
          return 'blue'
        case '11': //上级已退回，区县审核中
          return 'blue'
        case '20': //地市审核中
          return 'blue'
        case '21': //上级已退回，地市审核中
          return 'blue'
        case '30': //省级审核中
          return 'blue'
        case '00': //省级审核中
          return 'blue'
        case '01': //省级审核中
          return 'blue'
        default:
          return 'normal'
      }
    },
    // 根据审核状态判断显示颜色
    auditStatusToClassName(status) {
      switch (status) {
        case '40': //审核通过
          return { color: '#98FA1C' }
        case '10': //区县审核中
          return { color: '#4CC2EE' }
        case '11': //上级已退回，区县审核中
          return { color: '#4CC2EE' }
        case '20': //地市审核中
          return { color: '#4CC2EE' }
        case '21': //上级已退回，地市审核中
          return { color: '#4CC2EE' }
        case '30': //省级审核中
          return { color: '#4CC2EE' }
        case '00': //省级审核中
          return { color: '#FF6600' }
        case '01': //省级审核中
          return { color: '#FF6600' }
        default:
          return 'normal'
      }
    },
    // 根据code转换码表
    changeCodeTable(code) {
      let value
      for (let i = 0; i < this.auditTypeList.length; i++) {
        if (code === this.auditTypeList[i].code) {
          value = this.auditTypeList[i].value
        }
      }
      return value
    },
    getDetail(record) {
      this.$router.push({
        path: '/DataModifyOrder/examineeDetail',
        query: { bmh: record.bmh, wkId: record.wk_id, showReOption: false },
      })
    },
  },
}
</script>

<style scoped lang="less">
.work-order-audit {
  padding: 10px;
  .work-order-audit-title {
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .work-order-audit-search {
  }
  .work-order-audit-table {
    margin-top: 20px;
    /deep/ .even-row {
      background-color: #f7f8fa;
    }
    /deep/ .ant-table-pagination {
      text-align: left;
    }
  }
  .table-selected-text {
    margin-top: 20px;
  }
  .work-order-audit-upload {
    margin: 20px 0;
    .upload-control {
      display: inline-block;
      width: 200px;
    }
  }
}
.tip-modal-title {
  width: 100%;
  text-align: left;
  font-size: 14px;
}
.tip-modal-content-list {
  display: inline-block;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
}
.tip-modal-content-confirm {
  text-align: center;
  margin: 20px 0;
}
.tip-modal-footer {
  text-align: center;
  margin: 0 auto;
}
</style>
