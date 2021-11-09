<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="标题" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.tag" placeholder="分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in tagList" :key="item._id" :label="item.name" :value="item._id" />
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row size="mini" style="width: 100%">
        <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <el-tag size="mini" style="margin: 0 5px" v-for="it in scope.row.tag" :key="it._id" :color="it.color">{{ it.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
              编辑
            </el-button>
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="标签">
            <el-checkbox-group v-model="tag" prop="tag">
                <el-checkbox v-for="item in tagList" :key="item._id" :label="item._id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
           <Tinymce ref="editor" v-model="temp.content" :height="200" />
        </el-form-item>
      </el-form>    
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteRecord, createRecord, updateRecord } from '@/api/record'
import { mapState, mapActions } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import Tinymce from '@/components/Tinymce'
export default {
  name: 'RecordList',
  directives: {
    waves
  },
  components: { Pagination, Tinymce },
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
        tag: '',
      },
      temp: {
        id: undefined,
        content: '',
        tag: []
      },
      tag:[],
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
    }
  },
  watch: {
    tag: function (val) {
        this.temp.tag = val
    }
  },
  computed: {
    ...mapState('tag', ['tagList'])
  },
  created() {
    if (this.tagList.length === 0) {
        this.getTagList()
    }
    this.getList()
  },
  methods: {
    ...mapActions('tag', ['getTagList']),
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '日期', '标签', '内容',]
        const filterVal = ['_id', 'time', 'tag', 'content',]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '学习记录列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'tag') {
          let val = ''
          v[j].forEach(element => {
            val +=  '--' + element.name
          });
          return val
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.updateTemp(row) // copy obj
      this.dialogStatus = 'update'
      this.updateTemp(row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRecord(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$refs.editor.setContent('')
            this.resetTemp()
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRecord(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        content: '',
        tag: []
      }
      this.tag = []
    },
    updateTemp(row) {
      this.temp = {
        id: row._id,
        content: row.content,
      }
      this.tag = row.tag.map(i => i._id)
    },
    handleDelete(row, index) {
      const { _id } = row
      deleteRecord(_id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
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
