<template>
  <div class="status-filter">
    <span>任务状态：</span>
    <span
      class="status"
      :class="!filterData.taskStatusId ? 'active' : ''"
      @click="changeTaskStatusId('')"
    >
      全部 {{ total }}</span
    >
    <span
      class="status"
      :class="[
        fillterColor(item.id),
        canClick ? 'canClick' : 'notClick',
        item.id === filterData.taskStatusId ? 'active' : '',
      ]"
      v-for="item in taskStatus"
      :key="item.id"
      @click="changeTaskStatusId(item.id)"
    >
      <i :class="fillterColor(item.id)"></i>
      {{ item.name }} {{ returnStatusCount(item.id) }}</span
    >
  </div>
</template>
 
<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapActions } = createNamespacedHelpers("escortTask");
export default {
  name: "",
  props: {
    filterData: {
      type: Object,
      default: {},
    },
    countList: {
      type: Array,
      default: [],
    },
    canClick: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      copyCountList: [...this.countList],
    };
  },
  computed: {
    taskStatus() {
      return this.$store.state.app.systemConf.escortStatus;
    },
    total() {
      let count = 0;
      let arr = this.copyCountList;
      arr.forEach((i) => {
        count += i.count;
      });
      return count;
    },
    //根据状态返回相关状态数量
    returnStatusCount(id) {
      return (id) => {
        const arr = this.copyCountList.filter((item) => item.value === id);
        if (arr.length) {
          return arr[0].count;
        } else {
          return 0;
        }
      };
    },
  },
  watch: {
    countList(newValue) {
      this.copyCountList = [...newValue];
    },
  },
  mounted() {
    if (!this.copyCountList.length) {
      this.copyCountList = JSON.parse(sessionStorage.getItem("countList"));
    }
  },
  methods: {
    ...mapActions(["queryEscortAsync"]),
    ...mapMutations(["queryEscortTaskStatusId"]),
    fillterColor(tag) {
      if (tag == 1 || tag == 0) {
        return "yellow";
      } else if (tag == 2) {
        return "gray";
      } else if (tag == 3) {
        return "blue";
      } else if (tag == 4) {
        return "cyan";
      } else if (tag == 5) {
        return "green";
      } else {
        return "";
      }
    },
    changeTaskStatusId(value) {
      if (!this.canClick) {
        return;
      }
      if (value === this.filterData.taskStatusId) {
        return;
      }
      this.filterData.taskStatusId = value;
      this.queryEscortTaskStatusId(value);
      this.queryEscortAsync();
      this.$emit("changeStatus");
    },
  },
};
</script>
 
<style lang = "less">
.status-filter {
  font-size: 0;
  /* margin-bottom: 0px; */
  margin-left: 10px;
  span {
    font-size: 14px;
  }
}
.canClick {
  cursor: pointer;
}
.notClick {
  cursor: auto;
}

span.status {
  margin-right: 10px;
  text-align: center;
  display: inline-block;
  width: 100px;
  height: 30px;
  border: 1px solid #ced3d9;
  border-radius: 3px;
  line-height: 28px;
  font-size: 14px;
  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .gray {
    background-color: #b1b1b1;
  }
  .yellow {
    background-color: #d49539;
  }
  .blue {
    background-color: #178fe6;
  }
  .cyan {
    background-color: #15d9d3;
  }
  .green {
    background-color: #2bb974;
  }
}
span.active {
  border-color: #3380cc;
  background-color: #ebf5ff;
}
</style>