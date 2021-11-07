<template>
  <div
    v-if="isShow"
    class="pailiantu"
  >
    <div class="pailiantu_box">
      <div
        :key="data.id"
        v-report="'index.pat-face'"
        class="pailiantu_pic"
        @touchstart.stop="handleClick(data.id)"
      >
        <img :src="data.hImgUrl">
      </div>
      <span @click="handleClosePhoto">&times;</span>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>

<style>
.pailiantu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}

.pailiantu_box {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-height: 4.9rem;
  position: relative;
}

.pailiantu_pic {
  width: auto;
  height: 100%;
  padding: 0.5rem 0;
  overflow: hidden;
}

.pailiantu_box .pailiantu_pic img {
  height: 3.9rem;
}

.pailiantu span {
  margin-left: 0.15rem;
  font-size: 0.6rem;
  color: #fff;
}
</style>
