<template>
  <li
    v-if="task"
    class="mission-item"
  >
    <div class="index-task-icon-container">
      <img
        :src="task.icon || 'https://gzhcos.qq.com/codm/found/icon-qd.png'"
        alt
        class="index-task-icon"
      >
    </div>
    <div class="index-task-list-container">
      <div class="index-task-name">
        {{ task.taskName }}
      </div>
      <span
        v-if="task.taskDesc"
        class="index-task-desc"
      >{{ task.taskDesc }}</span>
      <span class="index-task-point">{{ task.pointAmount }}</span>
    </div>
    <div
      v-if="taskStatus === 1"
      v-report="['points.points-task-go', task.taskName]"
      class="index-task-todo-btn"
      @click="handleDoTask"
    >
      {{ task.btnTxt || '去完成' }}
    </div>
    <div
      v-else-if="taskStatus===2"
      v-report="['points.exchange-welfare', task.taskName]"
      class="index-task-done-btn"
    >
      已完成
    </div>
    <div
      v-else-if="taskStatus===3"
      v-report="['points.points-task-receive', task.taskName]"
      class="index-task-receive-btn"
      @click="handlePickIntegral"
    />
    <i class="line" />
  </li>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import 'styles/mixin.less';
@import 'styles/common.less';

li.mission-item {
  width: 46%;
  height: 33%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  border-bottom: none;
  flex-flow: wrap;
  position: relative;
  background: none;
  overflow: initial;
  box-sizing: border-box;
  // border-bottom: solid 1px rgba(139, 139, 139, 0.6);
  // position: relative;

  &::before {
    content: '';
    width: 1.5%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.index-task-icon-container {
  position: initial;
  margin-top: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin-right: 0.15rem;
  top: 50%;
}

.index-task-icon {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.index-task-name {
  max-width: 60%;
  width: 60%;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 0.2rem;
  line-height: 0.4rem;
  color: #fdfffe;
  // letter-spacing: 0.04rem;
  text-align: left;
}

.index-task-list-container {
  width: 2rem;
  // margin: 0 0.75rem 0 0;
  position: relative;

  .index-task-point {
    margin-left: 0.1rem;
    line-height: 0.46rem;
    font-size: 0.2rem;
    color: #ffed57;
    position: absolute;
    top: -0.02rem;
    left: 58%;
    white-space: nowrap;

    &::before {
      content: '+';
      position: relative;
      top: -0.02rem;
    }

    &::after {
      content: '积分';
    }
  }

  .index-task-desc {
    color: #ced1d7;
    width: 100%;
    text-emphasis: left;
    line-height: 0.32rem;
    font-size: 0.18rem;
    margin-top: -0.05rem;
    max-width: 2.1rem;
    float: left;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-align: left;
  }
}

.index-task-done-btn {
  // font-family: fangzheng;
  width: 1.2rem;
  height: 0.34rem;
  border: solid 1px #b2b4b7;
  font-size: 0.22rem;
  color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.02rem;
  background-color: #373e49;
  // display: none;
}

.index-task-todo-btn {
  // font-family: fangzheng;
  width: 1.2rem;
  height: 0.34rem;
  border: solid 1px #ffed57;
  font-size: 0.22rem;
  color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.02rem;
  background-color: #565944;
  // display: none;
}

.index-task-receive-btn {
  background: url(https://gzhcos.qq.com/codm/found/dhfl-btn.png) no-repeat center/cover;
  width: 1.2rem;
  height: 0.34rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: #000;

  &::before {
    content: '待领取';
    font-size: 0.22rem;
    letter-spacing: 0.02rem;
    // font-family: fangzheng;
  }
}
</style>
