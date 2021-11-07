/*eslint-disable */
<template lang="html">
    <div class="editor">
        <div ref="toolbar" class="toolbar">
        </div>
        <div ref="editor" class="text">
        </div>
    </div>
</template>

<script>
import E from "../assets/editor/wangEditor";

export default {
  name: "editoritem01",
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "editorValue",
    event: "editorChange"
  },
  props: {
    editorValue: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // isClear(val) {
    //   // 触发清除文本域内容
    //   if (val) {
    //     this.editor.txt.clear();
    //     this.info_ = null;
    //   }
    // },
    editorValue: function(value) {
      if (!this.editorValue) {
        this.editor.txt.html(this.editorValue);
      }
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    //将父组件的值 赋值给editor
    if (this.editorValue) {
      this.editor.txt.html(this.editorValue);
    }
  },
  // updated() {
  //     if (this.editorValue) {
  //         this.editor.txt.html(this.editorValue);
  //     }
  // },
  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  methods: {
    //上传图片请求

    async uploadPicReq(file) {
      try {
        const res = await this.$api.init.uploadPic({ file });
        if (res.code === "200") {
          return res.data;
        }
        console.log(res);
      } catch (error) {
        this.$message.error("上传失败" + error);
      }
    },
    //图片转base64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    // 配置editor
    seteditor() {
      const _this = this;
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.customUploadImg = async function(files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        const imgBase64 = await _this.getBase64(files[0]);
        const res = await _this.uploadPicReq(imgBase64);
        const { path } = res;
        document.querySelectorAll(".w-e-text")[0].focus();
        // 将后台返回的路径插入editor
        insert(_this.picBaseUrl + path);
        console.log(_this.picBaseUrl + path);
      };
      
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024; // 将图片大小限制为 20M
      this.editor.customConfig.uploadImgMaxLength = 20; // 限制一次最多上传 20 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        // "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
        // "fullscreen" // 全屏
      ];
      // 视频上传
    //   this.editor.customConfig.uploadVideoServer = `/uploadFile`; // 上传接口
      this.editor.customConfig.onchange = html => {
        this.info_ = html; 
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="less">
.editor {
  width: 100%;
  // height: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
  .text {
    margin-top: 5px;
    height: calc(100% - 40px);
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow-y: auto;
  }
  .w-e-toolbar {
    line-height: 20px;
    display: flex;
    border: 1px solid #ccc;
    justify-content: space-between;
    border-radius: 5px;
    background: rgb(255, 255, 255) !important;
    .w-e-menu {
      padding: 5px !important;
    }
  }
}
.editor iframe {
  width: 380px;
  height: 200px;
}
.editor .w-e-panel-container .w-e-emoticon-container .w-e-item img {
  width: 40px;
  height: 40px;
}
.editor .w-e-text {
  overflow-y: auto;
}
.editor .w-e-text {
  /* 滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 5px;
    background-color: #eff3f5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: #eff3f5;
  }
  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #36b4f3;
  }
}
</style>