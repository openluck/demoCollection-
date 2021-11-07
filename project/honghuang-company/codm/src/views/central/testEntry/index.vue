<template>
  <div
    class="test-panel"
    style="overflow: scroll;"
  >
    <div class="system-info">
      <p class="cell">
        <span>userAgent: </span>
        <input
          type="text"
          :value="userAgent"
        >
      </p>
      <p class="cell">
        <span>html-clientW: {{ clientW }}</span>
        <span>html-clientH: {{ clientH }}</span>
        <span>devicePixelRatio: {{ devicePixelRatio }}</span>
      </p>
      <p
        v-if="systemInfo"
        class="cell"
      >
        <span>osSystem: {{ systemInfo.osSystem }}</span>
        <span>osVersion: {{ systemInfo.osVersion }}</span>
        <span>deviceName: {{ systemInfo.deviceName }}</span>
        <span>deviceModel: {{ systemInfo.deviceModel }}</span>
      </p>
    </div>
    <div class="box">
      <input
        v-model.trim="value"
        type="text"
        class="input-url"
        placeholder="输入地址"
      >
      <button
        class="btn3"
        @click.stop="jumpTo(value)"
      >
        跳转
      </button>
      <button
        class="btn3"
        @click.stop="reloadPage"
      >
        刷新页面
      </button>
      <button
        class="btn1"
        @click.stop="copyTokens"
      >
        复制登录态
      </button>
    </div>
    <div
      v-for="item in data"
      :key="item.type"
      class="test-link-box"
    >
      <p class="title">
        <span>类型：</span>
        <span>{{ item.type }}</span>
      </p>
      <ul class="ul-list">
        <li
          v-for="(u, i) in item.urlList"
          :key="i"
        >
          <p
            style="overflow-wrap: break-word; color: #2d8cf0;"
            @touchend="handleJump(u.url)"
          >
            {{ u.name }}
          </p>
        </li>
      </ul>
    </div>
    <textarea
      id="copytest"
      ref="textareaRef"
      readonly
      :value="token"
      style="height: 1px; width: 1px;"
    />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="less" scoped>

.ul-list {
  display: flex;
  justify-content: flex-start;

  li {
    font-size: 0.9rem;
    margin: 0.4rem 0.2rem;
  }
}

.btn3,
.btn1 {
  width: 100px;
  height: 42px;
}

.box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

input {
  height: 1.2rem;
  width: 60%;
  flex: 1;
  font-size: 0.32rem;
  border-radius: 4px;
}

#copytest {
  position: fixed;
  right: 999999;
  top: 1000000;
}

.system-info {
  span {
    font-size: 0.32rem;
    color: #fff;
    padding: 0 0.2rem;
  }
}

.test-link-box {
  color: #fff;

  p.title {
    font-size: 0.24rem;
    text-align: left;
  }

  ul {
    display: flex;
    justify-content: flex-start;

    li p {
      font-size: 0.48rem;
    }
  }
}
</style>
