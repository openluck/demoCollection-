import { Vue, Prop, Component } from 'vue-property-decorator';
import { convertHttps, timeFormat } from '@/vueUtils/filters';
import { LIKE_MESSAGE_TYPE } from '@/config';
import { decodeUnicode } from '@tencent/slug-function';
import { Encoder } from '@assets/libs/encoder';

@Component({
  filters: { convertHttps, timeFormat },
})
export default class ReplyAndLikeItem extends Vue {
  @Prop({ default: {} })
  public data!: IMessageItem;

  @Prop({ default: 'reply' })
  public type!: 'reply' | 'like';

  public get userAvatar() {
    return this.data.sndImgurl || this.data.userHead || 'https://gzhcos.qq.com/codm/central/tx.png';
  }

  public get content() {
    if (this.data.msgType === parseInt(LIKE_MESSAGE_TYPE, 10)) {
      return '赞了我';
    }
    const data = this.data as IReplyMessage;
    if (!data.replyContent) {
      return `评论了我：${this.formatContent(data.content)}`;
    }
    return `回复了我：${this.formatContent(data.replyContent)}`;
  }

  /**
   * handleJump
   */
  public handleJump(id: string) {
    const resourceType = this.data.resourceType;
    if (id.startsWith('DJ') || resourceType === 'moment') {
      this.$router.push(`/found/dynamic_detail/${id}`);
    } else if (resourceType === 'v4_article') {
      this.$router.push(`/article_detail/${id}`);
    } else {
      this.$router.push(`/video_detail/${id}`);
    }
  }

  /**
   * 格式化内容
   * @param {String} content - 需要格式化的内容
   */
  public formatContent(content: string) {
    content = Encoder.htmlDecode(decodeUnicode(content));
    return content.replace(/\[e:(\d+)\]/g, ($1, $2) => {
      console.log($1);
      return `<img class="ig--emoji" src="https://ossweb-img.qq.com/images/js/bsCommonFiles/images/qqemotion/${$2}.png">`;
    });
  }
}
