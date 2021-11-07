import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { storage } from '@helpers/storage';
import { addLoginAuthParams } from '@/vueUtils/filters';
// import slugSdk from '@/helpers/SlugSdk';
import { getTestLinkList } from '@/services/commons';

@Component
export default class TestPage extends BaseVue {
  public data: ITestListUrlData['confUrlInfo'] = [];

  public token: string = storage.getBySession(['tokenParams']).tokenParams;

  public clientW = document.documentElement.clientWidth;

  public clientH = document.documentElement.clientHeight;

  public systemInfo: ISystemInfo | null = null;

  public userAgent = navigator.userAgent;

  public value: string = this.token;

  public devicePixelRatio = window.devicePixelRatio;

  public created() {
    // this.getSystemInfo();
    this.getTestData();
  }

  public handleJump(url: string) {
    location.href = addLoginAuthParams(url);
  }

  public jumpTo(url: string) {
    location.href = addLoginAuthParams(url);
  }

  public copyTokens() {
    (this.$refs as any).textareaRef.select();
    document.execCommand('copy');
  }

  public reloadPage() {
    location.reload();
  }

  // private getSystemInfo() {
  //   this.systemInfo = slugSdk.getDeviceInfo();
  // }

  private async getTestData() {
    const { data } = await getTestLinkList();
    this.data = data.confUrlInfo;
  }
}
