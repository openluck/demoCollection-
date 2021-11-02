<!--
 * @Description: 课表单个格子组件
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-05 16:13:42
 * @LastEditors: cb
 * @LastEditTime: 2021-09-15 16:46:14
-->
<template>
  <div class="cb-t-cell" @click="child">
    <!-- 授课 -->
    <div class="cb-t-sk" v-if="row.lesSortType === '1'">
      <div class="cb-t-les" v-if="row[week].lesList.length>0">
        <div class="cb-t-les-sub">
          <span v-if="filterValue.sub" :title="row[week].lesList[0].subjectName">{{row[week].lesList[0].subjectName}}</span>
        </div>
        <div v-if="filterValue.tea" class="cb-t-les-info" :title="row[week].lesList[0].teacherName">{{row[week].lesList[0].teacherName}}</div>
        <div v-if="filterValue.place" class="cb-t-les-info" :title="row[week].lesList[0].placeName">{{row[week].lesList[0].placeName}}</div>
        <div v-if="filterValue.class" class="cb-t-les-info" :title="(row[week].lesList[0].className)+(row[week].lesList[0].stuNum ? '/'+row[week].lesList[0].stuNum+'人' : '')">
          {{row[week].lesList[0].className}}
          {{row[week].lesList[0].stuNum ? '/'+row[week].lesList[0].stuNum+'人' : ''}}
        </div>
        <div v-if="filterValue.time" class="cb-t-les-info" :title="row[week].lesList[0].lesTime">{{row[week].lesList[0].lesTime}}</div>
        <div class="cb-t-les-check">
          <a-checkbox v-if="row[week].lesList[0].isSelect" disabled v-model="row[week].lesList[0].isSelect"></a-checkbox>
        </div>
      </div>
    </div>
    <!-- 非授课 -->
    <div v-else class="cb-cell-fsk">
      <div v-if="row[week]">{{row[week].lesRemark}}</div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "",
  props: {
    row: {},
    filterValue: {
      type: Object
    }, //过滤对象
    week: {
      type: String
    },
    slotDay: {
      type: Array
    },
    i: {
      type: Number
    }
  },
  components: {},
  watch: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {
    // console.log(this.row);
  },
  methods: {
    child() {
      this.row.lesIdList = [];
      // this.row.lesIdList.push(this.row[this.week].lesList[0].lesId)
      this.row.lesIdList.push(this.week);
    },
    filertWeek(item) {
      switch (item) {
        case "lesMon":
          return "周一";
        case "lesTue":
          return "周二";
        case "lesWed":
          return "周三";
        case "lesThu":
          return "周四";
        case "lesFri":
          return "周五";
        case "lesSat":
          return "周六";
        case "lesSun":
          return "周日";
      }
    }
  }
};
</script>
 
<style  lang = "less">
</style>