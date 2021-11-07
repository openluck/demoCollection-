<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 17:06:25
 * @LastEditors: went
 * @LastEditTime: 2021-08-19 14:12:20
-->

//方法调用
<a-button @click="ApplyOtherWeek">
  <svg-icon icon-class="com_adjust_record" :scale="0.8" style="margin-right:8px">
  </svg-icon>
 应用于其他周次
</a-button>


//页面使用 
<ApplyOtherWeek ref="ApplyOtherWeek" />

//引入
import ApplyOtherWeek from "@/components/common/ApplyOtherWeek";
components: { ApplyOtherWeek },


//打开应用到其他周次弹窗,传入查询参数即可
  ApplyOtherWeek() {
      this.$refs.ApplyOtherWeek.showModal();
      const params = {
        secId: this.reLesInitSecId,
        gradeId: "",
        classId: "",
        palceId: "",
        personId: this.reLesInitTeacherId,
        teachWeekId: "",
        subjectId: this.reLesInitSubjectId,
        changeType: 2  //1. 周内调课  2. 代课 3 场所调课 4. 取消课程
      };
      this.$refs.ApplyOtherWeek.initExParam(params);
  }