<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column  align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column label="名字" width="110" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span> {{ scope.row.word }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOpen" type="success" size="mini">公开</el-tag>
          <el-tag v-else type="danger" size="mini">私密</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="240">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="封面" width="240">
        <template slot-scope="scope">
          <el-image
            style="width: 120px; height: 50px"
            :src="scope.row.poster"
            fit="fill"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/album/photoList/'+row._id">
            <el-button icon="el-icon-edit" type="primary" size="mini">
              查看
            </el-button>
          </router-link>
          <el-button size="mini" icon="el-icon-edit" type="warning" style="margin-left: 10px" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" icon="el-icon-edit" type="danger" style="margin-left: 10px" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="名字" prop="type">
            <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="描述" prop="title">
          <el-input v-model="temp.word" />
        </el-form-item>
        <el-form-item label="状态">
            <el-radio-group v-model="temp.isOpen">
                <el-radio :label="true">公开</el-radio>
                <el-radio :label="false">私密</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="封面">
           <Upload v-model="temp.poster" @input="posterChange" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { _getList, _create, _delete, _update } from '@/api/album'
import Upload from '@/components/Upload/SingleImage3'
import waves from '@/directive/waves' // waves directive
export default {
  directives: { waves },
  components: { Upload },
  data() {
    return {
      list: null,
      downloadLoading: false,
      listLoading: true,
      temp: {
        id: undefined,
        name: '',
        word: '',
        poster: '',
        isOpen: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      _getList().then(response => {
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
          _create(this.temp).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
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
          _update(tempData).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
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
        name: '',
        word: '',
        poster: '',
        isOpen: true
      }
    },
    updateTemp(row) {
      this.temp = {
        id: row._id,
        name: row.name,
        word: row.word,
        poster: row.poster,
        isOpen: row.isOpen
      }
    },
    posterChange(val) {
      this.temp.poster = val
    }
  }
}
</script>
