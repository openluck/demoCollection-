<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-01 13:26:49
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-01 15:55:08
-->
<template>
  <div class="dialog">
    <a-modal
      :visible="sectionVisible"
      title="新增安排"
      okText="确定"
      cancelText="取消"
      centered
      @ok="handleOk"
      @cancel="closeModel"
      destroyOnClose
      class="amodel"
    >
      <div class="select-group">
        <!-- 所属午别 -->
        <div class="select-item">
          <span>所属午别：</span>
          <a-select
            default-value="请选择"
            style="width: 300px"
            @change="ChangeCourseTime"
            class="select-btn stu-select"
          >
            <a-select-option
              v-for="item in courseTime"
              :key="item.id"
              :value="item.time"
            >
              {{ item.time }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 安排类型 -->
        <div class="select-item">
          <span>安排类型：</span>
          <a-select
            default-value="请选择"
            style="width: 300px"
            @change="ChangeCourseType"
            class="select-btn stu-select"
          >
            <a-select-option
              v-for="item in couserType"
              :key="item.id"
              :value="item.type"
            >
              {{ item.type }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 安排名称 -->
        <div class="select-item">
          <div class="arr-name">
            <span>安排名称：</span>
            <a-input placeholder="请输入名称" style="width: 300px" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "sectionDialog",
  props: {
    sectionVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      courseTime: [
        {
          id: 1,
          time: "早晨",
        },
        {
          id: 2,
          time: "上午",
        },
        {
          id: 3,
          time: "下午",
        },
        {
          id: 4,
          time: "夜晚",
        },
      ],
      couserType: [
        {
          id: 1,
          type: "授课",
        },
        {
          id: 2,
          type: "自习",
        },
      ],
    };
  },
  methods: {
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    handleOk() {},

    /**
     * @name: 取消
     * @msg:
     * @param {*}
     * @return {*}
     */
    closeModel() {
      this.$emit("closeModel", this.sectionVisible);
    },

    /**
     * @name:所属午别
     * @msg:
     * @param {*}
     * @return {*}
     */
    ChangeCourseTime() {},
    /**
     * @name:安排类型
     * @msg:
     * @param {*}
     * @return {*}
     */
    ChangeCourseType() {},
  },
};
</script>

<style lang="less" scoped>
.select-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;

  .select-item {
    width: 80%;
    height: 32px;
    margin: 0 auto 20px;
  }
}
/deep/ .ant-modal-header {
  text-align: left;
}
/deep/ .ant-modal-footer {
  text-align: center;
}
</style>