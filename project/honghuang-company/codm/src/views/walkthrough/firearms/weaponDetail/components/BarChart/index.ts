import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class BarChart extends BaseVue {
  @Prop() detail!: IWeaponParams;

  public parseNumber(num: number) {
    return `width: ${Math.floor(num / 120 * 100)}%`;
  }
}
