import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { IFiearms } from '@/views/walkthrough/firearms';

@Component
export default class GunCardItem extends BaseVue {
  @Prop() gunId!: string;
  @Prop() reportId!: string | string[];
  @Prop() data!: IFiearms;
}
