<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" style="text-align: right;" :class-name="'sub-navbar '+ 'published'">
        <el-button v-loading="loading" style="margin-right: 20px; margin-top:20px" type="success" @click="submitForm">
          {{ isEdit ? '修改' : '发布' }}
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类:" class="postInfo-container-item" style="margin-bottom: 30px;">
          <el-select v-model="postForm.classify" default-first-option placeholder="分类">
            <el-option v-for="(item,index) in classifyList" :key="item+index" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item label="封面:" prop="poster" style="margin-bottom: 30px;">
          <Upload v-model="postForm.poster" @input="posterChange" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { mapState, mapActions } from 'vuex'
const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  poster: '', // 文章图片
  id: undefined,
  classify: '' // 文章分类
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        poster: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    ...mapState('articleClassify', ['classifyList'])
  },
  created() {
    this.getClassifyList()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    ...mapActions('articleClassify', ['getClassifyList']),
    fetchData(id) {
      fetchArticle(id).then(response => {
        const { _id, poster, title, content, classify: { _id: classify_id }} = response.data
        this.postForm = {
          id: _id,
          poster,
          title,
          content,
          classify: classify_id
        }
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      document.title = `${this.postForm.title}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateArticle(this.postForm).then(() => {
              this.$notify({
                title: '成功',
                message: '修改文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.postForm = Object.assign({}, defaultForm)
              this.$refs.editor.setContent('')
            }).catch(() => {
              this.loading = false
            })
          } else {
            createArticle(this.postForm).then(() => {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.postForm = Object.assign({}, defaultForm)
              this.$refs.editor.setContent('')
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    posterChange(val) {
      this.postForm.poster = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
// .postInfo-container-item ::v-deep {
//     .el-form-item__label {
//         font-size: 18px !important;
//         font-weight: 500;
//         color: #898989 !important;
//     }
// }

</style>
