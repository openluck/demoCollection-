<!--
 * @descripttion: 排课规则-规则列表
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-28 13:26:12
-->
<template>
  <div :class="type ? 'arrLesson-rule active' : 'arrLesson-rule'">
    <div class="head">
      <a-space size="middle">
        <a-button @click="handleAddRule" type="primary">
          <a-icon type="plus" />新增规则
        </a-button>
        <a-button @click="handleClearRule">
          <a-icon type="delete" />清空规则
        </a-button>
      </a-space>
      <div class="head-r">
        <a-button
          @click="
            setRulesSort(
              selectedRowKeys.length
                ? { ruleId: selectedRowKeys[0] }
                : { ruleId: '' },
              '3'
            )
          "
          title="将勾选规则上移一条"
          size="small"
          :disabled="!selectedRowKeys.length || !move.up"
        >
          <a-icon type="arrow-up" />
        </a-button>
        <a-button
          style="margin-left: 10px"
          @click="
            setRulesSort(
              selectedRowKeys.length
                ? { ruleId: selectedRowKeys[0] }
                : { ruleId: '' },
              '4'
            )
          "
          title="将勾选规则下移一条"
          size="small"
          :disabled="!selectedRowKeys.length || !move.down"
        >
          <a-icon type="arrow-down" />
        </a-button>
      </div>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="list"
        :rowKey="(row) => row.ruleId"
        :pagination="pagination"
        :loading="loading"
        :customRow="customRow"
        :row-selection="rowSelection"
        :scroll="{ y: type ? 'calc(100vh - 535px)' : 'calc(100vh - 453px)' }"
      >
        <!-- 作用类型 -->
        <div slot="useType">
          <a-menu>
            <a-menu-item
              v-for="item in useType"
              :key="item.id"
              style="height: 30px; line-height: 30px"
            >
              <a @click="useTypeSelect(item)"
                ><span
                  style="
                    display: inline-block;
                    margin-right: 8px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                  "
                  :style="{ background: item.color }"
                ></span>
                {{ item.text }}</a
              >
            </a-menu-item>
          </a-menu>
        </div>
        <div slot="myType" class="title-t">
          <span
            v-show="useTypeCheckedColor"
            :style="{ background: useTypeCheckedColor }"
          />作用类型
        </div>
        <div slot="tableIcon" class="tableSort">
          <a-icon type="down"></a-icon>
        </div>
        <!-- 全部规则 -->
        <div slot="rules">
          <a-menu>
            <a-menu-item
              v-for="item in rules"
              :key="item.id"
              v-show="
                requestParams.useType == 0 ||
                item.useType == 0 ||
                requestParams.useType == item.useType
              "
              style="height: 30px; line-height: 30px"
            >
              <a @click="rulesSelect(item)"
                ><span
                  style="
                    display: inline-block;
                    margin-right: 8px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                  "
                  :style="{ background: item.color }"
                ></span
                >{{ item.text }}</a
              >
            </a-menu-item>
          </a-menu>
        </div>
        <div slot="myRule" class="title-t">
          <span
            v-show="rulesCheckedColor"
            :style="{ background: rulesCheckedColor }"
          />全部规则
        </div>
        <!-- 编辑 -->
        <span slot="action" slot-scope="_, record">
          <!-- <a @click="edit(record)">编辑</a> -->
          <!-- <a-divider type="vertical" /> -->
          <a @click="showDeleteConfirm(record)" style="color: red">删除</a>
        </span>
        <span slot="sort" slot-scope="_, record">
          <div class="sort">
            <a-button
              @click="setRulesSort(record, '1', _)"
              title="将此条规则置于第一条"
              size="small"
              :disabled="_.number == 0 && !firstDisabled"
            >
              <a-icon type="vertical-align-top" />
            </a-button>

            <a-button
              @click="setRulesSort(record, '2', _)"
              title="将此条规则置于最后一条"
              size="small"
              style="margin-left: 10px"
              :disabled="_.number == list.length - 1 && !lastDisabled"
            >
              <a-icon type="vertical-align-bottom" />
            </a-button>
          </div>
        </span>
        <!-- <span slot="useTypeScoped" slot-scope="text">{{ text }}</span>
        <span slot="rulesScoped" slot-scope="text">{{ text }}</span> -->
      </a-table>
    </div>
    <ClearRule ref="ClearRule" />
    <AddRuleModal ref="AddRuleModal" />
  </div>
</template>
 
<script>
import ClearRule from "./Components/ClearRule";
import AddRuleModal from "./Components/AddRuleModal";

export default {
  name: "ArrLessonRule",
  components: { ClearRule, AddRuleModal },
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      arrLessonId: "956eeb4f27e64419adc1d98037d70e5c", // 排课方案id
      columns: [
        {
          title: "排序",
          key: "sort",
          scopedSlots: { customRender: "sort" },
          width: "15%",
        },
        {
          dataIndex: "useType",
          key: "useType",
          // title: "作用类型",
          scopedSlots: {
            filterDropdown: "useType",
            filterIcon: "tableIcon",
            title: "myType",
          },
          width: "10%",
        },
        {
          dataIndex: "rules",
          key: "rules",
          // title: "全部规则",
          scopedSlots: {
            filterDropdown: "rules",
            filterIcon: "tableIcon",
            title: "myRule",
          },
          width: "20%",
        },
        {
          title: "作用内容",
          dataIndex: "useContent",
          key: "useContent",
          scopedSlots: { customRender: "useContent" },
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
          width: "15%",
        },
      ],
      list: [],
      loading: false,
      selected: "",
      useTypeCheckedColor: "",
      rulesCheckedColor: "",
      requestParams: {
        useType: 0,
        current: 1,
        pageSize: 10,
        rules: 0,
      },
      useType: [
        { id: 0, text: "全部" },
        { id: 1, text: "课程", color: "#B5838D" },
        { id: 2, text: "教师", color: "#1A535C" },
      ],
      rules: [
        { id: 0, text: "全部", useType: 0, order: 0 },
        { id: 1, text: "只能排", color: "#FF6565", useType: 0 },
        { id: 2, text: "不能排", color: "#FF6565", useType: 0 },
        { id: 3, text: "单双周", color: "#FFB520", useType: 1 },
        { id: 4, text: "连堂", color: "#52E071", useType: 1 },
        { id: 5, text: "教案平齐", color: "#39CBE8", useType: 1 },
        { id: 6, text: "课程不相邻", color: "#938AFF", useType: 1 },
        { id: 7, text: "周内分散", color: "#E56BF0", useType: 0 },
        { id: 8, text: "互斥", color: "#E5989B", useType: 0 },
        { id: 9, text: "同步", color: "#20BF55", useType: 2 },
        { id: 10, text: "合班", color: "#3D5A80", useType: 2 },
        { id: 11, text: "周内集中", color: "#DA627D", useType: 2 },
      ],
      pagination: {
        current: 1,
        size: "middle",
        defaultPageSize: 10,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showTotal: (total, range) =>
          // `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
          `共${total}条数据`, // 显示总数
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "20", "30", "40"],
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      modalVisible: false,
      selectedRowKeys: [],
      move: {
        up: false,
        down: false,
      },
      moveLoading: false,
      firstDisabled: false,
      lastDisabled: false,
    };
  },
  watch: {
    "pagination.current"() {
      this.getCanMove();
    },
    "pagination.total"() {
      this.getCanMove();
    },
    list(list) {
      if (list.length) {
        this.getFirstLastMove(list[0].ruleId, 1);
        this.getFirstLastMove(list[list.length - 1].ruleId, 0);
      }
    },
    selectedRowKeys() {
      this.getCanMove();
    },
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  mounted() {
    const arrLessonId = sessionStorage.getItem("arrLessonId");
    this.arrLessonId = arrLessonId ? arrLessonId : "";
    this.getRuleList();
  },
  methods: {
    async getCanMove() {
      if (this.selectedRowKeys.length) {
        const ruleId = this.selectedRowKeys[0];
        const res = await this.$api.ArrLessonRule.getCanMove({ ruleId });
        if (res.code == 200) {
          this.move = res.data;
        } else {
          // this.$message.error("请求失败！" + res.message);
          this.move = {
            up: false,
            down: false,
          };
        }
        this.moveLoading = false;
      }
    },
    async getFirstLastMove(ruleId, type) {
      const res = await this.$api.ArrLessonRule.getCanMove({ ruleId });
      if (res.code == 200) {
        if (type) {
          this.firstDisabled = res.data.up;
        } else {
          this.lastDisabled = res.data.down;
        }
      } else {
        this.$message.error("请求失败！" + res.message);
      }
    },
    onSelectChange(selectedRowKeys, row) {
      if (selectedRowKeys.length) {
        this.selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]];
      } else {
        this.selectedRowKeys = [];
      }
      console.log("row", row);
    },
    onPageChange(page) {
      this.pagination.current = page;
      this.requestParams.current = page;
      this.getRuleList();
    },
    // change page size options event
    onShowSizeChangeMethod(i, pageSize) {
      this.requestParams.pageSize = pageSize;
      this.pagination.current = 1;
      this.requestParams.current = 1;
      this.getRuleList();
    },
    useTypeSelect({ id, color }) {
      this.requestParams.useType = id;
      this.useTypeCheckedColor = color;
      this.pagination.current = 1;
      this.requestParams.current = 1;
      this.requestParams.rules = 0;
      this.rulesCheckedColor = "";
      this.getRuleList();
    },
    rulesSelect({ id, color }) {
      this.requestParams.rules = id;
      this.rulesCheckedColor = color;
      this.pagination.current = 1;
      this.requestParams.current = 1;
      this.getRuleList();
    },
    showDeleteConfirm({ ruleId }) {
      this.$confirm({
        title: "你确定要删除此条规则？",
        // content: 'Some descriptions',
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.delRules(ruleId);
        },
      });
    },
    // 拖动排序
    customRow(record, index) {
      return {
        // FIXME: draggable： true 不生效还不晓得是什么原因，先使用鼠标移入事件设置目标行的draggable属性
        props: {
          // draggable: 'true'
        },
        style: {
          cursor: "pointer",
        },
        on: {
          // 鼠标移入
          mouseenter: (event) => {
            // 兼容IE
            var ev = event || window.event;
            ev.target.draggable = true;
          },
          // 开始拖拽
          dragstart: (event) => {
            // 兼容IE
            var ev = event || window.event;
            // 阻止冒泡
            ev.stopPropagation();
            // 得到源目标数据
            this.sourceObj = record;
          },
          // 拖动元素经过的元素
          dragover: (event) => {
            // 兼容 IE
            var ev = event || window.event;
            // 阻止默认行为
            ev.preventDefault();
          },
          // 鼠标松开
          drop: (event) => {
            // 兼容IE
            var ev = event || window.event;
            // 阻止冒泡
            ev.stopPropagation();
            // 得到目标数据
            this.targetObj = record;
          },
        },
      };
    },

    handleClearRule() {
      this.$refs.ClearRule.showModal();
    },
    handleAddRule() {
      this.$refs.AddRuleModal.showModal();
    },
    // 获取规则列表
    async getRuleList() {
      try {
        this.loading = true;
        const { arrLessonId, requestParams } = this;
        const params = { arrLessonId, ...requestParams };
        const res = await this.$api.ArrLessonRule.getRuleList(params);
        if (res.code === "200" || res.code === 200) {
          const {
            data: {
              list,
              pagination: { total },
            },
          } = res;
          this.list = list;
          this.loading = false;
          this.pagination.total = total;
        } else {
          this.$message.error("请求失败！" + res.message);
          this.loading = false;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 删除排课规则
    async delRules(ruleId) {
      try {
        const { arrLessonId } = this;
        const params = { arrLessonId, ruleId };
        const res = await this.$api.ArrLessonRule.delRules(params);
        if (res.code === "200" || res.code === 200) {
          const { current, defaultPageSize, total } = this.pagination;
          let _total = total - 1;
          if (!(_total % defaultPageSize) && current > 1) {
            this.pagination.current = current - 1;
            this.requestParams.current = current - 1;
          }
          this.$message.success("删除成功！");
          this.getRuleList();
        } else {
          this.$message.error("删除失败！" + res.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 设置规则顺序（排序）
    async setRulesSort({ ruleId }, sortType) {
      try {
        const { arrLessonId, moveLoading, selectedRowKeys } = this;
        if (moveLoading) return;
        this.moveLoading = true;
        const params = { arrLessonId, ruleId, sortType: Number(sortType) };
        console.log("params", params);
        const res = await this.$api.ArrLessonRule.setRulesSort(params);
        if (res.code === "200" || res.code === 200) {
          const msg =
            sortType === "1"
              ? " 置顶"
              : sortType === "2"
              ? "置底"
              : sortType === "3"
              ? "上移"
              : sortType === "4"
              ? "下移"
              : "";
          this.$message.success(`该规则${msg}成功！`);
          this.getRuleList();
          if (sortType == 1 || sortType == 2) {
            this.moveLoading = false;
            if (selectedRowKeys.length) this.getCanMove();
          } else {
            this.getCanMove();
          }
        } else {
          this.$message.error("操作失败！" + res.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.arrLesson-rule {
  height: calc(100% - 52px - 72px - 33px);

  overflow: auto;
  .head {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /deep/ thead th:nth-child(1) span {
    display: none;
  }
  .table {
    height: calc(100% - 62px);
    overflow: hidden;
    .tableSort {
      line-height: 53px;
    }
  }
  .title-t {
    span {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  /deep/ .sort,
  .head-r {
    & > span {
      transition: all 0.3s;
    }
    & > span:hover {
      transform: scale(1.3);
    }
  }
}
.arrLesson-rule.active {
  height: calc(100% - 9px);
}
</style>