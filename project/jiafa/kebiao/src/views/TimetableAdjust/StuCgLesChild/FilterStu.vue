<!--
 * @Description: 学生换课 学段年级班级学生四级联动、查询
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 13:45:34
 * @LastEditors: cb
 * @LastEditTime: 2021-09-14 16:57:42
-->
<template>
  <div style="position: relative;">
    <!-- 学段 -->
    <a-select 
      v-model="searchData.secId" 
      @change="secChange" 
      style="width: 120px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in secList" :value='item.secId' :key="index">
        {{item.secName}}
      </a-select-option>
    </a-select>
    <!-- 年级 -->
    <a-select 
      v-model="searchData.gradeId" 
      @change="gradeChange" 
      style="width: 120px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in gradeList" :value='item.gradeId' :key="index">
        {{item.gradeName}}
      </a-select-option>
    </a-select>
    <!-- 班级 -->
    <a-select 
      v-model="searchData.classId" 
      @change='classChange' 
      style="width: 120px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in classList" :value='item.classId' :key="index">
        {{item.className}}
      </a-select-option>
    </a-select>
    <!-- 学生 -->
    <a-select 
      show-search 
      v-model="searchData.personId" 
      :filter-option="filterOption" 
      @change="handleChange" 
      style="width: 120px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in personList" :value='item.stuId' :key="index">
        {{item.stuName}}
      </a-select-option>
    </a-select>
    <a-button @click="filterT" type="primary">
      <svg-icon icon-class="com_search"  style="margin-right:8px;"></svg-icon>
      查询
    </a-button>
  </div>
</template>
 
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: 'FilterStu',
  components: {},
  data() {
    return {
      secList: [], //学段列表
      gradeList: [], //年级列表
      classList: [], //班级列表
      personList: [], //人员列表
      searchData: {
        secId: '', //学段
        gradeId: '', //年级
        classId: '', //班级
        personId: '' //人员
      }
     }
  },
  computed: {
    ...mapState("stuCgLes", ["searchDataAll", 'secListAll', 'gradeListAll', 'classListAll', 'personListAll'])
  },
  mounted() {
    if (this.searchDataAll.secId &&
        this.searchDataAll.gradeId &&
        this.searchDataAll.classId &&
        this.searchDataAll.personId) {
          this.searchData = this.searchDataAll
          this.secList = this.secListAll
          this.gradeList = this.gradeListAll
          this.classList = this.classListAll
          this.personList = this.personListAll
      } 
  },
  methods: {
    ...mapMutations("stuCgLes", ["setAdjustData"]),
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
    gradeChange(value) {
      this.searchData.classId = ''
      this.classList = []
      this.classChange()
      if (value) { //如果有值，请求班级数组
        this.getClassByGrade(value)
      }
    },
    //班级change事件，置空学生，请求学生
    classChange(value) {
      this.searchData.personId = ''
      this.personList = []
      if (value) { //如果有值，请求学生数组
        this.getStuByClass(value)
      }
    },
    handleChange(value, option) {
     this.stuName = option.componentOptions.children[0].text
    },
    //查询按钮
    filterT() {
      if (this.searchData.secId === '') {
        this.$message.warning('请先选择学段！')
      } else if (this.searchData.gradeId === '') {
        this.$message.warning('请先选择年级！')
      } else if (this.searchData.classId === '') {
        this.$message.warning('请先选择班级！')
      } else if (this.searchData.personId === '') {
        this.$message.warning('请先选择学生！')
      } else {
        this.$emit('filterTimetable', this.searchData)
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
      }
    },
    //接收数组跟id对象
    receive() {
      // console.log('页面条件默认值复制',this.searchDataAll,this.secListAll,this.gradeListAll,this.classListAll,this.personListAll);
      this.searchData = this.searchDataAll
      this.secList = this.secListAll
      this.gradeList = this.gradeListAll
      this.classList = this.classListAll
      this.personList = this.personListAll
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    // 根据年级获取班级
    async getClassByGrade(value) {
      let data = {
        gradeId: value,
        secId: this.searchData.secId
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
 
</style>