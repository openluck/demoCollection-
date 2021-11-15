<template>
  <a-layout id="user-home">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="goPage(1)">
          <a-icon type="user" />
          <span class="nav-text">首页</span>
        </a-menu-item>
        <a-menu-item key="2" @click="goPage(2)" v-show="showStore">
          <a-icon type="video-camera" />
          <span class="nav-text">积分商城</span>
        </a-menu-item>
        <!-- <a-menu-item key="3" @click="goPage(3)">
          <a-icon type="upload" />
          <span class="nav-text">积分兑换</span>
        </a-menu-item>
        <a-menu-item key="4" @click="goPage(4)">
          <a-icon type="user" />
          <span class="nav-text">积分赠送</span>
        </a-menu-item> -->
        <a-menu-item key="3" @click="goPage(3)">
          <a-icon type="user" />
          <span class="nav-text">个人信息</span>
        </a-menu-item>
        <a-menu-item key="4" @click="goPage(4)" v-show="showPoints">
          <a-icon type="user" />
          <span class="nav-text">发布积分</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div class="welcome">
          <span>欢迎您：{{ userName }}</span>
          <a-button class="out-btn" type="primary" @click="loginOut">
            退出
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view />
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="textalign: center">
        Ant Design ©2021 Created by Ant UED
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      userName: "", // 用户名
      index: "1",
      aduserName: "",
      index: "",
      showPoints: true,
      showStore: true
    };
  },
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
    goPage(index) {
      switch (index) {
        case 1:
          this.$router.push("/news");
          break;
        case 2:
          this.$router.push("/pointes");
          break;
        case 3:
          this.$router.push("/userinfo");
          break;
        case 4:
          this.$router.push("/publish");
          break;
      }
    },
    loginOut() {
      sessionStorage.removeItem("userIfon");
      this.$router.push("/login");
    },
  },
  mounted() {
    setTimeout(() => {
      this.index = this.$route.query.index;
      // // alert(this.index);
      console.log("index", typeof this.index);
      if (this.index === "1") {
        this.userName = JSON.parse(sessionStorage.getItem("userIfon")).username;
        this.showPoints = false;
        this.showStore = true;
      } else {
        this.userName = JSON.parse(
          sessionStorage.getItem("userIfon")
        ).adusername;
        this.showPoints = true;
         this.showStore = false;
      }
      // this.userName = JSON.parse(sessionStorage.getItem("userIfon")).username;
      // if (this.userName) {
      // }
      // this.aduserName = JSON.parse(
      //   sessionStorage.getItem("aduserIfon")
      // ).adusername;
    }, 500);
  },
};
</script>

<style  lang="less" scoped>
#user-home {
  width: 100%;
  height: 100vh;

  .welcome {
    font-size: 22px;
    padding: 0 30px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    align-items: center;

    .out-btn {
      margin-left: 20px;
    }
  }
}
</style>