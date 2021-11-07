<template>
  <div class="send-msg">
    <div class="wrap">
      <VideoCall v-if="showVideoCall" ref="video" :taskId="taskId" />

      <div v-else class="container">
        <div class="left">
          <a-input v-model="keyword" @input="inputSearch" style="width: 180px;margin-bottom:10px" placeholder="搜索任务名称" allowClear>
            <a-icon slot="suffix" type="search" style="fontSize:18px"/>
          </a-input>
          <a-menu
            style="width: 180px;height:270px;overflow-y:auto;overflow-x: hidden"
            :selectedKeys="taskIdArr"
            mode="inline"
            @click="handleClick"
          >
            <a-menu-item v-for="item in copyContact" :key="item.taskId" :title="item.taskName">{{item.taskName}}</a-menu-item>
          </a-menu>
        </div>
        <div class="right">
          <div class="messages">
            <div class="title">
              <a-icon type="user" style="fontSize:16px;"/>
              <h6>{{orgNameTitle}}</h6>
              <!-- 发送视频 -->
              <div class="vcall-btn">
                <a-button @click="handleVideoCall" type="primary" shape="circle" icon="video-camera" size="default" title="发视频"/>
              </div>
            </div>
            <div class="ms-body">
              <a-list item-layout="horizontal" :data-source="mesgList" style="min-height:170px">
                <a-list-item slot="renderItem" slot-scope="item">
                  <a-list-item-meta
                    :description="item.content"
                  >
                    <a slot="title">{{ item.title }}</a>
                    <a-avatar
                      slot="avatar"
                      src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=701675442,1434096146&fm=111&gp=0.jpg"
                    />
                  </a-list-item-meta>
                    <!-- <p >发送时间：{{item.sendTime}}</p> -->
                </a-list-item>
              </a-list>
            </div>
            <div class="ms-input">
              <a-textarea class="textarea-title" v-model="messageForm.title"  name="" id="" placeholder="请输入标题信息，40字以内" />
              <a-textarea class="textarea-content" v-model="messageForm.content" name="" id="" placeholder="请输入消息内容，200字以内" />
            </div>
            <div class="ms-btns">
              <a-button @click="onSubmit" type="primary" style="margin-right:15px;">发送</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import { Tabs, List, Avatar, Menu } from 'ant-design-vue'
import vue from 'vue'
import { getBrowse } from "@/utils/util";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("videoCall");
//判断浏览器是否为Chrome 等，不是就加载空组件
if (
  getBrowse() === "Chrome" ||
  getBrowse() === "Firefox" ||
  getBrowse() === "Safari"
) {
  var VideoCall = () => import("./VideoCall");
} else {
  var VideoCall = () => import("./Temp");
}
vue.use(List)
vue.use(Tabs);
vue.use(Menu);
vue.use(Avatar);
export default {
  props: {
    selectedTask: {
      type: Array,
      required: true
    }
  },
  components: { VideoCall },
  data() {
    return {
      labelCol: { span: 10 },
      wrapperCol: { span: 20 },
      messageForm: {
        content: "",
        title: ""
      },
      isDisabled: false,
      contact: [],
      copyContact: [],
      activeKey: 1,
      mode: "top",
      keyword: "",
      orgNameTitle: "",
      mesgList: [],
      taskId: '',
      taskIdArr: [],
      showVideoCall: false,
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          },
          {
            max: 40,
            message: "标题不能大于40个字符"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入内容"
          },
          {
            max: 200,
            message: "内容不能大于200个字符"
          }
        ]
      }
    };
  },
  created(){
    const { selectedTask } = this;
    this.contact = selectedTask.map(item => ({
      taskName:item.taskName,
      taskId:item.taskId
    }))

    this.orgNameTitle = this.contact[0].taskName;

    this.getEscortMsgList(this.contact[0].taskId);

    this.copyContact = [...this.contact];
  },
  mounted() {
    this.handleTabChange();
    // ********************computed执行顺序早于mounted********************;
    this.taskId = this.contact[0].taskId;
    this.taskIdArr = [this.taskId];
  },
  computed: {
    defaultSelectedKeys(){
      return [this.contact[0].taskId]
    }
  },
  methods: {
    // 点击发送视频
    handleVideoCall(){
      this.showVideoCall = true,
      // 一点开就进入房间
      this.join();
    },
    ...mapActions(["askMobileVideoAsync"]),
    //进入房间
    join() {
      const { taskId } = this;
      this.askMobileVideoAsync({ taskId, type: 2 }); //type为2的时候发送视频
    },
    // 发送指令
    onSubmit() {
      const { content, title } = this.messageForm;
      if (!content) return this.$message.warn("请输入内容");
      if (!title) return this.$message.warn("请输入标题");
      this.isDisabled = true;
      let fillterMsg = {
        taskId: this.taskId,
        content,
        title,
        orgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode || ""
      };
      this.$api.taskMonitor
        .sendEscortMsg(fillterMsg)
        .then(res => {
          setTimeout(() => (this.isDisabled = false), 2000);
          if (res.result) {
            this.$message.success("发送成功！");
            this.messageForm.content = "";
            this.messageForm.title = "";
            this.getEscortMsgList(fillterMsg.taskId);
          } else {
            this.$message.error("发送失败！");
          }
        })
        .catch(res => {
          this.isDisabled = false;
          this.$message.error("请求错误");
        });
    },
    handleTabChange(key){
      this.activeKey = key;
    },
    callback(val) {
      console.log(val);
    },
    handleClick(e) {
      this.taskId = e.key;
      this.orgNameTitle = e.item.title;
      this.taskIdArr = [e.key];
      this.getEscortMsgList(e.key);
    },
    inputSearch(){
      this.copyContact = [...this.contact];
      this.copyContact = this.filterOption(this.keyword, this.contact);
      if(this.keyword === ''){
        this.copyContact = [...this.contact];
      }
    },
    // 根据orgCode和orgName来筛选列表
    // 根据任务名称来筛选列表 
    filterOption(input, option) {
      const stringC = new RegExp("[^\a-\z\A-\Z0-9\u4E00-\u9FA5]");
      const stringN = new RegExp("^[A-Za-z0-9]+$");
      return (
            option.filter( ele => {
              return ele.taskName.indexOf(input) != -1 ? true : false
          })
        );
      /* if(stringC.test(input)){
        return (
            option.filter( ele => {
              return ele.taskName.indexOf(input) != -1 ? true : false
          })
        );
      } else if(stringN.test(input)){
        return(
          option.filter( ele => {
              return ele.taskId.indexOf(input) != -1 ? true : false
          })
        )
      } */
    },
    // 获取押运任务指令推送列表
    getEscortMsgList(taskId){
      this.$api.taskMonitor.getEscortMsg({taskId})
      .then(res => {
        if(res.result){
          this.mesgList = res.data;
          // this.mesgList = this.mesgList.reverse();
        }
      })
    },
    // 获取押运任务指令推送详情
    getEscortMsgDetails(data){
      this.$api.taskMonitor.getEscortMsgDetail(data)
      .then(res => {
        if(res.code === '200'){

        }
      })
    },
  }
};
</script>
<style lang='less' >
.send-msg{
  .container{
    display: flex;
    .left{
      width: 185px;
      overflow-x: hidden;
    }
    .right{
      flex: 1;
    }
  }
}
.ant-list-split .ant-list-item{
  border-bottom: 1px dashed #e8e8e8;
}
.send-msg {
  width: 600px;
  height: 360px;
  .ant-col-20 {
    width: 100%;
  }
  .ant-form-item {
    // padding-bottom: 15px;
    margin-bottom: 0;
  }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
  }
  .messages{
    .title{
      display: flex;
      align-items: center;
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      position: relative;
      h6{
        margin-left: 5px;
      }
      .vcall-btn{
        position: absolute;
        right: 10px;
        z-index: 9999;
      }
    }
    .ms-body{
      max-height: 190px;
      overflow-y: auto;
    }
    .ms-input{
      display: flex;
      border-top: 1px solid #e8e8e8;
      /deep/.ant-input:focus{
        box-shadow: 0 0 0 !important;
      }
      .textarea-title{
        width: 40%;
        height: 80px;
        border: 0;
        outline: none;
        resize: none;
      }
      .textarea-content{
        width: 60%;
        height: 80px;
        border: 0;
        border-left: 1px solid #e8e8e8;
        outline: none;
        resize: none;
      }
    }
    .ms-btns{
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>