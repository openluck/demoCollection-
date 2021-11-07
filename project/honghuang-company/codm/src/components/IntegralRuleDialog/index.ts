import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class HelloWorld extends BaseVue {
  @Prop() close!: () => void;

  public handleCloseTap() {
    if (this.close) {
      this.close();
    }
  }
}
