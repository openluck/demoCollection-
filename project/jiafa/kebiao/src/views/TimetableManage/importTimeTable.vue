<template>
  <div class="import-timetable">
    <a-modal class="import-timetable-modal"
             width="600px"
             :destroyOnClose="true"
             :maskClosable="false"
             :keyboard="false"
             v-model="visible"
             title="导入数据"
             @ok="onSubmit">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 数据来源方式 -->
        <a-form-model-item label="数据来源方式："
                           prop="dataSourceMethods">
          <a-select v-model="form.dataSourceMethods"
                    placeholder="请选择数据来源方式">
            <a-select-option value="1">手动导入</a-select-option>
            <a-select-option value="2">第三方自动获取</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="form.dataSourceMethods==='2'"
                           :wrapper-col="{ span: 21,offset: 1}">
          <div
               style="width:100%;height:50px;background:#fff4f3;display:flex;align-items: center;border-radius: 5px;">
            <a-icon type="exclamation-circle"
                    style="color:#ff7062;fontSize:24px;margin-right:15px;" />
            新课表数据将在当前时间的第二天覆盖重复数据，您确定继续吗？
          </div>
        </a-form-model-item>

        <!-- 导入数据方式 -->
        <a-form-model-item v-if="form.dataSourceMethods==='1'"
                           label="导入数据方式："
                           prop="exportMethods">
          <a-select v-model="form.exportMethods"
                    placeholder="请选择导入数据方式">
            <a-select-option value="1">增加</a-select-option>
            <a-select-option value="2">替换</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 是否走班 -->
        <a-form-model-item v-if="form.dataSourceMethods==='1'"
                           label="是否走班："
                           prop="isml">
          <a-select v-model="form.isml"
                    placeholder="请选择是否走班">
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="2">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 课表应用范围 -->
        <a-form-model-item v-if="form.dataSourceMethods==='1'"
                           label="课表应用范围："
                           prop="useWeekScope">
          <a-select mode="multiple"
                    placeholder="请选择课表应用范围"
                    @change="handleChange"
                    @popupScroll="popupScroll"
                    v-model="form.useWeekScope">
            <a-select-option v-for="(item,index) of useWeekScopeList"
                             :key="index">
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <!-- 教室课表： -->
        <a-form-model-item v-if="form.dataSourceMethods==='1'"
                           label="教室课表："
                           :wrapper-col="{ span: 16, offset: 0 }"
                           prop="classroomTimetable">
          <a-upload name="logo"
                    action="/upload.do"
                    list-type="picture">
            <a-button>
              <a-icon type="upload" /> 上传文件
            </a-button>
            <span class="extra-notes">支持扩展名：xlsx、xls</span>
          </a-upload>
          <a> 下载教室课表导入模板 </a>
        </a-form-model-item>
        <!-- 校本课程学生人员关系表： -->
        <a-form-model-item v-if="form.dataSourceMethods==='1' && form.isml==='2' "
                           :key="2344325"
                           label="校本课程学生人员关系表："
                           :label-col="{ span: 8, offset: 0 }"
                           :wrapper-col="{ span: 14, offset: 0 }"
                           prop="personRelation">
          <a-upload name="logo"
                    action="/upload.do"
                    list-type="picture">
            <a-button>
              <a-icon type="upload" /> 上传文件
            </a-button>
            <span class="extra-notes">支持扩展名：xlsx、xls</span>
          </a-upload>
          <a> 下载校本课程学生人员关系表导入模板 </a>
        </a-form-model-item>
        <!-- 国家课程与校本课程学生人员关系表： -->
        <a-form-model-item v-if="form.dataSourceMethods==='1' && form.isml==='1' "
                           :key="1135486"
                           label="国家课程与校本课程学生人员关系表："
                           :label-col="{ span: 12, offset: 0 }"
                           :wrapper-col="{ span: 12, offset: 0 }"
                           prop="countryRelation">
          <a-upload name="logo"
                    action="/upload.do"
                    list-type="picture">
            <a-button>
              <a-icon type="upload" /> 上传文件
            </a-button>
            <span class="extra-notes">支持扩展名：xlsx、xls</span>
          </a-upload>
          <a> 下载国家课程与校本课程学生人员关系表导入模板 </a>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 确定之后的等待框 -->
    <a-modal class="wait-modal"
             width="400px"
             style="height:500px;"
             :destroyOnClose="true"
             :maskClosable="false"
             :keyboard="false"
             :footer="null"
             v-model="waitVisible"
             @cancel="waitModalColse"
             :closable="false"
             title="导入数据">
      <a-spin />
      <span style="margin-left:15px;">数据加载中，请耐心等待...</span>
    </a-modal>

    <!-- 结果框 -->
    <a-modal class="result-modal"
             width="400px"
             :destroyOnClose="true"
             :maskClosable="false"
             :keyboard="false"
             v-model="resultVisible"
             title="导入数据">
      <!-- 导入成功 -->
      <div v-if="result"
           class="success">
        <a-icon type="check-circle"
                style="color:#39be7c;fontSize:22px" />
        <span>恭喜您，数据导入已成功！</span>
      </div>
      <!-- 导入失败 -->
      <div v-if="!result && form.dataSourceMethods=== '2' "
           class="error">
        <a-icon type="exclamation-circle"
                style="color:#FAAD14;fontSize:22px" />
        <span>数据导入失败！</span>
      </div>
      <div v-if="!result && form.dataSourceMethods=== '1' "
           class="error1">
        <div class="err-info">
          <a-icon type="exclamation-circle"
                  style="color:#FAAD14;fontSize:22px" />
          <span>数据导入失败！</span>
        </div>
        <ul class="err-list">
          <li>1.不存在，谢谢！</li>
          <li>1.不存在，谢谢！</li>
          <li>1.不存在，谢谢！</li>
          <li>1.不存在，谢谢！</li>
        </ul>
        <div class="download-btn">
          <a>
            <a-icon type="download" /> 下载课表导入错误提示文档
          </a>
        </div>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      visible: false,
      waitVisible: false,
      resultVisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      useWeekScopeList: ['全部', '第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周'],
      result: true,
      form: {
        dataSourceMethods: '1', // 数据来源方式
        exportMethods: '1', // 导入数据方式（1 - 增加、2 - 替换）
        isml: '2', // 是否走班（1 - 是、2 - 否）
        useWeekScope: [0], // 课表应用范围（周）
        classroomTimetable: '', // 教室课表xls地址（url）
        personRelation: '', // 校本课程学生人员关系表xls地址
        countryRelation: '' // 国家课程与校本课程学生人员关系表
      },
      rules: {
        dataSourceMethods: [
          { required: true, message: '请选择数据来源方式', trigger: 'change' }
        ],
        exportMethods: [{ required: true, message: '请选择导入数据方式', trigger: 'change' }],
        isml: [{ required: true, message: '请选择是否走班', trigger: 'change' }],
        useWeekScope: [
          {
            type: 'array',
            required: true,
            message: '请选择课表应用范围',
            trigger: 'change'
          }
        ],
        classroomTimetable: [{ required: true, message: '请上传教室课表', trigger: 'blur' }],
        countryRelation: [{ required: true, message: '请上传国家课程与校本课程学生人员关系表', trigger: 'blur' }],
        personRelation: [{ required: false, message: '', trigger: 'blur' }]
      }
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {
    showModal(record) {
      this.visible = true;
    },
    onSubmit() {
      this.visible = false;
      this.waitVisible = true;
      setTimeout(() => {
        this.waitVisible = false;
        this.resultVisible = true;
      }, 1000);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleChange(value) {
      // console.log(`Selected: ${value}`);
    },
    popupScroll() {
      // console.log('popupScroll');
    },
    // 等待框关闭事件
    waitModalColse() {
      // this.showPropsConfirm();
    }
    /* showPropsConfirm() {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        okButtonProps: {
          props: { disabled: true },
        },
        cancelText: 'No',
        onOk:()=>{
          this.waitVisible = false;
        },
        onCancel:()=> {
          this.waitVisible = true;
        },
      });
    }, */
  }
}
</script>
 
<style scoped lang="less">
.import-timetable-modal {
  .extra-notes {
    margin-left: 15px;
    font-size: 12px;
    color: #a7adb3;
  }
}
.wait-modal {
  /deep/.ant-modal {
    height: 200px;
    .ant-modal-body {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.result-modal {
  /deep/.ant-modal {
    height: 300px;
    .ant-modal-body {
      height: 300px;
      display: flex;
      justify-content: center;
    }
  }
  .success {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > span {
      margin-left: 5px;
    }
  }
  .error {
    & > span {
      margin-left: 5px;
    }
  }
  .error1 {
    .err-info {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      & > span {
        margin-left: 5px;
      }
    }
    .err-list {
      width: 100%;
      min-height: 100px;
      margin-top: 10px;
      li {
        min-height: 26px;
        line-height: 26px;
        list-style: none;
      }
    }
    .download-btn {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>