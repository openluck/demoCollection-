<template>
  <div class="teacher">
    <div class="filterTit">
      <a-button type="primary" @click="addAct"
        ><svg-icon
          icon-class="icon_creat"
          :scale="0.8"
          style="margin-right: 5px"
        ></svg-icon>
        创建活动
      </a-button>
      <div class="formFliter">
        <!-- <div class="filterItem">
          <div>所属学年 ：</div>
          <div>
            <a-select v-model="search.yearId" :default-value="yearDefault"  @change="yearChange" style="width: 120px">
              <a-select-option
                v-for="(item, index) in yearList"
                :key="index"
                :value="item.yearId"
                :title="item.yearName"
              >
                {{ item.yearName }}
              </a-select-option>
            </a-select>
          </div>
        </div> -->
        <!-- <div class="filterItem">
          <div>所属学期 ：</div>
          <div>
            <a-select v-model="search.termId"  style="width: 120px">
              <a-select-option
                v-for="(item, index) in termList"
                :key="index"
                :value="item.termId"
                :title="item.termName"
              >
                {{ item.termName }}
              </a-select-option>
            </a-select>
          </div>
        </div> -->
        <div class="filterItem">
          <div>所属年级 ：</div>
          <div>
            <a-select
              @change="filterChange()"
              v-model="search.gradeId"
              style="width: 120px"
            >
              <a-select-option
                v-for="(item, index) in gradeList"
                :key="index"
                :value="item.gradeId"
                :title="item.gradeName"
              >
                {{ item.gradeName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="filterItem">
          <div>
            <a-input
              v-model="search.name"
              allow-clear
              placeholder="活动名称"
              style="width: 180px"
            />
          </div>
        </div>
        <div class="filterItem">
          <a-button @click="filterChange()" type="primary"> 查 询 </a-button>
        </div>
      </div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :rowKey="(row) => row.courseGroupId"
        :loading="tableLoading"
        :scroll="{ y: cheatListHeight }"
        :pagination="pagination"
        :showHeader="false"
        :data-source="dataList"
      >
        <div slot="name" slot-scope="text, record" class="itemL">
          <div class="itemName">
            {{ record.name
            }}<span :style="filterStatus(record.currentState)">{{
              record.currentState
            }}</span>
          </div>
          <div class="itemTime">
            {{ record.gradeName }}<span v-if="record.gradeName">|</span>
            {{ record.termName }}<span v-if="record.termName">|</span>
            {{ record.yearName }}<span v-if="record.yearName">|</span
            >{{ record.startDate }} - {{ record.endDate }}
          </div>
        </div>
        <div slot="action" slot-scope="text, record">
          <a-button type="link" style="color: #616366" @click="setting(record)"
            ><svg-icon
              icon-class="icon_operate_01"
              :scale="0.8"
              style="margin-right: 5px"
            ></svg-icon
            >选课设置</a-button
          >
          <a-button type="link" @click="result(record)" style="color: #616366"
            ><svg-icon
              icon-class="icon_operate_02"
              :scale="0.8"
              style="margin-right: 5px"
            ></svg-icon
            >选课结果</a-button
          >
          <a-button type="link" style="color: #616366" @click="save(record)"
            ><svg-icon
              icon-class="icon_operate_03"
              :scale="0.8"
              style="margin-right: 5px"
            ></svg-icon
            >编辑</a-button
          >
          <a-popconfirm
            title="确定删除该活动？"
            @confirm="() => delElc(record)"
          >
            <a-button type="link" style="color: #616366"
              ><svg-icon
                icon-class="icon_operate_04"
                :scale="0.8"
                style="margin-right: 5px"
              ></svg-icon
              >删除</a-button
            >
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <!-- 新增编辑对话框 -->
    <a-modal
      :destroyOnClose="true"
      :maskClosable="false"
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      style="width: 500px"
    >
      <a-form-model layout="inline" :model="form" :rules="rules" ref="ruleForm">
        <!-- 活动名称 -->
        <a-form-model-item
          ref="courseGroupName"
          label="活动名称"
          prop="courseGroupName"
          style="margin-bottom: 20px"
        >
          <a-input
            v-model="form.courseGroupName"
            placeholder="50字以内"
            style="width: 360px"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="gradeId"
          label="活动年级"
          prop="gradeId"
          style="margin-bottom: 20px"
        >
          <a-select
            :disabled="examDisabled"
            v-model="form.gradeId"
            @change="fromGradeChange"
            placeholder="请选择活动年级"
            style="width: 360px"
          >
            <a-select-option
              v-for="(item, index) in gradeList"
              :key="index"
              :value="item.gradeId"
              :title="item.gradeName"
            >
              {{ item.gradeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="examinationId"
          label="参考考试"
          style="margin-bottom: 20px; margin-left: 10px"
        >
          <a-select
            :disabled="examDisabled"
            v-model="form.examinationId"
            placeholder="请选择考试"
            style="width: 360px"
          >
            <a-select-option
              v-for="(item, index) in particCourseList"
              :key="index"
              :value="item.examinationId"
              :title="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 选择时间 -->
        <a-form-model-item
          ref="startDate"
          label="选择时间"
          prop="startDate"
          style="margin-bottom: 20px"
        >
          <a-range-picker
            style="width: 360px"
            v-model="datePickValue"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DDTHH:mm"
            :placeholder="['开始时间', '结束时间']"
            :allowClear="false"
            @ok="onOk"
          >
            <a-icon slot="suffixIcon" type="smile" />
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item
          ref="courses"
          label="走班课设置"
          prop="courses"
          style="margin-left: -14px"
        >
          <div
            style="
              width: 360px;
              height: 140px;
              border: 1px solid #d9d9d9;
              border-radius: 4px;
              padding: 5px;
            "
          >
            <a-checkbox-group :disabled="examDisabled" v-model="form.courses">
              <a-checkbox
                style="margin-right: 8px; margin-left: 8px"
                v-for="item in courseList"
                :key="item.courseId"
                :value="item.courseId"
              >
                {{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
const columns = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
    width: "72%",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
    width: "28%",
  },
];
export default {
  data() {
    return {
      gradeList: [], //年级列表
      yearDefault: {},
      yearList: [], //学年列表
      termList: [], //学期列表
      particCourseList: [], //课时计划列表
      courseList: [], //科目列表
      search: {
        // yearId: "", //学年
        // termId: "", //学期编号
        gradeId: "", //年级编号（GUID）
        name: "", //活动名称
        current: 1, //当前页；
        pageSize: 10, //每页条数
      },
      modalTitle: "新增选课组合",
      modalState: "",
      visible: false,
      datePickValue: [],
      dataList: [],
      columns,
      cheatListHeight: 0,
      tableLoading: false,
      //表单
      form: {
        courseGroupName: "", // 标题
        examinationId: "", //参考考试
        startDate: "",
        endDate: "",
        // yearId: "", //学年
        // termId: "", //学期编号
        gradeId: "", //年级编号（GUID）
        courses: [], //科目列表
      },
      examDisabled: false,
      rules: {
        courseGroupName: [
          { required: true, message: "请填写活动名称！", trigger: "blur" },
          { min: 1, max: 50, message: "活动名称应在50字以内", trigger: "blur" },
        ],
        examinationId: [
          { required: true, message: "请选择参考考试", trigger: "blur" },
        ],
        gradeId: [
          { required: true, message: "请选择活动年级", trigger: "blur" },
        ],
        startDate: [{ required: true, message: "请选择时间", trigger: "blur" }],
        courses: [{ required: true, message: "请选择走班课", trigger: "blur" }],
      },
      pagination: {
        current: 1,
        defaultPageSize: 10,
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        // onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        size: "middle",
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "25", "50"], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onChange: (pageIndex, pageSize) => {
          this.pagination.current = pageIndex;
          this.search.current = pageIndex
          this.$store.commit("changePageInfo", { pageIndex, pageSize });
          this.getList();
        },
        onShowSizeChange: (pageIndex, pageSize) => {
          this.pagination.current = 1;
          this.search.current = 1
          this.search.pageSize = pageSize;
          this.$store.commit("changePageInfo", { pageIndex, pageSize });
          this.getList();
        },
      }, // table的分页器
    };
  },
  watch: {
    "search.gradeId"(newVal) {
      // this.pagination.current = 1
      this.$store.commit("changeCurGradeId", newVal);
    },
    "pagination.current"(pageIndex) {
      this.search.current = pageIndex
      console.log(this.search);
      this.$store.commit("changePageInfo", { pageIndex });
    },
  },
  created() {
    console.log(this.$route);
    const pageIndex = this.$route.query.pageIndex - 0;
    const pageSize = this.$route.query.pageSize - 0;
    if (pageIndex) {
      console.log("inininin");
      this.pagination.current = pageIndex;
    } else {
      this.$store.commit("changePageInfo", { pageIndex: 1 });
    }
    if (pageSize) {
      this.pagination.defaultPageSize = pageSize;
    } else {
      this.$store.commit("changePageInfo", { pageSize: this.pagination.defaultPageSize });
    }
    console.log(pageIndex, this.search);
  },
  mounted() {
    this.getGradesList();
    // this.getYearsList();
    setTimeout(() => {
      this.getList();
    }, 500);
    this.$nextTick(() => {
      this.getCheatListHeight();
    });
  },
  methods: {
    moment,
    //获取cheatList高度
    getCheatListHeight() {
      let cheatList = window.document.querySelector(".list");
      // console.log(cheatList.clientHeight);
      this.cheatListHeight = cheatList.clientHeight - 64 - 1;
    },
    //过滤状态
    filterStatus(text) {
      if (text === "未开始") {
        return "background:#e4eaef;color:#797c80";
      } else if (text === "进行中") {
        return "background:#cee3f8;color:#2e8ae6";
      } else if (text === "已完成") {
        return "background:#d8f1e4;color:#53c38b;";
      } else {
        return "";
      }
    },
    yearChange(yearId) {
      this.search.termId = "";
      let data = {
        yearId: yearId,
      };
      this.getTermsList(data);
    },
    //选课设置
    setting(item) {
      this.$router.push("/courseSet");
      sessionStorage.setItem("courseSet", JSON.stringify(item));
    },
    //选课结果
    result(item) {
      this.$router.push("/courseResult");
      sessionStorage.setItem("courseResult", JSON.stringify(item));
    },
    addAct() {
      this.examDisabled = false;
      this.modalState = "1";
      this.modalTitle = "新增选课组合";
      this.form = {
        courseGroupName: "", // 标题
        examinationId: "",
        startDate: "",
        endDate: "",
        courses: [],
      };
      this.datePickValue = [];
      this.visible = true;
      this.getCourseList();
    },
    //取消
    handleCancel() {
      this.form = {
        courseGroupName: "", // 标题
        examinationId: "",
        startDate: "",
        endDate: "",
      };
      this.visible = false;
    },
    //确定
    handleOk() {
      if (this.form.courses.length < 3) {
        this.$message.error("走班课至少选择三个！");
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.modalState === "1") {
            this.addElc(this.form);
          } else {
            this.editElc(this.form);
          }
        } else {
          return false;
        }
      });
    },
    onOk(value) {
      this.form.startDate = value[0];
      this.form.endDate = value[1];
    },
    //编辑活动
    save(item) {
      // console.log(item.currentState);
      this.examDisabled = false;
      this.modalState = "2";
      this.modalTitle = "编辑选课组合";
      this.datePickValue = []
      this.datePickValue.push(item.startDate);
      this.datePickValue.push(item.endDate);
      this.form = {
        courseGroupId: item.courseGroupId,
        courseGroupName: item.name, // 标题
        examinationId: item.examinationId, //参考考试
        startDate: item.startDate.replace(" ", "T"),
        endDate: item.endDate.replace(" ", "T"),
        courses: item.courseList,
        gradeId: item.gradeID,
      };

      if (item.currentState === "已完成" || item.currentState === "进行中") {
        this.examDisabled = true;
      }
      this.getCourseList();
      // console.log(item.gradeId);
      this.getParticCourseList(item.gradeID);
      this.visible = true;
    },
    //活动年级编辑
    fromGradeChange(value) {
      this.getParticCourseList(value);
    },
    filterChange() {
      this.pagination.current = 1
      this.search.current = 1
      this.getList();
    },
    //请求
    //获取活动列表
    async getList() {
      this.tableLoading = true;
      // console.log(this.search);
      try {
        const res = await this.$api.teacher.getCourseGroupsPageList({
          ...this.search,
        });
        if (res.code === 200) {
          this.dataList = res.data.list;
          this.pagination.total = res.data.pagination.total;
          // this.pagination.current = res.data.pagination.current;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    //获取年级
    async getGradesList() {
      try {
        const res = await this.$api.teacher.getGradesList();
        if (res.code === 200) {
          this.gradeList = res.data;
          // console.log("this.$store.state.curGradeId", this.$store.state.curGradeId);
          if (this.$store.state.teacherExam.curGradeId) {
            this.search.gradeId = this.$store.state.teacherExam.curGradeId;
          } else {
            if(res.data && res.data.length>0){
              this.search.gradeId = res.data[0].gradeId
            }else{
              this.search.gradeId=null
            }
          }
        } else {

        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    // //获取学期
    // async getTermsList(data) {
    //   try {
    //     const res = await this.$api.teacher.getTermsList(data);
    //     if (res.code === 200) {
    //       this.termList = res.data;
    //       if (res.data) {
    //         for (let i = 0; i < res.data.length; i++) {
    //           const element = res.data[i];
    //           if (element.currentState) {
    //             this.search.termId = element.termId
    //             break;
    //           } else {
    //             this.search.termId = res.data[0].termId
    //           }
    //         }
    //       } else {
    //          this.search.termId = ''
    //       }

    //       // this.getList();
    //     } else {
    //     }
    //   } catch (error) {
    //     this.$message.error("请求失败！" + error);
    //   }
    // },
    // //获取学年
    // async getYearsList() {
    //   try {
    //     const res = await this.$api.teacher.getYearsList();
    //     if (res.code === 200) {
    //       this.yearList = res.data;
    //       for (let i = 0; i < res.data.length; i++) {
    //         const element = res.data[i];
    //         if (element.currentState) {
    //            this.search.yearId = element.yearId
    //            break;
    //         } else {
    //            this.search.yearId = res.data[0].yearId
    //         }
    //       }
    //       // console.log(this.search.yearId);
    //       let data = {
    //         yearId: this.search.yearId
    //       }
    //       this.getTermsList(data)
    //     } else {
    //     }
    //   } catch (error) {
    //     this.$message.error("请求失败！" + error);
    //   }
    // },
    //获取课时计划
    async getParticCourseList(id) {
      let data = {
        gradeId: id,
      };
      try {
        const res = await this.$api.teacher.getloadExam(data);
        if (res.code === 200) {
          this.particCourseList = res.data;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    //新增活动
    async addElc(data) {
      try {
        const res = await this.$api.teacher.addElc_CourseGroups(data);
        if (res.code === 200) {
          this.visible = false;
          this.getList();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + res.message);
      }
    },
    //编辑活动
    async editElc(data) {
      try {
        const res = await this.$api.teacher.editElc_CourseGroups(data);
        if (res.code === 200) {
          this.visible = false;
          this.getList();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    //删除活动
    async delElc(item) {
      let data = {
        courseGroupId: item.courseGroupId,
      };
      try {
        const res = await this.$api.teacher.delElc_CourseGroups(data);
        if (res.code === 200) {
          if (this.dataList.length === 1) {
            this.pagination.current = 1;
            this.search.current = 1;
          }
          this.getList();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    //获取科目列表
    async getCourseList() {
      try {
        const res = await this.$api.teacher.getCourseList();
        if (res.code === 200) {
          // console.log(res);
          this.courseList = res.data;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>

<style lang="less">
.teacher {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterTit {
    width: 100%;
    height: 70px;
    border-bottom: 1px solid #eaedf0;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .formFliter {
      // width: 80%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .filterItem {
        margin-right: 20px;
        display: flex;
        align-items: center;
      }
    }
  }
  .list {
    width: 100%;
    flex-grow: 1;
    padding: 0 20px;
    overflow-y: auto;
    /* 滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: #eff3f5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background-color: #eff3f5;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #36b4f3;
    }
    .itemName {
      font-size: 18px;
      display: flex;
      align-items: center;
      span {
        padding: 5px;
        font-size: 14px;
        background-color: #a2a6ab;
        border-radius: 5px;
        margin-left: 10px;
      }
    }
    .itemTime {
      font-size: 14px;
      margin-top: 15px;
      color: #919599;
      span {
        margin: 0 8px;
      }
    }
  }
}
</style>
