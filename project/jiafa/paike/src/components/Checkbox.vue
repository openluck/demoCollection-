<template>
  <div class="diyCheckbox" :style="{ borderColor:(isCheck?styles.bgc:'#dadfe6'), }" @click="check">
    <div class="diySubject" :style="{backgroundColor:(isCheck?styles.textBgc:'#f5f5f5'), }">{{subject}}</div>
    <div  :style="{backgroundColor:(isCheck?styles.bgc:'white'), }" class="isCommit">
     <span v-show="isCheck">√</span> 
    </div>
  </div>
</template>

<script>
export default {
  name: "diyCheckbox",
  props: {
    item: {
      type: Object
    },
    checkIdList: {
       type: Array
    }
  },
  data() {
    return {
      styles: {
        bgc: '#2e8ae6',
        textBgc: '#f3f8ff'
      },
      subject: '',
      isCheck: false
    }
  },
  created() {
    this.subject = this.item.SubjectName
  },
  methods: {
    check() {
        if (!this.isCheck) { //确定
          if (this.checkIdList.length < 3) {
            this.isCheck = !this.isCheck
            this.$emit('handChange', this.item.SubjectId)
          } else {
            this.$message.error('最多选择三个',5)
          }
        } else { //取消
         this.isCheck = !this.isCheck
          this.$emit('delSub', this.item.SubjectId)
        }
    }
  }
}
</script>

<style scoped lang="less">
.diyCheckbox{
  // width: 134px;
  height: 34px;
  border: 1px solid #dadfe6;
  margin-right: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .diySubject{
    height: 32px;
    padding: 0 10px;
    border-right: 1px solid #dadfe6;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
  }
  .isCommit{
    width: 40px;
    height: 100%;
    line-height: 34px;
    flex-grow: 1;
    text-align: center;
    color: white;
  }
}
</style>