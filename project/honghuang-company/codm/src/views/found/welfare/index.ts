import Empty from '@components/Empty';
import MissionItem from './components/MissionItem';
import MissionList from './components/MissionList';
import Loading from '@components/Loading';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { foundStore } from '@store/modules/found';
import IntegralRuleDialog from '@components/IntegralRuleDialog';
import SystemSafeguardHint from '@components/SystemSafeguardHint';

@Component({
  name: 'welfare',
  components: {
    Empty,
    Loading,
    MissionItem,
    MissionList,
    IntegralRuleDialog,
    SystemSafeguardHint,
  },
})
export default class WelfarePage extends BaseVue {
  public loading = true;

  public showRuleDialog = false;

  public get userInfo() {
    return foundStore.integralUserInfo;
  }

  public handleRuleBtnTap() {
    this.showRuleDialog = true;
  }

  public hideRuleDialog() {
    this.showRuleDialog = false;
  }

  public created() {
    foundStore.updateIntegralUserInfo().finally(() => {
      this.loading = false;
    });
  }
}
