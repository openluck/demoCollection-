import Loading from '@components/Loading';
import { Component } from 'vue-property-decorator';
import zlkParser from '@helpers/ZLKParser';
import {
  fetchFireadrmsGunHotData,
  fetchFireadrmsGunPropsData,
  fetchFireadrmsHotData,
  fetchFireadrmsHotGunData,
} from '@/services/walkthrough';
import GuideImgVideoPanel from '@components/GuideImgVideoPanel';
import GunCardItem from '@components/GunCardItem';
import { storage } from '@helpers/storage';
import BaseVue from '@helpers/BaseVue';
import { createMossConfigData } from '../../../placeholderData';

export interface IFiearms {
  img: string;
  name: string;
  id: string;
  labelName: string;
  labelKey: string;
}

export interface IFiearmsData {
  [key: string]: IFiearms[];
}

interface ILabel {
  [key: string]: string;
}

type IMossConfigData = {
  img: string;
  id: number;
  name: string;
  url: string;
};

@Component({
  name: 'firearms',
  components: {
    Loading,
    GuideImgVideoPanel,
    GunCardItem,
  },
})
export default class DataPage extends BaseVue {
  public v4IdMap = {
    hot: 114111,
    gun: 114112,
  };

  public tab = this.initTab() as string;

  public data: IFiearmsData = {};

  public labels: ILabel = {};

  public loading = true;

  public hotCount = 2;

  // 热门 和 枪匠的 左侧的数据
  public mossData: IMossConfigData[] = [];

  // 热门 和 枪匠的 右侧的数据
  public mossGuideData: IMossConfigData[] = [];

  // 第一个是右边的数据， 第二个是左边的数据
  private cacheData: { [key: string]: [IMossConfigData[], IMossConfigData[]] } = {};

  public created() {
    zlkParser.getFireamrmsLabelData().then(res => {
      this.data = res;
      this.labels = this.getLabels();
    });
    this.initData().finally(() => {
      this.loading = false;
    });
  }

  public destroyed() {
    this.cacheTabType();
  }

  public getCls(tab: string) {
    if (this.tab === tab) {
      return 'firearms-li on';
    }
    return 'firearms-li';
  }

  public async switchTab(tab: string) {
    if (this.tab === tab) {
      return;
    }
    this.tab = tab;
    if (tab === 'hot' || tab === 'gun') {
      this.loading = false;
      await this.initData();
    }
  }

  // 重写 mixin 方法
  protected getV4Id() {
    const tab = this.tab as 'gun' | 'hot';
    return this.v4IdMap[tab];
  }

  // note: 处理热门-枪匠 这两个 tab 的数据
  private async getNonNormalGunData() {
    const data = this.cacheData[this.tab];
    if (data) {
      return data;
    }
    this.loading = true;
    let d: [IMossConfigData[], IMossConfigData[]] = [[], []];
    if (this.tab === 'hot') {
      d = await Promise.all([this.getFireadrmsHotData(), this.getFireadrmsHotGunData()]);
    } else if (this.tab === 'gun') {
      d = await Promise.all([this.getFireadrmsGunHotData(), this.getFireadrmsGunPropsData()]);
    }
    this.cacheData[this.tab] = d;
    this.loading = false;
    return d;
  }

  private async initData() {
    const data = this.cacheData[this.tab];
    if (!data) {
      this.mossData = createMossConfigData(8, 3) as any;
      this.mossGuideData = createMossConfigData(2, 1) as any;
    }
    const res = await Promise.all([this.getNonNormalGunData()]);
    this.mossData = res[0][1];
    this.mossGuideData = res[0][0].slice(0, this.hotCount);
  }

  private getLabels() {
    const label: ILabel = {};
    for (const key of Object.keys(this.data)) {
      if (key === 'ALL') {
        label[key] = '全部武器';
        continue;
      }
      label[key] = this.data[key][0].labelName;
    }
    return label;
  }

  // 热门枪械
  private async getFireadrmsHotGunData() {
    const ret = await fetchFireadrmsHotGunData();
    if (ret.code === 0) {
      return this.parseMossData(ret.data);
    }
    return [];
  }

  // 热门攻略
  private async getFireadrmsHotData() {
    const ret = await fetchFireadrmsHotData();
    if (ret.code === 0) {
      return this.parseMossData(ret.data);
    }
    return [];
  }

  // 热门枪械-热门攻略
  private async getFireadrmsGunHotData() {
    const ret = await fetchFireadrmsGunHotData();
    if (ret.code === 0) {
      return this.parseMossData(ret.data);
    }
    return [];
  }

  // 枪械属性
  private async getFireadrmsGunPropsData() {
    const ret = await fetchFireadrmsGunPropsData();
    if (ret.code === 0) {
      return this.parseMossData(ret.data);
    }
    return [];
  }

  private parseMossData(data: IMossOperationItem[]) {
    if (!data || data.length === 0) {
      return [];
    }
    const ret: IMossConfigData[] = [];
    for (const item of data) {
      const d: IMossConfigData = {
        id: item.id,
        img: item.images,
        name: item.title,
        url: item.url,
      };
      ret.push(d);
    }
    return ret;
  }

  private initTab() {
    const { firearmsTab } = storage.getBySession(['firearmsTab']);
    this.clearCacheTabType();
    return firearmsTab || this.$route.query.tab || 'hot';
  }

  private clearCacheTabType() {
    storage.setBySession({ firearmsTab: '' });
  }

  private cacheTabType() {
    storage.setBySession({ firearmsTab: this.tab });
  }
}
