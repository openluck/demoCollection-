<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="内容" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column label="留言者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.person && scope.row.person.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支持度" width="240" align="center">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" style="margin-right: 10px">支持({{ scope.row.support }})</el-tag>
          <el-tag type="info" size="mini">反对({{ scope.row.oppose }})</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="240">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/word/childList/'+row._id">
            <el-button type="primary" size="mini">
              查看回复
            </el-button>
          </router-link>
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
    <el-dialog title="留言" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="form">
        <el-form-item>
          <el-input v-model="form.content" type="textarea" :rows="3" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { _getList, _create, _delete } from '@/api/word'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: ''
      },
      total: 0,
      downloadLoading: false,
      listLoading: true,
      form: { content: '' },
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      _getList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          _create(this.form).then(() => {
            this.dialogFormVisible = false
            this.form.content = ''
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '留言成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '留言者', '留言时间', '支持', '反对', '回复', '内容']
        const filterVal = ['_id', 'person', 'time', 'support', 'oppose', 'children', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '留言列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'person') {
          if (v[j] === null) {
            return ''
          }
          return v[j]['name']
        }
        if (j === 'children') {
          return v[j].length
        }
        return v[j]
      }))
    },
    handleDelete(row, index) {
      const { _id } = row
      _delete(_id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除留言成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
