<template>
  <div class="add-group-sub-group">
    <div class="subject-item-com">
      <div class="container">
        <div class="name">{{ combination.combinationName }}</div>
        <div class="num">{{ combination.combinationNum }} <span>人</span></div>
        <div class="jion-num">
          进入人数：
          <span v-if="isStuList">{{ combination.insertStu || 0 }}</span>
          <span v-else>
            <a-input-number style="width:65px;margin-right:5px;" v-model="value"
              @change="inputChange($event,combination)" :formatter="value=>`${value}`.replace(/[^\d]/g,'')"
              :parser="value =>value" @blur="inputBlur" :min="0" :max="combination.combinationNum" />
          </span>人
        </div>
        <div class="choose-btn" v-if="isStuList">
          <a @click="handleChooseStu(combination)">选择人员</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddGroupSubGroup',
  components: {},
  props: {
    // 数据
    combination: {
      type: Object,
      require: true,
      default: () => ({}),
    },
    // 插入人数
    // insertStu: {
    //   type: Number,
    //   require: true,
    //   default: 0,
    // },
  },
  data() {
    return {
      jionStuNum: 520,
      maxStuNum: 9999,
      value: 0,
    }
  },
  computed: {
    isStuList() {
      return this.$store.state.adminClass.isStuList;
    }
  },
  created() {
    this.value = this.combination.insertStu || 0; 
  },
  methods: {
    // 点击选择人员
    handleChooseStu(combination) {
      this.$emit('showChildrenDrawer', combination)
    },
    // 输入框失去焦点，如果清空输入框，自动将其变为0，避免输入框为空
    inputBlur() {
      this.value ? '' : this.value = 0;
    },
    // 输入框change事件
    inputChange(value, { combinationId }) {
      this.$emit("handleInputValue", value, combinationId);
    },
  },
}
</script>

<style scoped lang="less">
.subject-item-com {
  width: max-content;
  .container {
    display: flex;
    height: 40px;
    line-height: 40px;
    text-align: center;
    align-items: center;
    position: relative;
    margin-bottom: 16px;
  }
  a {
    color: #1ba4b3 !important;
  }

  .name {
    min-width: 60px;
    border: 1px solid #e3e5e6;
    border-right: 0;
    border-radius: 5% 0 0 5%;
    background-color: #f7f9fa;
  }
  .num {
    min-width: 70px;
    border: 1px solid #e3e5e6;
  }
  .jion-num {
    min-width: 120px;
    border: 1px solid #e3e5e6;
    display: flex;
    align-items: center;
    padding: 0px 5px;
    border-left: 0;
  }
  .choose-btn {
    min-width: 70px;
    border: 1px solid #e3e5e6;
    border-left: 0;
  }
  .com-delete {
    position: absolute;
    z-index: 999;
    top: -8px;
    right: -8px;
    color: white;
  }
  /deep/.ant-popover-inner {
    // background-color: #49b6c2 !important;
    width: 236px;
  }
}
</style>
