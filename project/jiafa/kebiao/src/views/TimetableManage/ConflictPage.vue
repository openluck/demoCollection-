<template>
  <div class="conflict-page">
    <div class="head">
      <div class="select">
        <!-- 学期 -->
        <label for="selectSchoolYear">冲突类型：</label>
        <a-select id="selectSchoolYear" v-model="type" style="width: 200px">
          <a-select-option value="1">场所冲突</a-select-option>
          <a-select-option value="2">人员冲突</a-select-option>
        </a-select>
      </div>
      <!-- 导出 -->
      <div class="export">
        <a-button type="primary" @click="handleExport"><a-icon type="logout" /> 下载冲突Word文档 </a-button>
      </div>
    </div>

    <div class="content">
      <div class="list">
        <div class="title">
          <div style="font-size:24px;font-weight:700;">场所冲突</div>
          <div>同一课堂在同一时间存在不同地点</div>
        </div>
        <div class="group">
          <p>【1组】</p>
          <div class="groupItem">
            <p style="margin-top:10px">高二年级课表安排</p>
            <a-table 
              class="groupItemList" 
              :columns="columns" 
              :data-source="dataList"
              :loading="tableLoading"
              :pagination="false"
              :rowKey="()=>Math.random()*12"
              bordered
              size="middle"
            >
            </a-table>
          </div>
          <div class="groupItem">
            <p style="margin-top:10px">高二年级课表安排</p>
            <a-table 
              class="groupItemList" 
              :columns="columns" 
              :data-source="dataList"
              :loading="tableLoading"
              :pagination="false"
              :rowKey="()=>Math.random()*12"
              bordered
              size="middle"
            >
            </a-table>
          </div>
        </div>
        <div class="group">
          <p>【2组】</p>
          <div class="groupItem">
            <p style="margin-top:10px"></p>
            <a-table 
              class="groupItemList" 
              :columns="columns" 
              :data-source="dataList"
              :loading="tableLoading"
              :pagination="false"
              :rowKey="()=>Math.random()*12"
              bordered
              size="middle"
            >
            </a-table>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="title">
          <div style="font-size:24px;font-weight:700;">人员冲突</div>
          <div>同一人员在同一时间存在</div>
        </div>
        <div class="group">
          <p>【1组】</p>
          <div class="groupItem">
            <p style="margin-top:10px"></p>
            <a-table 
              class="groupItemList" 
              :columns="columns" 
              :data-source="dataList"
              :loading="tableLoading"
              :pagination="false"
              :rowKey="()=>Math.random()*12"
              bordered
              size="middle"
            >
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '科目',
    dataIndex: 'lesSub',
    key: 'lesSub'
  },
  {
    title: '教师姓名',
    dataIndex: 'lesTeacher',
    key: 'lesTeacher'
  },
  {
    title: '班级名称',
    dataIndex: 'classes',
    key: 'classes'
  },
  {
    title: '星期',
    dataIndex: 'weekday',
    key: 'weekday'
  },
  {
    title: '节次',
    dataIndex: 'lesSort',
    key: 'lesSort'
  },
  {
    title: '时间',
    dataIndex: 'lesTime',
    key: 'lesTime'
  },
  {
    title: '场所',
    dataIndex: 'lesPlace',
    key: 'lesPlace'
  },
  {
    title: '校本课',
    dataIndex: 'xbk',
    key: 'xbk'
  }
]
export default {
  name: 'conflictPage',
  components: {},
  data () {
    return {
      type:"",
      tableLoading: false,
      dataList: [
        {
          num: '1',
          lesSub: '语文',
          lesTeacher: '张晓华',
          classes: '高2019级1班',
          weekday: '星期一',
          lesSort: '第一节',
          lesTime: '2020-02-03',
          lesPlace: 'A0102室',
          xbk: '--'
        }
      ],
      columns,
     }
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
    // 下载冲突Word文档
    handleExport(){

    },
  },
}
</script>
 
<style scoped lang="less">
 .conflict-page{
   padding: 16px;
   .head{
     display: flex;
     justify-content: space-between;
     margin-bottom: 20px;
   }

   .content{
     .list{
       border: 1px solid #E1E6EB;
       margin-bottom: 16px;
       box-shadow: 0 0 5px #E1E6EB;
     }
     .title{
       text-align: center;
       border-bottom: 1px solid #E1E6EB;
       padding: 5px;
     }
     .group{
       padding: 16px;
     }
   }
 }
</style>