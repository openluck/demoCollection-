import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators';
import store from '@/store';
import { getIntegralUserProfile } from '@/services/found';

export interface IFoundState {
  topics: IUgcTopicItem[];
}

// dynamic: true => 动态创建 vuex store
@Module({ store, name: 'found', dynamic: true })
class FoundStore extends VuexModule implements IFoundState {
  public topics: IUgcTopicItem[] = [];

  public integralUserInfo: IIntegralUserProfile | null = null;

  @Mutation
  public setTopic(topic: IUgcTopicItem) {
    this.topics.push(topic);
  }

  @Mutation
  public clearSelectTopic() {
    this.topics = [];
  }

  @Mutation
  public deleteTopic(index: number) {
    this.topics.splice(index, 0);
  }

  @Mutation
  public setIntegralUserInfo(userInfo: IIntegralUserProfile) {
    this.integralUserInfo = userInfo;
  }

  @Action
  public async updateIntegralUserInfo() {
    const { data, code } = await getIntegralUserProfile();
    if (code === 0 && data.user) {
      this.setIntegralUserInfo(data.user);
    }
  }
}

export const foundStore = getModule(FoundStore);
