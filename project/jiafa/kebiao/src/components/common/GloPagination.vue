
<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-20 19:13:58
 * @LastEditors: went
 * @LastEditTime: 2021-09-16 10:52:29
-->
<template>
  <div
    class="glo-pagination"
    v-if="total"
  >
    <div class="custon-total">共{{ total }}条数据</div>
    <div class="antd-pagination">
      <a-pagination
        class
        v-model="current"
        show-size-changer
        :total="total"
        :defaultPageSize="defaultPageSize"
        @showSizeChange="onShowSizeChange"
        @change="onChange"
      />
    </div>

    <div class="custon-jumper">
      <span>跳至</span>
      <span>
        <a-input-number
          class="custom-input"
          id="inputNumber"
          v-model="jumperValue"
          :min="1"
          :max="maxJumperValue"
          @pressEnter="pressEnter"
        />
        /{{ totalPage }}
      </span>
      页
    </div>
  </div>
</template>
 
<script>
export default {
  name: "",
  components: {},
  props: {
    //数据总条数
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      //默认每页条数
      defaultPageSize: 10,
      //总页数
      totalPage: 0,
      //当前页
      current: 1,
      //快速跳转输入框值
      jumperValue: "",
      //快速跳转输入框最大值
      maxJumperValue: 0
    };
  },
  computed: {},

  created() {
    //初始化总页数和快速跳转输入框最大值
    this.maxJumperValue = this.totalPage = Math.ceil(
      this.total / this.defaultPageSize
    );
  },
  watch: {
    total(val) {
      this.maxJumperValue = this.totalPage = Math.ceil(
        val / this.defaultPageSize
      );
    }
  },
  mounted() { },
  methods: {
    onChange(e) {
      this.$emit("onChange", e);
      this.current = e;
    },
    onShowSizeChange(e, pageSize) {
      this.maxJumperValue = this.totalPage = Math.ceil(this.total / pageSize);
      this.$emit("onSizeChange", e, pageSize);
    },

    pressEnter(val) {
      let curPage = Number(val.target.value);
      if (curPage < 1 || curPage > this.maxJumperValue) {
        return;
      }
      this.current = curPage === 0 ? 1 : curPage;
      let outCurrent =
        this.current > this.maxJumperValue ? this.maxJumperValue : this.current;
      this.$emit("pressEnter", outCurrent);
    },
    initCurrent() {
      // console.log('初始化');
      this.current = 1;
      // console.log('this.current', this.current);
    },
    initPageSize(val) {
      this.defaultPageSize = val;
    },
    clearJumperValue() {
      this.jumperValue = '';
    }
  }
};
</script>
 
<style scoped lang = "less">
.glo-pagination {
  margin: 10px 0;
  display: flex;
  .custon-total {
    flex: 1;
    display: inline-block;
    margin-left: 10px;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #494b4d;
  }
  .antd-pagination {
    flex: 4;
    display: flex;
    justify-content: flex-end;
    .ant-pagination {
      box-sizing: border-box;
      height: 60px;
      line-height: 60px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-variant: tabular-nums;

      list-style: none;
      font-feature-settings: "tnum";
      /deep/.ant-pagination-item-active {
        font-weight: 500;
        background: #1bb280;
        border-color: #1bb280;
      }
      /deep/.ant-pagination-item-active a {
        color: #ffffff;
      }
    }
  }
  .custon-jumper {
    display: flex;
    justify-content: center;
    display: inline-block;
    margin-left: 10px;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #919599;
    .custom-input {
      width: 50px;
      margin: 0 4px;
    }
  }
}
</style>