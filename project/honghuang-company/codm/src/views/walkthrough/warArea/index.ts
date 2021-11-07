import V4VideoCardList from '@components/V4VideoCardList';
import { Component } from 'vue-property-decorator';
import GuideImgVideoPanel from '@components/GuideImgVideoPanel';
import {
  fetchEvilData,
  fetchEvilHotData,
  fetchForbiddenData,
  fetchForbiddenHotData,
  fetchSkillCoreData,
  fetchAdvancedSkillsData,
} from '@/services/walkthrough';
import { IGuideItem } from '@/views/walkthrough/gamePlay';
import GuideCardList from '@/components/GuideCardList';
import { storage } from '@/helpers/storage';
import BaseVue from '@helpers/BaseVue';
import { createMossConfigData } from '@/placeholderData';

type TabType = 'forbidden' | 'evil' | 'skillCore' | 'advancedSkill';

type ICardItem = IGuideItem;

type CacheDataType = { [key in TabType]: ICardItem[] };

// note: 技能攻略
@Component({
  name: 'warArea',
  components: {
    V4VideoCardList,
    GuideCardList,
    GuideImgVideoPanel,
  },
})
export default class WarAreaPage extends BaseVue {
  public v4IdMap: { [key in TabType]?: number } = {
    evil: 114109,
    forbidden: 114108,
    skillCore: 114110,
  };
  public tab: TabType = this.initTab() as TabType;
  public cardDataList: ICardItem[] = this.getPlaceholderData();
  public cacheData: CacheDataType = {
    forbidden: [],
    evil: [],
    skillCore: [],
    advancedSkill: [],
  };

  public hotCount = 2;
  public hotPage = 0;
  public loading = true;

  public cacheHotData: Pick<CacheDataType, 'forbidden' | 'evil'> = {
    forbidden: [],
    evil: [],
  };

  public hotData: ICardItem[] = createMossConfigData(2, 0) as any;

  public created() {
    this.init();
  }

  public destroyed() {
    this.cacheTabType();
  }

  public async handleClickTabTap(type: TabType) {
    if (this.tab === type) {
      return;
    }
    this.hotData = [];
    this.cardDataList = [];
    this.tab = type as any;
    this.hotPage = 0;
    this.loading = false;
    await this.init();
  }

  public handleJumpBtn(url: string) {
    this.$router.push(url);
  }

  protected getV4Id() {
    return this.v4IdMap[this.tab];
  }

  private init() {
    Promise.all([this.getData(), this.getHotData()]).then(ret => {
      this.cardDataList = ret[0];
      if (this.tab !== 'skillCore') {
        this.hotData = ret[1].slice(0, this.hotCount) || [];
      }
      this.loading = false;
    });
  }

  private async getData() {
    const data = this.cacheData[this.tab];
    if (data.length !== 0) {
      return data;
    }
    let d: ICardItem[] = [];
    this.loading = true;
    if (this.tab === 'forbidden') {
      d = await this.getForbiddenData();
    } else if (this.tab === 'evil') {
      d = await this.getEvilData();
    } else if (this.tab === 'skillCore') {
      d = await this.getSkillCoreData();
    } else {
      d = await this.getAdvancedSkillsData();
    }
    this.cacheData[this.tab] = d;
    this.loading = false;
    return d;
  }

  private async getHotData() {
    if (this.tab !== 'skillCore' && this.tab !== 'advancedSkill') {
      const data = this.cacheHotData[this.tab];
      if (data.length !== 0) {
        return data;
      }
      let d: ICardItem[] = [];

      if (this.tab === 'forbidden') {
        d = await this.getForbiddenHotData();
      } else if (this.tab === 'evil') {
        d = await this.getEvilHotData();
      }
      this.cacheHotData[this.tab] = d;
      return d;
    }
    return [];
  }

  private async getForbiddenData() {
    const ret = await fetchForbiddenData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  private async getEvilData() {
    const ret = await fetchEvilData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  private async getSkillCoreData() {
    const ret = await fetchSkillCoreData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  // note: 获取进阶技能数据
  private async getAdvancedSkillsData() {
    const ret = await fetchAdvancedSkillsData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  private async getForbiddenHotData() {
    const ret = await fetchForbiddenHotData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  private async getEvilHotData() {
    const ret = await fetchEvilHotData();
    if (ret.code === 0) {
      return this.convertData(ret.data);
    }
    return [];
  }

  private convertData(data: IMossOperationItem[]) {
    if (!data || data.length === 0) {
      return [];
    }
    const ret: ICardItem[] = [];
    for (const item of data) {
      const d = {
        id: `${item.id}`,
        img: item.images,
        url: item.url,
        name: item.title,
      };
      ret.push(d);
    }
    return ret;
  }

  private initTab() {
    const { warAreaTab } = storage.getBySession(['warAreaTab']);
    this.clearCacheTabType();
    return warAreaTab || this.$route.query.tab || 'forbidden';
  }

  private clearCacheTabType() {
    storage.setBySession({ warAreaTab: '' });
  }

  private cacheTabType() {
    storage.setBySession({ warAreaTab: this.tab });
  }

  private getPlaceholderData() {
    if (this.tab === 'skillCore') {
      return createMossConfigData(6, 5) as any;
    }
    return createMossConfigData(4, 1) as any;
  }
}
