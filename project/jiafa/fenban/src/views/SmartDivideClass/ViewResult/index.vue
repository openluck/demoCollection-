/*
 * @Author: mikey.zhaopeng 
 * @Date: 2021-04-Su 10:12:42 
 * @Last Modified by:   MinJ 
 * @Last Modified time: 2021-04-Su 10:12:42 
 */
<template>
  <div class="mj-vr-content">
    <!-- 头部 -->
    <div class="mj-vr-headcon">
      <h4>
        <!-- <a-icon
          @click="goBack"
          class="icon"
          type="left-circle"
          style="margin-right: 5px"
        /> -->
        预览分班结果
      </h4>
      <div>
        <!-- <a-button
          icon="interaction"
          @click="
            $router.push({
              path: '/SmartDivideClass',
              query: { planId }
            })
          "
          >修改分班</a-button
        > -->
        <a-button
          icon="interaction"
          @click="checkContinueFb"
        >修改分班</a-button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="mj-vr-txtcon">
      <!-- 筛选 -->
      <div class="mj-vr-selectcon">
        <div class="mj-vr-tabs">
          <a-radio-group
            v-model="classType"
            @change="radioChange"
          >
            <a-radio-button :value="1">查看行政班</a-radio-button>
            <a-radio-button :value="2">查看教学班</a-radio-button>
          </a-radio-group>
        </div>
        <div
          class="mj-vr-selects"
          v-if="classType === 2"
        >
          <span>科目：</span>
          <a-select
            :value="subjectId"
            @change="changeClass"
          >
            <a-select-option
              v-for="item in classList"
              :key="item.subjectId"
              :text="item.subjectName"
            >{{ item.subjectName }}</a-select-option>
          </a-select>
        </div>
      </div>

      <!-- 表格 -->
      <div class="mj-vr-table">
        <a-table
          :bordered="true"
          :columns="columns"
          :loading="loading"
          :data-source="dataSource"
          :pagination="pagination"
          rowKey="id"
          :scroll="{ y: 'calc(100vh - 368px)' }"
        >
          <!-- 选考组合 -->
          <div
            slot="chooseExamGroup"
            slot-scope="text"
          >
            <span
              v-for="item in text"
              :key="item"
              class="mj-vr-splitLine"
              :title="item"
            >{{ item }}</span>
          </div>
          <!-- 选考走班科目 -->
          <div
            slot="chooseWalkSub"
            slot-scope="text"
          >
            <span
              v-for="item in text"
              :key="item"
              class="mj-vr-splitLine"
              :title="item"
            >{{ item }}</span>
          </div>
          <!-- 学考组合 -->
          <div
            slot="studyGroup"
            slot-scope="text"
          >
            <span
              v-for="item in text"
              :key="item"
              class="mj-vr-splitLine"
              :title="item"
            >{{ item }}</span>
          </div>
          <!-- 学考走班科目 -->
          <div
            slot="studyWalkSub"
            slot-scope="text"
          >
            <span
              v-for="item in text"
              :key="item"
              class="mj-vr-splitLine"
              :title="item"
            >{{ item }}</span>
          </div>
          <!-- 来源班级 -->
          <div
            slot="originalClass"
            slot-scope="text"
          >
            <span
              v-for="item in text"
              :key="item"
              class="mj-vr-splitLine"
              :title="item"
            >{{ item }}</span>
          </div>
          <div
            slot="option"
            slot-scope="text, record"
            @click="goDetail(record)"
            class="no-result"
            :class="{ 'see-result': isStuList }"
          >
            <svg-icon
              class="op_daoru"
              icon-class="fblist_ckjg"
            ></svg-icon>
            查看结果
          </div>
        </a-table>
      </div>
    </div>

    <diviedResultModal ref="diviedResultModal" />
  </div>
</template>
 
<script>
/**
 * @description 查看结果
 * @date 2021-4-1 15:33:15
 */
import diviedResultModal from "./ChildCom/DivideResultModal";

//行政班表头
const adminColumns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: "6%",
  },
  {
    title: "班级名称",
    dataIndex: "admClassName",
    key: "admClassName",
    align: "center",
    width: "12%",
  },
  // {
  //   title: "班级类型",
  //   dataIndex: "admClassType",
  //   key: "admClassType",
  //   align: "center",
  //   width: "8%"
  // },
  {
    title: "选考组合",
    dataIndex: "chooseExamGroup",
    key: "chooseExamGroup",
    align: "left",
    width: "11%",
    scopedSlots: { customRender: "chooseExamGroup" },
  },
  {
    title: "选考走班科目",
    dataIndex: "chooseWalkSub",
    key: "chooseWalkSub",
    align: "left",
    width: "11%",
    scopedSlots: { customRender: "chooseWalkSub" },
  },
  {
    title: "学考组合",
    dataIndex: "studyGroup",
    key: "studyGroup",
    align: "left",
    width: "11%",
    scopedSlots: { customRender: "studyGroup" },
  },
  {
    title: "学考走班科目",
    dataIndex: "studyWalkSub",
    key: "studyWalkSub",
    align: "left",
    width: "11%",
    scopedSlots: { customRender: "studyWalkSub" },
  },
  {
    title: "女生人数",
    dataIndex: "grilsNum",
    key: "grilsNum",
    align: "center",
    width: "8%",
  },
  {
    title: "男生人数",
    dataIndex: "boysNum",
    key: "boysNum",
    align: "center",
    width: "8%",
  },
  {
    title: "总人数",
    dataIndex: "totalNum",
    key: "totalNum",
    align: "center",
    width: "6%",
  },
  {
    title: "来源班级",
    dataIndex: "originalClass",
    key: "originalClass",
    align: "center",
    width: "7%",
  },
  {
    title: "操作",
    dataIndex: "option",
    key: "option",
    align: "left",
    // width: "8%",
    scopedSlots: { customRender: "option" },
  },
];
// 教学班表头
const teachColumns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: "8%",
  },
  {
    title: "班级名称",
    dataIndex: "admClassName",
    key: "admClassName",
    align: "center",
    width: "16%",
  },
  {
    title: "来源班级",
    dataIndex: "originalClass",
    key: "originalClass",
    align: "center",
    width: "30%",
    scopedSlots: { customRender: "originalClass" },
  },
  {
    title: "女生人数",
    dataIndex: "grilsNum",
    key: "grilsNum",
    align: "center",
    width: "12%",
  },
  {
    title: "男生人数",
    dataIndex: "boysNum",
    key: "boysNum",
    align: "center",
    width: "12%",
  },
  {
    title: "总人数",
    dataIndex: "totalNum",
    key: "totalNum",
    align: "center",
    width: "12%",
  },
  {
    title: "操作",
    dataIndex: "option",
    key: "option",
    align: "center",
    width: "10%",
    scopedSlots: { customRender: "option" },
  },
];

export default {
  name: "ViewResult",
  components: { diviedResultModal },
  props: {},
  created() {
    this.planId = this.$route.query.planId || "";
  },
  data() {
    return {
      planId: "", //分班方案id
      classType: 1, //班级类型：1行政班 2教学班
      classList: [], //班级列表
      subjectId: "", //选中科目id
      subjectName: "", //选中科目名称
      adminColumns, //行政班表格
      teachColumns, //教学班表格
      columns: adminColumns, //表格
      dataSource: [], //表格数据
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        size: "middle",
        showTotal: (total, range) => {
          let size = range[1] - range[0] + 1;
          return `当前显示${size}条，共${total}条数据`;
        },
        // showTotal: (total, range) => `当前显示${range[1]}条，共${total}条数据`,
        onChange: (pageIndex) => {
          this.pagination.current = pageIndex;
          if (this.isSelectCourse && this.classType == 1) {
            this.subjectName = "";
            this.isSelectCourse = false;
          }
          const data = {
            sleCourseName: this.subjectName,
            classType: this.classType,
            current: pageIndex,
          };
          this.getTableList(data);
        },
      },
      loading: false,
      isSelectCourse: false, // 是否选择科目
      // className: "", //行班级名称
      isStuList: false,
    };
  },
  computed: {},
  mounted() {
    this.getTableList({
      sleCourseName: "",
      classType: 1,
      current: 1,
    });
    // console.log(this.$store.state.adminClass.isStuList);
    this.isStuList = this.$store.state.adminClass.isStuList;
  },
  // created() {
  //   console.log(this.$store.state.adminClass.isStuList);
  // },
  methods: {
    /**
     * @desc radio切换
     */
    radioChange(e) {
      this.dataSource = [];
      this.pagination.current = 1;
      this.pagination.total = 0;
      const value = e.target.value;
      this.classType = value;
      this.columns = value === 1 ? adminColumns : teachColumns;
      value !== 1
        ? this.getClassList()
        : this.getTableList({
          sleCourseName: "",
          classType: value,
          current: 1,
        });
    },
    /**
     * @desc 获取科目列表
     */
    async getClassList() {
      const res = await this.$api.viewResult.getClassListData({
        planId: this.planId,
        // classType: this.classType,
      });
      // console.log(res);
      if (res.code === "200" && res.data) {
        const list = res.data;
        if (list && list.length) {
          let listData = [];
          list.map((item) => {
            if (item.subjectName === "所有科目") item.subjectId = "all";
            if (item.subjectId !== null || item.subjectName !== null) {
              listData.push(item);
            }
          });
          // console.log(listData);
          const subjectId = listData.length ? listData[0].subjectId : "";
          // const subjectName = listData.length ? listData[0].subjectName : "";
          this.classList = listData || [];
          this.subjectId = subjectId;
          // this.subjectName = subjectName;
          this.pagination.current = 1;
          this.getTableList({
            sleCourseName: "",
            classType: this.classType,
            current: 1,
          });
        }
      } else this.$message.info(res.message, 5);
    },
    /**
     * @desc 科目切换
     * value 选中班级
     */
    changeClass(value, option) {
      // console.log(option);
      this.isSelectCourse = true;
      this.subjectId = value;
      const text = (option.data.attrs && option.data.attrs.text) || "";
      const textVal = text === "所有科目" ? "" : text;
      this.subjectName = textVal;
      this.pagination.current = 1;
      this.getTableList({
        sleCourseName: textVal,
        classType: this.classType,
        current: 1,
      });
    },
    /**
     * @desc 获取表格数据
     * data 接口入参：sleClassName查询参数-选择的班级
     *               classType	判断是行政班还是教学班
     */
    async getTableList(data) {
      this.loading = true;
      const params = { divideSchemId: this.planId, pageSize: 10 };
      const res = await this.$api.viewResult.getTableListData({
        ...params,
        ...data,
      });
      if (res.code === "200" && res.data && res.data.list) {
        const pagination = res.data.pagination;
        let list = res.data.list || [];
        let num = (this.pagination.current - 1) * 10;
        list.map((item, index) => {
          item.id = num + index + 1;
          item.chooseExamGroup = item.chooseExamGroup
            ? item.chooseExamGroup.split(",")
            : "-";
          item.studyGroup = item.studyGroup ? item.studyGroup.split(",") : "-";
          item.chooseWalkSub = item.chooseWalkSub
            ? item.chooseWalkSub.split(",")
            : "-";
          item.studyWalkSub = item.studyWalkSub
            ? item.studyWalkSub.split(",")
            : "-";
          item.originalClass = item.originalClass
            ? item.originalClass.split(",")
            : "-";
        });
        // console.log(list);
        this.dataSource = list;
        this.pagination.total = pagination.total;
      } else this.$message.info(res.message, 5);

      this.loading = false;
    },
    /**
     * @desc 模态框
     * item 点击项
     */
    goDetail(item) {
      if (this.isStuList) {
        const line = {
          classType: this.classType,
          classId: this.classType === 1 ? item.adminClassId : item.teachClassId,
          current: 1,
          search: "",
          pageSize: 10,
        };
        // console.log(item);

        //调用子组件的函数、状态
        this.$refs.diviedResultModal.visible = true;
        this.$refs.diviedResultModal.getDetailList(line, 1);
        this.$refs.diviedResultModal.type = this.classType;
        this.$refs.diviedResultModal.className = item.admClassName || "";
      } else {

      }
    },

    /**
     * @desc 修改分班
     *
     */
    async checkContinueFb() {
      // $router.push({
      //   path: "/SmartDivideClass",
      //   query: { planId, id: $route.query.id, name: $route.query.name },
      // });
      try {
        const res = await this.$api.getDivideClassList.checkInput({
          planId: this.planId,
        });
        if (res.code === "200") {
          // 0-未发布 1-已发布
          let { publishState } = res.data;
          if (publishState === "1") {
            this.$confirm({
              title: "修改分班结果",
              content:
                "该方案已发布完成，如对分班数据进行修改，则该方案将会撤回，需要重新进行校验发布；",
              okText: "前往修改",
              okType: "primary",
              cancelText: "取消",
              onOk: () => {
                this.goContinueFb();
              },
            });
          } else if (publishState === "0") {
            this.goContinueFb();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * @desc 去继续分班
     *
     */
    goContinueFb() {
      this.$router.push({
        path: "/SmartDivideClass",
        query: {
          planId: this.planId,
          id: this.$route.query.id,
          name: this.$route.query.name,
        },
      });
    },

    /**
     * @name: 返回上一页
     * @msg:
     * @param {*}
     * @return {*}
     */
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
 
<style scoped lang="less">
.mj-vr-content {
  width: 100%;
  height: 100%;
  .mj-vr-headcon {
    padding: 0 12px;
    width: 100%;
    height: 60px;
    background-color: #ffffff;
    h4 {
      display: inline-block;
      width: 200px;
      line-height: 60px;
      font-size: 20px;
      font-weight: normal;
    }
    div {
      display: inline-block;
      width: calc(100% - 200px);
      text-align: right;
      .ant-btn {
        width: 112px;
        // height: 40px;
        &:nth-child(1) {
          margin-right: 18px;
          background-color: #1ba4b3;
          color: #ffffff;
        }
      }
    }
  }

  .mj-vr-txtcon {
    margin: 16px;
    height: calc(100% - 76px);
    background-color: #ffffff;
    .mj-vr-selectcon {
      padding: 16px 16px 0 16px;
      display: flex;
      .mj-vr-tabs {
        flex: 1;
        .ant-radio-button-wrapper {
          width: 110px;
          // height: 40px;
          // line-height: 40px;
          text-align: center;
          text-shadow: none;
          border-color: #e1e3e6;
          &:first-child {
            border-radius: 20px 0 0 20px;
          }
          &:last-child {
            border-radius: 0 20px 20px 0;
          }
          &:hover {
            color: #1ba4b3;
          }
        }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
          color: #ffffff;
          background-color: #1ba4b3;
          border-color: #1ba4b3;
        }
      }
      .mj-vr-selects {
        flex: 1;
        text-align: right;
        .ant-select {
          width: 160px;
        }
        .ant-select-selection {
          height: 40px;
          // line-height: 40px;
        }
      }
    }

    /deep/ .mj-vr-table {
      margin-top: 16px;
      padding: 0 16px;
      .mj-vr-splitLine {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .no-result {
        // color: #eee;
        color: rgba(0, 0, 0, 0.35);
        // rgba(0,0,0,.35)
        cursor: pointer;
        &.see-result {
          color: #616366;
        }
      }
      .ant-table-thead > tr > th {
        color: #797c80;
        background-color: #f7f9fa;
      }
      .ant-table-tbody > tr > td {
        color: #494a4d;
      }
      .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td {
        padding: 18px 16px;
      }
      .anticon {
        margin-right: 4px;
        // color: #85898c;
      }
    }
  }
}
</style>