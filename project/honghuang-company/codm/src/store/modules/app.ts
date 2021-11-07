import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators';
import store from '@/store';
import { getUserInfo, saveUserInfo } from '@/services/central';
import { getIntegralTaskList } from '@/services/found';
import { storage } from '../../helpers/storage';
import { GAME_APP_EXPERIENCE_ENV_GAME_ID, GRAY_LEVEL_MAP } from '@/config';
import { getCurrentDateString, reportGrayLevelData } from '@/utils';

export interface IAppState {
  isShowTest: boolean;
}

// dynamic: true => 动态创建 vuex store
@Module({ dynamic: true, store, name: 'app' })
class AppStore extends VuexModule implements IAppState {
  public userInfo: IUserInfo | null = null;
  public taskList: ITaskListItemData[] = [];
  public isExperienceEnv = false;

  // 1 normal , 2 : empty; 3 : error
  public fetchTaskListStatus: 1 | 2 | 3 = 1;
  public replyMsgCount = 0;
  public likeMsgCount = 0;

  // 提前查接口
  public hasIntegralPick = false;
  public hasActivity = false;
  public isShowTest = false;

  @Mutation
  public setShow(isShow: boolean) {
    this.isShowTest = isShow;
  }

  @Mutation
  public setFetchTaskListError(status: 1 | 2 | 3) {
    this.fetchTaskListStatus = status;
  }

  @Mutation
  public setTaskList(taskList: ITaskListItemData[]) {
    this.taskList = taskList.sort((a, b) => a.orderWeight - b.orderWeight);
  }

  @Mutation
  public setupHasIntegralPick(hasIntegral: boolean) {
    this.hasIntegralPick = hasIntegral;
  }

  @Mutation
  public setMsgCount(msg: { replyMsgCount?: number; likeMsgCount?: number }) {
    if (typeof msg.replyMsgCount !== 'undefined') {
      this.replyMsgCount = msg.replyMsgCount;
    }
    if (typeof msg.likeMsgCount !== 'undefined') {
      this.likeMsgCount = msg.likeMsgCount;
    }
  }

  @Mutation
  public setUserInfo(userInfo: IUserInfo) {
    this.userInfo = userInfo;
  }

  @Mutation
  public checkGameAppEnv() {}

  @Mutation
  public grayLevelTactics() {
    const { authMap } = storage.getBySession(['authMap']);
    const game = authMap.gameidV5 || authMap.gameid;
    if (!game) {
      this.isExperienceEnv = true;
      return;
    }
    const gameid = parseInt(game, 10);
    if (gameid === GAME_APP_EXPERIENCE_ENV_GAME_ID) {
      // 体验服
      this.isExperienceEnv = true;
    } else {
      // 正式服, 使用灰度策略
      // this.isExperienceEnv = false;
      const num = parseInt(game.slice(-2), 10); // 取倒数 2 个
      const timeKey = getCurrentDateString();
      for (const item of GRAY_LEVEL_MAP) {
        if (item.time === timeKey) {
          const [min, max] = item.internal;
          if (num >= min && num <= max) {
            // 在该区间开放 ugc 和积分站
            reportGrayLevelData();
            this.isExperienceEnv = false;
          } else {
            this.isExperienceEnv = true;
          }
          return;
        }
      }
      // 灰度还没有开始或者是已经结束
      this.isExperienceEnv = false;
    }
  }

  @Action
  public async getIntegralMissionList() {
    const { data, code } = await getIntegralTaskList();
    if (code === 0) {
      let has = false;
      const d = data ? data.items : [];
      const items = d || [];
      if (items.length === 0) {
        this.setFetchTaskListError(3);
        return;
      }
      this.setFetchTaskListError(1);
      for (const item of items) {
        if (item.taskStatus === 3) {
          has = true;
        }
      }
      this.setupHasIntegralPick(has);
      this.setTaskList(items);
    } else {
      this.setFetchTaskListError(2);
    }
  }

  @Action
  public async saveUserInfo() {
    const ret = await getUserInfo();
    if (ret.code === 0 || ret.code === 200) {
      this.setUserInfo(ret.data);
      await saveUserInfo(ret.data);
    }
  }
}

export const appStore = getModule(AppStore);
