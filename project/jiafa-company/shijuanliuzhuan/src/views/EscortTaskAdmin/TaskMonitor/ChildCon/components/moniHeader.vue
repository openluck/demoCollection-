<template>
  <div class="moni_header">
    <div class="bread_crump">
      <TaskStatusList
        :filterData="{}"
        :countList="countList"
        :canClick="false"
      />
    </div>
    <div class="go_back">
      <a-button size="large" @click="$router.go(-1)">
        <a-icon type="left" />返回
      </a-button>
    </div>
  </div>
</template>
 
<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortTask"
);
import TaskStatusList from "@/components/common/TaskStatusList";
export default {
  name: "",
  components: { TaskStatusList },
  data() {
    return {};
  },
  computed: { ...mapState(["lists", "total", "tableLoading", "countList"]) },
  mounted() {},
  methods: {}
};
</script>
 
<style scoped lang = "less">
.moni_header {
  display: inline-block;
  width: 100%;
  height: 60px;
  line-height: 60px;
  position: relative;
  .bread_crump {
    display: inline-block;
    vertical-align: middle;
  }
  .go_back {
    display: inline-block;
    position: absolute;
    right: 10px;
  }
}
</style>