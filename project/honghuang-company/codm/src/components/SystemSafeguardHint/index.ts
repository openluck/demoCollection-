import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class SystemSafeguardHint extends BaseVue {
  @Prop({ default: '' }) msg!: string;
}
