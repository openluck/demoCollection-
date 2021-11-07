<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-04 16:24:15
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 16:21:16
-->
<template>
  <div class="yqy-edit-lesSort-item" ref="yqy-edit-lesSort-item">
    <header class="back">
      <div class="back-left">
        <!-- <a-icon type="left-circle" style="fontSize:22px;color:#929599;margin-right:10px"/> -->
        <svg-icon
          icon-class="lesSort_back"
          style="fontsize: 22px; margin-right: 10px; vertical-align: middle"
          @click.native="toPage('/LesSortManage/lesSortSetting')"
        >
        </svg-icon>
        <span>编辑节次项</span>
      </div>
      <div class="back-right">
        <a-button @click="toPage('/LesSortManage/lesSortSetting')"
          >取消</a-button
        >
        <a-button type="primary" @click="save()">下一步</a-button>
      </div>
    </header>

    <div class="content" v-loading="loading">
      <div class="title">
        <span class="sec-name">{{ curSec.secName }}</span>
        <a-button type="primary" style="margin-left: 16px" @click="addItem()">
          <svg-icon
            icon-class="com_add"
            style="fontsize: 12px; margin-right: 5px"
          ></svg-icon>
          新增节次项
        </a-button>
      </div>

      <!-- 列表 -->
      <div class="list">
        <div
          class="list-item"
          :class="
            moveIndex[0] === index
              ? 'moving-down'
              : moveIndex[1] === index
              ? 'moving-up'
              : ''
          "
          v-for="(item, index) in showLesSortIndex"
          :key="item.lesSortIndex"
        >
          <span class="index">{{ item.lesSortIndex }}</span>
          <div class="name-box box">
            <span class="box-title">节次名</span>
            <span class="box-text">{{ item.lesSortName }}</span>
          </div>
          <div class="type-box box">
            <span class="box-title">类型</span>
            <!-- <span class="box-text">{{item.lesSortType==="0"?"非授课":"授课"}}</span> -->
            <span v-if="item.lesSortType === '1'" class="box-text"
              >授课 ({{ item.lesType === "0" ? "非自习" : "自习" }})</span
            >
            <span v-else-if="item.lesSortType === '0'" class="box-text"
              >非授课</span
            >
          </div>
          <div class="show-box box">
            <span class="box-title">展示形式</span>
            <span class="box-text">{{
              item.showType === "1" ? "通栏" : "七列"
            }}</span>
          </div>
          <div class="handle-box">
            <a-button type="link" @click="editItem(item)">
              <svg-icon
                icon-class="com_edit"
                style="width: 14px; margin-right: 6px"
              >
              </svg-icon>
              编辑
            </a-button>
            <!-- <a-button type="link" @click="delItem(item)">
              <svg-icon icon-class="msc" style="width:14px;margin-right: 6px">
              </svg-icon>
              删除
            </a-button> -->
            <a-popconfirm
              title="确定要删除这行内容吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="delItem(item)"
            >
              <a-button type="link">
                <svg-icon
                  icon-class="com_delete"
                  style="width: 14px; margin-right: 6px"
                >
                </svg-icon>
                删除
              </a-button>
            </a-popconfirm>
          </div>
          <div class="move-box">
            <svg-icon
              icon-class="lesSort_up"
              :class="index === 0 ? 'disable' : ''"
              style="font-size: 22px; margin-right: 18px"
              @click.native="
                index === 0
                  ? () => {}
                  : swapArray(lesSortList, index, index - 1)
              "
            >
            </svg-icon>
            <svg-icon
              icon-class="lesSort_down"
              :class="index === lesSortList.length - 1 ? 'disable' : ''"
              style="font-size: 22px"
              @click.native="
                index === lesSortList.length - 1
                  ? () => {}
                  : swapArray(lesSortList, index, index + 1)
              "
            >
            </svg-icon>
          </div>
        </div>
      </div>
    </div>

    <AddModal
      v-if="addLesSortModalVisi"
      :itemData="itemData"
      :addLesSortModalVisi="addLesSortModalVisi"
      :status="status"
      @saveItem="saveItem"
    />
  </div>
</template>

<script>
import AddModal from "./EditLesSortItemChildren/AddModal.vue";
export default {
  name: "EditLesSortItem",
  components: { AddModal },
  data() {
    return {
      addLesSortModalVisi: false,
      loading: false,
      status: true, //true 编辑状态   false新增状态
      itemData: {},
      lesSortList: [], //节次项列表
      moveIndex: [], //正在移动的列表
    };
  },
  computed: {
    curSec() {
      return this.$store.state.lesSort.curSec;
    },
    lesSortPlanId() {
      return this.$store.state.lesSort.lesSortPlanId;
    },
    showLesSortIndex() {
      // console.log("ininininn");
      const arr = [...this.lesSortList];
      arr.sort((a, b) => a.lesSortIndex - b.lesSortIndex);
      return arr;
    },
  },
  async created() {
    const isBack = this.$route.query.isBack;
    if (isBack === "t") {
      this.lesSortList = this.$store.state.lesSort.tempLesSortList;
    } else {
      if (this.lesSortPlanId) {
        await this.getLesSortPlanInfo({
          secId: this.curSec.secId,
          lesSortPlanId: this.lesSortPlanId,
        });
      }
    }
  },
  mounted() {},
  methods: {
    toPage(url) {
      this.$router.push(url);
    },
    addItem() {
      this.itemData = {
        // lesSortId: "",
        lesSortIndex: this.lesSortList.length
          ? this.lesSortList[this.lesSortList.length - 1].lesSortIndex + 1
          : 1,
        lesSortName: "",
        lesSortType: "1",
        lesType: "0",
        showType: "2",
        remarkList: ["", "", "", "", "", "", ""],
      };
      this.addLesSortModalVisi = true;
      this.status = false;
    },
    editItem(data) {
      this.itemData = { ...data };
      this.addLesSortModalVisi = true;
      this.status = true;
    },

    delItem(data) {
      console.log("data", data);
      if (this.lesSortPlanId) {
        this.$store.commit("lesSort/delLesSort", data.lesSortIndex);
      }
      this.lesSortList = this.lesSortList
        .filter((i) => i.lesSortIndex !== data.lesSortIndex)
        .map((i) => {
          if (i.lesSortIndex >= data.lesSortIndex) {
            i.lesSortIndex--;
          }
          return i;
        });
    },

    saveItem(data) {
      this.addLesSortModalVisi = false;
      // console.log('saveItem');
      if (this.status) {
        // if (data.lesSortId) {
        let index;
        for (let i = 0, j = this.lesSortList.length; i < j; i++) {
          if (this.lesSortList[i].lesSortIndex === data.lesSortIndex) {
            index = i;
            break;
          }
        }
        this.lesSortList.splice(index, 1, data);
      } else {
        // data.lesSortId = data.lesSortIndex
        this.lesSortList.push(data);
      }
    },

    /**
     * @description: index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
     * @param {*} arr 数组
     * @param {*} index1 添加项目的位置
     * @param {*} index2 删除项目的位置
     * @return {*}
     * @author:
     */
    swapArray(arr, index1, index2) {
      if (index1 > index2) {
        this.moveIndex = [index2, index1]; //放入数组，待添加动画
      } else {
        this.moveIndex = [index1, index2];
      }
      // console.log(index1, index2);
      let temp = arr[index1].lesSortIndex;
      arr[index1].lesSortIndex = arr[index2].lesSortIndex;
      arr[index2].lesSortIndex = temp;
      arr.sort((a, b) => a.lesSortIndex - b.lesSortIndex);

      setTimeout(() => {
        this.moveIndex = [];
      }, 500);
    },
    async save() {
      if (!this.lesSortList.length) {
        return this.$message.warn("请至少添加一项节次");
      }
      this.$store.commit("lesSort/changeTempLesSortList", this.lesSortList);
      this.toPage("/LesSortManage/RangeDiffNoon");
      // if (this.lesSortPlanId) {
      //   console.log("this.lesSortList", this.lesSortList);
      //   this.toPage("/LesSortManage/RangeDiffNoon" + "?lesSortPlanId=" + this.lesSortPlanId)
      // } else {
      // }
    },

    //获取节次方案详情
    async getLesSortPlanInfo(data) {
      this.loading = true;
      try {
        const res = await this.$api.lesSortSetting.getLesSortPlanInfo(data);
        if (res.code === "200" && res.result) {
          this.lesSortList = res.data.lesSortList.sort(
            (a, b) => a.lesSortIndex - b.lesSortIndex
          );
          this.$store.commit(
            "lesSort/changeOriginalLesSortList",
            JSON.parse(JSON.stringify(this.lesSortList))
          );
          let arr = res.data.diffNoonList.sort(
            (a, b) => a.startIndex - b.startIndex
          );
          this.$store.commit("lesSort/changeTempDiffNoonRangeList", arr);
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
@primary-color: #2abf8e;
.yqy-edit-lesSort-item {
  height: 100%;
  .back {
    height: 64px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e8eb;
    .back-left {
      span {
        color: #303233;
        font-size: 18px;
        vertical-align: middle;
      }
    }
    // .back-right {
    // }
  }
  .content {
    padding: 24px;
    min-height: calc(100% - 64px);
  }
  .list {
    padding-top: 8px;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      margin-top: 16px;
      border: 1px solid #eceef0;
      padding: 0 24px;
      background: #fafbfc;
      .index {
        display: inline-block;
        width: 32px;
        height: 32px;
        background: #eaf9f4;
        border: 2px solid #2abf8e;
        border-radius: 50%;
        font-size: 16px;
        color: @primary-color;
        text-align: center;
        line-height: 28px;
        margin-right: 96px;
      }
      .box {
        display: flex;
        flex-direction: column;
      }
      // .name-box,
      .type-box,
      .show-box {
        width: 0;
        flex-grow: 1;
      }
      .name-box {
        width: 0;
        flex-grow: 2;
      }
      .handle-box {
        width: 165px;
        margin-right: 96px;
      }
      .box-title {
        color: #aaaeb2;
        font-size: 14px;
      }
      .box-text {
        color: #494b4d;
        font-size: 16px;
      }
      .ant-btn-link {
        color: #616366;
        font-size: 14px;
      }
      .svg-icon {
        color: #797c7f;
        cursor: pointer;
      }
      .svg-icon.disable {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    .list-item.moving-down {
      animation: down 0.5s 1;
    }
    .list-item.moving-up {
      animation: up 0.5s 1;
    }

    .ant-btn + .ant-btn {
      margin-left: 0;
    }
  }
}
@keyframes up {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-72px);
  }
  // 100% {
  //   transform: translateY(0px);
  // }
}
@keyframes down {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(72px);
  }
  // 100% {
  //   transform: translateY(0px);
  // }
}
</style>
