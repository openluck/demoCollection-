<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-11 16:06:51
 * @LastEditors: cb
 * @LastEditTime: 2021-10-14 17:19:16
-->
<template>
  <div class="header-content">
    <span class="header-title">智能课表</span>
    <span class="header-operate">
      <span
        :class="{ message: isNew }"
        @click="goMessage"
      >
        <svg-icon
          icon-class="message-mxx"
          style="color:#A1AAB2"
          :scale="1.5"
        />
      </span>
      <span class="header-avatar">
        <svg-icon
          icon-class="t_touxiang"
          :scale="2"
          style="margin: 0 4px 0 54px"
        />
      </span>
      <a-dropdown :trigger="['click']">
        <span
          class="ant-dropdown-link"
          @click="(e) => e.preventDefault()"
        >
          <span style="font-size: 16px; 
                font-weight: 400; margin-left: 10px">
            {{ userName }}</span>
          <a-icon
            type="down"
            class="caret-down"
            style="verticel-align: middle"
          />
        </span>
        <template #overlay>
          <a-menu class="header-logout">
            <a-menu-item>
              <a
                href="javascript:;"
                @click="logout"
              >退出系统</a>
            </a-menu-item>
          </a-menu>
        </template>

      </a-dropdown>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipVisible: false,
      userName: "",
      taskList: [],
      filter: {
        current: 1,
        pageSize: 10
      },
      isNew: this.$store.state.app.hasNewTips

    };
  },
  components: {},
  watch: {
    "$store.state.app.hasNewTips": function (val) {
      this.$store.commit("app/getHasNewTips", val);
    }
  },
  mounted() {
    this.userName = this.$store.state.app.userName
  },
  methods: {
    async openTaskList() {
      this.$store.commit("app/getHasNewTips", false);
      const result = await this.$api.user.getTaskList(this.filter);
      if (result.code === "200") {
        let list = result.data.list;
        this.taskList = list.splice(0, 5);
      }
    },
    async updateTaskStatus(record) {
      let params = [];
      if (record) {
        params = [record.uid];
        this.$router.push("/SysAdmin/MessageCenter");
      } else {
        this.taskList.map(item => {
          params.push(item.uid);
        });
      }
      try {
        const res = await this.$api.user.updateTaskStatus({ taskIds: params });
        if (res.code === "200" && res.result) {
          this.openTaskList();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    logout() {
      if (
        navigator.userAgent.indexOf("Firefox") !== -1 ||
        navigator.userAgent.indexOf("Chrome") !== -1
      ) {
        window.location.href = "about:blank";
        window.close();
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    },
    goMessage() {
      this.$router.push("/Message/Message");
      // this.$store.commit("app/getHasNewTips", false);
    }
  }
};
</script>

<style lang="less" scoped>
.header-logout {
  width: 100px;
  text-align: center;
}
.wt-new-tip:after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 5px;
  position: absolute;
  top: 20px;
  margin-left: 10px;
  display: block;
  background: red;
}
.header-content {
  .header-title {
    font-size: 28px;
    font-family: "微软雅黑";
    font-weight: 500;
    text-align: LEFT;
    color: #303233;
    margin-left: -30px;
  }
  .header-operate {
    // padding-right: 16px;
    // display: flex;
    // justify-content: flex-end;
    position: absolute;
    right: 16px;
  }
  > span:nth-child(2) {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    font-weight: bolder;
    font-size: 16px;
    .caret-down {
      vertical-align: middle;
      margin: 0 6px;
    }
  }
  > span:last-of-type .icon {
    font-size: 16px;
    margin: 0 10px;
    vertical-align: middle;
    font-weight: 400;
  }
  > span:last-of-type .logout-text {
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    vertical-align: middle;
    font-weight: bolder;
  }
}

.wt-tips-popover-title {
  display: flex;
  justify-content: space-between;
  width: 274px;
  height: 50px;
  line-height: 50px;
}
.wt-tips-popover-content {
  width: 274px;
  .wt-tips-popover-content-item {
    border-bottom: 1px solid #f0f1f2;
    padding: 2px 0;
    cursor: pointer;
    .wt-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .wt-item-title-point {
        display: inline-block;
        width: 6px;
        height: 6px;
        line-height: 6px;
        border-radius: 3px;
        margin-bottom: 2px;
        background: #ff6565;
      }
    }

    .wt-item-content {
      width: 260px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 10px;
      height: 40px;
      line-height: 36px;
    }
  }
  .wt-mss-link {
    text-align: center;
    height: 38px;
    line-height: 38px;
    color: #3399ff;
    cursor: pointer;
  }
}
/deep/.ant-dropdown-menu {
  width: 80px !important;
}
.sys-message {
  position: relative;
  // display: inline-block;
  // background-color: #ff5a5a;
  &::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 7px;
    background-color: #ff5a5a;
    display: inline-block;
    right: 10%;
    top: 0%;
    border-radius: 50%;
  }
}
.header-avatar {
}
</style>
