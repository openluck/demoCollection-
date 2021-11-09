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
      style="width: 696px"
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
      <el-table-column align="center" label="照片" width="240">
        <template slot-scope="scope">
          <el-image
            style="width: 120px; height: 50px"
            :src="scope.row.url"
            fit="fill"></el-image>
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

    <el-dialog title="添加" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="form">
        <el-form-item>
          <Upload v-model="form.url"  @input="photoListChange" />
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
import { _getPhotoList, _createPhoto, _deletePhoto } from '@/api/album'
import Upload from '@/components/Upload/SingleImage2'
export default {
    components: { Upload },
  data() {
    return {
      list: null,
      listQuery: {
        id: undefined,
        page: 1,
        limit: 20
      },
      listLoading: true,
      dialogFormVisible: false,
      form: {
        id: undefined,
        url: []
      },
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.listQuery.id = id
    this.form.id = id
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      _getPhotoList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          _createPhoto(this.form).then(() => {
            this.dialogFormVisible = false
            this.fetchData(this.listQuery)
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      const { _id } = row
      _deletePhoto(_id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除回复成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    photoListChange(fileList) {
        this.form.url = fileList.map(item => item.response.data)
    }
  }
}
</script>
