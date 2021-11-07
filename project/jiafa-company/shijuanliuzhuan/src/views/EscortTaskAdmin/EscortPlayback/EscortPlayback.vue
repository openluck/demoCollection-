<template>
  <div class="escortPlayback">
    <!-- 页面布局 -->
    <div class="container" style="padding: 0">
      <!-- 选择的头部 -->
      <div class="head">
        <!-- 机构选择 -->
        <div class="choose">
          <label class="p-choose">{{ forever }}机构选择:</label>
          <a-tree-select
            style="width: 70%"
            :tree-data="options"
            placeholder="请选择机构"
            v-model="cascaderValue"
            :defaultValue="defalutChooseOrgCode"
          />
        </div>
        <!-- 回放结果 -->
        <div class="result">
          <label class="p-result">回放结果:</label>
          <a-select v-model="resultChange" style="width: 100px">
            <a-select-option value>全部</a-select-option>
            <a-select-option value="0">未回放</a-select-option>
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="2">异常</a-select-option>
          </a-select>
          <!-- 查询 -->
          <div class="query">
            <a-button type="primary" @click.enter.exact="queryResult('query')">
              <icon name="sousuo" scale="2" />查询
            </a-button>
          </div>
        </div>
        <!-- 搜索 -->
        <div class="search">
          <label class="p-search">搜索：</label>
          <a-input
            class="input"
            placeholder="任务名称/机构名称"
            @keydown.enter.exact.prevent="queryResult('search')"
            v-model="keyword"
          />
          <!-- 搜索按钮 -->
          <div class="btn-search">
            <a-button type="primary" @click.enter.exact="queryResult('search')">
              <icon name="sousuo" scale="2" />搜索
            </a-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table back-table">
        <a-table
          :loading="isLoading"
          :columns="columns"
          :data-source="lists"
          :pagination="pagination"
          size="middle"
          :scroll="{ y: 620 }"
          :rowKey="(record) => record.missionId"
          :rowClassName="
            (record, index) => {
              if (index % 2 !== 0) return 'eveneven';
            }
          "
        >
          <span slot="name" slot-scope="text">{{ text }}</span>
          <span slot="customTitle">任务名称</span>
          <span slot="result" slot-scope="result">
            <a-tag
              :color="
                result == '1' ? 'green' : result == '2' ? 'red' : 'orange'
              "
              >{{
                result == "1" ? "正常" : result == "2" ? "异常" : "未回放"
              }}</a-tag
            >
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button @click="showModal(record)">记录</a-button>
          </span>
        </a-table>
      </div>
      <!-- 模态框 -->
      <div class="modal">
        <a-modal
          :title="title"
          :width="680"
          :visible="visible"
          :footer="null"
          :closable="true"
          @cancel="handleCancel"
          :destroyOnClose="true"
          class="modal-wrap"
        >
          <p class="missionName" style="margin: 15px 0 0 60px">
            任务名称：{{ missionName }}
          </p>
          <p style="margin: 15px 0 0 60px">起始机构：{{ startOrgcode }}</p>
          <p style="margin: 15px 0 0 60px">目标机构：{{ targetOrgcode }}</p>
          <p style="margin: 15px 0 0 60px">
            任务开始时间：{{ missionStartTime }}
          </p>
          <p style="margin: 15px 0 0 60px">
            任务结束时间：{{ missionEndTime }}
          </p>
          <div style="margin-left: 50px; display: flex; align-items: center">
            <!-- 回放人 -->
            <label for="form">
              <span style="color: red; margin-right: 5px">*</span>回放人：
            </label>
            <a-form
              id="form"
              style="
                width: 200px;
                height: 35px;
                margin-top: 14px;
                margin-bottom: 10px;
                margin-left: 5px;
              "
            >
              <a-input
                v-model="replayPerson"
                :class="isWarning ? 'border' : ''"
              />
            </a-form>
            <div
              v-show="isWarning"
              style="margin-left: 20px; font-size: 12px; color: red"
            >
              * 回放人须填写！
            </div>
          </div>
          <div style="margin-left: 50px; margin-top: 10px">
            <label>
              <span style="color: red; margin-right: 5px">*</span>回放结果：
            </label>
            <a-radio-group v-model="chooseValue">
              <a-radio value="1">正常</a-radio>
              <a-radio value="2">异常</a-radio>
            </a-radio-group>
            <div
              v-show="isssWarning"
              style="margin-top: 8px; font-size: 12px; color: red"
            >
              * 回放结果须选择！
            </div>
          </div>
          <!-- 选择了异常，会有一个情况说明 -->
          <div
            class="remark"
            v-show="chooseValue === '2'"
            style="margin-top: 20px; margin-left: 50px; display: flex"
          >
            <label for="remark">
              <span style="color: red; margin-right: 5px">*</span>异常说明:
            </label>
            <a-textarea
              v-model="remark"
              :maxLength="100"
              name="remark"
              id="remark"
              style="
                width: 450px;
                height: 80px;
                border-radius: 5px;
                margin-left: 10px;
              "
              :class="issWarning ? 'border' : ''"
            />
          </div>
          <div
            v-show="issWarning"
            style="
              margin-left: 120px;
              margin-top: 10px;
              font-size: 12px;
              color: red;
            "
          >
            * 异常说明须填写！
          </div>
          <div class="btn" style="margin: 30px 0 0 130px">
            <a-button
              type="primary"
              @click="handleOk"
              style="width: 90px; height: 35px; margin-right: 20px"
            >
              <icon name="ok" scale="2" />保存
            </a-button>
            <a-button
              @click="handleCancel"
              style="width: 90px; height: 35px; margin-right: 20px"
            >
              <icon name="close" scale="2.1" />取消
            </a-button>
          </div>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getStore } from "@/utils/util.js";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortPlayback"
);
import {
  Select,
  Cascader,
  Button,
  Icon,
  Table,
  Tag,
  Divider,
  Input,
  Pagination,
  Modal,
  Radio,
  Form,
  Message,
  Spin,
  TreeSelect,
} from "ant-design-vue";
Vue.use(Select)
  .use(Cascader)
  .use(Icon)
  .use(Table)
  .use(Tag)
  .use(Divider)
  .use(Input)
  .use(Pagination)
  .use(Modal)
  .use(Radio)
  .use(Form)
  .use(Spin)
  .use(TreeSelect);
Vue.prototype.$message = Message;
Message.config({
  duration: 2,
  maxCount: 1,
});
const columns = [
  {
    dataIndex: "missionName",
    key: "missionName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "起始机构",
    dataIndex: "startOrgcode",
    key: "startOrgcode",
    align: "center",
  },
  {
    title: "目标机构",
    dataIndex: "targetOrgcode",
    key: "targetOrgcode",
    align: "center",
  },
  {
    title: "实际开始时间",
    dataIndex: "missionStartTime",
    key: "missionStartTime",
    align: "center",
  },
  {
    title: "实际结束时间",
    dataIndex: "missionEndTime",
    key: "missionEndTime",
    align: "center",
  },
  {
    title: "回放人",
    dataIndex: "replayPerson",
    key: "replayPerson",
    align: "center",
  },
  {
    title: "回放结果",
    dataIndex: "replayResult",
    key: "replayResult",
    scopedSlots: { customRender: "result" },
    align: "center",
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  name: "EscortPlayback",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      columns,
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        current: 0,
        size: "middle",
      }, // table的分页器
      visible: false, // modal 的显示与隐藏
      title: "押运回放记录",
      missionId: "",
      missionName: "",
      startOrgcode: "",
      targetOrgcode: "",
      missionStartTime: "",
      missionEndTime: "",
      replayPerson: "",
      replayResult: "",
      resultChange: "", //选择的要查询的回放结果
      chooseValue: 0, //记录选择的回放结果 0 /1
      isWarning: false, //回放人必须填写
      issWarning: false, //remake必须填写
      isssWarning: false, //回访结果必须选择
      replayPerson: "", //回放人
      remark: "", //remak
      keyword: "", //搜索关键词
      cascaderValue: [], //级联选择的value
      // options: this.$store.state.app.orgs,
      fieldNames: {
        label: "orgName",
        value: "orgCode",
        children: "children",
      },
      defalutChooseOrgCode: "", //默认选中的级联结构
    };
  },
  created() {
    this.defalutChooseOrgCode = JSON.parse(getStore("userInfo")).orgcode;
    this.cascaderValue = JSON.parse(getStore("userInfo")).orgcode;

    this.resetFilterInfo(); //重置页面的查询条件
    this.queryEscortPlaybackAsync(false); //请求数据，
  },
  mounted() {},
  components: {},

  computed: {
    ...mapState(["lists", "total", "filterInfo", "isLoading"]),
    forever() {
      this.pagination.total = this.total / 1;
      return "";
    },
    options() {
      return this.$store.state.app.orgs;
    },
  },
  methods: {
    ...mapActions(["queryEscortPlaybackAsync", "confirmEscortPlaybackAsync"]),
    ...mapMutations(["save", "resetFilterInfo"]),
    queryResult(type) {
      // 查询回放结果
      let { keyword } = this;
      if (type === "query") {
        this.pagination.current = 1; // 将当前页归为1
        this.filterInfo.pageIndex = 1; // 将state当前页面归为1
        let { cascaderValue, resultChange } = this;
        let queryPlayback = this.$store.state.escortPlayback.filterInfo;
        //用户如果没有选择orgCode，就默认传本用户登录所属的orgCode
        let queryCascaderValue = cascaderValue || this.defalutChooseOrgCode; //cascaderValue || JSON.parse(getStore('userInfo')).orgcode;
        this.filterInfo.orgCode = queryCascaderValue;
        this.filterInfo.replayResult = resultChange;
        this.filterInfo.keyword = "";
        this.queryEscortPlaybackAsync(true);
        this.keyword = "";
        console.log(resultChange);
      }
      if (type === "search") {
        // 搜索结果
        this.cascaderValue = this.defalutChooseOrgCode; // 将机构树变成默认值
        this.resultChange = ""; // 将回放结果变成默认值
        this.pagination.current = 1;
        this.filterInfo.pageIndex = 1;
        this.filterInfo.keyword = keyword;
        this.filterInfo.orgCode = JSON.parse(getStore("userInfo")).orgcode;
        this.queryEscortPlaybackAsync(true);
      }
    },
    onPageChange(page) {
      // 表格页面改变事件
      this.pagination.current = page;
      this.filterInfo.pageIndex = page;
      this.queryEscortPlaybackAsync(false);
    },
    handleOk(e) {
      // 模态框确定
      const escortId = this.missionId;
      this.visible = false;
      let replayResult = this.chooseValue; //拿到选择的结果0/1
      let replayPerson = this.replayPerson; // 拿到回放人名字
      if (!replayPerson) {
        // 如果没有回放人 return
        this.isWarning = true;
        this.visible = true;
        setTimeout(() => {
          this.isWarning = false;
        }, 2000);
        return;
      }
      if (this.chooseValue === "2" && !this.remark) {
        // 如果没有回放说明 return
        this.visible = true;
        this.issWarning = true;
        setTimeout(() => {
          this.issWarning = false;
        }, 2000);
        return;
      }
      if (!replayResult) {
        // 如果没有选择回放结果 return
        this.visible = true;
        this.isssWarning = true;
        setTimeout(() => {
          this.isssWarning = false;
        }, 2000);
        return;
      }
      let replayRemake = this.remark; //如果有异常情况，拿到异常情况的value
      if (replayResult == 1) {
        replayRemake = "";
      }
      this.save({
        replayResult,
        replayPerson: replayPerson,
        replayRemake,
        escortId,
      });
      this.confirmEscortPlaybackAsync();
    },
    showModal(record) {
      // 示模态框
      const {
        missionId,
        missionName,
        startOrgcode,
        targetOrgcode,
        replayResult,
        missionStartTime,
        replayRemake,
        missionEndTime,
        replayPerson,
      } = record;
      this.missionId = missionId; //record 为当前选择的行 的数据
      this.missionName = missionName;
      this.startOrgcode = startOrgcode;
      this.targetOrgcode = targetOrgcode;
      this.missionStartTime = missionStartTime;
      this.missionEndTime = missionEndTime;
      this.chooseValue = replayResult;
      this.replayPerson = replayPerson;
      this.remark = replayRemake;
      this.visible = true;
    },
    handleCancel(e) {
      // 模态框取消
      this.visible = false;
      this.isWarning = false;
    },
  },
};
</script>

<style lang="less" >
.dark-row {
  background: #ccc;
}
//表格隔行变色
.eveneven {
  background-color: #fafafa;
}
.border {
  border: 1px solid red;
}
.escortPlayback {
  width: 100%;
  height: 100%;
  background: #ebf0f5;
  padding: 10px;
  .container {
    width: 100%;
    height: 100%;
    background: white;
    padding: 0;
    .head {
      width: 100%;
      height: 75px;
      display: flex;
      .choose {
        width: 300px;
        height: 75px;
        display: flex;
        align-items: center;
        .p-choose {
          font-size: 14px;
          margin: 0 10px 0 20px;
        }
      }
      .result {
        width: 300px;
        height: 75px;
        display: flex;
        align-items: center;
        .p-result {
          font-size: 14px;
          margin: 0 10px 0 20px;
        }
        .query {
          margin-left: 20px;
          .icon-search {
            font-size: 16px;
          }
        }
      }
      .search {
        width: 400px;
        height: 75px;
        display: flex;
        align-items: center;
        .input {
          width: 200px;
        }
        .p-search {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin: 0 10px 0 20px;
        }
        .btn-search {
          margin-left: 20px;
          .icon-search {
            font-size: 16px;
          }
        }
      }
      .svg-icon {
        margin-right: 5px;
        vertical-align: -3px;
      }
    }
    .table {
      padding-left: 20px;
      padding-right: 20px;
      .ant-pagination {
        float: left;
      }
    }
    .ant-pagination-item-active a {
      background-color: #398fe6;
      color: #fff;
    }
  }
  .ant-btn {
    padding: 0 10px;
  }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
  }
}
.back-table {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 8px  !important;
  }
}

.btn {
  .ant-btn {
    padding: 0 10px;
  }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
  }
  .svg-icon {
    margin-right: 5px;
    vertical-align: -4px;
  }
}
</style>