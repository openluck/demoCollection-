import MapRightPanel from './components/MapRightPanel';
import MapPanel from './components/MapPanel';
import StrategyDialog from './components/StrategyDialog';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { walkthroughtStore } from '@/store/modules/walkthrougth';
import Loading from '@components/Loading/index';

@Component({
  name: 'mapPage',
  components: {
    MapRightPanel,
    StrategyDialog,
    MapPanel,
    Loading,
  },
})
export default class MapPage extends BaseVue {
  public loading = true;

  public get currentVid() {
    return walkthroughtStore.currentV4Id;
  }

  public get showDialog() {
    return walkthroughtStore.showDialog;
  }

  public created() {
    this.initMapData().finally(() => {
      this.loading = false;
    });
  }

  public destroyed() {
    // 不保存之前的状态
    walkthroughtStore.reset();
  }

  private async initMapData() {
    await walkthroughtStore.fetchMapData();
  }
}
