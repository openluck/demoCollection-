<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-03 13:55:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 10:00:41
-->

<!-- 教师安排 -->
<template>
  <div>
    <a-modal
      title="教师安排"
      class="operationTeacher"
      :visible="teacherDrawerVisible"
      @cancel="onClose"
      :width="920"
      :footer="null"
    >
      <div class="content">
        <div class="group" v-for="group in teacherList" :key="group.groupId">
          <div class="group-name">{{ group.group }}</div>
          <div class="teacher-list">
            <div class="add item-common" @click="() => addTeacher(group)">
              <a-icon type="plus"></a-icon>添加
            </div>
            <div
              class="item item-common"
              v-for="item in group.list"
              :key="`${item.teacherId}-${group.groupId}`"
            >
              <div class="name" :title="item.teacherName">
                {{ item.teacherName }}
              </div>
              <div class="num">
                {{ item.restNum
                }}<span style="color: #b9bdc0">/{{ item.totalNum }}</span>
              </div>
              <div
                class="close"
                @click="
                  deleModalTip(1, {
                    groupId: group.groupId,
                    teacherId: item.teacherId
                  })
                "
              >
                <a-icon
                  :style="{ fontSize: '12px', color: '#FF6464' }"
                  type="minus-circle"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="noneData" v-if="teacherList.length < 1">
          <img :src="require('./../../../../../../assets/img/noData.png')" />
          <p>暂无数据</p>
        </div>
      </div>
    </a-modal>
    <!-- 添加老师 -->
    <TeacherListDialog
      :projectGroupId="teacherGroup.groupId"
      ref="TeacherListDialog"
    />
    <!-- 删除提示：改用confirm -->
    <!-- <DeleModal v-if="isDeleModal" :visible="isDeleModal" title="教师" /> -->
    <!-- <AddTeacher :groupId="teacherGroup.groupId" v-if="isAddTeacherModal" /> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import TeacherListDialog from "../../../ArrLessonSetting/TeacherLesArrange/childCom/TeacherListDialog.vue";
import AddTeacher from "../Modal/AddTeacher.vue";
import DeleModal from "./deleModal.vue";
export default {
  data() {
    return {
      planId:
        sessionStorage.getItem("arrLessonId") ||
        "956eeb4f27e64419adc1d98037d70e5c", //计划id
      teacherList: [], //教师列表
      teacherGroup: {}, //添加教师 所在分组
      // isDeleModal: false, //删除教师弹窗
      deleObj: {} //删除项
    };
  },
  components: { TeacherListDialog, AddTeacher, DeleModal },
  computed: {
    ...mapState("arrangeOperation", [
      "teacherDrawerVisible",
      "isAddTeacherModal"
    ])
  },
  mounted() {
    this.getTeacherList();
  },
  methods: {
    ...mapMutations("dialog", ["setTeacherListVisible"]),
    ...mapMutations("arrangeOperation", [
      "setTeacherDrawerVisible",
      "setAddTeacherModal"
    ]),
    /**
     * @desc 关闭教室安排弹窗
     */
    onClose() {
      this.$parent.topChan();
      this.setTeacherDrawerVisible(false);
    },

    /**
     * @desc 获取教师安排列表
     */
    async getTeacherList() {
      const params = { planId: this.planId };
      // console.log("params", params);
      let res = await this.$api.ArrangeOperation.getTeacherList(params);
      if (res.code === "200" || res.code === 200) {
        const teacherData = res.data;
        let list = [];
        if (teacherData && teacherData.length) {
          list = teacherData;
        }
        this.teacherList = list;
      } else this.$message.error(res.message);
    },
    /**
     * @desc 添加教师
     */
    addTeacher(item) {
      this.teacherGroup = item;
      //延时作用：子组件用props接收参数，导致传参为上一次值
      setTimeout(() => {
        this.setTeacherListVisible(true);
        this.$refs.TeacherListDialog.getTeacherDialogList();
      }, 100);

      // this.setAddTeacherModal();
    },
    /**
     * @desc 删除操作
     * value:1打开弹窗2弹窗取消3弹窗确定 item需删除项
     */
    deleModalTip(value, item) {
      // if (value === 1) {
      //   this.isDeleModal = true;
      //   this.deleObj = item;
      // } else {
      //   this.isDeleModal = false;
      //   value === 3 ? this.delTeacher() : null;
      // }
      this.deleObj = item;
      this.$confirm({
        title: "确定删除该教师安排？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.delTeacher();
        }
      });
    },
    /**
     * @desc 删除教师
     */
    async delTeacher(groupId, teacherId) {
      let data = { ...{ planId: this.planId }, ...this.deleObj };
      let res = await this.$api.ArrangeOperation.delTeacher(data);
      if (res.code === "200") {
        this.$message.success("取消成功",5);
        this.getTeacherList();
      } else this.$message.error(res.message,5);
      this.deleObj = {};
    },
    /**
     * @desc 教师添加成功回调
     */
    getTeachGroup() {},
    getTeacherGroupList() {
      this.getTeacherList();
    }
  }
};
</script>

<style lang="less" scoped>
.operationTeacher {
  /deep/ .ant-modal-body {
    padding-top: 0;
    height: 560px;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
}
.content {
  width: 100%;
  height: 100%;
  overflow: auto;
  .group {
    margin-top: 8px;
    .group-name {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: 700;
    }
    .teacher-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .item-common {
        height: 40px;
        line-height: 40px;
        width: 115px;
        margin: 8px 8px 0 0;
      }
      .add {
        text-align: center;
        background-color: #e5f2ff;
        color: #409fff;
        cursor: pointer;
      }
      .item {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 8px;
        background-color: #f4f6f7;
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .close {
          position: absolute;
          top: -20px;
          right: -4px;
          cursor: pointer;
        }
      }
    }
  }

  .noneData {
    padding-top: 20%;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #bfbfbf;
    p {
      margin-top: 10px;
    }
  }
}
</style>
