import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class HelloWorld extends BaseVue {
  @Prop() msg!: string;
}
