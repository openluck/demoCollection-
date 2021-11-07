<!--
 * @Description: 新建学生课表选择课程弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-16 14:52:58
 * @LastEditors: cb
 * @LastEditTime: 2021-10-11 17:00:43
-->
<template>
  <div class="">
 <global-modal
      :visible="SelectCourseVisible"
      :title="entTitle"
      :width="440"
      :defaultBtn="false"
      @cancel="SelectCourseVisible=false"
    >
      <div v-if="type === '1'" class="cb-modal-content">
        <div class="cb-modal-tit">请选择学生课程</div>
        <a-radio-group v-model="value" @change="courseChange">
          <a-radio v-for="(item,index) in cgableCourseList" :key="index" :value='item.stuCourseId'>
            {{item.stuCourseName}}
          </a-radio>
        </a-radio-group>
      </div>
      <div v-if="type === '2'" class="cb-modal-content1">
        <a-form-model
          ref="searchData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="可换教学班">
            <a-select style="width:240px;" v-model="value" @change="courseChange">
              <a-select-option v-for="(item,index) in cgableCourseList" :key="index" :value='item.stuCourseId'>
                {{item.stuCourseName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #selfBtn>
        <div style="text-align:center" >
          <a-button @click="closeV">取消</a-button>
          <a-button style="margin-left:16px;" @click="addCours" type="primary">确定</a-button>
        </div>        
      </template>

    </global-modal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal";
import { mapState } from "vuex";
export default {
  name: '',
  components: { GlobalModal },
  data() {
    return {
      SelectCourseVisible: false,
      entTitle: "选择学生课程",
      labelCol: { span: 6 },
      wrapperCol: { span: 6 },
      //可换课课程列表
      cgableCourseList: [],
      value: '',
      stuCourseName: '',
      type: ''
     }
  },
  computed: {
    ...mapState("stuCgLes", ["searchDataAll", 'stuName'])
  },
  mounted() {
  
  },
  methods: {
    //type：1为新建，2为编辑
    showModal(list, type, stuCourseName) {
      this.type = type
      this.value = ''
      this.cgableCourseList = []
      if (type === '1') {
        this.entTitle = "选择学生课程"
      } else {
        this.entTitle = "可换班级教学班"
      }
      this.SelectCourseVisible = true
      this.cgableCourseList = list
      this.value = list[0].stuCourseId
      this.stuCourseName = stuCourseName
    },
    closeV() {
      this.SelectCourseVisible = false
    },
    addCours() {
      this.operateChangeLes()
    },
    courseChange() {
      // this.cgableCourseList.map(item => {
      //   if (item.stuCourseId === this.value) { 
      //     this.stuCourseName = item.stuCourseName
      //   }
      // })
    },
    //新增学生课表
    async operateChangeLes() {
      let data = {
        personId: this.searchDataAll.personId,
        gradeId: this.searchDataAll.gradeId,
        stuName: this.stuName,
        exCgCourseId: this.value,
        stuCourseName: this.stuCourseName
      }
      const res = await this.$api.studentAdjustment.operateChangeLes(data);
      if (res.code === '200' && res.result) {
        this.$message.success('操作成功！')
        this.closeV()
        this.$emit('addCommit')
      } else {
        this.$message.warning(res.message)
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
.cb-modal-content {
  padding: 0 34px;
  .cb-modal-tit{
    width: 100%;
    height: 48px;
    font-size: 14px;
    text-align: LEFT;
    color: #616366;
    line-height: 48px;
  }
}
.cb-modal-content1 {
  padding: 32px 54px 16px;
}
/deep/.ant-radio-wrapper{
  width: 100%;
  margin-bottom: 15px;
}
</style>