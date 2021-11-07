<template>
  <ul class="tactics-ul">
    <template v-for="item in list">
      <GuideCardItem
        :key="item.id"
        :item="item"
        :tab="tab"
        :report-id="reportId"
      />
    </template>
  </ul>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tactics-ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  margin-top: 0.2rem;
  padding-bottom: 0.6rem;
  // margin-right: 0.1rem;
}
</style>
