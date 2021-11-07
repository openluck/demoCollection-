import DynamicWaterfall, { TabType } from '@components/DynamicWaterfall';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import SystemSafeguardHint from '@components/SystemSafeguardHint';

@Component({
  name: 'SquarePage',
  components: {
    DynamicWaterfall,
    SystemSafeguardHint,
  },
})
export default class SquarePage extends BaseVue {
  public tab: TabType | '' = 'latest';

  public handleTabClick(tab: TabType) {
    this.tab = tab;
  }

  public created() {
    this.tab = 'latest';
  }

  public deactivated() {
    this.tab = 'latest';
  }

  public handleClickTopicItem() {
    this.tab = '';
  }
}
