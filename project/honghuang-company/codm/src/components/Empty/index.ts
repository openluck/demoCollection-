import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class Empty extends BaseVue {
  @Prop({ default: '暂无数据' }) msg!: string;
}
