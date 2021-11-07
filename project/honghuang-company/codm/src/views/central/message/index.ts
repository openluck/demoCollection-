import { Component } from 'vue-property-decorator';
import { convertHttps } from '@vueUtils/filters';
import BaseVue from '@helpers/BaseVue';
import ReplyLikeMessage from './components/ReplyLikeMessage';
import { appStore } from '@/store/modules/app';
import SystemSafeguardHint from '@components/SystemSafeguardHint';

export type Tab = 'reply' | 'like';

@Component({
  name: 'message',
  components: { ReplyLikeMessage, SystemSafeguardHint },
  filters: { convertHttps },
})
export default class MessageCenter extends BaseVue {
  public tab = 'reply';

  public get replyMsgCount() {
    return appStore.replyMsgCount;
  }

  public get likeMsgCount() {
    return appStore.likeMsgCount;
  }

  public handleTabTap(tab: Tab) {
    this.tab = tab;
    if (tab === 'like') {
      appStore.setMsgCount({ likeMsgCount: 0 });
    } else {
      appStore.setMsgCount({ replyMsgCount: 0 });
    }
  }
}
