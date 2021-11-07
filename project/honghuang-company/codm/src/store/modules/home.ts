import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface IHomeState {
  title: string;
}

// dynamic: true => 动态创建 vuex store
@Module({ dynamic: true, store, name: 'home' })
class HomeStore extends VuexModule implements IHomeState {
  public title = '使命召唤微社区';

  @Mutation
  public setTitle(title: string) {
    this.title = title;
  }
}

export const homeStore = getModule(HomeStore);
