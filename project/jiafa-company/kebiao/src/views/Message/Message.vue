<template>
  <div class="msg">
    <h3 class="title">消息</h3>
    <a-button class="read-btn" type="primary" @click="signRead">
      <svg-icon icon-class="message-plyd" class="plyd" />
      批量标记为已读
    </a-button>
    <a-table
      class="msg-table"
      :columns="columns"
      :data-source="dataSource"
      :loading="tableLoading"
      :pagination="false"
      :rowKey="(row) => row.infoId"
      :customRow="rowClick"
      :row-selection="{
        selectedRowKeys: idList,
        onChange: onSelectChange,
      }"
    >
      <template #information="text, record">
        <div
          :class="record.isRead === '1' ? 'isread' : 'noread'"
        >
          <svg-icon
            :icon-class="
              record.isRead === '1' ? 'message-isread' : 'message-noread'
            "
            style="width: 20px; height: 20px; font-size: 20px"
            :scale="1.3"
          />
          {{ text }}
        </div>
      </template>

      <template #action="text, record">
        <a class="font-color" @click.stop="showModal(record)">
          <svg-icon icon-class="message-mxq" class="xq-sc" />详情</a
        >
        <a class="font-color" @click.stop="del(record)">
          <svg-icon icon-class="message-msc" class="xq-sc" />删除</a
        >
      </template>
    </a-table>
    <glo-pagination
      :total="fetchData.gloTotal"
      @onChange="onPageChange"
      ref="gloPagination"
      @onSizeChange="sizeChange"
      @pressEnter="pressEnter"
    ></glo-pagination>
    <MsgDtails ref="MsgDtails" />
  </div>
</template>
 
<script>
import MsgDtails from "./MsgDetails";
import GloPagination from "@/components/common/GloPagination";
import { tablePages } from "@/Utils/util";
const columns = [
  {
    title: "消息",
    dataIndex: "information",
    key: "information",
    ellipsis: true,
    width: "65%",
    scopedSlots: { customRender: "information" },
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    ellipsis: true,
    width: "15%",
    align: "left",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "操作",
    key: "action",
    width: "15%",
    ellipsis: true,
    align: "left",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "msg",
  components: { MsgDtails, GloPagination },
  data() {
    return {
      dataSource: [],
      columns,
      tableLoading: false,
      fetchData: {
        current: 1, // 当前页
        pageSize: 10, // 每页条数
        gloTotal: 0, // 总条数
        pages: 0, // 总页数
      },
      idList: [],
    };
  },
  computed: {
    personId() {
      return JSON.parse(sessionStorage.getItem("userInfo")).personId;
    },
  },
  mounted() {
    this.getInformation();
  },
  methods: {
    // 表格多选框
    onSelectChange(selectedRowKeys) {
      this.idList = selectedRowKeys;
    },
    // 详情
    async showModal(record) {
      const { infoId, isRead } = record;
      if (isRead === "1") {
        this.$refs.MsgDtails.showModal(record);
      } else {
        let infoIdList = [];
        infoIdList.push(infoId);
        let data = {
          personId: this.personId, // 登录人id
          infoIdList: infoIdList,
        };
        try {
          const res = await this.$api.Message.readInformation(data);
          if (res.code === "200") {
            this.$message.success("消息已读成功");
            this.idList = [];
            this.$refs.MsgDtails.showModal(record);
            this.getInformation();
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.warning("请求失败", error);
        }
      }
    },
    // 删除
    del(record) {
      const { infoId } = record;
      this.$confirm({
        title: "你确定要删除这条消息吗？",
        okText: "确认删除",
        cancelText: "取消",
        onOk: () => {
          // 调用接口
          this.delMsg(infoId);
        },
      });
    },
    /**
     * @name: 删除消息
     * @msg:
     * @param {*} id 消息id
     * @return {*}
     */
    async delMsg(id) {
      let data = {
        infoId: id,
        personId: this.personId, // 登录人id
      };
      try {
        const res = await this.$api.Message.delInformation(data);
        if (res.code === "200") {
          this.$message.success("消息删除成功");
          let paginations = {
            pages: this.fetchData.pages,
            total: this.fetchData.gloTotal,
            pageSize: this.fetchData.pageSize,
            current: this.fetchData.current,
          };
          this.fetchData.current = tablePages(paginations, 1);
          this.getInformation();
        } else {
          this.$message.warning(res.message);
          this.getInformation();
        }
      } catch (error) {
        this.$message.warning("请求失败", error);
      }
    },
    // 标记已读
    async signRead() {
      let idLength = this.idList.length;
      if (idLength === 0) {
        this.$message.warning("请选择需要标记为已读的消息");
      } else {
        let data = {
          personId: this.personId, // 登录人id
          infoIdList: this.idList,
        };
        try {
          const res = await this.$api.Message.readInformation(data);
          if (res.code === "200") {
            this.$message.success("消息已读成功");
            this.idList = [];
            this.getInformation();
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.warning("请求失败", error);
        }
      }
    },
    // 点击表格每一行
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            // console.log(record, index);
            this.showModal(record);
          },
        },
      };
    },
    /**
     * @name: 获取消息列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getInformation() {
      this.tableLoading = true;
      let data = {
        pageSize: this.fetchData.pageSize,
        current: this.fetchData.current,
        personId: this.personId,
      };
      try {
        const res = await this.$api.Message.getInformation(data);
        if (res.code === "200") {
          this.dataSource = res.data.list;
          this.fetchData.gloTotal = res.data.pagination.total;
          this.fetchData.pages = res.data.pagination.pages;
        } else {
          this.$message.warning(error);
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.error("请求错误");
      }
    },
    // 表格页面改变事件
    onPageChange(current, size) {
      this.fetchData.current = current;
      this.idList = [];
      this.$refs.gloPagination.clearJumperValue();
      this.getInformation();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      // debugger;
      // this.fetchData.current = 1;
      this.fetchData.pageSize = size;
      this.fetchData.current = current;
      // this.$refs.gloPagination.initCurrent(this.fetchData.current);
      this.getInformation();
    },
    // 快速切换页面
    pressEnter(outCurrent) {
      this.fetchData.current = outCurrent;
      this.getInformation();
    },
  },
};
</script>
 
<style scoped lang="less">
.msg {
  background: white;
  padding: 15px 24px 15px;
  .font-color {
    color: #616366;
    &:nth-child(1) {
      margin-right: 33px;
    }
  }
  .title {
    color: #303233;
    font-size: 18px;
    font-weight: normal;
    margin: 0 0 10px;
  }
  .read-btn {
    margin-bottom: 24px;
  }
  .plyd {
    margin-right: 8px;
    color: #ffffff;
  }
  .noread {
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .isread {
    color: #616366;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .xq-sc {
    margin-right: 9px;
    margin-top: 3px;
  }
  /deep/ .ant-table-row-cell-break-word {
    background-color: inherit;
  }
  /deep/ .ant-table-thead {
    background-color: #fafbfc;
  }

  /deep/ .ant-modal-confirm-body > .anticon {
    font-size: 20px;
  }
  /deep/ .ant-modal-confirm-body {
    display: flex;
    align-items: center;
  }
  // /deep/ .ant-table .ant-table-tbody > tr > td {
  //   background-color: #fff;
  // }
  /deep/ .ant-table-row {
    cursor: pointer;
  }
}
</style>