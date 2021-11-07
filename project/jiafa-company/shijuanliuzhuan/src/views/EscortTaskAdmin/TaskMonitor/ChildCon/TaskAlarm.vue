<template>
  <div class="task_info">
    <div class="alarmContainer">
      <div class="left">
        <a-menu
          style="height:360px;padding-top:10px;overflow-y:scroll;overflow-x: hidden"
          :default-selected-keys="defaultSelectedKeys"
          :open-keys.sync="openKeys"
          mode="inline"
          @click="(e)=>getTaskAlarm(e.key)"
        >
          <a-menu-item
            v-for="item in selectedTask"
            :key="item.taskId"
            :title="item.taskName"
          >{{item.taskName}}</a-menu-item>
        </a-menu>
      </div>
      <div class="right">
        <div class="info_content">
          <div class="alarm_content" v-if="isAlarmShow">
            <div class="alarm-content-header">
              <span style="width:80px">操作</span>
              <span style="width:140px">预警时间</span>
              <span style="width:100px;">预警类型</span>
              <span style>备注</span>
            </div>
            <ul>
              <li
                v-for="(item,index) in alarmList "
                :key="index"
                class="alarm-li"
                @click="handleAlarm(item)"
              >
                <span class="task-status" style="width:80px;">
                  <a-button
                    size="small"
                  >{{item.actionStatus===0?"未处置":item.actionStatus===1?"正常":"异常"}}</a-button>
                </span>
                <span class="task-time" style="width:140px">{{item.alarmTime}}</span>
                <span
                  class="task-type"
                  style="width:100px;"
                  :title="returnAlarmType(item.alarmType)"
                >{{returnAlarmType(item.alarmType)}}</span>
                <span
                  class="task-remark"
                  :title="item.remark?item.remark:'--'"
                >{{item.remark?item.remark:'--'}}</span>
              </li>
            </ul>
          </div>
          <div class="alarm-content" style="padding-top:80px" v-else>
            <a-empty />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabs, List, Avatar, Menu } from "ant-design-vue";
import vue from "vue";
vue.use(List);
vue.use(Tabs);
vue.use(Menu);
vue.use(Avatar);

export default {
  props: {
    selectedTask: {
      type: Array
    }
  },
  data() {
    return {
      alarmList: [],
      isAlarmShow: false,
      messageForm: {
        content: "",
        title: ""
      },
      isDisabled: false,

      taskDetail: {},
      carInfo: [],
      activeKey: 1,
      mode: "top",
      current: ["mail"],
      openKeys: ["sub1"],
      keyword: "",
      orgNameTitle: ""
    };
  },
  mounted() {
    if (this.selectedTask.length > 0) {
      this.getTaskAlarm(this.selectedTask[0].taskId);
    }
  },
  computed: {
    defaultSelectedKeys() {
      if (this.selectedTask.length > 0) {
        return [this.selectedTask[0].taskId];
      }
    }
  },
  methods: {
    getTaskDetail(op) {
      const filterDetail = {
        examId: sessionStorage.getItem("examId"),
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        taskId: op
      };

      this.$api.taskMonitor.getEscortDetail(filterDetail).then(res => {
        if (res.data) {
          this.taskDetail = res.data;
        }
      });
    },
    /**
     * 获取任务预警信息
     * @param {*} option 任务ID
     */
    getTaskAlarm(option) {
      const filterAlarm = {
        examId: this.examId,
        orgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        alarmType: "",
        keyWord: "",
        startTime: "",
        endTime: "",
        pageIndex: 1,
        pageSize: 100,
        taskId: option
      };
      this.$api.taskMonitor.queryEscortAlarm(filterAlarm).then(res => {
        if (res.data) {
          let resList = res.data.list;
          // if (resList.length > this.alarmCount) {
          //   //有新的报警信息，语音播报
          //   this.playSound(`${baseUrl}mp3/tts.mp3`);
          // }
          this.alarmList = resList;
          console.log("=====================", this.alarmList);

          this.alarmCount = resList.length;
          this.isAlarmShow = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //返回预警类型
    returnAlarmType(id) {
      let arr =
        JSON.parse(sessionStorage.getItem("systemConf")).alarmType || [];

      if (!arr || arr.length == 0) {
        return "-";
      } else {
        for (let item of arr) {
          if (id == item.id) return item.name;
        }
      }
    }
  }
};
</script>
<style lang='less'>
.alarmContainer {
  display: flex;
  .left {
    width: 180px;
  }
  .right {
    flex: 1;
    .info_content {
      padding: 10px;
      .alarm_content {
        width: 400px;
        height: 306px;
        .alarm-content-header {
          width: 100%;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          background: rgba(0, 0, 0, 0.1);
          span {
            display: inline-block;
            text-align: center;
            margin: 0 4px;
          }
        }
        ul {
          li {
            span {
              margin: 0 4px;
              display: inline-block;
              vertical-align: bottom;
              width: 100%;
              height: 40px;
            }
            .task-remark {
              display: inline-block;
              width: 20px;
              height: 40px;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .task-type {
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
            cursor: pointer;
            &:last-of-type {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}

.ant-list-split .ant-list-item {
  border-bottom: 1px dashed #e8e8e8;
}
.task_info {
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
  .messages {
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      h6 {
        margin-left: 5px;
      }
    }
    .ms-body {
      max-height: 190px;
      overflow-y: auto;
    }
    .ms-input {
      display: flex;
      border-top: 1px solid #e8e8e8;
      /deep/.ant-input:focus {
        box-shadow: 0 0 0 !important;
      }
      .textarea-title {
        width: 40%;
        height: 80px;
        border: 0;
        outline: none;
        resize: none;
      }
      .textarea-content {
        width: 60%;
        height: 80px;
        border: 0;
        border-left: 1px solid #e8e8e8;
        outline: none;
        resize: none;
      }
    }
    .ms-btns {
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>