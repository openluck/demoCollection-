<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-27 15:04:44
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-21 16:36:34
-->
<template>
  <div class="section-arrange">
    <div class="title">
      <span>节次管理</span>
    </div>
    <div class="add-btn">
      <a-button type="primary" @click="showDialog">
        <a-icon type="plus" />新增节次安排
      </a-button>
    </div>
    <!--使用draggable组件-->
    <div>{{ drag ? "拖拽中" : "拖拽停止" }}</div>
    <!--使用draggable组件-->
    <draggable
      v-model="myArray"
      chosenClass="chosen"
      forceFallback="true"
      group="people"
      animation="1000"
      @start="onStart"
      @end="onEnd"
    >
      <transition-group>
        <div class="drag-item" v-for="item in myArray" :key="item.id">
          <div class="num">
            <span class="yuan">{{ item.id }}</span>
          </div>
          <div class="chunk">
            <span class="name">名称：</span>
            <span class="value">{{ item.name }}</span>
          </div>
          <div class="chunk">
            <span class="name">类型：</span>
            <span class="value">{{ item.type }}</span>
          </div>
          <div class="chunk">
            <span class="name">所属时段：</span>
            <span class="value">{{ item.time }}</span>
          </div>
          <div class="arrange">
            <div class="edit opr">
              <a-icon class="icon" type="check-square" />
              <span>编辑</span>
            </div>
            <div class="del opr">
              <a-icon class="icon" type="check-square" />
              <span>删除</span>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <SectionDialog :sectionVisible="sectionVisible" @closeModel="closeModel" />
  </div>
</template>

<script>
//导入draggable组件
import draggable from "vuedraggable";
import SectionDialog from "./SectionDialog/SectionDialog";
export default {
  name: "",
  //注册draggable组件
  components: {
    draggable,
    SectionDialog
  },
  data() {
    return {
      drag: false,
      //定义要被拖拽对象的数组
      myArray: [
        {
          id: 1,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 2,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 3,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 4,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 5,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 6,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 7,
          name: "早自习",
          type: "授课",
          time: "早晨"
        },
        {
          id: 8,
          name: "早自习",
          type: "授课",
          time: "早晨"
        }
      ],
      sectionVisible: false
    };
  },
  mounted() {
    this.getClassSectionList();
  },
  methods: {
    async getClassSectionList() {
      const res = await this.$api.SectionArrList.getClassSectionList();
    },
    /**
     * @name: 开始拖拽事件
     * @msg:
     * @param {*}
     * @return {*}
     */
    onStart() {
      this.drag = true;
    },

    /**
     * @name: 拖拽结束事件
     * @msg:
     * @param {*}
     * @return {*}
     */
    onEnd() {
      this.drag = false;
    },

    /**
     * @name: 显示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showDialog() {
      this.sectionVisible = true;
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*} sectionVisible 显示参数
     * @return {*}
     */
    closeModel(sectionVisible) {
      this.sectionVisible = !sectionVisible;
    }
  }
};
</script>

<style lang="less" scoped>
.section-arrange {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background-color: #ffffff;

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .add-btn {
    margin: 10px 0;

    /deep/.ant-btn-primary {
      background-color: #409fff !important;
      border-color: #409fff !important;
    }
  }

  /*被拖拽对象的样式*/
  .drag-item {
    padding: 6px 10px;
    // background-color: #fff;
    border: solid 1px #eee;
    margin-bottom: 10px;
    // cursor: move;
    display: flex;
    align-items: center;
    height: 66px;
    font-size: 17px;
    box-sizing: border-box;

    .num {
      width: 5%;

      .yuan {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #409fff;
        color: #409fff;
        border-radius: 50%;
      }
    }

    .chunk {
      width: 30%;

      .name {
        color: #8f9294;
      }
    }

    .arrange {
      width: 10%;
      display: flex;

      .opr {
        cursor: pointer;
      }

      .edit {
        margin-right: 20px;
      }

      .edit:hover {
        color: #9dceff;
      }

      .del:hover {
        color: #ff7676;
      }

      .icon {
        margin-right: 10px;
      }
    }
  }
  /*选中样式*/
  .chosen {
    border: solid 1px #3089dc !important;
  }
}
</style>