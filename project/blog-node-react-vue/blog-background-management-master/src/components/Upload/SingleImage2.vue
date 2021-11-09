<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload
        class="upload-demo"
        action="/api/common/uploadPhoto"
        :on-success="handleImageSuccess"
        :on-remove="handleRemove"
        :file-list="fileList"
        drag
        list-type="picture">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
        </div>
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'SingleImageUpload2',
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(response, file, fileList) {
        this.emitInput(fileList)
    },
    handleRemove(file, filelist) {
        this.emitInput(filelist)
    },
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
