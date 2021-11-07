<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-03 13:55:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:59:06
-->

<!-- 教室安排 -->
<template>
  <div>
    <a-modal
      class="operationRoom"
      title="教室安排"
      :visible="roomDrawerVisible"
      @cancel="onClose"
      :width="890"
      :footer="null"
    >
      <div class="content">
        <div class="tree">
          <!-- <div class="tree-n">场所树：</div> -->
          <div class="tree-c">
            <a-tree-select
              :value="tree.placeId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              tree-default-expand-all
              :replaceFields="{
                children: 'children',
                title: 'placeName',
                key: 'placeId',
                value: 'placeId'
              }"
              @change="treeNodeChange"
            />
          </div>
        </div>
        <div class="room-content">
          <div class="room">
            <div class="room-add room-common" @click="addRoom">
              <a-icon
                type="plus"
                :style="{
                  fontSize: '12px',
                  color: '#409FFF',
                  marginRight: '2px'
                }"
              />
              添加
            </div>
            <div
              class="room-item room-common"
              v-for="i in roomList"
              :key="i.classroomId"
            >
              <div class="close" @click="() => deleModalTip(1, i)">
                <a-icon
                  :style="{
                    fontSize: '12px',
                    color: '#FF6464',
                    cursor: 'pointer'
                  }"
                  type="minus-circle"
                />
              </div>
              <span :title="i.classroomName">{{ i.classroomName }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 添加教室 -->
    <AddClassDialog ref="AddClassDialog" />
    <!-- 删除提示 -->
    <DeleModal v-if="isDeleModal" :visible="isDeleModal" title="教室" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AddClassDialog from "../../../ArrLessonSetting/ClassArrange/childCom/AddClassDialog.vue";
import DeleModal from "./deleModal.vue";
export default {
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "956eeb4f27e64419adc1d98037d70e5c", //方案id
      classIdSele: "", //左侧 班级选中id
      tree: { placeId: "" }, //场所树选中
      treeData: [], //场所树数据
      roomList: [], //教室列表
      isDeleModal: false, //删除提示框
      deleItem: {} //删除项
    };
  },
  components: { AddClassDialog, DeleModal },
  computed: {
    ...mapState("arrangeOperation", ["roomDrawerVisible", "classId"]),
    ...mapState("dialog", ["addClassDialogvisible"])
  },
  watch: {
    classId() {
      this.classIdSele = this.classId;
    }
  },
  mounted() {
    this.getClassroomTree();
  },
  methods: {
    ...mapMutations("arrangeOperation", ["setRoomDrawerVisible"]),
    ...mapMutations("dialog", ["setAddClassDialog"]),
    /**
     * @desc 关闭教室安排弹窗
     */
    onClose() {
      this.setRoomDrawerVisible(false);
      this.$parent.topChan();
    },

    /**
     * @desc 获取场所树数据
     */
    async getClassroomTree() {
      let req = {
        arrLessonId: this.planId,
        type: 0
      };
      let res = await this.$api.ArrangeOperation.getClassroomTree(req);
      if (res.code === "200" || res.code === 200) {
        let data = res.data && res.data.length ? res.data : [];
        let treeList = [],
          treeSele = { placeId: "" };
        if (data && data.length) {
          data = await this.dealTreeData(data);
          treeList = data;
          treeSele = data[0];
        }
        this.treeData = treeList;
        this.tree = treeSele;
        this.getRoomList(treeSele.placeId);
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 场所树处理name为null数据
     */
    dealTreeData(list) {
      if (list && list.length) {
        list.map((item) => {
          item.placeName = item.placeName ? item.placeName : "--";
          if (item.children && item.children.length) {
            this.dealTreeData(item.children);
          }
        });
      }
      return list;
    },
    /**
     * @desc 获取教师安排列表
     */
    async getRoomList(placeId) {
      let params = { planId: this.planId, classId: this.classId, placeId };
      let res = await this.$api.ArrangeOperation.getRoomList(params);
      if (res.code === "200" || res.code === 200) {
        const roomData = res.data || [];
        if (roomData && roomData.length) {
          this.roomList = roomData;
        }
      } else this.$message.warning(res.message,5);
    },
    /**
     * @desc 场所切换
     * id 选中场所项
     */
    treeNodeChange(id, label) {
      const treeItem = { placeId: id, placeName: label };
      this.tree = treeItem;
      this.getRoomList(id);
    },
    // 添加教室
    addRoom() {
      // 复用 教室安排添加教室组件
      this.setAddClassDialog(true);
      this.$refs.AddClassDialog.getClassroomTree();
      this.$refs.AddClassDialog.getClassroomList();
      // 添加完成之后调用接口getRoomList() 刷新列表数据
    },
    /**
     * @desc 删除操作
     * value:1打开弹窗2弹窗取消3弹窗确定 item需删除项
     */
    deleModalTip(value, item) {
      // if (value === 1) {
      //   this.isDeleModal = true;
      //   this.deleItem = item;
      // } else {
      //   this.isDeleModal = false;
      //   value === 3 ? this.delRoom() : null;
      // }
      this.deleItem = item;
      this.$confirm({
        title: "确定删除该教室安排？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.delRoom();
        }
      });
    },
    /**
     * @desc 删除教室
     */
    async delRoom(item) {
      const params = { planId: this.planId, roomId: this.deleItem.classroomId };
      let res = await this.$api.ArrangeOperation.delRoom(params);
      if (res.code === "200" || res.code === 200) {
        this.$message.success("取消成功",5);
        this.getRoomList(this.tree.placeId);
      } else this.$message.warning(res.message,5);
      this.deleItem = {};
    },
    /**
     * @desc 添加教室回调
     */
    getClassroomList() {
      this.getRoomList(this.tree.placeId);
    }
  }
};
</script>

<style lang="less" scoped>
.operationRoom {
  /deep/ .ant-modal-body {
    height: 560px;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
}
.content {
  .tree {
    display: flex;
    flex-direction: row;
    height: 40px;
    line-height: 40px;
    margin-bottom: 16px;
    .tree-n {
      // width: 80px;
    }
    .tree-c {
      width: 180px;
    }
  }
  .room-content {
    height: 460px;
    overflow-y: scroll;
  }
  .room {
    display: flex;
    // flex-direction: row;
    flex-wrap: wrap;
    // height: 460px;
    overflow: auto;
    padding-top: 10px;
    box-sizing: border-box;
    .room-common {
      height: 40px;
      width: 150px;
      line-height: 40px;
      text-align: center;
      margin: 0 12px 12px 0;
    }
    .room-add {
      color: #409fff;
      background-color: #e5f2ff;
      cursor: pointer;
    }
    .room-item {
      position: relative;
      background-color: #f4f6f7;
      span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close {
        position: absolute;
        top: -20px;
        right: -4px;
      }
    }
  }
}
</style>
