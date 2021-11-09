<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">
        添加
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
      <el-table-column align="center" label="操作" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加回复" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="form">
        <el-form-item label="回复内容" :label-width="formLabelWidth">
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
import { _getChildList, _createChild, _deleteChild } from '@/api/word'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        id: null,
        content: ''
      },
      formLabelWidth: '80px'
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.form.id = id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      this.listLoading = true
      _getChildList(id).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          _createChild(this.form).then(() => {
            this.dialogFormVisible = false
            this.form.content = ''
            this.fetchData(this.form.id)
            this.$notify({
              title: '成功',
              message: '回复成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      const { _id } = row
      _deleteChild(_id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除回复成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
