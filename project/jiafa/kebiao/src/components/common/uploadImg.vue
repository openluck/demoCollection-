<template>
  <div class="upload-img">
    <a-upload
      accept="image/*"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <!-- <a-icon type="plus" /> -->
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>

    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="preview-image-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
async function getBase64(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  data() {
    return {
      loading: false,
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  },
  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  methods: {
    //上传图片之前
    async beforeUpload(file, fileList) {
      // console.log("file", file);

      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      // const isJPG = file.type === "image/jpg";
      if (!isJPG) {
        this.$message.error("请上传图片");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error());
        });
      }

      this.loading = true;
      const imgBase64 = await getBase64(file);
      const res = await this.uploadPicReq(imgBase64);
      this.fileList = [
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          // url:  res.url,
          url: this.picBaseUrl + res.path
        }
      ];
      //   this.form.image = res.url;

      //   this.form = { ...this.form,image:res.url };
      //   this.$refs.form.validate();
      this.$emit("changeFormImage", res.path);

      return new Promise((resolve, reject) => {
        return reject(new Error());
      });
    },

    handlePreview(file) {
      this.previewVisible = true;
      this.previewImage = file.url || file;
    },

    handleChange({ fileList }) {
      this.fileList = fileList;
      this.$emit("resetFormImage");
      //   this.form.image = null;
      //   this.$refs.form.validate();
    },

    handleCancel() {
      this.previewVisible = false;
    },

    //上传图片请求
    async uploadPicReq(imgBase64) {
      try {
        const res = await this.$api.init.uploadPic({ imgBase64 });
        this.loading = false;
        if (res.code === "200") {
          return res.data;
        } else {
        }

        // console.log(res);
      } catch (error) {
        this.$message.error("请求失败");
      }
    }
  }
};
</script>

<style lang="less">
.upload-img {
  height: 110px;
  .ant-upload-picture-card-wrapper {
    height: 102px;
  }
  .ant-upload-list-item-thumbnail{
    font-size: 14px;
    line-height: 12px;
  }
}

.preview-image-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>