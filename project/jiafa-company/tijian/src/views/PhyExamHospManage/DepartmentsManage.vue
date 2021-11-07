<template>
  <div id="ConfigManage">
    <div class="province">
      <div class="top" style="margin-bottom: 15px">
        <a-button type="primary" @click="handleAdd" style="margin-right: 15px">
          <svg-icon icon-class="tianjia" :scale="0.8" style="margin-right: 5px" />
          新增科室
        </a-button>
        <a-button type="primary" @click="saveConfig">
          <svg-icon icon-class="baocun" :scale="0.8" style="margin-right: 5px" />
          保存
        </a-button>
      </div>

      <div class="list">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :rowKey="(row) => row.deskId"
          bordered
          :pagination="false"
          class="desk-table"
          :scroll="{ y: tableHeight }"
        >
          <template slot="deskName" slot-scope="text, record">
            <EditableCell
              ref="EditableCell"
              :text="text"
              @change="onCellChange(record.deskId, 'deskName', $event)"
            />
          </template>

          <template slot="editItem" slot-scope="text, record">
            <span v-for="(item, index) in record.editItem" :key="index" class="item">
              <span class="item-text">{{ item.editItemName }}</span>
              <a-icon
                class="item-icon"
                type="close-circle"
                theme="filled"
                @click="delEditable(record, item)"
              />
            </span>
            <span class="add-button" @click="addEditable(record)">
              <a-icon class="add-button-icon" type="plus-circle" />
              <span class="add-button-text">新增</span>
            </span>
          </template>

          <template slot="checkItem" slot-scope="text, record">
            <span v-for="(item, index) in record.checkItem" :key="index" class="item">
              <span class="item-text">{{ item.checkItemName }}</span>
              <a-icon
                class="item-icon"
                type="close-circle"
                theme="filled"
                @click="delCheckItem(record, item)"
              />
            </span>
            <span class="add-button" @click="addCheckItem(record)">
              <a-icon class="add-button-icon" type="plus-circle" />
              <span class="add-button-text">新增</span>
            </span>
          </template>

          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除该科室？"
              @confirm="() => onDelete(record.deskId)"
            >
              <a-button>删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <!-- 可新增科室编辑项 -->
      <a-modal
        v-model="visible"
        width="720px"
        :destroyOnClose="true"
        :maskClosable="false"
        title="新增可编辑项"
        @ok="handleOk"
        class="addDesk-modal"
      >
        <template slot="footer">
          <a-button type="primary" @click="handleOk" style="margin-right: 10px">
            <svg-icon icon-class="queren" :scale="0.8" style="margin-right: 5px" />
            确认
          </a-button>
          <a-button @click="handleCancel">
            <svg-icon icon-class="quxiao" :scale="0.7" style="margin-right: 5px" />
            取消
          </a-button>
        </template>

        <a-table
          :columns="editColumns"
          :data-source="editList"
          :rowKey="(row) => row.addDeskId"
          bordered
          :showHeader="false"
          :pagination="false"
          class="addDesk-table"
        >
          <template slot="item" slot-scope="text, record">
            <a-checkbox
              v-for="item in text"
              :key="item.itemId"
              :defaultChecked="isChecked(item.itemId)"
              :disabled="isDisabled(item.itemId)"
              @change="(checkedValues) => changeCheckbox(checkedValues, item, record)"
            >
              {{ item.itemName }}
            </a-checkbox>
          </template>
        </a-table>
      </a-modal>
    </div>
  </div>
</template>
<script>
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="this.text" ref="editInput" placeholder="请输入科室名称" @change="changeEdit" @pressEnter="check"  @blur="check"/>
        </div>
        <div v-else class="editable-cell-text-wrapper" @dblclick="edit">
          {{ this.text || ' ' }}
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: false,
    };
  },
  mounted() {
  },
  methods: {
    changeEdit(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit("change", this.value);
    },
    edit() {
      this.editable = true;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
      });
    },
  },
};
export default {
  components: {
    //科室名称编辑组件
    EditableCell,
  },
  data() {
    return {
      count: 0,
      columns: [
        {
          title: "科室名称",
          dataIndex: "deskName",
          width: "10%",
          scopedSlots: { customRender: "deskName" },
        },
        {
          title: "科室编辑权限",
          dataIndex: "editItem",
          width: "41%",
          scopedSlots: { customRender: "editItem" },
        },
        {
          title: "科室查看权限",
          dataIndex: "checkItem",
          width: "41%",
          scopedSlots: { customRender: "checkItem" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "8%",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      tableHeight: 0, //table高度
      dataSource: [],
      dataSourceTemp: [],
      orgCode: "", //机构代码
      visible: false, //新增可编辑项model
      //新增可编辑项
      editColumns: [
        {
          title: "科室名称",
          dataIndex: "addDeskName",
          width: "20%",
          scopedSlots: { customRender: "addDeskName" },
        },
        {
          title: "可编辑项",
          dataIndex: "item",
          width: "80%",
          scopedSlots: { customRender: "item" },
        },
      ],
      editList: [], //新增可编辑项列表
      addType: "", //判断是新增编辑项还是可查看项

      allEdit: [], // 所有可编辑项
      selectedEdit: [], // 已选择可编辑项
      rowSelectedEdit: [], //某行的已选择可编辑项
      rowSelectedCheck: [], //某行的已选择可查看项
      editItemIdTemp: "", // 存储肝功和胸透中的一项
      deskId: [], //正在进行操作的那一行ID
      addEdit: [], //新勾选的可编辑项
      addCheck: [], //新勾选的可查看项
      userCode: "",
    };
  },
  created() {
    this.userCode = JSON.parse(sessionStorage.getItem("userInfo")).orgCode;
  },
  mounted() {
    this.getEditList();
    this.getDeskList();
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  computed: {},
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 55;
    },
    //可选择项的默认选择内容
    isChecked(id) {
      const editResult =
        this.selectedEdit.some((i) => i.editItemId === id) ||
        this.rowSelectedCheck.some((i) => i.checkItemId === id);
      const checktResult =
        this.rowSelectedEdit.some((i) => i.editItemId === id) ||
        this.rowSelectedCheck.some((i) => i.checkItemId === id);
      if (this.addType === "1") {
        return editResult;
      } else if (this.addType === "2") {
        return checktResult;
      }
    },
    // 可选择项的默认选择内容（禁用）
    isDisabled(id) {
      let editResult;
      if (this.editItemIdTemp === id) {
        editResult = true;
      } else {
        editResult =
          this.selectedEdit.some((i) => i.editItemId === id) ||
          this.rowSelectedCheck.some((i) => i.checkItemId === id);
      }
      const checktResult =
        this.rowSelectedEdit.some((i) => i.editItemId === id) ||
        this.rowSelectedCheck.some((i) => i.checkItemId === id);
      if (this.addType === "1") {
        return editResult;
      } else if (this.addType === "2") {
        return checktResult;
      }
    },
    // 获取新增科室编辑项列表
    async getEditList() {
      try {
        const res = await this.$api.DepartmentsManage.getEditList({
          orgCode: this.userCode,
        });
        if (res.code === "200" || res.code === 200) {
          var dataList = res.data.list;
          this.editList = dataList;
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    // 获取科室列表
    async getDeskList() {
      try {
        const res = await this.$api.DepartmentsManage.getDeskList({
          orgCode: this.userCode,
        });
        if (res.code === "200" || res.code === 200) {
          if (res.data.list) {
            var dataList = res.data.list;
            this.dataSourceTemp = JSON.parse(JSON.stringify(dataList));
            this.dataSource = dataList;
          }
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    // 新增科室
    handleAdd() {
      if (this.dataSource.length >= 30) {
        this.$message.error("最多只能添加30个科室！");
      } else {
        const { count, dataSource } = this;
        for (let i = 0; i < dataSource.length; i++) {
          if (!dataSource[i].deskName) {
            this.$message.error("请填写完整的科室名称后再添加！");
            return;
          }
        }
        const newData = {
          deskId: `deskId${count}`,
          deskName: "",
          editItem: [],
          checkItem: [],
        };
        this.dataSource = [...dataSource, newData];
        this.count = count + 1;
        this.$nextTick(() => {
          this.$refs.EditableCell.edit();
        });
      }
    },
    // 编辑科室名称
    onCellChange(deskId, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.deskId === deskId);
      for (let i = 0; i < dataSource.length; i++) {
        const element = dataSource[i];
        if (element.deskName === value) {
          if (element.deskId !== deskId) {
            this.$message.error('科室名称不能相同！')
              for (let j = 0; j < this.dataSource.length; j++) {
                const element1 = this.dataSource[j];
                if (element1.deskId === deskId) {
                  element1.deskName = ''
                }
              }
              return
          } else {
            if (target) {
              target[dataIndex] = value;
              this.dataSource = dataSource;
            }
          }
        } else {
          target[dataIndex] = value;
          this.dataSource = dataSource;
        }
      } 
    },
    //删除单行数据
    onDelete(deskId) {
      var dataList = this.dataSource;
      var deleteObj = {};
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].deskId === deskId) {
          deleteObj = dataList[i];
        }
      }
      if (!deleteObj.checkItem.length && !deleteObj.editItem.length) {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.deskId !== deskId);
      } else {
        this.$message.error("不能删除此科室！");
      }
    },
    //新增可编辑项
    addEditable(record) {
      // 所有可编辑项 所有已选择编辑项 全部清空
      this.allEdit = [];
      this.selectedEdit = [];
      // 新勾选的可编辑项清空
      this.addEdit = [];
      this.visible = true;
      this.addType = "1";
      this.deskId = record.deskId;

      //拿到某行的已选择可查看项
      this.rowSelectedCheck = record.checkItem;

      // 拿到所有可编辑项
      var dataList = this.editList;
      for (let i = 0; i < dataList.length; i++) {
        this.allEdit = this.allEdit.concat(dataList[i].item);
      }
      //拿到所有已选择编辑项
      var dataList2 = this.dataSource;
      for (let i = 0; i < dataList2.length; i++) {
        this.selectedEdit = this.selectedEdit.concat(dataList2[i].editItem);
      }
      //临时存储胸透肝功（加禁用）
      this.editItemIdTemp = "";
      for (let i = 0; i < record.editItem.length; i++) {
        if (record.editItem[i].editItemId === "gg") {
          this.editItemIdTemp = "xt";
        } else if (record.editItem[i].editItemId === "xt") {
          this.editItemIdTemp = "gg";
        }
      }
    },
    //新增可查看项
    addCheckItem(record) {
      // 新勾选的可查看想清空
      this.addCheck = [];
      this.visible = true;
      this.addType = "2";
      this.deskId = record.deskId;

      //拿到某行的已选择可编辑项
      this.rowSelectedEdit = record.editItem;
      //拿到某行的已选择可查看项
      this.rowSelectedCheck = record.checkItem;
    },
    // 删除可编辑项
    delEditable(record, item) {
      // console.log(record, item)
      /* this.dataSource[record.deskId - 1].editItem = this.dataSource[record.deskId - 1].editItem.filter((i) => {
        return item !== i
      }) */
      this.dataSource.forEach((a) => {
        if (a.deskId === record.deskId) {
          a.editItem = a.editItem.filter((i) => {
            return item !== i;
          });
        }
      });
      // console.log(this.dataSource)
      // console.log('删除可编辑项后列表数据', this.dataSource)
    },
    // 删除可查看项
    delCheckItem(record, item) {
      // console.log(record, item)
      /* this.dataSource[record.deskId - 1].checkItem = this.dataSource[record.deskId - 1].checkItem.filter((i) => {
        return item !== i
      }) */
      this.dataSource.forEach((a) => {
        if (a.deskId === record.deskId) {
          a.checkItem = a.checkItem.filter((i) => {
            return item !== i;
          });
        }
      });
      // console.log(this.dataSource)
      // console.log('删除可查看项后列表数据', this.dataSource)
    },

    // model框确定
    handleOk() {
      this.visible = false;
      if (this.addType === "1") {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].deskId === this.deskId) {
            this.dataSource[i].editItem = [
              ...this.dataSource[i].editItem,
              ...this.addEdit,
            ];
            return;
          }
        }
      } else if (this.addType === "2") {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].deskId === this.deskId) {
            this.dataSource[i].checkItem = [
              ...this.dataSource[i].checkItem,
              ...this.addCheck,
            ];
            return;
          }
        }
      }
    },
    // model框取消
    handleCancel() {
      this.visible = false;
    },
    // model框新增可编辑项的选择
    changeCheckbox(checkedValues, item, record) {
      if (this.addType === "1") {
        var itemObj = {};
        itemObj.editItemId = item.itemId;
        itemObj.editItemName = item.itemName;

        if (checkedValues.target.checked) {
          if (item.itemId === "gg") {
            this.editItemIdTemp = "xt";
          } else if (item.itemId === "xt") {
            this.editItemIdTemp = "gg";
          }
          this.addEdit.push(itemObj);
        } else {
          if (item.itemId === "gg") {
            this.editItemIdTemp = "";
          } else if (item.itemId === "xt") {
            this.editItemIdTemp = "";
          }
          this.addEdit = this.addEdit.filter((i) => i.editItemId !== item.itemId);
        }
      } else if (this.addType === "2") {
        const itemObj = {};
        itemObj.checkItemId = item.itemId;
        itemObj.checkItemName = item.itemName;

        if (checkedValues.target.checked) {
          this.addCheck.push(itemObj);
        } else {
          this.addCheck = this.addCheck.filter((i) => i.checkItemId !== item.itemId);
        }
        // console.log('新增的项', this.addCheck)
      }
    },
    //保存配置
    async saveConfig() {
      try {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (!this.dataSource[i].deskName) {
            this.$message.error("科室名称不能为空！");
            return;
          } else if (
            this.dataSource[i].checkItem.length === 0 &&
            this.dataSource[i].editItem.length === 0
          ) {
            this.$message.error("各科室编辑权限和查看权限不能同时为空！");
            return;
          }
          //~~~~~~~~~~~
          //临时将编辑权限和查看权限组成一个数组 arrTemp
          //自定义科室有矫正视力编辑权限，该科室至少要有裸眼视力的查看权限！
          let arrTemp = this.dataSource[i].checkItem.concat(this.dataSource[i].editItem);
          for (let j = 0; j < this.dataSource[i].editItem.length; j++) {
            const element = this.dataSource[i].editItem[j];
            if (element.editItemId === "jzsl") {
              // console.log('编辑权限有矫正视力')
              let resultT = arrTemp.find((item) => {
                return item.checkItemId === "lysl" || item.editItemId === "lysl";
              });
              if (!resultT) {
                this.$message.error(
                  "自定义科室有矫正视力编辑权限时，该科室至少要有裸眼视力的查看权限！"
                );
                return;
              }
            }
          }
          //~~~~~~~~~~~
        }
        const dataList = JSON.parse(JSON.stringify(this.dataSource));
        for (let index = 0; index < dataList.length; index++) {
          dataList[index].state = 0;
          const item = dataList[index].deskId + "";
          const item1 = item.substring(0, 6);
          if (item1 === "deskId") {
            dataList[index].deskId = "";
          }
          for (let j = 0; j < this.dataSourceTemp.length; j++) {
            const element = this.dataSourceTemp[j];
            if (dataList[index].deskId === element.deskId) {
              if (dataList[index].deskName === element.deskName) {
                dataList[index].state = 0;
              } else {
                dataList[index].state = 1;
              }
            }
          }
        }

        const res = await this.$api.DepartmentsManage.saveConfig({
          orgCode: this.userCode,
          deskList: dataList,
        });
        // console.log(res);
        if (res.code === "200" || res.code === 200) {
          // this.getEditList()
          this.getDeskList();
          this.$message.success("操作成功！");
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>
<style lang="less">
#ConfigManage {
  height: 100%;

  .province {
    height: 100%;
    display: flex;
    flex-direction: column;
    .list {
      flex-grow: 1;
      overflow-y: auto;
    }
  }

  .desk-table {
    .ant-table-body {
      background-color: #f5f5f5;
      .editable-cell {
        position: relative;
      }
      .editable-cell-text-wrapper {
        padding: 5px;
      }
      .item {
        display: inline-block;
        width: 140px;
        padding: 5px 10px;
        background-color: #fff;
        margin: 8px 16px 8px 0;
        position: relative;
        .item-text {
          display: inline-block;
          margin-right: 10px;
        }
        .item-icon {
          position: absolute;
          right: 10px;
          top: 9px;
          color: #cacaca;
        }
      }
      .add-button {
        display: inline-block;
        width: 140px;
        padding: 5px 10px;
        background-color: #fff;
        margin: 5px 10px 5px 0;
        text-align: center;
        cursor: pointer;
        .add-button-text {
          display: inline-block;
          margin-left: 10px;
          color: #c3c3c3;
        }
        .add-button-icon {
          color: #c3c3c3;
        }

        &:hover {
          .add-button-text {
            color: #37acff;
          }
          .add-button-icon {
            color: #37acff;
          }
        }
      }
    }
  }
}

.addDesk-modal {
  .ant-modal-footer {
    border: 0;
    text-align: center;
  }

  .addDesk-table {
    .ant-table-tbody {
      .ant-checkbox-wrapper {
        width: 120px;
        margin: 5px 5px 5px 0;
      }
    }
  }
}
</style>
