import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import zlkParser from '@helpers/ZLKParser';
import { fetchSkillData } from '@/services/walkthrough';
import Loading from '@components/Loading';
import GuideCardList from '@components/GuideCardList';
import { storage } from '@/helpers/storage';
import { createMossConfigData } from '../../../placeholderData';

export interface IGuideItem {
  name: string;
  img: string;
  id: string;
  url: string;
}

type TabType = 'mode' | 'map' | 'skill';

@Component({
  name: 'gamePlay',
  components: { Loading, GuideCardList },
})
export default class GamePlayPage extends BaseVue {
  public data: IGuideItem[] = createMossConfigData(6, 5) as any;

  public tab: TabType = this.initTab() as TabType;

  public loading = true;

  public cacheData: { [key in TabType]: IGuideItem[] } = {
    map: [],
    mode: [],
    skill: [],
  };

  public created() {
    this.getData().then(data => {
      this.data = data;
    });
  }

  public destroyed() {
    this.cacheTabType();
  }

  public async handleClickTabTap(type: TabType) {
    if (this.tab === type) {
      return;
    }
    this.loading = false;
    this.tab = type;
    const data = this.cacheData[this.tab];
    if (data.length === 0) {
      this.data = createMossConfigData(6, 5) as any;
    }
    this.data = await this.getData();
  }

  private async getData() {
    const data = this.cacheData[this.tab];
    if (data.length > 0) {
      return data;
    }
    this.loading = true;
    let d: IGuideItem[] = [];
    if (this.tab === 'mode') {
      d = await zlkParser.getGamePlayList();
    } else if (this.tab === 'map') {
      d = await zlkParser.getMapGuideDataList();
    } else {
      d = await this.getSkillData();
    }
    this.cacheData[this.tab] = d;
    this.loading = false;
    return d;
  }

  private async getSkillData() {
    const ret = await fetchSkillData();
    if (ret.code === 0) {
      return this.parseMossData(ret.data);
    }
    return [];
  }

  private parseMossData(data: IMossOperationItem[]) {
    const ret: IGuideItem[] = [];
    for (const item of data) {
      const d: IGuideItem = {
        id: `${item.id}`,
        img: item.images,
        name: item.title,
        url: item.url,
      };
      ret.push(d);
    }
    return ret;
  }

  private initTab() {
    const { gamePlayTab } = storage.getBySession(['gamePlayTab']);
    this.clearCacheTabType();
    return gamePlayTab || this.$route.query.tab || 'mode';
  }

  private clearCacheTabType() {
    storage.setBySession({ gamePlayTab: '' });
  }

  private cacheTabType() {
    storage.setBySession({ gamePlayTab: this.tab });
  }
}
