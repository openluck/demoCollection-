import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { MAP_LIST_DATA, walkthroughtStore } from '@/store/modules/walkthrougth';

export interface IMapLabel {
  name: string;
  key: string;
  url: string;
}

@Component
export default class MapRightPanel extends BaseVue {
  public showMapSelectedPanel = false;

  public mapList = MAP_LIST_DATA;

  public currentMap: IMapLabel = MAP_LIST_DATA[0];

  public get mapDetailData() {
    return walkthroughtStore.mapDetailData;
  }

  public get showAllFlag() {
    return this.showAllFlagMap[this.currentMap.key];
  }

  public showAllFlagMap: { [key: string]: boolean } = {
    evilIslands: false,
    forbiddenZone: false,
  };

  public created() {
    this.getMapData();
  }

  public handleSwitchMapBtn() {
    this.showMapSelectedPanel = !this.showMapSelectedPanel;
  }

  public handleMapBtnTap(key: string) {
    if (key === this.currentMap.key) {
      this.showMapSelectedPanel = false;
      return;
    }
    this.currentMap = this.getCurrentMap(key);
    walkthroughtStore.setMapKey(key);
    this.showMapSelectedPanel = false;
    this.getMapData();
  }

  public handleSelectedItem(payload: { index: number; key: number }) {
    const { index, key } = payload;
    const checked = this.mapDetailData[index].checked;
    this.mapDetailData[index].checked = !checked;
    walkthroughtStore.updateSelected({ key, type: !checked ? 'add' : 'delete' });

    let count = 0;
    for (const item of this.mapDetailData) {
      if (item.checked) {
        count++;
      }
    }
    const currentState = this.showAllFlagMap[this.currentMap.key];
    if (count === this.mapDetailData.length) {
      // 全选了
      this.showAllFlagMap[this.currentMap.key] = true;
    } else {
      if (currentState) {
        // 没全选， 如果当前为 true
        this.showAllFlagMap[this.currentMap.key] = false;
      }
    }
  }

  public handleSelectedAll() {
    const key = this.currentMap.key;
    this.showAllFlagMap[key] = !this.showAllFlagMap[key];
    const data = this.mapDetailData.map(item => {
      item.checked = this.showAllFlagMap[key];
      return item;
    });
    walkthroughtStore.setMapDetailData({ key, mapDetailData: data });
  }

  private async getMapData() {
    const { url, key } = this.currentMap;
    const data = walkthroughtStore.cacheMapData[key];
    if (!data) {
      await walkthroughtStore.fetchMapData({ url, key });
    } else {
      walkthroughtStore.setMapDetailData({ key, mapDetailData: data });
    }
  }

  private getCurrentMap(key: string) {
    for (const item of MAP_LIST_DATA) {
      if (item.key === key) {
        return item;
      }
    }
    return MAP_LIST_DATA[0];
  }
}
