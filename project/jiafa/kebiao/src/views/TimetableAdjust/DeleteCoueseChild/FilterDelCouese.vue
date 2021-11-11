<!--
 * @Description: 删除课程顶部条件过滤
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-16 16:53:43
 * @LastEditors: cb
 * @LastEditTime: 2021-10-14 09:44:41
-->
<template>
  <div style="position: relative;"> 
    <a-select 
      v-model="typeId" 
      @change="typeChageM"  
      style="width: 120px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in typeList" :value='item.id' :key="index">
        {{item.name}}
      </a-select-option>    
    </a-select>
    <!-- 学段 -->
    <a-select 
      v-if="isShowo"
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
      v-if="isShowt"
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
    <!-- 选择班级、教师、场所 -->

    <!-- 班级 -->
    <a-select 
    show-search 
    :filter-option="filterOption" 
     @focus="typeChange"
      v-if="typeId === '1'" 
      v-model="searchData.classId"  
      style="width: 130px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="item in classList" :key="item.classId">{{item.className}}</a-select-option>
    </a-select>
    <!-- 教师 -->
    <a-select 
      show-search 
      :filter-option="filterOption" 
       @focus="typeChange"
      v-if="typeId === '2'"  
      v-model="searchData.personId" 
      style="width: 130px;margin-right:16px;"
      :getPopupContainer="(v) => v.parentNode"
      :dropdownStyle="{zIndex:'9'}"
    >
      <a-select-option v-for="(item,index) in personList" :value='item.teacherId' :key="index">
        {{item.teacherName}}
      </a-select-option>
    </a-select>
    <!-- 场所 -->
    <a-tree-select
    show-search
     :filterTreeNode="filterOption1"
     @focus="typeChange"
      v-if="typeId === '3'"
      v-model="searchData.placeId"
      :replace-fields="replaceFields"
      style="width: 130px;margin-right:16px;"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' ,zIndex:'9'}"
      :getPopupContainer="(v) => v.parentNode"
      :tree-data="treeData"
      placeholder="请选择场所"
      :load-data="onLoadData"
    />
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
      secList: [], //学段
      gradeList: [], //年级
      classList: [], //班级
      personList: [], //教师
      treeData: [], //场所
      typeList: [{
        id: '1',
        name: '班级'
      }, {
        id: '2',
        name: '教师'
      }, {
        id: '3',
        name: '场所'
      }], //类型列表
      typeId: '1', //下拉框类型
      searchData: {
        secId: '', //学段
        gradeId: '', //年级
        classId: '', //班级
        personId: '', //人员
        placeId: ''
      },
      replaceFields: {
        key: 'buildingId',
        title: 'buildingName',
        value: 'buildingId'
      },
      isShowo: true,
      isShowt: true
     }
  },
  computed: {
    ...mapState("deleteCouese", ["searchDataAll"])
  },
  mounted() {
    if (this.searchDataAll.secId) {
      this.searchData = {
        secId: this.searchDataAll.secId, //学段
        gradeId: this.searchDataAll.gradeId, //年级
        classId: this.searchDataAll.classId, //班级
        personId: this.searchDataAll.personId, //人员
        placeId: this.searchDataAll.placeId
      }
      this.secList = this.searchDataAll.secList //学段
      this.gradeList = this.searchDataAll.gradeList//年级
      this.classList = this.searchDataAll.classList//班级
      this.personList = this.searchDataAll.personList//教师
      this.treeData = this.searchDataAll.treeData //场所
      this.typeId = this.searchDataAll.typeId
      console.log(this.typeId);
      if (this.typeId === '1') { //班级
          this.isShowo = true
          this.isShowt = true
      } else if (this.typeId === '2') { //教师
          this.isShowo = true
          this.isShowt = false
      } else {
        this.isShowo = false
          this.isShowt = false
      }
    } 
  },
  methods: {
    ...mapMutations("deleteCouese", ["setCouese"]),
    typeChageM(value) {
     if (value === '1') { //班级
        this.isShowo = true
        this.isShowt = true
     } else if (value === '2') { //教师
        this.isShowo = true
        this.isShowt = false
     } else {
       this.isShowo = false
        this.isShowt = false
     }
    },
    filterOption1(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    //学段change事件，置空年级班级教师，请求年级，班级，教师
    secChange(value) {
      console.log(value);
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
    //年级change事件，置空班级教师，请求班级，请求教师
    gradeChange(value) {
      if (this.typeId !== '3') {
        this.classList = []
        this.searchData.classId = ''
        this.personList = []
        this.searchData.personId = ''
      }
      if (value) { //如果有值，请求1,班级数组,2教师数组，3，场所树
      if (this.typeId === '1') {
        this.getClassByGrade(value)
      } else if (this.typeId === '2') {
        this.getTeacherBySubject()
      } else if (this.typeId === '3' && this.treeData.length === 0) {
        this.getPlaceTree()
      } 
      }
    },
    //类型change事件，置空班级教师场所，如果班级教室场所数组无值，根据typeId请求班级教师场所
    typeChange() {
      if (this.searchData.secId === '') {
        this.$message.warning('请先选择学段！')
        return
      } else if (this.searchData.gradeId === '' && this.isShowt) {
        this.$message.warning('请先选择年级！')
        return
      }
      this.searchData.classId = ''
      this.searchData.personId = ''
      this.searchData.placeId = ''
      if (this.typeId === '1' && this.classList.length === 0) {
       this.getClassByGrade()
      } else if (this.typeId === '2' && this.personList.length === 0) {
       this.getTeacherBySubject()
      } else if (this.typeId === '3' && this.treeData.length === 0) {
        this.getPlaceTree()
      } else {
        
      }  
    },
    async onLoadData(treeNode) {
      let item = treeNode.dataRef
      if (item.buildingType === '3' || item.buildingType === 3) {
        const children = await this.getClassroom(item.buildingId)
        this.treeData = this.getArrayObj(this.treeData, item.buildingId, children)
        this.treeData = [...this.treeData]
      } else {
        
      }
    },
    getArrayObj(data, id, children) {
      for (var i in data) {
        if (data && id && children) {
          if (data[i].buildingId === id) {
            data[i].children = children
          } else {
              this.getArrayObj(data[i].children, id, children);
          }
        } else {
         if (!data[i].isLeaf) {
            data[i].disabled = true
            this.getArrayObj(data[i].children);
          }
        }
      }
      return data
    },
    handleChange(value, option) {
     this.stuName = option.componentOptions.children[0].text
    },
    //查询按钮
    filterT() {
       if (this.typeId === '1') { //班级
          if (this.searchData.secId === '') {
            this.$message.warning('请先选择学段！')
            return
          } else if (this.searchData.gradeId === '') {
            this.$message.warning('请先选择年级！')
             return
          } else if (this.searchData.classId === '') {
            this.$message.warning('请选择班级！')
             return
          } 
        } else if (this.typeId === '2') { //教师
          if (this.searchData.secId === '') {
            this.$message.warning('请先选择学段！')
             return
          } else if (this.searchData.personId === '') {
            this.$message.warning('请先选择教师！')
             return
          }
        } else if (this.typeId === '3') { //场所
          if (this.searchData.placeId === '') {
            this.$message.warning('请先选择场所！')
             return
          } 
        } 
        this.coueseVisible = false
        let data = {
          typeId: this.typeId, //下拉框类型
          secId: this.searchData.secId,
          gradeId: this.searchData.gradeId,
          classId: this.searchData.classId,
          personId: this.searchData.personId,
          placeId: this.searchData.placeId,
          secList: this.secList, //学段
          gradeList: this.gradeList, //年级
          classList: this.classList, //班级
          personList: this.personList, //教师
          treeData: this.treeData //场所
        }
        this.setCouese(data);
        this.$emit('filterTimetable', this.searchData)
    },
    //接收数组跟id对象
    receive() {
     this.searchData = {
        secId: this.searchDataAll.secId, //学段
        gradeId: this.searchDataAll.gradeId, //年级
        classId: this.searchDataAll.classId, //班级
        personId: this.searchDataAll.personId, //人员
        placeId: this.searchDataAll.placeId
      }
      this.secList = this.searchDataAll.secList //学段
      this.gradeList = this.searchDataAll.gradeList//年级
      this.classList = this.searchDataAll.classList//班级
      this.personList = this.searchDataAll.personList//教师
      this.treeData = this.searchDataAll.treeData //场所
      this.typeId = this.searchDataAll.typeId
      if (this.typeId === '1') { //班级
          this.isShowo = true
          this.isShowt = true
      } else if (this.typeId === '2') { //教师
          this.isShowo = true
          this.isShowt = false
      } else {
        this.isShowo = false
          this.isShowt = false
      }
    },

    // 根据年级获取班级
    async getClassByGrade() {
      let data = {
        gradeId: this.searchData.gradeId,
        secId: this.searchData.secId,
        appId: sessionStorage.getItem("appId")
      }
      let res = await this.$api.common.getClassByGrade(data)
      if (res.code === '200') {
        this.classList = res.data
      }
    },
    // 根据学段年级获取教师
    async getTeacherBySubject() {
      const data = {
        secId: this.searchData.secId,
        gradeId: this.searchData.gradeId
      };
      const res = await this.$api.common.getTeacherBySub(data);
      if (res.code === '200') {
        this.personList = res.data
      }
    },
    // 场所树，到楼层
    async getPlaceTree() {
      let res = await this.$api.common.getPlaceTree()
      if (res.code === '200' && res.result) {
        this.treeData = this.getArrayObj([res.data])
      }
    },
    // 根据楼层获取房间
    async getClassroom(value) {
      const data = { buildingId: value };
      const res = await this.$api.common.getClassroom(data);
      if (res.code === '200' && res.result) {
        return res.data.map(i => ({ ...i, buildingId: i.classroomId, isLeaf: true, value: i.classroomId, buildingName: i.classroomName }))
      } else {
        return []
      }
    }
    
  }
}
</script>
 
<style scoped lang = "less">