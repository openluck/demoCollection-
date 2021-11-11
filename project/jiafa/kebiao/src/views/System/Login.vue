<template>
  <div class="login">
    <a-form-model
      :model="loginForm"
      :rules="fieldRules"
      ref="loginForm"
      laba-position="left"
      laba-width="0px"
      class="demo-ruleForm login-container"
    >
      <h2 class="title" style="padding-left:22px;">智能课表</h2>
      <a-form-model-item prop="account">
        <a-input
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
          style="padding-left:6px"
          placeholder="请输入用户名"
        >
          <a-icon slot="prefix" style="color: rgba(82, 150, 253,1);font-size:18px;" type="user" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input
          type="password"
          style="padding-left:6px"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter="login"
        >
          <a-icon slot="prefix" style="color: rgba(82, 150, 253,1);font-size:18px;" type="lock" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <span class="forget-pwd">忘记密码？</span>
      </a-form-model-item>

      <a-form-model-item style="width:100%;">
        <a-button
          type="primary"
          shape="round"
          block
          @click.native.prevent="login"
          :loading="loading"
          style="height: 3rem;
                    font-size: 1.2rem;"
        >立即登录</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginForm: {
        account: "",
        password: ""
      },
      fieldRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // this.$api.user
          //   .login({
          //     userName: this.loginForm.account,
          //     password: this.loginForm.password
          //   })
          axios.post('/login')
            .then(res => {
              console.log(res, '登录成功')
              if (res.data.result) {
                sessionStorage.setItem("token", res.data.data);
                this.$router.push("/"); // 登录成功，跳转到主页
                this.getPicBaseUrlReq();
                this.getBasicData()
              } else {
                this.$message.error(res.data.message);
              }
              setTimeout(() => {
                this.loading = false;
              }, 2000);
            })
            .catch(err => {
              this.$message.error(err.message);
              setTimeout(() => {
                this.loading = false;
              }, 2000);
            });
        } else {
          console.log("提交失败");
          return false;
        }
      });
    },
    reset() {
      this.$refs.loginForm.resetFields();
    },

    // 获取图片基础地址
    async getPicBaseUrlReq() {
      try {
        const res = await this.$api.init.getPicBaseUrl();
        // console.log("resresres", res);
        if (res.code === "200") {
          this.$store.commit("changePicBaseUrl", res.data.picBaseUrl);
          sessionStorage.setItem("picBaseUrl", res.data.picBaseUrl);
        }
      } catch (error) {
        this.$message.error("请求错误");
      }
    },
    async getBasicData() {
      try {
        const res = await this.$api.init.getBasicData();
        console.log(res);
        if (res.code === '200') {
          sessionStorage.setItem('gradeList',JSON.stringify(res.data.gradeList) )  //年级列表
          sessionStorage.setItem('weekList',JSON.stringify(res.data.weekList) )    //教学周列表
          sessionStorage.setItem('subjectList',JSON.stringify(res.data.subjectList)) //科目列表
          sessionStorage.setItem('schoolYearList',JSON.stringify(res.data.schoolYearList)) //科目列表
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } 
    },
  },
  mounted() {},
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  }
};
</script>

<style lang="less" >
.login {
  background-size: cover;
  // background-image: url("../../assets/loginbg.png");
  min-height: 100vh;
  position: relative;
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 30px;
    height: 3rem;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
.login-container {
  position: absolute;
  background-clip: padding-box;
  width: 20%;
  height: 20%;
  background: #ffffff;
  top: 34%;
  right: 26%;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
    font-weight: bold;
    letter-spacing: 6px;
    font-size: 1.6rem;
  }
  .forget-pwd {
    width: 100%;
    display: inline-block;
    text-align: center;
    color: rgb(59, 152, 247);
    font-size: 1rem;
  }
}
</style>
