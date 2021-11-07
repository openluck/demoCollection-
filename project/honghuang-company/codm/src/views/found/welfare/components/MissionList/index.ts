import { Component } from 'vue-property-decorator';
import Empty from '@components/Empty';
import BaseVue from '@helpers/BaseVue';
import MissionItem from '../MissionItem';
import { appStore } from '@/store/modules/app';

@Component({
  components: { Empty, MissionItem },
})
export default class MissionList extends BaseVue {
  public get taskList() {
    return appStore.taskList;
  }

  public get fetchError() {
    return appStore.fetchTaskListStatus;
  }
}
