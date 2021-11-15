<template>
  <div class="header">
    <div class="heaader-content">
      <span>
        <a-dropdown>
          <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <svg-icon
              icon-class="profilePhoto"
              :scale="2"
              style="margin-right: 14px"
            />
            欢迎你！ {{ userName }}
            <a-icon
              type="caret-down"
              class="caret-down"
              style="verticel-align: middle"
            />
          </span>
          <a-menu slot="overlay">
            <a-menu-item @click="logout">
              <a href="javascript:;">安全退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      visible: false,
    };
  },
  components: {},

  mounted() {
    this.userName = JSON.parse(sessionStorage.getItem("userIfon")).username;
    console.log(this.userName);
  },
  methods: {
    logout() {
      window.close();
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  float: right;
  .heaader-content {
    padding-right: 16px;
    > span:nth-child(1) {
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
      font-weight: bolder;
      font-size: 16px;
      .caret-down {
        vertical-align: middle;
        margin: 0 10px;
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
}
</style>>

