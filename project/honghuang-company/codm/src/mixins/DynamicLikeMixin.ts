/**
 * note: 动态点赞 mixin
 */
import { Component } from 'vue-property-decorator';
import { addVote, cancelVote } from '@services/dynamic';
import BaseMixin from './BaseMixin';

interface ILikeTypeInfo {
  isLike: 0 | 1;
  count: number;
}

@Component
export default class DynamicLikeMixin extends BaseMixin {
  public likeInfo: ILikeTypeInfo | null = null;

  private lock = false;

  public async handleTapLikeIcon(id: string) {
    const liked = (this.likeInfo as ILikeTypeInfo).isLike === 1;
    if (liked) {
      // 取消点赞
      await this.cancelLike(id);
    } else {
      await this.addLike(id);
    }
  }

  protected async addLike(id: string) {
    if (this.lock) {
      return;
    }
    this.lock = true;
    const ret = await addVote(id);
    if (ret.code === 0) {
      this.$toast('点赞成功');
      this.likeInfo = {
        count: ++(this.likeInfo as ILikeTypeInfo).count,
        isLike: 1,
      };
      this.lock = false;
      return;
    }
    this.$toast('点赞失败');
    this.lock = false;
  }

  protected async cancelLike(id: string) {
    if (this.lock) {
      return;
    }
    this.lock = true;
    const ret = await cancelVote(id);
    if (ret.code === 0) {
      this.likeInfo = {
        count: --(this.likeInfo as ILikeTypeInfo).count,
        isLike: 0,
      };
      this.$toast('取消点赞成功');
      this.lock = false;
      return;
    }
    this.$toast('取消点赞失败');
    this.lock = false;
  }
}
