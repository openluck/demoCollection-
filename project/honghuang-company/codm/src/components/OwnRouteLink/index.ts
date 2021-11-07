import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import sdkHelper from '@/helpers/SDKHelper';

@Component
export default class OwnRouterLink extends BaseVue {
  @Prop() to!: string;

  @Prop() reportId!: string[];

  public handleNavgate() {
    if (this.to.startsWith('http')) {
      sdkHelper.exitFullScreen();
      setTimeout(() => {
        sdkHelper.exitFullScreen();
        this.$nextTick(() => {
          sdkHelper.exitFullScreen();
          location.href = this.to;
        });
      }, 0);
    } else {
      this.$router.push(this.to);
    }
  }
}
