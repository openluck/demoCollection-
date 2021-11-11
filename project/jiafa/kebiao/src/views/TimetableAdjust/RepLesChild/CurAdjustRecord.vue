<template>
  <div class="adjust-record">
    <div class="adjust-record-title">当前调整记录</div>
    <div class="adjust-record-content">
      <div class="adjust-record-content-item" v-for="(item,index) in adjustRecord" :key="index">
        <div class="tit">
          <svg-icon class="tag" icon-class="标签" ></svg-icon><div class="time">{{item.time}}</div>
        </div>
        
        <p>{{item.content}}</p>
      </div>
    </div>
  </div>
</template>
 
<script>
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      adjustRecList: []
    };
  },
  computed: {
    ...mapState("replaceLes", ["adjustRecord"])
  },
  mounted() {},
  methods: {}
};
</script>
 
<style scoped lang = "less">
.adjust-record {
  width: 100%;
  margin-top: 42px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .adjust-record-title {
    height: 54px;
    line-height: 54px;
    padding-left: 10px;
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .adjust-record-content-item {
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 10px;
    .tit{
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      .tag{
        margin-right: 10px;
      }
      .time{
        font-weight: 600;
      }
    }
    p{
      font-size: 14px;
    }
  }
}
</style>