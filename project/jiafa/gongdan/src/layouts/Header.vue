<template>
  <div class="header">
    <div class="header-right">
      <div class="header-logo">数据修改工单管理系统</div>
      <div class="header-plan">
        <label for>考试计划：</label>
        <a-select style="width: 300px" @change="handleChange" v-model="exId">
          <a-select-option
            v-for="item in exList"
            :key="item.exId"
            :value="item.exId"
          >{{ item.exName }}</a-select-option>
        </a-select>
      </div>
    </div>

    <div class="heaader-content">
      <span>
        <a-dropdown>
          <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <svg-icon icon-class="profilePhoto" :scale="2" style="margin-right:14px;" />
            {{ orgName }}
            <a-icon
              type="caret-down"
              class="caret-down"
              style="verticel-align:middle;backgrond-color:#FFF;"
            />
          </span>

          <a-menu slot="overlay" style="width:120px;margin-left:120px;text-align:center;">
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
      userName: "XXX考区",
      visible: false,
      exId: "",
      orgName: "",
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      exList: [],
      changePassword: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入当前密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新名称",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: "请确认名称",
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {},
  created() {
    // this.getInfo();
  },
  mounted() {
    this.exId = sessionStorage.getItem("exId");
    setTimeout(() => {
      this.orgName = JSON.parse(sessionStorage.getItem("userInfo")).orgName;
      this.exList = JSON.parse(sessionStorage.getItem("exList"));
    }, 500);
    this.$store.commit("changeExId", this.exId);
  },
  methods: {
    handleChange(e) {
      sessionStorage.setItem("exId", e);
      this.exId = e;
      this.$store.commit("changeExId", this.exId);
    },
    logout() {
      this.$api.user.logout({}).then(res => {
        if (res.code === "200") {
          this.clearInfo();
        } else {
          this.clearInfo();
        }
      });
    },
    clearInfo() {
      sessionStorage.removeItem("sjgdxgxt_token");
      sessionStorage.removeItem("routerInfo");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("openKeysMap");
      sessionStorage.removeItem("selectedKeysMap");
      sessionStorage.removeItem("orgCode");
      sessionStorage.removeItem("orgId");
      sessionStorage.removeItem("exId");
      sessionStorage.removeItem("exList");
      this.$router.push("/login");
      location.reload();
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  // float: right;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .header-right {
    padding-left: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .header-logo {
      font-size: 26px;
    }
    .header-plan {
      margin-left: 60px;
    }
  }
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
</style
>>
