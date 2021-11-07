<!--
 * @Author: ylc
 * @Date: 2021-08-10 13:17:16
 * @LastEditTime: 2021-09-28 11:30:43
 * @LastEditors: ylc
 * @Description: 导入检测页面
 * @FilePath: \Web\src\views\TimetableManage\ImportCheck.vue
-->

<template>
  <div class="ylc-import-content">
    <div v-if="!online">
      <div class="ylc-import-head"
        @click="backList()">
        <svg-icon icon-class="com_back"
          class="ylc-back-icon" />
        导入检测
      </div>
      <div class="ylc-import-body">
        <div class="ylc-alert-box">
          <div style="display: flex">
            <div>
              <svg-icon icon-class="imp_success"
                style="width: 24px; height: 24px"
                v-if="dataConfig" />
              <svg-icon icon-class="com_warn"
                style="width: 24px; height: 24px"
                v-else />
            </div>
            <div style="margin-left: 12px">
              <div class="ylc-alert-title">基础数据配置</div>
              <div class="ylc-alert-content"
                v-if="dataConfig">
                学生信息、行政班级信息、教师信息、教室信息等已配置完成。
              </div>
              <div class="ylc-alert-content"
                v-else>{{ dataWarning }}</div>
            </div>
          </div>
          <div style="display: flex; margin-top: 37px">
            <div>
              <svg-icon icon-class="imp_success"
                style="width: 24px; height: 24px"
                v-if="lesConifg" />
              <svg-icon icon-class="com_warn"
                style="width: 24px; height: 24px"
                v-else />
            </div>
            <div style="margin-left: 12px">
              <div class="ylc-alert-title">节次项设置</div>
              <div class="ylc-alert-content"
                v-if="lesConifg">
                节次方案已配置。
              </div>
              <div class="ylc-alert-content"
                v-else>{{ lesWarning }}</div>
            </div>
          </div>
          <div class="ylc-alert-btns"
            v-if="dataConfig && lesConifg">
            <a-button class="ylc-alert-auto"
              v-if="fetchData.type !== '校本课'"
              @click="autoImport">自动导入</a-button>
            <a-button class="ylc-alert-manually"
              @click="selfImport">手动导入</a-button>
          </div>
          <div class="ylc-alert-btns"
            v-else>
            <a-button class="ylc-alert-back-btn"
              @click="backList">返回列表</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="ylc-check-online"
      v-else>
      <div class="ylc-online-box">
        <div class="ylc-online-icon">
          <svg-icon icon-class="imp_loading"
            class="turn"
            style="width: 58px; height: 58px" />
        </div>
        <div class="ylc-online-alert">其他管理员导入中，请稍后...</div>
      </div>
    </div>
  </div>
</template>

<script>
import svgIcon from "../../components/common/svgIcon.vue";
export default {
  components: { svgIcon },
  data() {
    return {
      dataConfig: true,
      lesConifg: true,
      lesWarning: "",
      dataWarning: "",
      result: "0",
      fetchData: {},
      online: false
    };
  },
  mounted() {
    this.fetchData = this.$route.query;
    this.checkEnvironment();
  },
  methods: {
    // 返回列表
    backList() {
      this.$router.push({ path: "/TimetableManage/TimetableManage" });
    },
    // 手动导入
    selfImport() {
      this.$router.push({
        path: "/TimetableManage/ImportManually",
        query: {
          ...this.fetchData
        }
      });
    },
    // 检测导入环境
    async checkEnvironment() {
      const res = await this.$api.TimetableManage.checkEnvironment({
        ...this.fetchData,
        isNormal: this.fetchData.type === "校本课" ? "0" : "1"
      });
      if (res.code === "200" || res.code === 200) {
        this.result = res.data.result;
        if (this.result === "1") {

        } else if (res.data.warning === "其他管理员数据导入中，请耐心等待") {
          this.online = true;
        } else {
          let str = res.data.warning.slice(0, -1)

          if (str.indexOf(";") === -1) {
            if (str.slice(0, 4) === "节次管理") {
              this.lesConifg = false;
              this.lesWarning = str.slice(5, -2);
            } else if (str.slice(0, 6) === "基础数据配置") {
              this.dataConfig = false
              this.dataWarning = str.slice(7, -1);
            }
          } else {
            let arr = str.split(";")
            this.lesConifg = false;
            this.dataConfig = false;
            this.lesWarning = arr[1].slice(5, -1)
            this.dataWarning = arr[0].slice(7, -1)
          }
        }
      } else {
        this.$message.error(res.message);
      }
    },
    // 自动导入
    async autoImport() {
      return this.$message.warn("自动导入暂不可用")
      // const res = await this.$api.TimetableManage.autoImportTable({
      //   ...this.fetchData
      // });
      // if (res.code === "200" || res.code === 200) {
      //   this.$router.push({
      //     path: "/TimetableManage/ImportSuccess",
      //     query: {
      //       res: res.data
      //     }
      //   });
      // } else {
      //   this.$message.error(res.message);
      // }
    }
  }
};
</script>

<style lang="less">
.ylc-import-content {
  width: 100%;
  height: 100%;
  .ylc-import-head {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #e6e8eb;
    font-size: 18px;
    padding-left: 24px;
    .ylc-back-icon {
      width: 22px;
      height: 22px;
      color: #929599;
      margin-right: 5px;
    }
  }
  .ylc-import-body {
    padding: 64px 0 0 120px;
    .ylc-alert-box {
      .ylc-alert-title {
        font-size: 18px;
        color: #303233;
      }
      .ylc-alert-content {
        color: #636366;
        font-size: 14px;
        margin-top: 17px;
      }
      .ylc-alert-btns {
        margin-top: 54px;
        margin-left: 36px;
        display: flex;
        .ylc-alert-auto {
          width: 120px;
          height: 32px;
          color: #fff;
          background-color: #2abf8e;
          border-radius: 4px;
          box-shadow: 0px 2px 0px 0px rgba(42, 191, 142, 0.1);
        }
        .ylc-alert-manually {
          width: 120px;
          height: 32px;
          margin-left: 24px;
          color: #fff;
          background: #2abf8e;
          border-radius: 4px;
          box-shadow: 0px 2px 0px 0px rgba(101, 172, 242, 0.1);
        }
        .ylc-alert-back-btn {
          width: 120px;
          height: 32px;
          margin-left: 24px;
          color: #fff;
          background: #2abf8e;
          border-radius: 4px;
          box-shadow: 0px 2px 0px 0px rgba(42, 191, 142, 0.1);
        }
      }
    }
  }
  .ylc-check-online {
    height: 100%;
    background-color: #fff;
    position: relative;
    .ylc-online-box {
      height: 200px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .ylc-online-icon {
        @keyframes turn {
          0% {
            transform: rotate(0);
          }
          // 25% {
          //   transform: rotate(90);
          // }
          // 50% {
          //   transform: rotate(180);
          // }
          // 75% {
          //   transform: rotate(270);
          // }
          100% {
            transform: rotate(360deg);
          }
        }
        transform-origin: center center;
        position: relative;
        text-align: center;
        animation: turn 2s linear infinite;
        // animation:turn 5s linear infinite;
      }
      .ylc-online-alert {
        font-size: 18px;
        color: #494b4d;
        margin-top: 30px;
      }
    }
  }
}
</style>