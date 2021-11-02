<template>
  <div class="choose_exam_course">
    <div class="top">
      <div class="top_left">
        <!-- 学年 -->
        <a-select
          v-model="fetchData.yearId"
          @change="yearChange"
          style="width: 120px; margin-right: 15px"
        >
          <a-select-option
            v-for="item in yearList"
            :key="item.yearId"
            :value="item.yearId"
          >
            {{ item.yearName }}
          </a-select-option>
        </a-select>
        <!-- 学期 -->
        <a-select
          v-model="fetchData.termId"
          @change="termChange"
          style="width: 120px; margin-right: 15px"
        >
          <a-select-option
            v-for="item in termList"
            :key="item.termId"
            :value="item.termId"
          >
            {{ item.termName }}
          </a-select-option>
        </a-select>
        <!-- 年级 -->
        <a-select
          v-model="fetchData.gradeId"
          @change="gradeChange"
          style="width: 120px"
        >
          <a-select-option
            v-for="item in gradeList"
            :key="item.gradeId"
            :value="item.gradeId"
          >
            {{ item.gradeName }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="operation_btn" style="margin-bottom: 15px">
      <a-button @click="addCourse" class="addCourse">
        <svg-icon
          icon-class="icon_creat"
          :scale="0.8"
          style="margin-right: 4px"
        />
        添加课程
      </a-button>
      <!-- <a-button @click="allDel" type="danger">
        <svg-icon
          icon-class="icon_export"
          :scale="0.8"
          style="margin-right: 4px"
        />
        批量删除
      </a-button> -->
      <a-popconfirm title="是否确定删除这些项?" @confirm="() => allDel()">
        <a-button type="danger">
          <svg-icon
            icon-class="icon_shanchu"
            :scale="0.9"
            style="margin-right: 4px"
          />
          批量删除
        </a-button>
      </a-popconfirm>
    </div>

    <div class="list">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataList"
        size="middle"
        :loading="tableLoading"
        :rowKey="(row) => row.particCourseId"
        bordered
        :pagination="false"
      >
        <span slot="courseType" slot-scope="text">
          {{ text === 1 ? "行政课" : text === 2 ? "走班课" : "-" }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <!-- <a-button @click="del(record)">删除</a-button> -->
          <a-popconfirm title="是否确定删除此项?" @confirm="() => del(record)">
            <!-- <a-button>删除</a-button> -->
            <span style="cursor: pointer">
              <svg-icon
                icon-class="icon_delete"
                :scale="0.8"
                style="margin-right: 4px"
              />
              删除
            </span>
          </a-popconfirm>
        </span>
      </a-table>
    </div>

    <a-modal
      v-model="visible"
      class="exam_course_modal"
      title="添加选考课程"
      :destroyOnClose="true"
      :maskClosable="false"
      width="580px"
    >
      <template slot="footer">
        <a-button type="primary" @click="confirm"> 确定 </a-button>
        <a-button @click="onClose"> 取消 </a-button>
      </template>

      <div class="course_type">
        <!-- <div class="course">
          <div class="course_title">行政课</div>
          <div class="course_content">
            <a-checkbox-group @change="adminCoursesChange">
              <a-checkbox
                v-for="item in adminCoursesList"
                :key="item.courseId"
                :value="item.courseId"
                style="display: block; margin: 10px 0 10px 10px"
              >
                {{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div> -->
        <div class="course">
          <div class="course_title">走班课</div>
          <div class="course_content">
            <a-checkbox-group @change="walkCoursesChange">
              <a-checkbox
                v-for="item in walkCoursesList"
                :key="item.courseId"
                :value="item.courseId"
                style="display: block; margin: 10px 0 10px 20px"
              >
                {{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "学科名称",
    dataIndex: "particCourseName",
    key: "particCourseName",
    width: "43%"
  },
  {
    title: "学科类型",
    dataIndex: "courseType",
    key: "courseType",
    width: "43%",
    scopedSlots: { customRender: "courseType" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    width: "10%",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  data() {
    return {
      organizationId: "", // 机构编码
      dataList: [],
      columns,
      tableLoading: false,
      particCoursesId: [], // 被删除的课程编号

      visible: false,
      /* adminCoursesList: [],
      adminCoursesList1: [], */
      walkCoursesList: [],
      // walkCoursesList1: [],
      // adminCourses: [], // 行政课选择项
      walkCourses: [], // 走班课选择项

      yearList: [], //学年
      termList: [], // 学期
      gradeList: [], // 年级
      fetchData: {
        yearId: "",
        termId: "",
        gradeId: ""
      }
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ", selectedRows
          );
          this.particCoursesId = selectedRows.map(
            item => item.particCourseId
          );
          console.log(this.particCoursesId)
        }
      };
    }
  },
  async mounted() {
    this.organizationId = sessionStorage.getItem('xuanke_orgcode')
    // 获取年级
    await this.getGradesList();
    this.fetchData.gradeId = this.gradeList[0].gradeId;
    // 获取学年
    await this.getYearsList();
    // this.fetchData.yearId = this.yearList[0].yearId;
    this.fetchData.yearId = this.yearList.filter(item => item.currentState)[0].yearId;
    // 获取学期
    await this.getTermsList(this.fetchData.yearId);
    // this.fetchData.termId = this.termList[0].termId;
    this.fetchData.termId = this.termList.filter(item => item.currentState)[0].termId;
    // 获取列表
    await this.getParticCourseList();
  },
  methods: {
    // 获取学年
    async getYearsList() {
      try {
        const res = await this.$api.teacher.getYearsList({});
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.yearList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 改变学年
    yearChange(value) {
      this.getTermsList(value);
      this.fetchData.termId = this.termList[0].termId;
      this.getParticCourseList();
    },
    // 获取学期
    async getTermsList(yearId) {
      try {
        const res = await this.$api.teacher.getTermsList({
          yearId: yearId
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.termList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 改变学期
    termChange(value) {
      console.log(value);
      this.getParticCourseList();
    },
    // 获取年级
    async getGradesList() {
      try {
        const res = await this.$api.teacher.getGradesList({});
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.gradeList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 改变年级
    gradeChange(value) {
      console.log(value);
      this.getParticCourseList();
    },

    // 批量删除
    async allDel() {
      if (this.particCoursesId.length <= 0) {
        this.$message.error('请选择删除项！');
        return
      }
      try {
        const res = await this.$api.chooseTest.delParticCourse({
          particCoursesIds: this.particCoursesId,
          ...this.fetchData
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.getParticCourseList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 添加课程
    addCourse() {
      this.visible = true;
      this.getCourseList();
    },
    // 获取科目列表
    async getCourseList() {
      try {
        const res = await this.$api.chooseTest.getCourseList({
          ...this.fetchData
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          /* this.adminCoursesList = res.data;
          this.adminCoursesList1 = res.data; */
          this.walkCoursesList = res.data;
          // this.walkCoursesList1 = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 行政科选择
    /* adminCoursesChange(checkedValues) {
      console.log("adminCourses = ", checkedValues);
      this.adminCourses = checkedValues;
      let arr = JSON.parse(JSON.stringify(this.walkCoursesList1));
      arr = arr.filter(item => !checkedValues.some(ele => ele === item.courseId))
      this.walkCoursesList = arr;
    }, */
    // 走班课选择
    walkCoursesChange(checkedValues) {
      // console.log("walkCourses = ", checkedValues);
      this.walkCourses = checkedValues;
      /* let arr = JSON.parse(JSON.stringify(this.adminCoursesList1));
      arr = arr.filter(item => !checkedValues.some(ele => ele === item.courseId))
      this.adminCoursesList = arr; */
    },
    // 添加课程 - 确定
    async confirm() {
      console.log(this.walkCourses)
      try {
        const res = await this.$api.chooseTest.addParticCourse({
          organizationId: this.organizationId,
          // adminCourses: this.adminCourses,
          walkCourses: this.walkCourses,
          ...this.fetchData
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.$message.success(res.message);
          this.getParticCourseList();
          this.visible = false;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 添加课程 - 取消
    onClose() {
      this.visible = false;
    },

    // 获取课程列表
    async getParticCourseList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.chooseTest.getParticCourseList({
          ...this.fetchData
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.dataList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    },
    // 删除
    async del(record) {
      console.log(record);
      try {
        const res = await this.$api.chooseTest.delParticCourse({
          particCoursesIds: [record.particCourseId],
          ...this.fetchData
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.getParticCourseList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="less">
.choose_exam_course {
  padding: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .operation_btn {
    .addCourse {
      margin-right: 15px;
      background-color: #39be7c;
      border-color: #39be7c;
      color: #fff;
      &:hover {
        background: #23cf79;
        border-color: #23cf79;
      }
    }
  }
}
.exam_course_modal {
  .ant-modal-footer {
    text-align: center;
  }
  .ant-modal-body {
    padding: 20px 24px;
    .course_type {
      display: flex;
      justify-content: space-around;
      .course {
        min-height: 360px;
        width: 300px;
        border: 1px solid #e1e3e6;
        .course_title {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          text-align: center;
          background-color: #f7f9fa;
          border-bottom: 1px solid #e1e3e6;
        }
      }
    }
  }
}
</style>
