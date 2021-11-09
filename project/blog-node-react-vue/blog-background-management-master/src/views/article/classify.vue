<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showDialog">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="classifyList"
      element-loading-text="Loading"
      border
      size="mini"
      style="width: 896px"
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
      <el-table-column label="名字" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDialog(row)">
            编辑
          </el-button>
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="名字" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="form">
        <el-form-item>
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { _update, _create, _delete } from '../../api/articleClassify'
export default {
  data() {
    return {
      list: null,
      listLoading: false,
      dialogFormVisible: false,
      form: {
        name: ''
      }
    }
  },
  computed: {
    ...mapState('articleClassify', ['classifyList'])
  },
  created() {
    if (this.classifyList.length === 0) {
      this.listLoading = true
      this.getClassifyList().then(() => {
        this.listLoading = false
      })
    }
  },
  methods: {
    ...mapActions('articleClassify', ['getClassifyList']),
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            _update(this.form).then(() => {
              this.dialogFormVisible = false
              this.form.name = ''
              this.getClassifyList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            _create(this.form).then(() => {
              this.dialogFormVisible = false
              this.form.name = ''
              this.getClassifyList()
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },
    showDialog(row) {
      if (row) {
        this.form.id = row._id
        this.form.name = row.name
      }
      this.dialogFormVisible = true
    },
    hideDialog() {
      this.form = {
        name: ''
      }
      this.dialogFormVisible = false
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
        this.getClassifyList()
      })
    }
  }
}
</script>
