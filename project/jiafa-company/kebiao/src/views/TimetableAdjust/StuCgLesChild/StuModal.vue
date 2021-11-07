<!--
 * @Description: 学生选课初始化弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 15:03:19
 * @LastEditors: cb
 * @LastEditTime: 2021-10-12 17:11:12
-->
<template>
  <div class="">
  <global-modal
      :visible="stuVisible"
      :title="entTitle"
      :width="400"
      :defaultBtn="false"
      @cancel="handOk"
       :closable='false'
    >
      <div class="cb-modal-content">
        <a-form-model
          :model="searchData"
          ref="searchData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="学段">
            <a-select
              v-model="searchData.secId"
              @change="secChange"
            >
              <a-select-option v-for="(item) in secList" :key="item.secId">{{item.secName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="年级" >
            <a-select
              v-model="searchData.gradeId"
              @change="gradeChange"
            >
              <a-select-option v-for="item in gradeList" :key="item.gradeId">{{item.gradeName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="班级" >
            <a-select
              v-model="searchData.classId"
              @change="classChange"
            >
              <a-select-option v-for="item in classList" :key="item.classId">{{item.className}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="学生">
            <a-select 
            show-search 
            :filter-option="filterOption"
              v-model="searchData.personId"
              @change="handleChange"
            >
              <a-select-option v-for="item in personList"  :key="item.stuId">{{item.stuName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #selfBtn>
        <div style="text-align:center">
          <a-button type="primary" @click="handOk">确定</a-button>
        </div>        
      </template>

    </global-modal>
  </div>
</template>
 
<script>
import { mapState, mapMutations } from "vuex";
import GlobalModal from "@/components/common/GlobalModal";
export default {
  name: '',
  components: { GlobalModal },
  data() {
    return {
      stuVisible: false,
      entTitle: "选择换课学生",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      searchData: {
        secId: "",
        gradeId: "",
        classId: "",
        personId: ''
      },
      secList: [],
      gradeList: [],
      classList: [],
      personList: [],
      stuName: ''
     }
  },
  computed: {
    ...mapState("stuCgLes", ["searchDataAll"])
  },
  mounted() {
  },
  methods: {
    ...mapMutations("stuCgLes", ["setAdjustData"]),
    async showModal() {
      if (this.searchDataAll.secId &&
        this.searchDataAll.gradeId &&
        this.searchDataAll.classId &&
        this.searchDataAll.personId) {
          this.stuVisible = false
      } else {
        this.stuVisible = true
        this.secList = JSON.parse(sessionStorage.getItem('secList'))
        this.searchData.secId = this.secList[0].secId
        this.secChange(this.searchData.secId)
        this.searchData.gradeId = this.gradeList[0].gradeId
        await this.gradeChange(this.gradeList[0].gradeId)
        if (this.classList.length > 0) {
          this.searchData.classId = this.classList[0].classId
           await this.classChange(this.classList[0].classId)
           if (this.personList.length > 0) {
             this.searchData.personId = this.personList[0].stuId
           }
        }
      }
    },
    //学段change事件，置空年级班级学生，请求年级，班级，学生
    secChange(value) {
      this.searchData.gradeId = ''
      this.gradeList = []
      this.gradeChange()
      //获取年级数组
      this.secList.map(item => {
        if (item.secId === value) {
          this.gradeList = item.gradeList
        }
      })
    },
    //年级change事件，置空班级学生，请求班级，请求学生
    async gradeChange(value) {
      this.searchData.classId = ''
      this.classList = []
      this.classChange()
      if (value) { //如果有值，请求班级数组
       await this.getClassByGrade(value)
      }
    },
    //班级change事件，置空学生，请求学生
    async classChange(value) {
      console.log(value);
      this.searchData.personId = ''
      this.personList = []
      if (value) { //如果有值，请求学生数组
       await this.getStuByClass(value)
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleChange(value, option) {
      this.stuName = option.componentOptions.children[0].text
    },
    handOk() {
      // this.$refs.searchData.validate(valid => {
      //   if (valid) {
          this.stuVisible = false
          this.setAdjustData(
            {
           searchData: this.searchData,
            secList: this.secList,
            gradeList: this.gradeList,
            classList: this.classList,
            stuName: this.stuName,
            personList: this.personList
          }
          );
          this.$emit('partObj', this.searchData)
      //   }
      // });
    },
    // 根据年级获取班级
    async getClassByGrade(value) {
      let data = {
        gradeId: value,
        secId: this.searchData.secId,
        appId: sessionStorage.getItem("appId")
      }
      let res = await this.$api.common.getClassByGrade(data)
      if (res.code === '200') {
        this.classList = res.data
      }
    },
    // 根据班级获取学生
    async getStuByClass(value) {
      const data = { classId: value };
      const res = await this.$api.common.getStuByClass(data);
      if (res.code === '200') {
        this.personList = res.data
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
 .cb-modal-content {
  padding: 32px 54px 16px;
  .ant-form-item {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    margin-bottom: 16px;
    vertical-align: top;
  }
}
</style>