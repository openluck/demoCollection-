import Vue from 'vue';
import Vuex from 'vuex';
import { IAppState } from './modules/app';
import { IHomeState } from './modules/home';
import { IFoundState } from './modules/found';

Vue.use(Vuex);

export interface IRootState {
  app: IAppState,
  home: IHomeState,
  found: IFoundState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  // modules: { appStore: AppStore, foundStore: FoundStore },
});
