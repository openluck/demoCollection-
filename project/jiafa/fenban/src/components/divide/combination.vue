<template>
  <div class="item-com" v-if="DCtype">
    <div
      class="com-left"
      :style="
        divideclassType === '2' && combination.type === '0' ? disableStyle : ''
      "
    >
      {{ combinationItem.combinationName }}
    </div>
    <div
      class="com-center"
      :style="
        divideclassType === '2' && combination.type === '0' ? disableStyle : ''
      "
    >
      {{ combination.combinationNum }}人
    </div>
    <div class="com-right" v-if="divideclassType === '1'">
      <a @click="editCombination">编辑</a>
    </div>
    <!-- <a-icon class="com-delete" type="close" /> -->
    <a-popconfirm
      v-if="divideclassType === '1'"
      title="你确定要删除该科目组合吗？"
      ok-text="确定"
      cancel-text="取消"
      @confirm="delCombination"
      @cancel="cancel"
    >
      <a class="com-delete">
        <svg-icon icon-class="close" class="com-svg"></svg-icon>
      </a>
    </a-popconfirm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  components: {},
  props: ['combination', 'adminClassId', 'adminClassInfo', 'groupId'],
  inject: ['openList', 'getBaseClassData'],
  data() {
    return {
      combinationItem: {},
      // adminClassInfoToCom: {},
      disableStyle: {
        backgroundColor: '#AAAAAA',
      },
    }
  },
  created() {
    this.combinationItem = this.combination
    // this.adminClassInfoToCom = Object.assign(
    //   {},
    //   this.adminClassInfo,
    //   this.combination,
    //   {
    //     groupId: this.groupId,
    //   }
    // )
  },
  computed: {
    // 分班类型： 选考分班还是学考分班 1 - 选考分班  2 - 学考分班
    ...mapState('adminClass', ['divideclassType']),
    // 控制组合显示类型
    // type string类型（0-选考，1-学考）
    DCtype() {
      return (
        (this.divideclassType === '1' && this.combination.type === '0') ||
        this.divideclassType === '2'
      )
    },
  },
  mounted() {},
  methods: {
    async delCombination() {
      const data = {
        adminClassId: this.adminClassId,
        combinationId: this.combination.combinationId,
      }
      let res = await this.$api.adminClass.delCombination(data)
      if (res.code === '200') {
        this.$message.success(res.message,5)
        // 分组和行政班级
        this.getBaseClassData()
      } else {
        // 存在合并班级时的情况
        this.$store.commit('adminClass/setDelErrorInfo', res.message)
        this.$store.commit('adminClass/setDelModalStatus', true)
      }
    },
    editCombination() {
      const list = Object.assign({}, this.adminClassInfo, this.combination, {
        groupId: this.groupId,
      })
      this.openList(list)
      this.$store.commit('adminClass/setEditModalStatus', true)
      // this.$store.commit('adminClass/setEditComModalData', this.adminClassItem)
    },
    cancel() {},
  },
}
</script>

<style scoped lang="less">
.bg-disabled {
  background-color: #aaaaaa;
}
.item-com {
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 16px;
  margin-right: 20px;
  .com-left {
    width: 75px;
    border: 1px solid #e3e5e6;
    border-right: none;
    border-radius: 5% 0 0 5%;
    background-color: #f7f9fa;
  }
  .com-center {
    width: 75px;
    border: 1px solid #e3e5e6;
  }
  .com-right {
    width: 75px;
    border: 1px solid #e3e5e6;
    border-left: 0;
    span {
      color: #1ba4b3;
    }
  }
  .com-delete {
    width: 20px;
    top: -20px;
    left: -10px;
    position: relative;

    .com-svg {
      color: red;
    }
  }
}
</style>
