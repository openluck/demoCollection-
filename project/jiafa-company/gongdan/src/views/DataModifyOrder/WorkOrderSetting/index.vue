<template>
  <div class="wk-setting">
    <header>
      <div class="title">{{title}}</div>
      <div class="notice">{{notice}}</div>
    </header>
    <main>
      <!-- 选择时间 -->
      <div class="select-time">
        <label for="">开始时间：</label>
        <!-- 开始日期 -->
        <a-date-picker
          v-model="fetchData.startTime"
          :disabled-date="disabledStartDate"
          show-time
          :showToday="false"
          format="YYYY-MM-DD HH:mm:ss"
          :allowClear="false"
          placeholder="开始日期"
        >
          <svg-icon
            slot="suffixIcon"
            icon-class="时间"
          />
        </a-date-picker>
        <span style="margin: 0 10px">结束时间：</span>
        <!-- 结束日期 -->
        <a-date-picker
          v-model="fetchData.endTime"
          :disabled-date="disabledEndDate"
          show-time
          :showToday="false"
          format="YYYY-MM-DD HH:mm:ss"
          :allowClear="false"
          placeholder="结束日期"
        >
          <svg-icon
            slot="suffixIcon"
            icon-class="时间"
          />
        </a-date-picker>
      </div>
      <a-tooltip>
        <template slot="title">
          保存您设置的时间
        </template>
        <a-button type="primary" @click="saveTime">
          <svg-icon
            icon-class="保存"
            :scale="0.8"
            style="margin-right: 5px"
          />
          保存
        </a-button>
      </a-tooltip>
    </main>
  </div>
</template>
 
<script>
/**
 * @description 工单设置
 * @date 2020-12-9 11:12:45
 */
import moment from "moment";
export default {
  name: "WorkOrderSetting",
  components: {},
  data() {
    return {
      title:"考生信息修改工单时间设置",
      notice:"操作提示：时间段之外不可添加考生数据修改工单，修改时间不影响已添加工单。",
      fetchData:{
        startTime: moment( new Date()).millisecond(0).second(0).minute(0).hour(0), //将默认时间设置为当天 00:00 - 24:00
        endTime:  moment( new Date()).millisecond(59).second(59).minute(59).hour(23),
      }
    };
  },
  computed: {},
  mounted() {
    this.getWorkOrderTime();
  },
  methods: {
    //禁选开始日期
    disabledStartDate(startTime) {
      const endTime = this.fetchData.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      return startTime.valueOf() > endTime.valueOf();
    },
    disabledEndDate(endTime) {
      const startTime = this.fetchData.startTime;
      if (!endTime || !startTime) {
        return false;
      }
      return startTime.valueOf() >= endTime.valueOf();
    },
    // 保存
    saveTime(){
      if(this.fetchData.startTime && this.fetchData.endTime){
        this.updateWorkOrderTime();
      }else{
        this.$message.warn("请选择时间段！")
      }
    },
    // 获取工单设置时间
    async getWorkOrderTime(){
      try {
        const res = await this.$api.WorkOrderSetting.getWorkOrderTime({})
        console.log(res);
        if (res.code === "200") {
          // this.fetchData.startTime = res.data.startTime;
          this.fetchData = res.data;
          this.fetchData.startTime = moment(Number(this.fetchData.startTime));
          this.fetchData.endTime = moment(Number(this.fetchData.endTime));
        } else {
          this.$message.error("获取时间失败" + res.message);
        }
      } catch (error) {
      }
      
    },
    // 更新工单设置时间
    async updateWorkOrderTime(){
      try {
        const fetchData = {...this.fetchData}
        fetchData.startTime = fetchData.startTime.valueOf();
        fetchData.endTime = fetchData.endTime.valueOf();
        const res = await this.$api.WorkOrderSetting.updateWorkOrderTime(fetchData);
        if (res.code === "200") {
          this.$message.success("设置成功！");
        } else {
          this.$message.error("设置失败！" + res.message);
        }
      } catch (error) {
      }
    }
  },
};
</script>
 
<style scoped lang="less">
.wk-setting {
  width: 100%;
  padding-left: 50px;
  background-color: #fff;
  header{
    height: 54px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6ecf2;
    .title{
      font-size: 16px;
      font-weight: 600;
      padding-left: 10px;
      position: relative;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        top: 2px;
        width: 4px;
        height: 18px;
        background: #000;
      }
    }
    .notice{
      font-size: 14px;
      color: #8a9199; 
      margin-left: 40px;
    }
  }
  main{
    height: 100%;
    .select-time{
      margin: 30px 0px;
    }
  }
}
</style>