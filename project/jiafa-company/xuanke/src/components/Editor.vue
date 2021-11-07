/*eslint-disable */
<template lang="html">
    <div class="editor">
        <!-- <div class="toolbar">
        </div>
        <div class="text">
        </div> -->
    </div>
</template>

<script>
import E from "../assets/wangeditor";
// import E from "../assets/editor/wangEditor";
import { baseUrl } from "../Utils/global";
export default {
    name: "editoritem01",
    data() {
        return {
            token: "",
            baseUrl,
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
        editorValue: function(value) {
            if (!this.editorValue) {
                this.editor.txt.html(this.editorValue);
            }
        }
        //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    },
    mounted() {
        const _this = this;
        window.fullscreen = {
            // editor create之后调用
            init: function(editorSelector) {
                const el = window.document.querySelector(
                    editorSelector + " .w-e-toolbar"
                );
                const cet =
                    '<div class="w-e-menu"><a class="_wangEditor_btn_fullscreen" href="###" onclick="window.fullscreen.toggleFullscreen(\'' +
                    editorSelector +
                    "')\">全屏</a></div>";
                _this.append(el, cet);
            },
            toggleFullscreen: function(editorSelector) {
                // $(editorSelector).toggleClass("fullscreen-editor");
                _this.toggleClass(editorSelector, "fullscreen-editor");
                console.log();
                if (
                    document.querySelector(
                        editorSelector + " ._wangEditor_btn_fullscreen"
                    ).firstChild.nodeValue === "全屏"
                ) {
                    document.querySelector(
                        editorSelector + " ._wangEditor_btn_fullscreen"
                    ).firstChild.nodeValue = "退出全屏";
                } else {
                    document.querySelector(
                        editorSelector + " ._wangEditor_btn_fullscreen"
                    ).firstChild.nodeValue = "全屏";
                }
            }
        };
        // 创建
        this.seteditor();
        // 自动 focus
        this.editor.customConfig.focus = true;
        //将父组件的值 赋值给editor
        if (this.editorValue) {
            this.editor.txt.html(this.editorValue);
        }
    },
    computed: {
        picBaseUrl() {
            return this.$store.state.app.picBaseUrl;
        }
    },
    methods: {
        //  模拟jquery的append方法
        append(parent, text) {
            if (typeof text === "string") {
                var temp = document.createElement("div");
                temp.innerHTML = text;
                // 防止元素太多 进行提速
                var frag = document.createDocumentFragment();
                while (temp.firstChild) {
                    frag.appendChild(temp.firstChild);
                }
                parent.appendChild(frag);
            } else {
                parent.appendChild(text);
            }
        },
        // 模拟jquery的 toggleClass方法
        toggleClass(ele, cln) {
            if (
                (" " + document.querySelector(ele).className + " ").indexOf(
                    " " + cln + " "
                ) > -1
            ) {
                document.querySelector(ele).classList.remove(cln);
            } else {
                document.querySelector(ele).classList.add(cln);
            }
        },
        //上传图片请求
        async uploadPicReq(file) {
            try {
                const res = await this.$api.init.uploadPic({ file });
                if (res.code === "200") {
                    return res.data;
                }
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
            // this.editor = new E(".toolbar", ".text");
            this.editor = new E(".editor");
            // 自动 focus
            this.editor.customConfig.focus = true;
            this.editor.customConfig.debug = true;
            console.log(this.editor.customConfig);
            // this.editor.customConfig.uploadImgServer = ""; // 配置服务器端地址
            this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
            this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
            this.editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024; // 将图片大小限制为 20M
            this.editor.customConfig.uploadImgMaxLength = 20; // 限制一次最多上传 20 张图片
            this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
            this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
            /**
             * 自定义上传图片的函数
             * @param {Object} files files 是 input 中选中的文件列表
             * @param {Funtion} insert insert 是获取图片 url 后，插入到编辑器的方法
             */
            this.editor.customConfig.customUploadImg = async function(
                files,
                insert
            ) {
                // getBase64()是对文件转为base格式
                const imgBase64 = await _this.getBase64(files[0]);
                // uploadPicReq() 上传图片的接口
                const res = await _this.uploadPicReq(imgBase64);
                const { path } = res;
                if (!path) return _this.$message.error("上传图片失败，请重试！")
                document.querySelectorAll(".w-e-text")[0].focus();
                // 将后台返回的路径插入editor
                insert(_this.picBaseUrl + path);
            };
            // 获取token
            const token = window.sessionStorage.getItem("token");
            this.editor.customConfig.uploadVideoMaxSize = 2000 * 1024 * 1024; // 自定义 视频大小 2GB
            this.editor.customConfig.uploadVideoParams = { token }; // 自定义  parmas
            this.editor.customConfig.uploadVideoHeaders = { token }; // 自定义 header
            // 视频上传
            this.editor.customConfig.uploadVideoServer = `${baseUrl}/uploadFile`; // 上传接口
            this.editor.customConfig.uploadVideoHooks = {
                // 上传完成处理方法
                customInsert: function(insertVideo, res) {
                    console.log(res);
                    if (res.code === "200" && res.result) {
                        const { path } = res.data;
                        if (!path) return _this.$message.error("上传视频失败，请重试！")
                        // 将后台返回的路径插入editor
                        insertVideo(_this.picBaseUrl + path);
                    } else {
                        this.$message.error("上传失败！" + res.msg);
                    }
                }
            };
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
                "video", // 插入视频
                "code", // 插入代码
                "undo", // 撤销
                "redo", // 重复
                "fullscreen" // 全屏
            ];

            this.editor.customConfig.onchange = html => {
                this.info_ = html; // 绑定当前逐渐地值
                this.$emit("change", this.info_); // 将内容同步到父组件中
            };
            // 创建富文本编辑器
            this.editor.create();
            // 全屏
            window.fullscreen.init(".editor");
        }
    }
};
</script>

<style lang="less">
.w-e-toolbar {
    flex-wrap: wrap;
    -webkit-box-lines: multiple;
}

.w-e-toolbar .w-e-menu:hover {
    z-index: 1000002 !important;
}

.w-e-menu a {
    text-decoration: none;
}
// 全屏实现的css ↓
.fullscreen-editor {
    transition: all 0.2s;
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
    left: 0px !important;
    top: 0px !important;
    right: 0px !important;
    background-color: white;
    z-index: 999999 !important;
}

.fullscreen-editor .w-e-text-container {
    transition: all 0.4s;
    width: 80% !important;
    height: 95% !important;
    margin: 0 auto;
}
.fullscreen-editor .w-e-toolbar {
    transition: all 0.3s;
    width: 80% !important;
    margin: 0 auto;
}
._wangEditor_btn_fullscreen {
    color: #999;
}
.editor {
    width: 100%;
    // height: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
    // 表情的大小
    .bq-image{
        width: 35px;
    }
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
    .w-e-text-container {
        border-radius: 5px;
        // height: 220px !important;
    }
}
// 插入视频的样式
.editor iframe {
    width: 560px;
    height: 300px;
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
