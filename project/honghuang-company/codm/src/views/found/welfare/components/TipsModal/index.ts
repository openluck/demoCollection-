import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class TipsModal extends BaseVue {
  @Prop({ default: '' }) readonly msg!: string;

  @Prop({ default: '' }) readonly title!: string;
}
