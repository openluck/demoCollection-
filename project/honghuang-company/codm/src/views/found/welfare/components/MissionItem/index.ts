import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { doIntegralTask, pickIntegralTaskAward } from '@/services/found';
import { genApiUrl } from '@/utils';
import { foundStore } from '@store/modules/found';
import { appStore } from '@/store/modules/app';

@Component
export default class MissionItem extends BaseVue {
  @Prop({ required: true }) readonly taskItem!: ITaskListItemData;

  public taskStatus: ITaskListItemData['taskStatus'] | null = null;

  public task: ITaskListItemData | null = this.taskItem;

  public i = 1;

  public created() {
    this.taskStatus = this.taskItem.taskStatus;
  }

  public handleDoTask() {
    this.doTask();
  }

  public async handlePickIntegral() {
    const { taskId } = this.taskItem;
    // 领取奖励
    const { code, data } = await pickIntegralTaskAward(taskId);
    if (code !== 0) {
      this.$toast('领取失败');
      return;
    }
    const {
      prize: { point },
      task,
    } = data as IIntegralTaskAwardResData;
    this.task = task;
    this.taskStatus = task.taskStatus;
    await this.updateUserInfo(point);
    await appStore.getIntegralMissionList();
    this.$toast(`恭喜您成功获得 ${point} 积分`);
  }

  private async updateUserInfo(point?: number) {
    if (foundStore.integralUserInfo && point) {
      const userInfo = foundStore.integralUserInfo;
      userInfo.pointAmount += point;
      userInfo.pointBalance += point;
      foundStore.setIntegralUserInfo(userInfo);
    } else {
      await foundStore.updateIntegralUserInfo();
    }
  }

  private async doTask() {
    const { taskScheme, taskId } = this.taskItem;
    const { action, scheme, param } = taskScheme;
    switch (action) {
      case 0:
        if (scheme) {
          if (scheme.includes('https://')) {
            //  跳外链
            location.href = genApiUrl(scheme, param);
          } else {
            // 跳微社区内部页面
            this.$router.push(scheme);
          }
        }
        break;
      case 1:
        await this.handleTaskTypeForOne(taskId);
        break;
      case 2:
        await this.handleTaskTypeForTwo(scheme, taskId);
        break;
      case 3:
        this.jumpTo(scheme, taskId);
        break;
      // case 4:
      //   // 点击关注公众号行为
      //   location.href = '';
      //   break;
      case 5:
        // 跳转外链
        location.href = genApiUrl(scheme, param);
        break;
      // case 7:
      //   // 查看邀请码
      //   location.href = utils.genApiUrl(scheme, this.taskItem.taskScheme.param);
      //   break;
    }
  }

  private async handleTaskTypeForOne(taskId: number) {
    const { code, data, msg } = await doIntegralTask(taskId);
    if (code === 0 && data) {
      await appStore.getIntegralMissionList();
      this.taskStatus = data.task.taskStatus;
      this.task = data.task;
      // 积分任务完成, 状态变为待领取, 这个时候是否需要加积分
      if (this.taskStatus === 2) {
        // 刷新一个用户信息
        this.updateUserInfo();
        this.$toast(`恭喜您成功获得 ${this.task.pointAmount} 积分`);
      }
    } else {
      this.$toast(msg);
    }
  }

  private async handleTaskTypeForTwo(scheme: string, taskId: number) {
    // 跳转之前，先发做任务接口
    const { msg, code } = await doIntegralTask(taskId);
    if (code !== 0) {
      this.$toast(msg);
      return;
    }
    appStore.getIntegralMissionList();
    this.jumpTo(scheme, taskId);
  }

  private jumpTo(scheme: string, taskId: number) {
    const url = genApiUrl(scheme, { taskId });
    if (url.startsWith('https://')) {
      location.href = url;
    } else {
      this.$router.push(url);
    }
  }
}
