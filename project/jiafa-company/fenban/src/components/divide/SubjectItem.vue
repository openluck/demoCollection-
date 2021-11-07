<template>
  <div class="subject-item-com">
    <div class="container">
      <div class="com-left">
        {{dataType === 'combination' ? combination.combinationName : dataType === 'subject'? combination.subjectName : ''}}
      </div>
      <div class="cut-off"></div>
      <div class="com-center">
        {{dataType === 'combination' ? combination.combinationNum : dataType === 'subject'? combination.subjectNum : ''}}
        <span>人</span>
      </div>
      <div class="cut-off" v-if="showEdit"></div>
      <div class="com-right" v-if="showEdit"><a>编辑</a></div>
      <a-popconfirm title="你确定要删除该科目组合吗？" ok-text="确定" cancel-text="取消" @confirm="confirm(combination)"
        :getPopupContainer="triggerNode => triggerNode.parentNode || document.body">
        <a class="com-delete" v-if="showDel">
          <svg-icon icon-class="del"></svg-icon>
        </a>
      </a-popconfirm>
    </div>
  </div>
</template>

<script>
/**
 * @description 科目及科目组合组件
 * @date 2021-3-31 15:05:15
 */
export default {
  name: 'SubjectItem',
  props: {
    // 类型
    dataType: {
      type: String,
      require: true,
      default: () => ''
    },
    groupId: {
      type: String,
      require: true,
      default: () => ''
    },
    // 数据
    combination: {
      type: Object,
      require: true,
      default: () => ({})
    },
    // 是否显示编辑
    showEdit: {
      type: Boolean,
      require: false,
      default: false
    },
    // 是否显示删除tag
    showDel: {
      type: Boolean,
      require: false,
      default: false
    },
  },
  inject: ['getBaseClassData'],
  methods: {
    // 确认删除
    confirm(combination) {
      this.delSubGroupInGroup(combination);
    },
    // 删除添加的组内科目组合
    async delSubGroupInGroup(combination) {
      try {
        const { combinationId } = combination;
        const { groupId, planId } = this;
        const params = { combinationId, groupId, planId };
        const res = await this.$api.chooseExam.delSubGroupInGroup(params);
        if (res.code === '200') {
          this.$message.success('删除成功！',5);
          this.getBaseClassData();
        } else {
          this.$message.error("删除失败！" + res.message,5)
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  },
}
</script>

<style scoped lang="less">
.subject-item-com {
  width: max-content;
  .container {
    display: flex;
    height: 40px;
    text-align: center;
    align-items: center;
    background-color: #49b6c2;
    color: white;
    position: relative;
  }
  a {
    color: white !important;
  }
  .cut-off {
    width: 1px;
    height: 70%;
    background-color: #80ccd4;
  }
  .com-left {
    min-width: 78px;
    border-right: 0;
    border-radius: 5% 0 0 5%;
  }
  .com-center {
    min-width: 78px;
  }
  .com-right {
    min-width: 75px;
    border-left: 0;
    span {
      color: #1ba4b3;
    }
  }
  .com-delete {
    position: absolute;
    z-index: 999;
    top: -8px;
    right: -8px;
    color: white;
  }
  /deep/.ant-popover-inner {
    width: 236px;
  }
}
</style>
