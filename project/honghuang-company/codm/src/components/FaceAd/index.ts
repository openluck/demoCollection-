import { getSplashScreenData, reportSplashScreenBehavior } from '@/services/commons';
import BaseVue from '@helpers/BaseVue';
import { Component } from 'vue-property-decorator';
import { storage } from '@helpers/storage';
import { searchBatchAppend } from '@tencent/slug-function-vue';
import sdkHelper from '@helpers/SDKHelper';

@Component
export default class FacePhotoAd extends BaseVue {
  public data: any = {}; // 渲染数据接收
  public isShow = false;

  public created() {
    this.init();
  }

  public async handleClick(id: number) {
    await reportSplashScreenBehavior(id, 2);
    const url = this.data.linkUrl;
    if (url.startsWith('http')) {
      const url = this.addParams(this.data.linkUrl);
      sdkHelper.exitFullScreen();
      setTimeout(() => {
        sdkHelper.exitFullScreen();
        this.$nextTick(() => {
          sdkHelper.exitFullScreen();
          location.href = url;
        });
      }, 0);
    } else {
      this.$router.push(url);
    }
  }
  // 关闭按钮逻辑
  public handleClosePhoto() {
    this.isShow = false;
  }

  // 获取后台数据
  public async getPhotoData() {
    try {
      const { code, data } = await getSplashScreenData();
      if (code !== 0) {
        // this.$toast('好像发送错误');
        return;
      }
      if (!data) {
        return;
      }
      const list = data.splashScreenList;
      if (list && list.length > 0) {
        this.data = list[0];
        this.isShow = true;
        reportSplashScreenBehavior(this.data.id, 1);
        storage.setBySession({ showFaceAd: '1' });
      } else {
        this.isShow = false;
      }
    } catch (error) {
      console.error(error);
      this.isShow = false;
    }
  }

  public addParams(url: string) {
    const { authMap } = storage.getBySession(['authMap']);
    return searchBatchAppend(authMap, url).href;
  }

  private init() {
    const { showFaceAd } = storage.getBySession(['showFaceAd']);
    if (!showFaceAd || showFaceAd === '0') {
      this.getPhotoData();
    }
  }
}
