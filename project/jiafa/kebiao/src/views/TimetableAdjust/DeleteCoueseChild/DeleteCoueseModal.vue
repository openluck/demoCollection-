<!--
 * @Description: 删除课程初始化弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 15:31:20
 * @LastEditors: cb
 * @LastEditTime: 2021-10-14 09:42:45
-->
<template>
  <div class="">
  <global-modal
      :visible="coueseVisible"
      :title="entTitle"
      :width="400"
      :defaultBtn="false"
      @cancel="handOk"
      :closable='false'
    >
      <div class="DeleteCoueseModal">
        <a-form-model
          :model="searchData"
          ref="searchData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="类型">
            <!-- 选择班级、教师、场所 -->
            <a-select v-model="typeId" @change="typeChageM" >
              <a-select-option v-for="(item,index) in typeList" :value='item.id' :key="index">
                {{item.name}}
              </a-select-option>    
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="isShowo" label="学段">
            <a-select
              v-model="searchData.secId"
              @change="secChange"
            >
              <a-select-option v-for="(item) in secList" :key="item.secId">{{item.secName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="isShowt" label="年级" >
            <a-select
              v-model="searchData.gradeId"
              @change="gradeChange"
            >
              <a-select-option v-for="item in gradeList" :key="item.gradeId">{{item.gradeName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="typeClass" :label="labelName" >
            
            <!-- 班级 -->
            <a-select  show-search 
            :filter-option="filterOption"  v-if="typeId === '1'" v-model="searchData.classId"  @focus="typeChange">
              <a-select-option v-for="item in classList" :key="item.classId">{{item.className}}</a-select-option>
            </a-select>
            <!-- 教师 -->
           <a-select 
            show-search 
            :filter-option="filterOption" 
            v-if="typeId === '2'"  
            v-model="searchData.personId"  
            @focus="typeChange">
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
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择场所"
              :load-data="onLoadData"
            />
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
      coueseVisible: false,
      entTitle: "选择",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
       replaceFields: {
        key: 'buildingId',
        title: 'buildingName',
        value: 'buildingId'
      },
      searchData: {
        secId: "",
        gradeId: "",
        classId: "",
        personId: '',
        placeId: ''
      },
      typeId: '1', //下拉框类型
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
      stuName: '',
      labelName: '班级',
      isShowo: true,
      isShowt: true
     }
  },
  computed: {
    ...mapState("deleteCouese", ["searchDataAll"])
  },
  mounted() {
  },
  methods: {
    ...mapMutations("deleteCouese", ["setCouese"]),
    typeChageM(value) {
     if (value === '1') { //班级
        this.isShowo = true
        this.isShowt = true
        this.labelName = '班级'
     } else if (value === '2') { //教师
        this.isShowo = true
        this.isShowt = false
        this.labelName = '教师'
     } else {
       this.isShowo = false
        this.isShowt = false
        this.labelName = '场所'
     }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    filterOption1(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    async showModal() {
      if (this.searchDataAll.secId) {
          this.coueseVisible = false
      } else {
        this.coueseVisible = true
        this.secList = JSON.parse(sessionStorage.getItem('secList'))
         this.searchData.secId = this.secList[0].secId
        this.secChange(this.searchData.secId)
        this.searchData.gradeId = this.gradeList[0].gradeId
        await this.gradeChange(this.gradeList[0].gradeId)
        if (this.classList.length > 0) {
          this.searchData.classId = this.classList[0].classId
        }
      }
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
    async gradeChange(value) {
      if (this.typeId !== '3') {
        this.classList = []
        this.searchData.classId = ''
        this.personList = []
        this.searchData.personId = ''
      }
      if (value) { //如果有值，请求1,班级数组,2教师数组，3，场所树
      if (this.typeId === '1') {
        await this.getClassByGrade()
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
      if (item.buildingType === 3) {
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
    handOk() {
      // if (this.searchData.secId === '') {
      //   this.$message.warning('请先选择学段！')
      // } else if (this.searchData.gradeId === '') {
      //   this.$message.warning('请先选择年级！')
      // } else if (this.searchData.classId === '' && this.searchData.personId === '' && this.searchData.placeId === '') {
      //    if (this.typeId === '1') {
      //     this.$message.warning('请先选择班级！')
      //   } else if (this.typeId === '2') {
      //    this.$message.warning('请先选择教师！')
      //   } else if (this.typeId === '3') {
      //   this.$message.warning('请先选择场所！')
      //   } 
      // } else {
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
        this.$emit('partObj', this.searchData)
      // }
    },
    // 根据年级获取班级
    async getClassByGrade() {
      console.log(this.searchData.gradeId);
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
 
<style  lang = "less">
 .DeleteCoueseModal {
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