<template>
  <div
    id="map"
    class="map-page"
  >
    <Loading v-if="loading" />
    <template v-else>
      <MapPanel />
      <MapRightPanel />
      <!-- 弹窗 -->
      <StrategyDialog
        v-if="showDialog"
        :current-v4-id="currentVid"
      />
    </template>
  </div>
</template>

<style lang="less" scoped>
* {
  touch-action: auto !important;
}

.hd {
  font-size: 0;
  display: block;
  text-indent: -999rem;
}

.horn {
  position: absolute;
  width: 0.1rem;
  height: 0.1rem;
  border: 1px solid #9fa2a8;
}

.horn1 {
  border-bottom-color: transparent;
  border-left-color: transparent;
  right: 0;
  top: 0;
}

.horn2 {
  border-bottom-color: transparent;
  border-right-color: transparent;
  left: 0;
  top: 0;
}

.horn3 {
  border-top-color: transparent;
  border-right-color: transparent;
  left: 0;
  bottom: 0;
}

.horn4 {
  border-top-color: transparent;
  border-left-color: transparent;
  right: 0;
  bottom: 0;
}

#map {
  width: 100%;
  height: calc(100vh - 0.77rem);
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-top: 0.2rem;
  box-sizing: border-box;
}
</style>

<script src="./index.ts" lang="ts"></script>
