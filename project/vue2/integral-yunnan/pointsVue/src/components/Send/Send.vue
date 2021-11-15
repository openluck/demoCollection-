
<template>
  <div>
    <!-- <a-table :columns="columns" :data-source="data">
      <a href="javascript:;" slot="ctrl">
        <span style="color: red" @click="showModal">赠送</span>
      </a>
    </a-table> -->
    <div class="table">
      <p class="table-title table-title1">
        <span>所属公司</span>
        <span class="mr1">积分类型</span>
        <span class="mr2">积分数</span>
        <span class="mr3">日期</span>
        <span class="mr4">操作</span>
      </p>
      <p class="table-title p2" v-for="item in tableData" :key="item.key">
        <span>{{ item.company }}</span>
        <span>{{ item.type }}</span>
        <span>{{ item.number }}</span>
        <span>{{ item.date }}</span>
        <span class="ctrl1" @click="showModal">赠送好友</span>
      </p>
    </div>
    <a-modal
      v-model="visible"
      title="好友列表"
      @ok="handleOk"
      cancelText="取消"
      okText="确定"
      destroyOnClose="true"
    >
      <div class="">
        <!-- <a-table
          :columns="columns2"
          :data-source="data2"
          :row-selection="rowSelection"
        >
        </a-table> -->
        <div class="table2 people-list">
          <!-- <p class="table-title">
            <span>好友列表</span>
          </p> -->
          <p class="table-title p2 " v-for="item in peolpledata" :key="item.key">
            <span> <a-checkbox /></span>
            <span class="name">{{ item.people }}</span>
            <span>
              <!-- 赠送积分数： -->
              <!-- <a-input-number id="inputNumber" v-model="value" /> -->
              <a-input
                placeholder="赠送积分数："
                type="number"
                allowClear="true"
              />
            </span>
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "积分类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "积分数",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "日期",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "操作",
    key: "ctrl",
    dataIndex: "ctrl",
    scopedSlots: { customRender: "ctrl" },
  },
];

const data = [
  {
    key: "1",
    type: "A积分",
    number: "100",
    date: "2020-10-03",
    company: "山东石化加油站",
  },
  {
    key: "2",
    type: "B积分",
    number: "200",
    date: "2020-11-03",
    company: "东明石化加油站",
  },
  {
    key: "3",
    type: "C积分",
    number: "100",
    date: "2021-01-03",
    company: "京博石化加油站",
  },
  {
    key: "4",
    type: "D积分",
    number: "300",
    date: "2020-11-03",
    company: "宝塔石化加油站",
  },
  {
    key: "5",
    type: "E积分",
    number: "500",
    date: "2020-05-03",
    company: "中东石化加油站",
  },
  {
    key: "6",
    type: "F积分",
    number: "100",
    date: "2021-01-03",
    company: "闽海石化加油站",
  },
  {
    key: "7",
    type: "G积分",
    number: "600",
    date: "2021-03-03",
    company: "金城石化加油站",
  },
  {
    key: "8",
    type: "H积分",
    number: "100",
    date: "2020-02-03",
    company: "鲁明石化加油站",
  },
];
const columns2 = [
  {
    title: "好友",
    dataIndex: "people",
    key: "people",
    // width: "50%",
    // algin: "center",
  },
];

const data2 = [
  {
    key: "1",
    people: "张三",
  },
  {
    key: "2",
    people: "李四",
  },
  {
    key: "3",
    people: "王五",
  },
  {
    key: "5",
    people: "小明",
  },
  {
    key: "6",
    people: "小黑",
  },
];

export default {
  data() {
    return {
      data,
      columns,
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      columns2,
      data2,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        },
      },
      tableData: [
        {
          key: "1",
          type: "A积分",
          number: "100",
          date: "2020-10-03",
          company: "山东石化加油站",
        },
        {
          key: "2",
          type: "B积分",
          number: "200",
          date: "2020-11-03",
          company: "东明石化加油站",
        },
        {
          key: "3",
          type: "C积分",
          number: "100",
          date: "2021-01-03",
          company: "京博石化加油站",
        },
        {
          key: "4",
          type: "D积分",
          number: "300",
          date: "2020-11-03",
          company: "宝塔石化加油站",
        },
        {
          key: "5",
          type: "E积分",
          number: "500",
          date: "2020-05-03",
          company: "中东石化加油站",
        },
        {
          key: "6",
          type: "F积分",
          number: "100",
          date: "2021-01-03",
          company: "闽海石化加油站",
        },
        {
          key: "7",
          type: "G积分",
          number: "600",
          date: "2021-03-03",
          company: "金城石化加油站",
        },
        {
          key: "8",
          type: "H积分",
          number: "100",
          date: "2020-02-03",
          company: "鲁明石化加油站",
        },
      ],
      peolpledata: [
        {
          key: "1",
          people: "张三",
        },
        {
          key: "2",
          people: "李四",
        },
        {
          key: "3",
          people: "王五",
        },
        {
          key: "5",
          people: "小明",
        },
        {
          key: "6",
          people: "小黑",
        },
      ],
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
      this.confirmLoading = false;
      this.$message.success("赠送成功");
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.table-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
  padding-top: 10px;
  box-sizing: border-box;
  padding: 10px 15px 0px;
  align-items: center;
  span {
    // flex: 1;
    text-align: center;
    display: block;
    width: 116px;
  }
}
.p2 {
  border-top: 1px solid #000;
}
.table {
  border: 1px solid #000;
}
.ctrl1 {
  color: red;
  cursor: pointer;
}
.table2 {
  border-left: 1px solid #000;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}
.people-list {

}
</style>
