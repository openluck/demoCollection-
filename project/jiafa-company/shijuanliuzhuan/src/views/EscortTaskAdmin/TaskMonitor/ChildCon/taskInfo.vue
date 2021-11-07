<template>
  <div class="task_info">
    <div class="container">
      <div class="left">
        <a-menu
          style="height:360px;padding-top:10px;overflow-y:scroll;overflow-x: hidden"
          :default-selected-keys="defaultSelectedKeys"
          :open-keys.sync="openKeys"
          mode="inline"
          @click="(e)=>getTaskDetail(e.key)"
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
          <ul>
            <li :title="this.taskDetail.taskName">
              <span>任务名称：</span>
              {{ this.taskDetail.taskName}}
            </li>
            <li :title="this.taskDetail.startOrgName">
              <span>起始机构：</span>
              {{ this.taskDetail.startOrgName}}
            </li>
            <li :title="this.taskDetail.endOrgName">
              <span>目标机构：</span>
              {{ this.taskDetail.endOrgName}}
            </li>
            <li>
              <span>押运人：</span>
              {{ this.taskDetail.escortPerson}}
            </li>
            <div class="car_info">
              <span>车辆（司机/其他人员）：</span>
              <div class="car_content">
                <span v-for="(item,index) in carInfo" :key="index">{{carContent(item)}}</span>
              </div>
            </div>
            <!-- <li>
              <span>交接人</span>
              {{ this.taskDetail.personName}}
            </li> -->
            <li>
              <span>开始时间:</span>
              {{ this.taskDetail.startTime}}
            </li>
            <li>
              <span>结束时间:</span>
              {{ this.taskDetail.endTime}}
            </li>
          </ul>
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
      this.getTaskDetail(this.selectedTask[0].taskId);
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
    }
  }
};
</script>
<style lang='less'>
.container {
  display: flex;
  .left {
    width: 180px;
  }
  .right {
    flex: 1;
    .info_content {
      padding: 10px;
      ul {
        overflow-y: auto;
        li {
          span {
            width: 160px;
            color: #3380cc;
            display: inline-block;
          }
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
          width: 420px;
          height: 40px;
          line-height: 40px;
          border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:last-of-type {
            border-bottom: none;
          }
        }
        .car_info {
          border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
          span {
            width: 160px;
            color: #3380cc;
            vertical-align: top;
            line-height: 40px;
          }
          .car_content {
            display: inline-block;
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
            width: 410px;
            span {
              color: rgba(0, 0, 0, 0.6);
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