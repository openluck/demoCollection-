<template>
  <div class="header">
    <div class="heaader-content">
      <span class="header-doc" @click="showDoc">说明文档</span>
      <span>
        <a-dropdown>
          <span class="ant-dropdown-link" @click="e => e.preventDefault()">
            <svg-icon icon-class="profilePhoto" :scale="2" style="margin-right:14px;" />
            欢迎你！ {{userName}}
            <a-icon type="caret-down" class="caret-down" style="verticel-align:middle" />
          </span>
          <a-menu slot="overlay">
            <!-- <a-menu-item @click="toPersonCenter">
              <a href="javascript:;">账户设置</a>
            </a-menu-item>
            <a-menu-item @click="resetPassword">
              <a href="javascript:;">修改密码</a>
            </a-menu-item>-->
            <a-menu-item @click="logout">
              <a href="javascript:;">安全退出</a>
            </a-menu-item>
            <!-- <a-modal v-model="visible" title="修改密码" @ok="onSubmitPassword" @cancel="visible=true">
              <a-form-model
                :model="changePassword"
                ref="passwordForm"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item ref="oldPassword" label="当前密码" prop="oldPassword">
                  <a-input-password
                    placeholder="请输入当前密码"
                    v-model="changePassword.oldPassword"
                    style="width:360px"
                  />
                </a-form-model-item>
                <a-form-model-item ref="newPassword" label="新密码" prop="newPassword">
                  <a-input-password
                    placeholder="请输入新密码"
                    v-model="changePassword.newPassword"
                    style="width:360px"
                  />
                </a-form-model-item>
                <a-form-model-item ref="confirmPassword" label="确认密码" prop="confirmPassword">
                  <a-input-password
                    placeholder="请确认密码"
                    v-model="changePassword.confirmPassword"
                    style="width:360px"
                  />
                </a-form-model-item>
              </a-form-model>
            </a-modal>-->
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
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

  mounted() {
    setTimeout(() => {
      this.userName = JSON.parse(sessionStorage.getItem("user")).account_name;
    }, 500);
  },
  methods: {
    showDoc() {
      const { href } = this.$router.resolve({
        path: '/doc',
        name: 'doc'
      });
      window.open(href, '_blank')
    },
    logout() {
      window.close();
    },
    resetPassword() {
      this.visible = true;
      this.changePassword.oldPassword = "";
      this.changePassword.newPassword = "";
      this.changePassword.confirmPassword = "";
    },
    onSubmitPassword() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          const filter = {
            account: JSON.parse(sessionStorage.getItem("userInfo")).account,
            password: this.changePassword.confirmPassword,
            userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
            roleName: "",
            nickName: "",
            gender: "",
            realName: "",
            phoneNumber: "",
            email: "",
            remark: ""
          };
          const oldPassword = JSON.parse(sessionStorage.getItem("userInfo"))
            .PASSWORD;
          if (this.changePassword.oldPassword === oldPassword) {
            try {
              const res = await this.$api.SystemManagement.setPersonalInfo(
                filter
              );
              if (res.result === true && res.code === "200") {
                this.visible = false;
                this.$message.success("密码修改成功！", 5);
                setTimeout(() => {
                  this.logout();
                }, 1000);
              }
            } catch (error) {
              console.log("error", error);
            }
          } else {
            this.$message.error("当前密码错误", 5);
          }
        }
      });
    },
    toPersonCenter() {
      this.$router.push("/SystemManagement/PersonalCenter");
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  float: right;
  .heaader-content {
    padding-right: 16px;
    .header-doc {
      cursor: pointer;
    }
    > span:nth-child(2) {
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

