<template>
  <div class="taskList">
    <ul
      v-if="taskList.length > 0"
      class="index-task-list"
    >
      <template
        v-for="item in taskList"
      >
        <MissionItem
          :key="item.taskId"
          :task-item="item"
        />
      </template>
      <i class="horn1 horn" />
      <i class="horn2 horn" />
      <i class="horn3 horn" />
      <i class="horn4 horn" />
    </ul>
    <Empty
      v-if="fetchError !== 1"
      :msg="fetchError === 2 ? '加载出错了哦, 等会再试试': '暂时还没有积分任务呢'"
    />
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

/deep/ .empty-box {
  .inner {
    margin-top: -30px;
  }
}

.taskList {
  .mx-size(100%, calc(100vh - 1rem));

  .index-task-list {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    background-color: #2a313b;
    border: 1px solid #464f5b;
    overflow: hidden;
    font-size: 0.3rem;
    padding: 0 0.1rem;
    box-sizing: border-box;
    align-content: flex-start;
    height: 80%;
    // .mx-size(100%, calc(100% - 5rem));
    margin-top: 0.22rem;
    position: relative;
    .mx-horn(0.05rem, #9fa2a8);
  }
}
</style>
