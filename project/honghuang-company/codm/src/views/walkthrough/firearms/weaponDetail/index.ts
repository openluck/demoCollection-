import { Component } from 'vue-property-decorator';
import V4VideoCardList from '@components/V4VideoCardList';
import BaseVue from '@helpers/BaseVue';
import zlkParser from '@/helpers/ZLKParser';
import BarChart from './components/BarChart';
import RadarChart from './components/RadarChart';
import Loading from '@components/Loading';

@Component({
  name: 'weaponDetails',
  components: {
    BarChart,
    RadarChart,
    V4VideoCardList,
    Loading,
  },
})
export default class weapondetailsPage extends BaseVue {
  public detail: IFirearmsItemData | null = null;

  public v4Id = '';

  public created() {
    this.setDetail();
  }

  private async setDetail() {
    const id = this.$route.params.id;

    if (!id) {
      this.$toast('未获取武器 id');
      return;
    }
    const data = await zlkParser.getWeaponDetailById(id);

    if (!data) {
      this.$toast('未获取武器详情, id 有误');
      return;
    }

    this.detail = data as IFirearmsItemData;
    this.v4Id = data.wqglv4id34;
  }
};
