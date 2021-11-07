/**
 * note:抽离通过 moss 广告位配置的排期运营数据, 对数据的有效期和数据解析
 * 如: 首页 banner, 快捷入口, 大神宝典
 */
import { Component } from 'vue-property-decorator';
import BaseMixin from './BaseMixin';
import { storage } from '../helpers/storage';

@Component
export default class MossOperationMixin extends BaseMixin {
  protected parserRawData<T extends object>(data: IMossOperationItem[], type: CacheMossKey): T[] {
    if (!data || data.length === 0) {
      return [];
    }
    const ret: T[] = [];
    for (const item of data) {
      const { startTime, endTime } = item;
      let isValid = true;
      if (type === 'homeBanner') {
        isValid = this.checkIsValidate(startTime, endTime);
      }
      if (isValid) {
        const swiper = {
          id: item.id,
          imgUrl: item.images,
          url: item.url,
          title: item.title,
          recommended: item.recommended,
          sort: item.sort,
        };
        ret.push(swiper as T);
      }
    }
    return ret;
  }

  protected checkIsValidate(startTime: string, endTime: string) {
    if (!startTime || !startTime) {
      return false;
    }
    const start = new Date(startTime.replace(/-/g, '/')).getTime();
    const end = new Date(endTime.replace(/-/g, '/')).getTime();
    const now = Date.now();

    if (start <= now && now <= end) {
      return true;
    }
    return false;
  }

  protected getOldData<K extends CacheMossKey>(key: K) {
    const ret = storage.get([key]) as any;
    if (ret) {
      return ret[key] as IMossCacheData[K];
    }
    return null;
  }

  protected setOldData<K extends CacheMossKey>(key: K, value: IMossCacheData[K]) {
    storage.set({ [key]: value });
  }
}
