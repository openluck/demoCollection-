<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-15 14:06:08
 * @LastEditors: went
 * @LastEditTime: 2021-06-24 14:45:07
-->
<template>
  <div class="select-content">
   <svg-icon icon-class="untitled" style="color:red"></svg-icon>
    <!-- <div class="main">
      <div class="area-select-container">
        <div
          class="list-one"
          v-for="(node, index) in list"
          :key="index"
          :data-selected-index="index"
          @click="handleClick(index)"
        >{{ node }}</div>
      </div>
      <VueAreaSelect
        style="backgroubnd:red"
        ref="areaSelect"
        :selectItemClassName="['list-one']"
        v-model="selectList"
        :preventParent="preventParent"
        selectedClassName="select-i"
        @handleClick="handleClick"
      />
    </div>-->
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    const target = Array.from(new Array(50), (item, i) => i);
    return {
      preventParent: true,
      selectAreaClassName: "main",
      selectList: [],
      list: target,
      curList: []
    };
  },
  created() {},
  watch: {},
  methods: {
    handleOpr(type) {
      switch (type) {
        case 1:
          this.preventParent = !this.preventParent;
          break;
      }
    },
    initGlobal() {
      this.selectList = [];
    },
    remove(val) {},
    handleClick(index) {
      if (this.curList.includes(index)) {
        this.selectList = this.selectList.filter((item, i) => {
          return item !== index;
        });
        this.curList = this.curList.filter((curItem, i) => {
          return curItem !== index;
        });
      } else {
        this.curList = [...this.selectList];
      }
    }
  },
  components: {}
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.select-content {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background: #ffffff;
  .left {
    width: 200px;
    background-color: antiquewhite;
  }
  .main {
    flex: 1;
    width: 40%;
  }
}

.control {
  background-color: wheat;
}
.model-list {
  background: #fff;
  height: 100px;
  overflow: auto;
}
.list-one {
  width: 50px;
  height: 50px;
  border: 1px solid #ccd;
  margin: 10px;
  display: inline-block;
  text-align: center;
  line-height: 50px;

  vertical-align: middle;
}
.area-select-container {
  display: inline-block;
  position: relative;
  background-color: #ffffff;
}
.select-i {
  color: red;
  background: beige;
}
</style>
