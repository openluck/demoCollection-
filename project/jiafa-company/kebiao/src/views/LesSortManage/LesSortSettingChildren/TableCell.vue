<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-07-21 16:34:20
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-15 16:03:44
-->
<template>
  <div class="yqy-table-cell">
    <span v-if="row.lesSortType === '0' && row.showType === '2' && status===1" class=""
      :title="curValue">
      <template v-if="!isEditing">
        {{ curValue }}
        <!-- <a-icon
          type="edit"
          class="edit-icon"
          style="color:#2ABF8E"
          @click="isEditing = true"
        /> -->
        <svg-icon class="edit-icon" icon-class="com_edit" @click.native="isEditing = true"
          style="fontSize:14px;margin-right: 6px" />
      </template>
      <template v-else>
        <a-input ref="input" v-model.trim="curValue" @blur="saveNotes()" :maxLength="10"
          :suffix="curValue.length + '/' + 10" />
        <!-- <InputSuffix ref="input" v-model.trim="curValue"  @blurEvent='saveNotes()'/> -->
      </template>
    </span>
    <span v-else :title="curValue">{{ curValue }}</span>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    value: {},
    row: {},
    arrLindex: {
      type: Number
    },
    status: {
      type: Number
    }
  },
  data() {
    return {
      isEditing: false,
      curValue: ''
    };
  },
  computed: {

  },
  watch: {
    isEditing(val) {
      if (val) {
        this.$nextTick(() => {
          // console.log(11111111,this.$refs);
          this.$refs.input.focus()
        })
      }
    }
  },
  beforeCreate() {
    // console.log('子 beforeCreate')
  },
  created() {
  },
  mounted() {
    // console.log('子 mounted')
    this.value ? this.curValue = this.value[this.arrLindex] : null
    // console.log("status", this.status);
  },
  methods: {
    saveNotes() {
      // console.log("curValue", this.curValue);
      // console.log("row", this.row.lesSortId);
      // let arr = [...this.value];
      this.value.splice(this.arrLindex, 1, this.curValue)
      // console.log(arr);
      this.isEditing = false;
    }

  }
};
</script>

<style scoped lang="less">
.yqy-table-cell {
  position: relative;
  height: 32px;
  & > span {
    line-height: 32px;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ant-input {
    width: 100%;
  }
  .edit-icon {
    color: #797c7f;
    position: absolute;
    top: -10px;
    right: -2px;
    &:hover {
      color: @primary-color;
    }
  }

  .ant-input-affix-wrapper {
    /deep/.ant-input {
      padding-right: 40px;
    }
    /deep/.ant-input-suffix {
      color: #d2d5d9;
      right: 5px;
    }
  }
}
</style>
