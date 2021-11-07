import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

const PROD_NAV = [
  {
    name: '武器枪匠',
    routerName: '/walkthrough/firearms',
    key: 'firearms',
  },
  {
    name: '多人对战',
    routerName: '/walkthrough/gameplay',
    key: 'gameplay',
  },
  {
    name: '使命战场',
    routerName: '/walkthrough/war_area',
    key: 'war_area',
  },
  {
    name: '地图资源',
    routerName: '/walkthrough/map',
  },
  {
    name: '成长宝典',
    routerName: '/walkthrough/grow_up',
    key: 'grow_up',
  },
];

@Component({
  name: 'walkthrough',
})
export default class WalkthroughPage extends BaseVue {
  public msg = 'walkthrough-page';

  public tabIndex = 0;
  public tabArr = PROD_NAV;

  public getCurrentPath() {
    return this.$route.path;
  }

  public destroyed() {
    this.resetTab();
  }

  private resetTab() {
    this.resetWalkthroughTabTypeAction();
  }
}
