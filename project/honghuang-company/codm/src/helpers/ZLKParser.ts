// import { globalConfig } from '@/config';
import { getMapGuideData, getZlkGamePlayData, getZlkFirearmsData, getZlkActivityCalendarData } from '@services/commons';
import { storage } from '@helpers/storage';
import { IFiearms } from '@/views/walkthrough/firearms';
import { IGuideItem } from '@/views/walkthrough/gamePlay';

/**
 * note:
 * 主要是解析来自资料库的数据， 枪械
 */
class ZLKParser {
  private fireamrmsData: IFirearmsItemData[] = [];
  // 模式攻略数据
  private modeGuideData: IGamePlayItemData[] = [];
  // 地图攻略数据
  private mapGuideData: IMapGuideData[] = [];

  public async getActivityCalendarData(): Promise<IActivityCalendarData[]> {
    const ret = await getZlkActivityCalendarData();
    if (ret.code === 0) {
      return ret.data.hdxx84;
    }
    return [];
  }

  public async getMapGuideDataList(): Promise<IGuideItem[]> {
    await this.getMapGuideData();
    const list: IGuideItem[] = [];
    for (const item of this.mapGuideData) {
      const data: IGuideItem = {
        id: item.dtidA6,
        img: item.dtmsmc8d,
        name: item.dtmmc63,
        url: '',
      };

      list.push(data);
    }
    return list;
  }

  public async getGamePlayList(): Promise<IGuideItem[]> {
    await this.getGamePlayData();
    const list: IGuideItem[] = [];
    for (const item of this.modeGuideData) {
      const data: IGuideItem = {
        id: item.wfid9a,
        img: item.wflh1b,
        name: item.wfmc95,
        url: '',
      };

      list.push(data);
    }
    return list;
  }

  public async getFireamrmsData() {
    if (!this.fireamrmsData || this.fireamrmsData.length === 0) {
      const cache = this.getCacheData('fireamrmsData');
      if (cache && cache.length > 0) {
        this.fireamrmsData = cache;
        this.fetchFireamrmsData();
        return;
      }
      await this.fetchGamePlayData();
    }
  }

  // 武器的 二级label
  public async getFireamrmsLabelData() {
    await this.fetchFireamrmsData();
    return this.parserFireamrmsLabel();
  }

  public async getWeaponDetailById(id: string) {
    await this.getFireamrmsLabelData();
    const raw = this.fireamrmsData as IFirearmsItemData[];
    for (const item of raw) {
      if (item.wqidEf === id) {
        return item;
      }
    }
    return null;
  }

  public async getGamePlayDetailById(id: string) {
    await this.fetchGamePlayData();
    const raw = this.modeGuideData as IGamePlayItemData[];
    for (const item of raw) {
      if (item.wfid9a === id) {
        return item;
      }
    }
    return null;
  }

  public async getMapGuideDetailById(id: string) {
    await this.fetchMapGuideData();
    const raw = this.mapGuideData as IMapGuideData[];
    for (const item of raw) {
      if (item.dtidA6 === id) {
        return item;
      }
    }
    return null;
  }

  private async getGamePlayData() {
    if (!this.modeGuideData || this.modeGuideData.length === 0) {
      const cache = this.getCacheData('modeGuideData');
      if (cache && cache.length > 0) {
        this.modeGuideData = cache;
        this.fetchGamePlayData();
        return;
      }
      await this.fetchGamePlayData();
    }
  }

  private async getMapGuideData() {
    if (!this.mapGuideData || this.mapGuideData.length === 0) {
      const cache = this.getCacheData('mapGuideData');
      if (cache && cache.length > 0) {
        this.mapGuideData = cache;
        this.fetchMapGuideData();
        return;
      }
      await this.fetchMapGuideData();
    }
  }

  private async fetchGamePlayData() {
    const ret = await getZlkGamePlayData();
    if (ret.code === 0) {
      this.modeGuideData = ret.data.wfxq58;
      // 更新数据之后， 更新版本号
      this.refreshGamePlayData(ret.data.wfxq58);
    }
  }

  private async fetchFireamrmsData() {
    const ret = await getZlkFirearmsData();
    if (ret.code === 0) {
      this.fireamrmsData = ret.data.wqxq4a;
      this.refreshFireamrmsData(ret.data.wqxq4a);
    }
  }

  private async fetchMapGuideData() {
    const ret = await getMapGuideData();
    if (ret.code === 0) {
      this.mapGuideData = ret.data.dtgl20;
      this.refreshMapGuideData(ret.data.dtgl20);
    }
  }

  private filterFiearmsData() {
    const data: IFiearms[] = [];

    for (const item of this.fireamrmsData) {
      const d: IFiearms = {
        img: item.wqlhEe,
        name: item.wqmc1a,
        id: item.wqidEf,
        labelName: item.wqyjfl27,
        labelKey: item.wqflkeyFd,
      };
      data.push(d);
    }
    return data;
  }

  private parserFireamrmsLabel() {
    const raw = this.filterFiearmsData();
    const data: { [key: string]: IFiearms[] } = {
      ALL: raw,
    };
    for (const item of raw) {
      const { labelKey: type } = item;
      if (!type) {
        continue;
      }
      if (!data[type]) {
        data[type] = [];
      }
      data[type].push(item);
    }
    return data;
  }

  private refreshFireamrmsData(data: IFirearmsItemData[]) {
    this.saveCacheData('fireamrmsData', data);
  }

  private refreshGamePlayData(data: IGamePlayItemData[]) {
    this.saveCacheData('modeGuideData', data);
  }

  private refreshMapGuideData(data: IMapGuideData[]) {
    this.saveCacheData('mapGuideData', data);
  }

  private getCacheData<T extends keyof ZLKCacheData>(key: T): ZLKCacheData[T] | [] {
    const data = storage.get([key]) as Pick<ZLKCacheData, T>;
    const cache = data[key];
    if (!cache || cache.length === 0) {
      return [];
    }
    return cache;
  }

  private saveCacheData<T extends keyof ZLKCacheData>(key: T, data: ZLKCacheData[T]) {
    storage.set({ [key]: data });
  }
}

const zlkParser = new ZLKParser();

export default zlkParser;
