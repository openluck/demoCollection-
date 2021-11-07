import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce, isArray, throttle } from '@tencent/slug-function-vue';
import { MAP_IMG_BASE_URL } from '@/config';
import { IMapPoint, walkthroughtStore } from '@store/modules/walkthrougth';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

// 瓦片图大小
const TILE_SIZE_W = 314;
const TILE_SIZE_H = 318;

const MAP_SIZE_W = 4000;
const MAP_SIZE_H = 4000;

@Component({
  components: { VueSlider },
})
export default class MapPanel extends BaseVue {
  @Prop() msg!: string;
  public zoomValue = 0;

  public v4id = '';

  public loading = true;

  private map!: L.Map;

  // 当前缩放的值
  private minZoom = 0.01;
  private maxZoom = 2;
  // 瓦片
  private tileLayer!: L.TileLayer;

  private pointMarkerGroup: { [id: string]: L.LayerGroup } = {};

  private pointMarker: { [id: string]: L.Marker[] } = {};

  private reporting = false;

  public get mapKey() {
    return walkthroughtStore.mapKey;
  }

  public get selectedPoint() {
    return walkthroughtStore.selectedPoint || [];
  }

  public get mapDetailData() {
    return walkthroughtStore.mapDetailData;
  }

  // note: 后执行
  @Watch('selectedPoint', { deep: true })
  public updateMapPoint() {
    if (this.selectedPoint.length === 0) {
      this.clearOldMapPoints();
      return;
    }
    setTimeout(() => {
      this.setMapPoints();
    }, 10);
  }

  // note: 先执行
  @Watch('mapKey')
  public renderMap() {
    this.clearOldMapPoints();
    this.resetMap();
    this.loading = true;
    this.setMap('update');
    this.loading = false;
  }

  public mounted() {
    this.initMap();
    this.setMap('init');
  }

  public handleRangeChange(value: number) {
    // 监听滑块滑动
    const fn = debounce((value: number) => {
      const zoom = this.minZoom + ((this.maxZoom - this.minZoom) * value) / 100;
      this.map.setZoom(parseFloat(zoom.toFixed(2)));
      this.reportZoomAction();
    }, 20);
    fn(value);
  }

  public handlezoomIn() {
    // 地图缩小
    const fn = throttle(() => {
      this.map.zoomIn();
    }, 300);
    fn();
  }

  public handleZoomOut() {
    // 地图放大
    const fn = throttle(() => {
      this.map.zoomOut();
    }, 300);
    fn();
  }

  private reportZoomAction() {
    if (this.reporting) {
      return;
    }
    this.reporting = true;
    setTimeout(() => {
      this.$mosso.report('btn', 'zoom', '缩放按钮滑动');
      this.reporting = false;
    }, 1000);
  }

  private initMap() {
    // 初始化地图
    this.map = L.map('mapid', {
      center: this.getMapCenter(),
      attributionControl: false, // 隐藏版权申明
      crs: L.CRS.Simple, // 使用正方形网格坐标系
      zoomSnap: 0.01, // 缩放级别允许小数
      // fadeAnimation: false,       // 关闭淡入淡出动画
      inertia: false, // 关闭惯性
      // maxBoundsViscosity: 0, // 阻止拖出边界
      zoomControl: false, // 默认缩放控制器
      zoomAnimation: true,
      bounceAtZoomLimits: false,
      doubleClickZoom: true, // 双击缩放
    });

    // 监听地图缩放
    this.map.on('zoomend', e => {
      // eslint-disable-next-line no-underscore-dangle
      const zoom = (e.target && e.target._zoom) || 0;
      this.zoomValue = ((zoom - this.minZoom) / (this.maxZoom - this.minZoom)) * 100;
    });
  }

  private getMapCenter() {
    return L.latLng(TILE_SIZE_W / 2, -TILE_SIZE_H / 2);
  }

  private clearOldMapPoints() {
    for (const id in this.pointMarkerGroup) {
      this.pointMarkerGroup[id].remove();
      this.pointMarker[id] = [];
    }
  }

  private setMap(type: 'update' | 'init') {
    const $map = document.getElementById('mapid') as HTMLElement;
    const mapWidth = $map.offsetWidth;
    const mapHeight = $map.offsetHeight;
    const minZoom = Math.max(Math.min(mapWidth / TILE_SIZE_W - 1, mapHeight / TILE_SIZE_H - 1), -0.5);
    this.minZoom = Number(minZoom.toFixed(2));
    this.map.fitBounds([
      [0, 0],
      [-TILE_SIZE_H, TILE_SIZE_W],
    ]);
    this.map.setMaxBounds([
      [0, 0],
      [-TILE_SIZE_H, TILE_SIZE_W],
    ]);

    this.map.setMinZoom(this.minZoom);
    this.map.setMaxZoom(this.maxZoom);

    this.tileLayer = L.tileLayer(`${MAP_IMG_BASE_URL}${this.mapKey}/{z}_{x}_{y}.jpg`, {
      maxZoom: this.maxZoom,
      minZoom: -0.5,
      tileSize: L.point(TILE_SIZE_W, TILE_SIZE_H),
      updateWhenIdle: true,
      // updateWhenZooming: false,
      bounds: [
        [0, 0],
        [-TILE_SIZE_H, TILE_SIZE_W],
      ],
    });

    this.tileLayer.on('loading', () => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    });

    // 添加地图
    this.tileLayer.addTo(this.map);
    // 设置缩放比
    this.map.setZoom(this.minZoom);
    if (type === 'init') {
      // note: 设置地图钉
      this.setMapPoints();
    }
  }

  // 设置资源覆盖层
  private setMapPoints() {
    if (!this.mapDetailData) {
      return;
    }

    const ids: string[] = [];
    for (const item of this.mapDetailData) {
      const id = `${item.id}`;
      ids.push(id);
      if (item.checked) {
        if (this.pointMarkerGroup[id]) {
          this.reRenderPoint(id);
        } else {
          this.drawPointList(`${item.id}`, item.points);
        }
      } else {
        if (this.pointMarkerGroup[`${item.id}`]) {
          this.pointMarkerGroup[`${item.id}`].remove();
        }
      }
    }
  }

  private reRenderPoint(id: string) {
    const markers = this.pointMarker[id];
    this.pointMarkerGroup[id].addTo(this.map);
    for (const marker of markers) {
      this.pointMarkerGroup[id].addLayer(marker);
    }
  }

  private drawPointList(id: string, points: IMapPoint[]) {
    if (!points || points.length === 0) {
      if (this.pointMarkerGroup[id]) {
        this.pointMarkerGroup[id].remove();
      }
      this.pointMarker[id] = [];
      return;
    }
    if (this.map) {
      this.pointMarkerGroup[id] = L.layerGroup();
      this.pointMarkerGroup[id].addTo(this.map);
      points.forEach(item => {
        // 坐标
        const [x, y] = item.position;
        const marker = this.createMarker(this.calcXY(x, y), `${id}_${item.v4id}`, item.img).addTo(this.map);
        if (item.v4id) {
          marker.on('click', e => {
            const infoStr = (e.target && e.target.options && e.target.options.alt) || '';
            const [id, v4id] = infoStr.split('_');
            this.handleMapPointClick(id, v4id);
            this.$mosso.report('btn', 'map-nail', '点击攻略地图钉触发');
          });
        }
        if (!isArray(this.pointMarker[id])) {
          this.pointMarker[id] = [];
        }
        this.pointMarker[id].push(marker);
        this.pointMarkerGroup[id].addLayer(marker);
      });
    }
  }

  private handleMapPointClick(id: string, v4id: string) {
    let d = this.findMapPointsById(id);
    if (d.length === 0) {
      return;
    }

    d = d.sort((a, b) => a.sort! - b.sort!);
    const v4Ids = d.map(item => item.v4id as string);
    walkthroughtStore.setVids({ v4Ids, currentV4Id: v4id });
  }

  private findMapPointsById(id: string): IMapPoint[] {
    for (const item of this.mapDetailData) {
      if (`${item.id}` === id) {
        return item.points;
      }
    }
    return [];
  }

  private calcXY(x: number, y: number) {
    const [w, h] = [TILE_SIZE_W / 2, TILE_SIZE_H / 2];

    const y1 = parseFloat((w + (x / MAP_SIZE_H) * TILE_SIZE_H).toFixed(4));

    const x1 = parseFloat((-(h - (y / MAP_SIZE_W) * TILE_SIZE_W)).toFixed(4));

    return [x1, y1] as [number, number];
  }

  private createMarker(position: [number, number], id: string, icon: string) {
    const options = { icon: this.createLayerIcon(icon), alt: id };
    return L.marker(position, options);
  }

  private createLayerIcon(src: string) {
    return L.icon({
      iconUrl: src,
      iconSize: [18, 23],
      iconAnchor: [9, 13],
    });
  }

  // 重置地图
  private resetMap() {
    if (this.map) {
      if (this.tileLayer) {
        this.tileLayer.remove();
      }
      this.pointMarker = {};
      this.pointMarkerGroup = {};
    }
  }
}
