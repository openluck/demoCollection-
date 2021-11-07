<!--
 * @Description: 调整记录弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 16:14:02
 * @LastEditors: cb
 * @LastEditTime: 2021-09-28 15:18:29
-->
<template>
  <div class="">
    <global-modal
      :visible="recordVisable"
      :title="recordTitle"
      :width="680"
      :defaultBtn="false"
      @cancel="recordVisable=false"
    >
      <div class="cb-record" v-if="recordList.length>0">
        <a-timeline>
          <a-timeline-item v-for="(item,index) in recordList" :key="index">
            <div class="cb-record-time">{{item.timestamp}}</div>
            <br>
            <div class="cb-record-content">{{item.content}}</div>
          </a-timeline-item>     
        </a-timeline>
      </div>
      <div v-else class="cb-empty">
         <a-empty :description="false" />
      </div>
      <template #selfBtn>
        <div style="text-align:center">
          <a-button type="link" @click="more">更多调整记录</a-button>
        </div>
      </template>
      
    </global-modal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal";
export default {
  name: '',
  components: { GlobalModal },
  data() {
    return {
      recordVisable: false,
      recordTitle: '调整记录',
      searchData: {},
      recordList: []
     }
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
    showModal(data) {
      this.recordVisable = true
      this.searchData = data
      this.getRecordList()
    },
    more() {
      this.$router.push({
        path: '/TimetableAdjust/ScheduleAdjustment',
        query: this.searchData
      })
    },
    //接口请求
    //获取调整记录
    async getRecordList() {
      const res = await this.$api.common.getRecordList(this.searchData);
      if (res.code === '200' && res.result) {
        if (res.data.list.length > 5) {
          res.data.list.length = 5
        }
        this.recordList = res.data.list
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
.cb-record{
  padding: 20px 30px;
  .cb-record-time{
    color: #929599;
  }
  .cb-record-content{
    color: #494b4d;
  }
}
 .cb-empty{
   padding: 20px;
 }
</style>