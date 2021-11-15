<template>
  <div class="login">
    <h1 class="title">石油企业会员积分管理系统</h1>
    <div class="login-box">
      <div class="choose-login">
        <a-radio-group name="radioGroup" :default-value="1" @change="onChange">
          <a-radio :value="1">会员登录</a-radio>
          <a-radio :value="2">企业登录</a-radio>
          <a-radio :value="3">注册</a-radio>
        </a-radio-group>
      </div>
      <div class="title2">
        <h2 class="login-title v-title" v-show="vipTitle">会员登录</h2>
        <h2 class="login-title admin-title" v-show="adminTitle">企业登录</h2>
        <h2 class="login-title register-title" v-show="regiTitle">
          注册
          <a-radio-group
            name="radioGroup"
            :default-value="1"
            @change="onChangeReg"
          >
            <a-radio :value="1">会员注册</a-radio>
            <a-radio :value="2">企业注册</a-radio>
          </a-radio-group>
        </h2>
      </div>
      <div class="login-content">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="login-from"
        >
          <a-form-item label="账号">
            <a-input
              v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '账号不能为空' }],
                },
              ]"
              placeholder="请输入账号"
            />
          </a-form-item>
          <a-form-item label="密码">
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                    },
                  ],
                },
              ]"
              placeholder="请输入密码"
              type="password"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="check" v-if="regiTitle">
              注册
            </a-button>
            <a-button type="primary" @click="check" v-else> 登陆 </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="register-content" style="display: none"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      vipTitle: true,
      adminTitle: false,
      regiTitle: false,
      vipReg: true,
      adReg: false,
    };
  },
  methods: {
    check() {
      this.form.validateFields((err, values) => {
        let { username, password } = values;
        if (this.vipTitle) {
          // 会员登录
          this.$http({
            method: "post",
            url: this.$util.baseUrl + "users/userLogin",
            data: {
              username: username,
              userpwd: password,
            },
          }).then((res) => {
            if (res.data.code === "200") {
              sessionStorage.setItem("userIfon", JSON.stringify(res.data.data));
              this.$router.push({
                path: "/news",
                query: {
                  index: 1,
                },
              });
            } else if (res.data.code === "400") {
              this.$message.error(res.data.mess);
            }
          });
        } else if (this.adminTitle) {
          // 管理员登录
          this.$http({
            method: "post",
            url: this.$util.baseUrl + "users/adminLogin",
            data: {
              adusername: username,
              aduserpwd: password,
            },
          })
            .then((res) => {
              if (res.data.code === "200") {
                sessionStorage.setItem(
                  "userIfon",
                  JSON.stringify(res.data.data)
                );
                // this.$router.push("/news");
                this.$router.push({
                  path: "/news",
                  query: {
                    index: 2,
                  },
                });
              } else if (res.data.code === "400") {
                this.$message.error(res.data.mess);
              }
            })
            .then((err) => {
              console.log(err);
            });
        } else {
          if (this.vipReg) {
            this.$http({
              method: "post",
              url: this.$util.baseUrl + "users/userRegVip",
              data: {
                username: username,
                userpwd: password,
              },
            }).then((res) => {
              if (res.data.code === "200") {
                this.$message.success(res.data.mess);
                // this.$router.push("/login");
                this.$router.go(0);
              } else {
                this.$message.error(res.data.mess);
              }
            });
          } else {
            this.$http({
              method: "post",
              url: this.$util.baseUrl + "users/userRegAdm",
              data: {
                username: username,
                userpwd: password,
              },
            }).then((res) => {
              if (res.data.code === "200") {
                this.$message.success(res.data.mess);
                // this.$router.push("/login");
                this.$router.go(0);
              } else {
                this.$message.error(res.data.mess);
              }
            });
          }
        }
      });
    },
    /**
     * @name: 切换
     * @msg:
     * @param {*}
     * @return {*}
     */
    onChange(e) {
      let index = e.target.value;
      if (index === 1) {
        this.vipTitle = true;
        this.adminTitle = false;
        this.regiTitle = false;
      } else if (index === 2) {
        this.adminTitle = true;
        this.vipTitle = false;
        this.regiTitle = false;
      } else {
        this.regiTitle = true;
        this.vipTitle = false;
        this.adminTitle = false;
      }
    },
    // 选择注册
    onChangeReg(e) {
      let index = e.target.value;
      if (index === 1) {
        this.vipReg = true;
        this.adReg = false;
      } else {
        this.vipReg = false;
        this.adReg = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  // background-image: url('../../assets/img/loginbg.png');
  background: url("../../assets/img/loginbg.png") no-repeat center/cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    position: absolute;
    color: #fff;
    font-size: 45px;
    top: 10%;
    left: 20%;
  }

  .login-box {
    background: url("../../assets/img/loginbox.png") no-repeat center/cover;
    width: 60vw;
    height: 60vh;
    background-color: #fff;
    position: relative;

    .choose-login {
      position: absolute;
      right: 10%;
      top: 10%;
    }

    .title2 {
      position: absolute;
      right: 10%;
      top: 21%;
      font-size: 20px;
      display: flex;
      width: 300px;
    }
    // .login-title {
    //   position: absolute;
    // }

    .login-from {
      position: absolute;
      width: 300px;
      height: 300px;
      right: 18%;
      top: 33%;
    }
  }
}
</style>