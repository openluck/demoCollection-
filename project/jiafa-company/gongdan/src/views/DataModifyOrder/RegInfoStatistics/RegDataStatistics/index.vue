<template>
  <div class="apply-data-statistics">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="报考类型统计报表">
        <TypeStatistical ref="TypeStatistical"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="艺体考生统计报表">
        <ArtStatistical ref="ArtStatistical"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="对口职教考生统计报表">
        <DKStatistical ref="DKStatistical"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
 
<script>
/**
 * @description 报考数据统计 Index
 * @date 2021-1-26 16:43:42
 */
import TypeStatistical from './ChildCom/TypeStatistical'
import ArtStatistical from './ChildCom/ArtStatistical'
import DKStatistical from './ChildCom/DKStatistical'
export default {
  name: "ApplyDataStatistics",
  components: {
    TypeStatistical,
    ArtStatistical,
    DKStatistical
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    callback(key) {
      console.log(key);
    },
  }
};
</script>
 
<style scoped lang = "less">
.apply-data-statistics{
  padding: 15px;
}
</style>