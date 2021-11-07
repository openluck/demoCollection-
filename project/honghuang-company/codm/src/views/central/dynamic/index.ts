import DynamicWaterfall from '@components/DynamicWaterfall';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import SystemSafeguardHint from '@components/SystemSafeguardHint';

@Component({
  name: 'dynamic',
  components: {
    DynamicWaterfall,
    SystemSafeguardHint,
  },
})
export default class DynamicPage extends BaseVue {}
