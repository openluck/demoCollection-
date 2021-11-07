import { Prop, Component, Watch } from 'vue-property-decorator';
import Vue from 'vue';
import { globalConfig } from '@/config';
import ingame from '@helpers/IngameConfigParser';
import { storage } from '@helpers/storage';

declare const SlugComment: SlugComment;

@Component
export default class Comment extends Vue {
  @Prop({ default: '' })
  public id!: string;

  @Prop({ default: '' })
  public title!: string;

  @Prop({ default: '' })
  public resourceType!: string;

  // public commentCount: number = 0;
  public token: LoginParams = storage.getBySession(['authMap']).authMap;
  public comment: SlugComment | null = null;
  public commentCount = 0;

  public async mounted() {
    await this.loadComment();
    this.$nextTick(() => {
      this.initComment();
    });
  }

  @Watch('id')
  public refreshComment() {
    if (this.comment) {
      this.comment.refresh({
        options: {
          title: '切换评论',
          objid: this.id,
        },
      });
    }
  }

  public get config(): CommentOptions {
    const { moduleId, gameid } = globalConfig;
    const stime = this.getStime();
    return {
      stime,
      gameid,
      objid: this.id,
      title: this.title,
      resource_type: this.resourceType,
      moduleId,
    };
  }

  @Watch('comment.comments.latest', { deep: true })
  public watchComent() {
    if (this.comment) {
      this.commentCount = this.comment.comments.total || 0;
    }
  }

  public get isRenderComment() {
    return this.token && ingame.isRenderCommentComp();
  }

  public destroyed() {
    this.destoryCommentInputEl();
  }

  private initComment() {
    this.comment = this.getSlugComment({
      el: '#comment-wrapper',
      options: this.config as CommentOptions,
      env: globalConfig.mode === 'development' ? 'development' : 'production',
      // env: 'production',
    });
    if (this.comment) {
      setTimeout(() => {
        this.moveInputFloatLayerToBoby();
      }, 30);
    }
  }

  private getStime() {
    return 202012;
  }

  private moveInputFloatLayerToBoby() {
    const el = document.querySelector('div.comment-input');
    if (el) {
      document.body.appendChild(el);
    }
  }

  private destoryCommentInputEl() {
    const el = document.querySelector('div.comment-input');
    if (el) {
      document.body.removeChild(el);
    }
  }

  private getSlugComment(config: CommentConfigs): SlugComment {
    return new SlugComment(config);
  }

  private async loadComment() {
    const win = window as any;
    if (typeof win.SlugComment === 'undefined') {
      const comment = await import('@tencent/comment');
      win.SlugComment = comment.default || comment;
      Vue.use(win.SlugComment);
    }
  }
}
