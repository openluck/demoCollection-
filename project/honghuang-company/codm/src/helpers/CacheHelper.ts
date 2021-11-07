// 用于基于内存存储的数据， 非 vue state or store state

import { deepCopy } from '@tencent/slug-function-vue';

export interface ICacheData {
  // note: 缓存 地图中的地图钉的视频攻略数据
  v4ContentData: {
    [id: string]: IV4DetailData;
  };
}

class CacheHelper {
  private cacheData!: ICacheData;

  public set(data: Partial<ICacheData>) {
    const d = deepCopy(data);
    this.cacheData = {
      ...this.cacheData,
      ...d,
    };
  }

  public getValue<T extends keyof ICacheData>(key: T): ICacheData[T] | null {
    if (!this.cacheData) {
      return null;
    }
    return this.cacheData[key];
  }
}

const cache = new CacheHelper();

export default cache;
