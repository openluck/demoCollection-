<template>
  <div class="header">
    <div class="head-line">体检信息化管理系统</div>
    <div class="current-user">当前用户：{{ currentOrg }} {{ currentUser }}</div>
    <div  v-if="showDownIcon === '1'" class="print" @click="downloadPlugin()">
      <svg-icon
        icon-class="dayin"
        :scale="1"
        style="margin-right: 5px;"
      />
      <span>打印客户端程序下载</span>
    </div>
    <div class="header-content">
      <span>
        <a-dropdown>
          <span class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <a-icon type="user" />
            <!-- <svg-icon icon-class="profilePhoto" :scale="2" style="margin-right:14px;" /> -->
            {{ userName }}
            <a-icon
              type="caret-down"
              class="caret-down"
              style="verticel-align: middle"
            />
          </span>
          <a-menu slot="overlay">
            <a-menu-item @click="resetPassword">
              <a href="javascript:;">修改密码</a>
            </a-menu-item>
            <a-menu-item @click="quit">
              <a href="javascript:;">安全退出</a>
            </a-menu-item>
            <a-modal
              v-model="visible"
              title="修改密码"
              @ok="onSubmitPassword"
              @cancel="visible = false"
              :maskClosable="false"
              destroyOnClose
            >
              <a-form-model
                :model="changePassword"
                ref="passwordForm"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item
                  ref="oldPassword"
                  label="当前密码"
                  prop="oldPassword"
                >
                  <a-input-password
                    placeholder="请输入当前密码"
                    v-model="changePassword.oldPassword"
                    style="width: 360px"
                  />
                </a-form-model-item>
                <a-form-model-item
                  ref="newPassword"
                  label="新密码"
                  prop="newPassword"
                >
                  <a-input-password
                    placeholder="请输入新密码"
                    v-model="changePassword.newPassword"
                    style="width: 360px"
                  />
                </a-form-model-item>
                <a-form-model-item
                  ref="confirmPassword"
                  label="确认密码"
                  prop="confirmPassword"
                >
                  <a-input-password
                    placeholder="请确认密码"
                    v-model="changePassword.confirmPassword"
                    style="width: 360px"
                  />
                </a-form-model-item>
              </a-form-model>
            </a-modal>
          </a-menu>
        </a-dropdown>
      </span>
    </div>
  </div>
</template>

<script>
import { encrypt } from "../utils/util";
export default {
  data() {
    //表单验证---密码
    const passwordReg = /^[\w!@#$%^&*<>?:",./;']{6,15}$/;
    let validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空！"));
      } else {
        if (value.length > 15 || value.length < 6) {
          callback(new Error("密码长度为6-15位"));
        } else if (!passwordReg.test(value)) {
          callback(new Error("格式有误，字母数字或特殊字符组合"));
          // } else if (this.changePassword.confirmPassword !== null) {
          //   this.$refs.passwordForm.validateField("confirmPassword");
          //   callback();
        } else {
          callback();
        }
      }
    };
    //表单验证---确认密码
    let validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changePassword.newPassword) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      showDownIcon: "0", //当前用户下载权限
      downloadUrl: null, //插件下载地址
      currentUser: "", //当前用户
      currentOrg: "", //当前机构
      userName: "",
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      changePassword: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            trigger: ["blur"],
            message: "请输入密码",
            required: true,
          },
        ],
        newPassword: [
          {
            validator: validatePassword,
            trigger: ["blur"],
            // trigger: ["change", "blur"],
            required: true,
          },
        ],
        confirmPassword: [
          {
            validator: validateRePassword,
            trigger: ["blur"],
            // trigger: ["change", "blur"],
            required: true,
          },
        ],
      },
    };
  },

  mounted() {
    setTimeout(() => {
      this.userName = JSON.parse(sessionStorage.getItem("userInfo")).userName;
      this.currentUser = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).trueName;
      this.currentOrg = JSON.parse(sessionStorage.getItem("userInfo")).orgName;
      this.showDownIcon = JSON.parse(sessionStorage.getItem("userInfo")).download;
      this.downloadUrl = JSON.parse(sessionStorage.getItem("userInfo")).downloadUrl;
    }, 0);
  },
  methods: {
    downloadPlugin() {
      console.log(this.downloadUrl);
      window.open(this.downloadUrl)
    },
    quit() {
      this.$confirm({
        title: "确认要退出系统吗？",
        content: "退出前请注意保存数据！",
        onOk: async() => {
          await this.logout();
        },
        onCancel() {},
      });
    },
    logout() {
      this.$api.user.logout({ userName: this.userName }).then((res) => {
        if (res.code === 200 || res.code === "200") {
          this.$message.success("账号已安全退出");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("routerInfo");
          sessionStorage.removeItem("userInfo");
          this.$router.push("/login");
        }
      });
    },
    resetPassword() {
      this.visible = true;
      this.changePassword.oldPassword = "";
      this.changePassword.newPassword = "";
      this.changePassword.confirmPassword = "";
    },
    onSubmitPassword() {
      this.$refs.passwordForm.validate(async(valid) => {
        if (valid) {
          let password = encrypt(
            this.changePassword.oldPassword,
            "C599B38D346BB2C2"
          );
          let newPassword = encrypt(
            this.changePassword.newPassword,
            "C599B38D346BB2C2"
          );
          const obj = { password, newPassword };
          const res = await this.$api.user.updatePassword(obj);
          if (res.code === 200 || res.code === "200") {
            this.$message.success("密码修改成功");
            this.visible = false;
          } else {
            this.$message.error("密码修改失败！" + res.message);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 0 15px 0 20px;
  background-color: #178fe6;
  line-height: 55px;
  overflow: hidden;
  .head-line {
    font-size: 24px;
    color: #fff;
    font-weight: bold;
  }
  .current-user {
    margin-left: 20px;
    flex-grow: 1;
    color: #fff;
    line-height: 60px;
  }
  .print{
    color: #fff;
    margin-right: 20px;
    cursor: pointer;
    line-height: 60px;
  }
  .header-content {
    height: 55px;
    color: #fff;
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
</style>

