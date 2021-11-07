import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators';
import store from '@/store';
import { getMapData } from '@/services/walkthrough';

export interface IWalkthrougthState {
  cacheMapData: { [key: string]: IMossOperationItem[] };
  mapKey: string;
}

export interface IMapPoint {
  position: [number, number];
  sort: number | null;
  v4id: string | null;
  img: string;
}

export type MapDetailDataItem = IMossOperationItem & { checked: boolean; points: IMapPoint[] };

// 地图map， 新加地图， 在此处添加即可
export const MAP_LIST_DATA = [
  {
    name: '恶魔岛',
    key: 'evilIslands',
    url: 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2535.json',
  },
  {
    name: '边境',
    key: 'forbiddenZone',
    url: 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2485.json',
  },
];

// dynamic: true => 动态创建 vuex store
@Module({ dynamic: true, store, name: 'walkthrougth' })
class WalkthrougthStore extends VuexModule implements IWalkthrougthState {
  public cacheMapData: { [key: string]: MapDetailDataItem[] } = {};
  public mapKey = MAP_LIST_DATA[0].key;
  public mapDetailData: MapDetailDataItem[] = [];
  public selectedPoint: number[] = [];
  // 点击地图钉， 弹出的攻略 id
  public v4Ids: string[] = [];
  public currentV4Id = '';
  public showDialog = false;

  @Mutation
  public setMapDetailData(payload: { key: string; mapDetailData: MapDetailDataItem[] }) {
    const { key, mapDetailData } = payload;
    const selects: number[] = [];
    this.mapDetailData = mapDetailData;
    this.cacheMapData[key] = mapDetailData;
    for (const item of mapDetailData) {
      if (item.checked) {
        selects.push(item.id);
      }
    }
    if (selects.length === 0) {
      this.selectedPoint = [];
    } else {
      this.selectedPoint = selects;
    }
  }

  @Mutation
  public reset() {
    this.cacheMapData = {};
    this.mapKey = MAP_LIST_DATA[0].key;
    this.mapDetailData = [];
    this.selectedPoint = [];
    // 点击地图钉， 弹出的攻略 id
    this.v4Ids = [];
    this.currentV4Id = '';
    this.showDialog = false;
  }

  @Mutation
  public setVids(payload: { v4Ids: string[]; currentV4Id: string }) {
    const { v4Ids, currentV4Id } = payload;
    this.v4Ids = v4Ids;
    this.currentV4Id = currentV4Id;
    this.showDialog = true;
  }

  @Mutation
  public hideDialog() {
    this.v4Ids = [];
    this.currentV4Id = '';
    this.showDialog = false;
  }

  @Mutation
  public changeMapDetailField(payload: { checked: boolean; index: number }) {
    const { checked, index } = payload;
    this.mapDetailData[index].checked = checked;
  }

  @Mutation
  public updateSelected(payload: { key: number | number[]; type: 'add' | 'delete' }) {
    const { key, type } = payload;
    if (type === 'add') {
      if (Array.isArray(key)) {
        const keys = key.filter(k => !new Set(this.selectedPoint).has(k));
        this.selectedPoint.push(...keys);
      } else {
        if (!this.selectedPoint.includes(key)) {
          this.selectedPoint.push(key);
        }
      }
    } else {
      if (Array.isArray(key)) {
        this.selectedPoint = this.selectedPoint.filter(k => new Set(key).has(k));
      } else {
        this.selectedPoint = this.selectedPoint.filter(k => k !== key);
      }
    }
  }

  @Mutation
  public setMapData(data: { key: string; value: MapDetailDataItem[] }) {
    const { key, value } = data;
    this.mapDetailData = value;
    this.cacheMapData[key] = value;
  }

  @Mutation
  public setMapKey(key: string) {
    this.mapKey = key;
  }

  @Mutation
  public clearSelectPoints() {
    this.selectedPoint = [];
  }

  @Action
  public async fetchMapData(payload?: { url: string; key: string }) {
    const { url, key } = payload ?? MAP_LIST_DATA[0];
    const ret = await getMapData(url);
    if (ret.code === 0) {
      const list = ret.data.sort((a, b) => a.sort - b.sort);
      const keys: number[] = [];
      const value = list.map<MapDetailDataItem>(item => {
        const points = item.url.split('|') as string[];
        const pointsList: IMapPoint[] = [];
        for (const p of points) {
          if (!p) {
            continue;
          }
          const [x, y, id, sort] = p.trim().split(',');
          const point: IMapPoint = {
            position: [parseFloat(x), parseFloat(y)],
            sort: sort !== 'null' ? parseFloat(sort) : null,
            v4id: id === 'null' ? null : id,
            img: item.images,
          };
          pointsList.push(point);
        }

        if (item.recommended === 'hot') {
          keys.push(item.id);
          return { ...item, checked: true, points: pointsList };
        }
        return { ...item, checked: false, points: pointsList };
      });
      this.setMapData({ key, value });
      this.clearSelectPoints();
      this.updateSelected({ key: keys, type: 'add' });
    }
  }
}

export const walkthroughtStore = getModule(WalkthrougthStore);
