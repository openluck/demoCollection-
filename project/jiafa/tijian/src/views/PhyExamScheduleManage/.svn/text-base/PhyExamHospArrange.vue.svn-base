<template>
  <div class="phy-exam-hosp-arrange">
    <div class="button-box">
      <a-button type="primary" @click="startCanceDrag()">
        <svg-icon
          :icon-class="isDistribut ? 'quxiao' : 'fenpei'"
          :scale="isDistribut ? 0.7 : 0.85"
          style="margin-right: 5px"
        ></svg-icon>
        {{ !isDistribut ? "开始分配" : "取消分配" }}</a-button
      >
      <a-button type="primary" @click="save" style="margin-left: 15px">
        <svg-icon
          icon-class="baocun"
          :scale="0.85"
          style="margin-right: 5px"
        ></svg-icon>
        保存</a-button
      >
    </div>

    <div class="table-box">
      <a-table
        class="assigns-table"
        style="margin-right: 20px"
        bordered
        size="small"
        :columns="[
          {
            title: '报名点',
            key: 'assignsList',
            scopedSlots: { customRender: 'assignsList' },
          },
        ]"
        :pagination="false"
        :data-source="assignsTableData"
        :rowKey="(row) => 1"
        :rowClassName="() => 'every-row'"
      >
        <template #assignsList>
          <template v-if="assignsList.length">
            <template v-for="item in assignsList">
              <span
                :title="item.assignsName"
                :key="item.assignsId"
                :class="
                  !isDistribut ? 'is-not-distribut tag-text' : 'tag-text shake'
                "
                :draggable="isDistribut && dragable"
                @dragstart="ininDragStart(item.assignsId)"
                @dragend="ininDragEnd()"
                >{{ item.assignsName }}</span
              >
            </template>
          </template>
          <span v-else>暂无数据</span>
          
        </template>
      </a-table>

      <a-table
        class="hosp-table"
        bordered
        size="small"
        :columns="columns"
        :pagination="false"
        :data-source="data"
        :rowKey="(row) => row.hospitalId"
        :rowClassName="() => 'every-row'"
        :scroll="{ y: scrollY }"
      >
        <template #result="text, row, index">
          <div
            v-if="text.length"
            :class="{ 'drag-enter-box': isEnterBox[index], 'drop-box': true }"
            @dragenter.self="initDragEnter(index)"
            @dragover="(e) => initDragOver(e, index)"
            @dragleave="initDragLeave(index)"
            @drop="initDrop(index)"
          >
            <span
              v-for="item in text"
              :key="item.assignsId"
              class="result-item"
              :class="isStartDrag ? 'item-tag-negative' : 'item-tag-positive'"
            >
              <span class="result-item-text" :title="item.assignsName">{{
                item.assignsName
              }}</span>
              <!-- <svg-icon
                v-if="dragable && isDistribut"
                icon-class="shanchu"
                :scale="0.85"
                style="margin-left: 8px"
                @click="delAssign(item, index)"
              ></svg-icon> -->
              <a-icon
                v-if="dragable && isDistribut"
                style="color:#cacaca"
                type="close-circle"
                class="result-item-icon"
                theme="filled"
                @click="delAssign(item, index)"
              />
            </span>
            <!-- <a-tag
              ref="resultItem"
              :class="isStartDrag ? 'item-tag-negative' : 'item-tag-positive'"
              v-for="item in text"
              :key="item.assignsId"
              >{{ item.assignsName }}
              <a-icon
                v-if="dragable && isDistribut"
                type="close-circle"
                class="result-item-icon"
                theme="filled"
                @click="delAssign(item, index)"
            /></a-tag> -->
          </div>
          <div
            v-else
            :class="{ 'drag-enter-box': isEnterBox[index], 'drop-box': true }"
            @dragenter.self="initDragEnter(index)"
            @dragover="(e) => initDragOver(e)"
            @dragleave="initDragLeave(index)"
            @drop="initDrop(index)"
          ></div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "体检医院",
    dataIndex: "hospitalName",
    width: 250,
    key: "hospitalName",
  },
  {
    title: "分配结果",
    dataIndex: "result",
    key: "result",
    scopedSlots: { customRender: "result" },
  },
];
export default {
  name: "",
  data() {
    return {
      data: [],
      columns,
      dataOriginal: [],
      assignsList: [],
      assignsListOriginal: [],
      dragable: true, //是否是区县，区县可拖拽，报名点只查看
      draggingId: null,
      isDistribut: false, //是否开始分配
      isStartDrag: false, //是否开始拖动
      isEnterBox: {}, //是否进入可放区域
      scrollY: 0,
    };
  },
  computed: {
    dragObj() {
      const { assignsList, draggingId } = this;
      return assignsList.filter((item) => item.assignsId === draggingId)[0];
    },

    dataLength() {
      return this.data.length;
    },

    assignsTableData() {
      if (this.assignsList.length) {
        return [{}]
      }
      return []
    }
  },
  watch: {
    dataLength(length) {
      for (let i = 0; i < length; i++) {
        this.$set(this.isEnterBox, i, false);
      }
    },
  },
  mounted() {
    const height = window.document.body.clientHeight;
    this.scrollY = height - 210;
    window.onresize = () => {
      const height = window.document.body.clientHeight;
      this.scrollY = height - 210;
    };
    this.getAssignsList();
    this.getHospitalList();
  },
  methods: {
    //初始化事件
    ininDragStart(id) {
      // console.log("ininDragStart", id);
      this.draggingId = id;
      this.isStartDrag = true;
    },
    ininDragEnd() {
      this.isStartDrag = false;
      // console.log("ininDragEnd");
      //  this.isEnterBox[index] = false;
    },
    initDragEnter(index) {
      this.isEnterBox[index] = true;
    },
    initDragOver(e, index) {
      e.preventDefault();
      // this.isEnterBox[index] = true;
    },
    initDragLeave(index) {
      this.isEnterBox[index] = false;
    },
    initDrop(index) {
      this.isEnterBox[index] = false;
      this.data[index].result.push(this.dragObj);
      this.assignsList = this.assignsList.filter(
        (item) => item.assignsId !== this.dragObj.assignsId
      );
    },
    //点击开始/取消分配
    startCanceDrag() {
      if (this.isDistribut) {
        this.data = JSON.parse(JSON.stringify(this.dataOriginal));
        this.assignsList = JSON.parse(JSON.stringify(this.assignsListOriginal));
      }
      this.isDistribut = !this.isDistribut;
    },
    delAssign(obj, index) {
      // console.log(obj);
      if (!obj.isArranged) {
        this.data[index].result = this.data[index].result.filter(
          (item) => item.assignsId !== obj.assignsId
        );
        this.assignsList.push(obj);
      } else {
        this.$error({
          title: "删除前请先在日程安排中解除分组！",
          // content: "some messages...some messages..."
        });
      }
    },

    //保存按钮
    save() {
      // console.log(this.data);
      this.isDistribut = false
      this.updateArrange()
    },
    //获取报名点数组
    async getAssignsList() {
      try {
        const res = await this.$api.phyExamHospArrange.getAssignsList({});
        if (res.code === "200" || res.code === 200) {
          this.assignsList = JSON.parse(JSON.stringify(res.data));
          this.assignsListOriginal = JSON.parse(JSON.stringify(res.data));
          // this.assignsList = JSON.parse(JSON.stringify(assignsList11));
          // this.assignsListOriginal = JSON.parse(JSON.stringify(assignsList11));
        } else {
           this.$message.error(res.message)
        }
      } catch (error) {
        this.$message.error("请求失败！" + error)
      }
    },

    //获取体检医院数组
    async getHospitalList() {
      try {
        const res = await this.$api.phyExamHospArrange.getHospitalList({});
        if (res.code === "200" || res.code === 200) {
          // this.data = JSON.parse(JSON.stringify(data11));
          // this.dataOriginal = JSON.parse(JSON.stringify(data11));
          this.data = JSON.parse(JSON.stringify(res.data));
          this.dataOriginal = JSON.parse(JSON.stringify(res.data));
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        this.$message.error("请求失败！" + error)
      }
    },

    //体检医院编排 - 修改编排
    async updateArrange() {
      const arr = this.data.map(item => {
        const tempArr = item.result.map(i => i.assignsId)
        return { hospitalId: item.hospitalId, result: tempArr }
      })
      // console.log(arr);
      try {
        const res = await this.$api.phyExamHospArrange.updateArrange(arr);
        if (res.code === "200" || res.code === 200) {
          this.$message.success("保存成功")
          this.getAssignsList()
          this.getHospitalList()
        } else {
           this.$message.error(res.message)
        }
      } catch (error) {
        this.$message.error("请求失败！" + error)
      }
    },
  },
};
</script>

<style lang="less">
// .shake {
  // animation: shake 4000ms ease-in-out infinite;
// }
@keyframes shake {
  /* 动画需：“对称”实现 */
  10%,
  90% {
    transform: scale(1);
  }
  20%,
  80% {
    transform: scale(0.95);
  }
  30%,
  70% {
    transform: scale(1);
  }
  40%,
  60% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
  // 10%, 90% { transform: rotate(-2deg) }
  // 20%, 80% { transform: rotate(2deg) }
  // 30%, 70% { transform: rotate(-2deg) }
  // 40%, 60% { transform: rotate(2deg) }
  // 50% { transform: rotate(0deg)}
}

.phy-exam-hosp-arrange {
  .button-box {
    margin-bottom: 15px;
  }
  .table-box {
    display: flex;
    .ant-spin-nested-loading,
    .ant-spin-container,
    .ant-table,
    .ant-table-content {
      height: 100%;
    }
    .ant-table-content {
      background-color: #f5f5f5;
      .ant-table-body {
        // height: 100%;
        & > table {
          height: 100%;
        }
      }
    }
    .assigns-table {
      width: 530px;
      flex-shrink: 0;
      .ant-table-row {
        td {
          max-height: calc(100vh - 205px);
          display: block;
          overflow-y: auto;
        }
      }
    }
    .hosp-table {
      flex-grow: 1;
      .ant-table-body {
        background-color: #f5f5f5;
        border-bottom: 1px solid rgb(232, 232, 232);
      }
    }

    .ant-table-placeholder{
      background-color: #f5f5f5;
    }
  }


  .drop-box {
    min-height: 80px;
    padding: 10px;
    position: relative;
    z-index: 10;
    .result-item {
      display: inline-block;
      width: 240px;
      padding: 5px;
      background-color: #fff;
      margin: 8px;
      // margin-right: 15px;
      // margin-bottom: 15px;
      position: relative;
      .result-item-text {
        display: inline-block;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .result-item-icon {
        position: absolute;
        right: 10px;
        top: 12px;
      }
    }
    .item-tag-positive {
      // position: relative;
      z-index: 9;
    }
    .item-tag-negative {
      // position: relative;
      z-index: -9;
    }
  }
  .drop-box.drag-enter-box {
    outline: 3px solid #1890ff;
  }
  .tag-text {
    width: 230px;
    padding: 10px;
    margin: 8px;
    display: inline-block;
    position: relative;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  [draggable="true"] {
    cursor: grab;
  }
  .is-not-distribut {
    background-color: #dfdfdf;
    cursor: not-allowed;
  }

  /* 悬浮变色 */
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: #f5f5f5;
  }
}
</style>
