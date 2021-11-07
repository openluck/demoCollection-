<template>
  <div class="work-order-audit">
    <div class="work-order-audit-search">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input
            style="width:200px;"
            v-model="keyWords"
            placeholder="报名号、姓名、身份证号"
            allowClear
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
      <div class="export-btn">
        <a-button type="primary" @click="exportExcel">导出</a-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="work-order-audit-table">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="examineeList"
        :row-key="(record) => record.id"
        :pagination="pagination"
        :scroll="{ y: tableHeight }"
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
        <span slot="operation" slot-scope="text, record">
          <a-button @click="getDetail(record)">查看</a-button>
        </span>
      </a-table>
    </div>
    <pdf :pageUrl="pageUrl" ref="pdf" />
    <sign :signUrl="signUrl" ref="signature" />
  </div>
</template>
<script>
import { mergeCellKey2, downloadFile } from '@/Utils/util'
import pdf from '@/components/common/readPDF'
import sign from '@/components/common/readSign'
import { mapState } from 'vuex'
// const
export default {
  name: '',

  components: { pdf, sign },
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
          obj.attrs.rowSpan = mergeCellKey2(
            text,
            this.examineeList,
            'idNumber',
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
        ellipsis: true,
        scopedSlots: { customRender: 'changeitem' },
      },
      {
        title: '原始值',
        dataIndex: 'oldValue',
        key: 'oldValue',
        align: 'center',
        ellipsis: true,
        scopedSlots: { customRender: 'oldValue' },
      },
      {
        title: '变更值',
        dataIndex: 'newValue',
        key: 'newValue',
        align: 'center',
        ellipsis: true,
        scopedSlots: { customRender: 'newValue' },
      },
      {
        title: '状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        align: 'center',
        // ellipsis: true,
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
            'finalModifyTime',
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
      tableHeight: null,
      screenHeight: null,
      examineeList: [],
      columns,
      fetchData: {
        current: 1, // 当前请求页数，从1开始
        pageSize: 20, // 每页数据条数
      },
      keyWords: '', //查询关键字
      tableLoading: false, //页面loading动画
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
      pageUrl: '', // pdf文件地址
      signUrl: '',
      record: '',
    }
  },
  computed: { ...mapState('codeTable', ['auditType']) },
  mounted() {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    // 获取码表-审核状态列表
    this.auditTypeList = [...this.auditType]
    this.getAlterList()
  },
  watch: {
    // 监听屏幕高度
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 300
    },
  },
  methods: {
    async exportExcel() {
      const data = { keywords: this.keyWords }
      // this.$api.ModifySearch.exportExcelInSearch(data).then(res => {
      //   // downloadFile(res);
      //   console.log(res, "rexs");
      //   let BLOB = new Blob([res], {
      //     type: "application/vnd.ms-excel"
      //   });
      //   var link = document.createElement("a");
      //   link.href = window.URL.createObjectURL(BLOB);
      //   link.download = "变更考生查询报表.xls";
      //   link.click();
      //   //释放内存
      //   window.URL.revokeObjectURL(link.href);
      // });
      let res = await this.$api.ModifySearch.exportExcelInSearch(data)
      downloadFile(res)
    },
    search() {
      this.getAlterList()
    },
    // 返回上一页
    back() {
      window.history.go(-1)
    },
    // 预览PDF
    showPDF(text) {
      // 处理fileUrl,需要处理成完整路径:基础路径+路径
      this.pageUrl = text
      // this.pageUrl = 'http://www.bhlib.com/pdf/002-jcrs.pdf'
      this.$refs.pdf.showModal()
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page
      this.fetchData.current = page
      this.getAlterList()
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize
      this.pagination.current = 1
      this.fetchData.current = 1
    },
    // 获取审核考生列表
    async getAlterList() {
      const data = {
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize,
        keywords: this.keyWords,
      }
      this.tableLoading = true
      const res = await this.$api.ModifySearch.getAlterList(data)
      if (res.code === '200') {
        this.examineeList = res.data.list
        this.pagination.total = res.data.pagination.total
        this.tableLoading = false
      } else {
        this.$message.error(res.message)
        this.tableLoading = false
      }
    },
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
          return { color: '#FF6600' }
        case '01': //省级审核中
          return { color: '#FF6600' }
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
      // 添加报名号、性别等参数------>examineeDetail
      console.log(record)
      /**
       * @des :需求调整，不再跳转考生数据详情页面，直接跳转考生完整信息页
       * @date 2021-3-5 13:04:47
       */
      const { bmh, wk_id } = record;
      this.$router.push({
        path: "/WorkOrderApply/ExamineeRegInfo",
        query: {
          bmh,
          wkId: wk_id,
          status: true,
          type: "look"
        }
      });
      /* this.$router.push({
        path: '/DataModifyOrder/examineeDetail',
        query: { bmh: record.bmh, wkId: record.wk_id, showReOption: false },
      }) */
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .work-order-audit-table {
    margin-top: 20px;
    /deep/ .even-row {
      background-color: #f7f8fa;
    }
    /deep/.ant-table-pagination {
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
