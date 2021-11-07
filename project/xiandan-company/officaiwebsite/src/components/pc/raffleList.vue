<template>
  <div class="common-table">
    <el-table :data="raffleList" :height="height" stripe border @row-click="clickTable">
      <el-table-column
        label="序列"
        type="index">
      </el-table-column>
      <el-table-column
        label="活动"
        prop="title">
      </el-table-column>
      <el-table-column
        label="需满人数/结束时间"
        prop="open_time"
        :formatter="formatterTime"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="open_type">
        <template slot-scope="scope">
          <span :style="scope.row.status === '2'? 'color:red': 'color:blue' ">{{scope.row.status === '1' ||  scope.row.status === '0'? '待开奖' : '已结束'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="详情">
        <a @click="open()">查看</a>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next, total"
      :total="raffleList.length"
    ></el-pagination>
  </div>
</template>
<script>
  import Vue from 'vue'
  import vueTable from 'vue-pagination-table'
  import login from '@/assets/img/login.png';

  import raffle from "./raffle";
  Vue.use(vueTable)

  export default {
    name: 'raffleList',
    data () {
      return {
        pageSize: 10,
        currentPage: 1,
        columnData: [
          // {
          //   prop: 'index',
          //   label: '序列',
          //   property:"intro",
          // },
          // {
          //   prop: 'active',
          //   label: '活动',
          //   property:"title"
          // },
          // {
          //   prop: 'peopleOrTime',
          //   label: '需满人数/结束时间',
          //   property:"open_time"
          // },
          // {
          //   prop: 'condition',
          //   label: '状态',
          //   property:"open_type",
          // },
          // {
          //   prop: 'details',
          //   label: '详情',
          //   property:""
          // }
        ],
        newTime: [],
        showList: [],
      }
    },
    props: {
      raffleList: {
        type: Array,
        default: () => {
          return []
        }
      },
      height: {
        type: Number,
        default: 600
      }
    },
    beforeMount() {
      console.log(this.raffleList);
    },
    methods: {
      // 处理页面展示数量改变
      handleSizeChange (val) {
        this.pageSize = val
        const currentPage = (this.currentPage - 1) * val
        this.raffleList = this.raffleList.slice(currentPage, currentPage + val)
      },
      // 处理当前页码改变
      handleCurrentChange (val) {
        this.currentPage = val
        const currentPage = (val - 1) * this.pageSize
        this.raffleList = this.tableData.slice(currentPage, currentPage + this.pageSize)
      },
      clickTable (row) {
        this.$emit('clickTable', row)
      },
      // 点击查看详细
      open() {
        this.$alert(`<div><img src=${login} style="width: 380px;height: 380px"/><p>微信扫描二维码</p></div>`, '请扫描小程序二维码查看', {
          dangerouslyUseHTMLString: true,
          center: true,
          showConfirmButton: false,
        });
      },
      // 转换时间格式
      formatterTime(row,column){
        if( typeof row.open_time === "string") {
          return row.open_time.replace(/-/g, '/').substring(0,10);
        }
      },
    },
    // 过滤器
    filters: {

    }
  }
</script>
<style scoped lang="scss">
  .common-table {
    width: 100%;
    .el-pagination {
      float: right;
      margin-top: 20px;
    }
  }
</style>
