<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 17:06:25
 * @LastEditors: cb
 * @LastEditTime: 2021-08-18 10:11:25
-->

//方法调用
<a-button @click="openRecord">
  <svg-icon icon-class="com_adjust_record" :scale="0.8" style="margin-right:8px">
  </svg-icon>
  调整记录
</a-button>


//页面使用
<RecordModal ref="RecordModal" />

//引入
import RecordModal from "@/components/common/RecordModal";
components: { RecordModal },


//打开调整记录弹窗,传入查询参数即可
openRecord(){
  let data={
    type:'5',
    }
  Object.assign(data,this.searchData)
  this.$refs.RecordModal.showModal(data)
},