<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="标题" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.classify" placeholder="分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in classifyList" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <router-link to="/article/create">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
          新建
        </el-button>
      </router-link>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row size="mini" style="width: 100%">
      <el-table-column align="center" label="ID" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.classify && scope.row.classify.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" label="浏览量">
        <template slot-scope="scope">
          <span>{{ scope.row.browse }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="点赞量" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.fabulous.length }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row._id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/article/edit/'+row._id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { mapState, mapActions } from 'vuex'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ArticleList',
  directives: {
    waves
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        date: [],
        keyword: '',
        classify: ''
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapState({
      classifyList: state => state.articleClassify.classifyList
    })
  },
  created() {
    this.getClassifyList()
    this.getList()
  },
  methods: {
    ...mapActions('articleClassify', [
      'getClassifyList'
    ]),
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '日期', '分类', '浏览量', '点赞量', '标题']
        const filterVal = ['_id', 'createTime', 'classify', 'browse', 'fabulous', 'title']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '文章列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'classify') {
          if (v[j] === null) {
            return ''
          }
          return v[j]['name']
        }
        if (j === 'fabulous') {
          return v[j].length
        }
        return v[j]
      }))
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    handleDelete(row, index) {
      const { _id } = row
      deleteArticle(_id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
