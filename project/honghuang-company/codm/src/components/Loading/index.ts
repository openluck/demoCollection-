import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class Loading extends BaseVue {
  @Prop({ default: '努力加载中...' }) msg!: string;
}
