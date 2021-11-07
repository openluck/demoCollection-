import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import FacePhotoAd from '../components/FaceAd';
import { parseSearch } from '@tencent/slug-function-vue';
import { storage } from '../helpers/storage';
import { getWhiteuserList } from '@/services/commons';
import { appStore } from '@/store/modules/app';
import { getUnreadMessageNums } from '@/services/dynamic';
import { LIKE_MESSAGE_TYPE, REPLY_MESSAGE_TYPE } from '@/config';
import { Tab } from '@/views/central/message';
import sdkHelper from '@/helpers/SDKHelper';
import { camelize } from '../utils';

@Component({
  name: 'app',
  components: { FacePhotoAd },
})
export default class AppPage extends BaseVue {
  private messageTimer: number | null = null;

  constructor() {
    super();
    this.saveToken();
    appStore.grayLevelTactics(); // 灰度发布策略
    if (!appStore.isExperienceEnv) {
      Promise.all([appStore.saveUserInfo(), this.setWhiteUserConfig(), appStore.getIntegralMissionList()]);
      this.asyncMessageCount();
    }
  }

  public mounted() {
    this.$nextTick(() => {
      this.checkIsPhone();
    });
  }

  public getActiveCls(name: string) {
    if (this.$route.path.includes(name)) {
      return 'on';
    }
    return '';
  }

  public handleBack() {
    if (this.$route.meta.back === 1 || this.$route.query.back === '1') {
      this.$router.back();
    } else {
      clearInterval(this.messageTimer as number);
      this.$nextTick(() => {
        sdkHelper.closeWebview();
      });
    }
  }

  public asyncMessageCount() {
    this.messageTimer = setInterval(() => {
      Promise.all([this.getReplyUnreadMessageNum(), this.getLikeUnreadMessageNum()]);
    }, 60 * 1000);
  }

  private async getReplyUnreadMessageNum() {
    await this.getUnreadMessageNum('reply', REPLY_MESSAGE_TYPE);
  }

  private async getLikeUnreadMessageNum() {
    await this.getUnreadMessageNum('like', LIKE_MESSAGE_TYPE);
  }

  private async getUnreadMessageNum(tab: Tab, msgType: string) {
    const { code, data } = await getUnreadMessageNums(msgType);
    if (code === 0) {
      const num = data.num;
      if (tab === 'like') {
        appStore.setMsgCount({ likeMsgCount: num });
      } else {
        appStore.setMsgCount({ replyMsgCount: num });
      }
    }
  }

  private saveToken() {
    let search = location.search;
    if (search && !search.includes('login_type=msdkv5')) {
      search = `${search}&login_type=msdkv5`;
    }

    const authMap = (camelize(parseSearch(search)) as any) as LoginParams;

    if (!search.includes('gameid_v5')) {
      const gameidV5 = authMap.gameid;
      search = `${search}&gameid_v5=${gameidV5}`;
      authMap.gameidV5 = gameidV5;
    }

    const { tokenParams } = storage.getBySession(['tokenParams']);
    if (tokenParams && !search) {
      return;
    }

    storage.setBySession({ tokenParams: search, authMap });
  }

  // note: 获取白名单配置
  private async setWhiteUserConfig() {
    const { data, code } = await getWhiteuserList();
    if (code === 0 || code === 200) {
      if (data.white === 1) {
        appStore.setShow(true);
      } else {
        appStore.setShow(false);
      }
      return;
    }
    appStore.setShow(false);
  }

  private checkIsPhone() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // g
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    if (isAndroid) {
      // 这个是安卓操作系统
    }
    if (isIOS) {
      // 这个是ios操作系统
      const el = document.querySelector('#app') as HTMLElement;
      el.classList.add('ios');
    }
  }
}
