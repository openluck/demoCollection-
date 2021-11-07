<!--
 * @Author: ylc
 * @Date: 2021-08-16 15:55:16
 * @LastEditTime: 2021-09-28 14:50:13
 * @LastEditors: ylc
 * @Description: 导入确认与校验
 * @FilePath: \Web\src\views\TimetableManage\importVerify.vue
-->

<template>
  <div class="ylc-verify-content">
    <div v-if="!loading">
      <div class="ylc-verify-head"
        @click="goBack()">
        <svg-icon icon-class="com_back"
          class="ylc-back-icon" />
        导入确认与校验
      </div>
      <div class="ylc-verify-body">
        <div class="ylc-verify-title">检测导入数据包含以下课程，请选择：</div>
        <div class="ylc-verify-text">科目，班级名称</div>
        <div class="ylc-verify-group"
          style="margin-top: 20px">
          <a-checkbox-group v-model="checkList"
            name="checkboxgroup"
            :options="classShowList" />
        </div>
        <a-button class="ylc-verify-btn"
          v-if="importStatu"
          @click="importFinal">确认导入</a-button>
        <a-button class="ylc-verify-btn"
          v-else
          @click="goBack()">重新导入</a-button>
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
        <div class="ylc-online-alert">导入数据校验中，请稍后...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [], // 班级列表
      classShowList: [], // 展示班级列表
      fetchData: {},
      checkList: [], // 选中列表
      loading: false, // 加载状态
      importStatu: false // 导入状态
    };
  },
  created() {
    let arr = [];
    arr = JSON.parse(this.$route.query.classList);
    this.classList = JSON.parse(this.$route.query.classList);
    this.fetchData = JSON.parse(this.$route.query.fetchData);
    if (arr.length === 0) {
      this.importStatu = false
      return this.$message.warn("导入数据为空，请返回重新选择文件导入")
    } else {
      this.importStatu = true
    }
    arr.map((item) => {
      let k = {
        value: item.className,
        label:
          item.classType === "1"
            ? item.className
            : item.className +
            (item.subjectName === null ? "" : "，" + item.subjectName)
      };
      this.checkList.push(item.className);
      this.classShowList.push(k);
    });
  },
  methods: {
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    },
    // 最终导入
    async importFinal() {
      let arr = [];
      this.classList.map((item) => {
        for (let i = 0; i < this.checkList.length; i++) {
          if (item.className === this.checkList[i]) {
            arr.push(item);
          }
        }
      });
      this.loading = true
      const res = await this.$api.TimetableManage.importTimeTableFinally({
        ...this.fetchData,
        classList: arr
      });
      if (res.code === "200" || res.code === 200) {
        this.loading = false
        this.$router.push({
          path: "/TimetableManage/ImportSuccess",
          query: { res: JSON.stringify(res.data), fetchData: JSON.stringify(this.fetchData) }
        });
      } else {
        this.loading = false
        this.$message.warn(res.message);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ylc-verify-content {
  height: 100%;
  position: relative;
  .ylc-verify-head {
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
  .ylc-verify-body {
    padding: 60px 120px;
    .ylc-verify-title {
      color: #303233;
      font-size: 18px;
      margin-bottom: 32px;
    }
    .ylc-verify-text {
      color: #303233;
      font-size: 14px;
    }
    .ylc-verify-btn {
      margin-top: 56px;
      background: #2abf8e;
      color: #fff;
      width: 120px;
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
  /deep/ .ant-checkbox-group-item {
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
