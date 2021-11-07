<template>
  <div class="login">
   <div class="white-box">
      <a-form-model
      :model="loginForm"
      :rules="fieldRules"
      ref="loginForm"
      laba-position="left"
      laba-width="0px"
      class="demo-ruleForm login-container"
    >
      <h2 class="title" style="padding-left: 22px">体检信息化管理系统</h2>
      <a-form-model-item prop="userName">
        <a-input
          type="text"
          v-model="loginForm.userName"
          auto-complete="on"
          style="padding-left: 6px"
          placeholder="请输入用户名"
        >
          <a-icon
            slot="prefix"
            style="color: rgba(82, 150, 253, 1); font-size: 18px"
            type="user"
          />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input
          type="password"
          style="padding-left: 6px"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
        >
          <a-icon
            slot="prefix"
            style="color: rgba(82, 150, 253, 1); font-size: 18px"
            type="lock"
          />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="verifyCode">
        <a-input
          :maxLength="4"
          style="padding-left: 6px"
          v-model="loginForm.verifyCode"
          auto-complete="off"
          placeholder="请输入验证码"
          @keyup.enter="login"
        >
          <a-icon
            slot="prefix"
            style="color: rgba(82, 150, 253, 1); font-size: 18px"
            type="safety-certificate"
          />
          <template #suffix>
            <img
              class="verifyCode"
              v-if="verifyCodeUrl"
              :src="'data:image/png;base64,' + verifyCodeUrl"
              alt="看不清换一张"
              title="看不清换一张"
              @click="getVerifyCode"
            />
            <span v-else @click="getVerifyCode">未获取到验证码</span>
          </template>
        </a-input>
      </a-form-model-item>
      <!-- <a-form-model-item>
        <span class="forget-pwd">忘记密码？</span>
      </a-form-model-item> -->

      <a-form-model-item style="width: 100%">
        <a-button
          type="primary"
          shape="round"
          block
          @click.native.prevent="login"
          :loading="loading"
          style="height: 3rem; font-size: 1.2rem"
          >立即登录</a-button
        >
      </a-form-model-item>
    </a-form-model>
   </div>
  </div>
</template>

<script>
import { encrypt } from "../../utils/util";
import { mapState } from "vuex";
function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode === parentCode) {
      var obj = data[i];
      temp = filterArray(data, data[i].orgCode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}
export default {
  name: "Login",
  data() {
    return {
      parentCode: "",
      loading: false, //login button loading status
      verifyCodeUrl: null,
      loginForm: {
        userName: "",
        verifyCode: "",
        password: ""
      },
      fieldRules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  computed: {
    ...mapState({
      themeColor: (state) => state.app.themeColor
    })
  },
  mounted() {
    this.getVerifyCode();
  },
  methods: {
    filterArray,
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let password = encrypt(
            this.loginForm.password,
            "C599B38D346BB2C2"
          );
          this.$api.user
            .login({
              username: this.loginForm.userName,
              password,
              verifyCode: this.loginForm.verifyCode.toLocaleUpperCase(),
              loginType: 0
            })
            .then(async(res) => {
              if (res.code === "200" || res.code === 200) {
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                this.$router.push("/"); // 登录成功，跳转到指定页面
                // if (res.data.userRole === '5') {
                  this.getOrgList();
                // } else {
                  this.getTree()
                // }
               
                
                // await this.setMenus();
                // this.$router.push("/examineeInfoManage/examineeInfoImport"); // 登录成功，跳转到指定页面
              } else {
                this.$message.error("登录失败！" + res.message);
              }
              setTimeout(() => {
                this.loading = false;
              }, 2000);
            })
            .catch((err) => {
              console.log(err);
              this.getVerifyCode();
              // this.$message.error(err.message);
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

    //获取验证码
    async getVerifyCode() {
      try {
        const res = await this.$api.user.getVerifyCode({});
        if (res.code === "200" || res.code === 200) {
          this.verifyCodeUrl = res.data.verifyCodeUrl;
        } else {
          this.$message.error("获取验证码失败，" + res.message);
        }
      } catch (error) {
        // this.$message.error("获取验证码失败，" + error);
      }
    },

    async setMenus() {
      const res = await this.$api.user.getMenu({ userId: "1" });
      if (res.code === "200" || res.code === 200) {
        this.$store.dispatch("add_Routes", res.data);
        this.$store.commit("gettedInfo", true);
      } else {
        this.$message.error("获取用户信息失败");
      }
    },
    async getTree() {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      const data = { orgCode: userInfo.orgCode }
      const res = await this.$api.init.getTree(data);

      if (res.code === "200" || res.code === 200) {
        const tempArr = res.data 

        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].orgCode === userInfo.orgCode) {
            this.parentCode = tempArr[i].parentCode;
            break
          }
        }
        // const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        // console.log(this.parentCode);
        let treeData = this.filterArray(
          tempArr, 
          this.parentCode
        )
        sessionStorage.setItem("treeData", JSON.stringify(treeData));
      } else {
        this.$message.error("获取机构树失败！" + res.message);
      }
    },
    async getOrgList() {
      const data = {}
      const res = await this.$api.init.getOrgList(data);
      if (res.code === "200" || res.code === 200) {
        localStorage.setItem("hospitalOrgList", JSON.stringify(res.data.list));
      } else {
      }
    },
  }
};
</script>

<style lang="less" >
.login {
  background-size: 100% 100%;
  background-image: url("../../assets/loginbg.png");
  min-height: 100vh;
  position: relative;

  .white-box{
    width: 620px;
    height: 500px;
    background-color: #fff;
    position: absolute;
    top: 24%;
    right: 10%;
    border-radius: 40px;
  }

  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 30px;
    height: 3rem;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .verifyCode {
    cursor: pointer;
  }
}
.login-container {
  position: absolute;
  background-clip: padding-box;
  width:70%;
  height:30%;
  background: #ffffff;
  top: 16%;
  right: 14%;

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
