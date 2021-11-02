<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 19:25:20
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-25 20:17:37
-->
<template>
  <div class="tips-dialog">
    <a-modal
      class="import-course"
      :visible="BatchSettingDialogVisible"
      @cancel="CloseBatchSettingDialog()"
      title="批量课时设置"
      :destroyOnClose="true"
    >
      <div class="content">
        <div>
          <a-icon type="info-circle" color="#ffbc7a" />
        </div>
        <p>批量设置更新后，将运用于该科目下所有教师课时。</p>
      </div>
      <div class="table">
        <div class="table-title">
          <span class="name">教研组</span>
          <span class="name">最大课时数</span>
        </div>
        <div class="table-con">
          <span class="con">{{ projectGroupName }}</span>
          <a-input-number
            placeholder="0"
            :class="['con','input-number']"
            :max="999"
            v-model="hourTime"
          />
          <!-- :min="0" -->
        </div>
        <div></div>
      </div>
      <template slot="footer">
        <a-button @click="CloseBatchSettingDialog()">取消</a-button>
        <a-button class="themeBtn" @click="debounceHandleOk()">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { debounce } from "@/Utils/util.js";
export default {
  name: "",
  props: {
    BatchSettingDialogVisible: {
      type: Boolean,
      default: false,
    },
    TipsData: {
      type: Object,
      default: {},
    },
    projectGroupName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      hourTime: null,
    };
  },
  methods: {
    CloseBatchSettingDialog() {
      this.hourTime = null;
      this.$emit("CloseBatchSettingDialog", this.BatchSettingDialogVisible);
    },
    // debounce,
    debounceHandleOk: debounce(
      function () {
        this.comfirmImport();
      },
      2000,
      true
    ),
    comfirmImport() {
      if (this.hourTime === null) {
        this.$message.warning("课时不能设置为空");
        this.hourTime = null;
      } else {
        // this.$parent.setTeacherHourNewAll(this.hourTime);
        // this.hourTime = null;
        let pd = false;
        pd = this.isNum(this.hourTime);
        if (pd) {
          this.$parent.setTeacherHourNewAll(this.hourTime);
          this.hourTime = null;
        } else {
          this.$message.warning("课时只能设置0,正整数");
          this.hourTime = null;
        }
      }
    },
    // 只能为0，正整数
    isNum(num) {
      if (num >= 0) {
        if (num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  font-size: 16px;
  width: 100%;
  height: 30px;
  border: 1px solid #ffeeb7;
  background-color: #fffbe6;
  display: flex;
  justify-content: center;
  align-content: center;
  p {
    height: 100%;
    margin-left: 10px;
    margin-bottom: 0;
    // font-size: 19px;
  }
  .ant-modal-footer {
    border-top: 1px solid #e8e8e8;
  }
  /deep/ .anticon {
    color: #ffbc7a;
  }
}
.table {
  width: 80%;
  height: auto;
  margin: 30px auto;
  .table-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    text-align: left;
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    font-size: 16px;
    height: 44px;
    align-items: center;
    .name {
      flex: 1;
      text-align: center;
    }
  }
  .table-con {
    display: flex;
    height: 44px;
    align-items: center;
    justify-content: space-around;
    margin-top: 20px;
    .con {
      // flex: 1;
      text-align: center;
      margin-left: 23px;
    }
    .input-number {
      width: 100px;
    }
  }
}

/deep/ .ant-modal-title {
  text-align: left;
}
/deep/ .ant-modal-body {
  padding: 10px !important;
}
/deep/ .ant-modal-footer {
  text-align: center;
}
</style>