import { Vue, Prop, Component } from 'vue-property-decorator';
import { convertHttps } from '@vueUtils/filters';
import ReplyLikeMessageItem from '../ReplyLikeMessageItem';
import { LIKE_MESSAGE_TYPE, REPLY_MESSAGE_TYPE } from '@/config';
import { getMessageList, queryDynamicByIds } from '@services/dynamic';
import { camelize } from '@/utils';
import Empty from '@components/Empty';
// import { storage } from '@/helpers/storage';

export interface LikeMessage extends ILikeMsgContent {
  pic: string;
  id: string;
  dynamicContent: string;
}

export interface ReplyMessage extends IReplyMsgContent {
  pic: string;
  id: string;
  dynamicContent: string;
}

export type MessageItem = LikeMessage | ReplyMessage;

@Component({
  components: { ReplyLikeMessageItem, Empty },
  filters: { convertHttps },
})
export default class ReplyAndLikeList extends Vue {
  @Prop({ default: 'reply' })
  public type!: 'reply' | 'like';

  public messageList: MessageItem[] = [];

  public noMoreData = false;

  public noData = false;

  public error = false;

  private num = 8;

  private start = 0;
  private loading = true;

  // private userId = storage.getBySession(['authMap']).authMap.openid;

  public created() {
    this.getMessage().then(list => {
      this.messageList = list;
      this.loading = false;
    });
  }

  public async handleScrollLoadMore() {
    if (this.noData) {
      return;
    }
    if (this.noMoreData) {
      return;
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.start += this.num;
    const items = await this.getMessage();
    this.loading = false;
    if (items.length === 0) {
      return;
    }
    this.messageList.push(...items);
  }

  private async getMessage(): Promise<MessageItem[]> {
    const { code, data } = await getMessageList(this.getRequestParams());
    if (code === 0) {
      const { CmqMessage, totalCount } = data;
      if (totalCount === 0 && this.messageList.length === 0) {
        this.noData = true;
        return [];
      }
      this.noData = false;
      if (CmqMessage.length === 0) {
        this.noMoreData = true;
        return [];
      }
      if (CmqMessage.length < this.num) {
        this.noMoreData = true;
      }
      return await this.parserMessage(CmqMessage);
    }
    this.error = true;
    this.noData = true;
    return [];
  }

  private async parserMessage(data: IReplyMessageData[]): Promise<MessageItem[]> {
    const ret: MessageItem[] = [];
    for (const item of data) {
      const jsonStr = item.msgContent as any;
      item.msgContent = camelize(JSON.parse(jsonStr || '')) as IReplyMsgContent | ILikeMsgContent;
      let id = (item.msgContent as IReplyMsgContent).objid;
      if (this.type === 'like') {
        id = (item.msgContent as ILikeMsgContent).worksId;
      }
      const m: MessageItem = {
        ...item.msgContent,
        pic: '',
        id,
        dynamicContent: '',
      };
      ret.push(m);
    }
    let ids = '';
    if (this.type === 'like') {
      ids = data
        .map(item => {
          const content = item.msgContent as ILikeMsgContent;
          return content.worksId;
        })
        .join(',');
    } else {
      ids = data
        .map(item => {
          const content = item.msgContent as IReplyMsgContent;
          return content.objid;
        })
        .join(',');
    }
    const { code, data: d } = await queryDynamicByIds(ids);
    if (code === 0) {
      const infoList = d.infolist;
      for (const item of ret) {
        for (const info of infoList) {
          if (item.id === info.aid) {
            item.dynamicContent = info.content;
            const picList = info.piclist as any;
            if (picList) {
              item.pic = JSON.parse(picList)[0].url;
            } else {
              item.pic = '';
            }
            break;
          }
        }
      }
    }
    return ret;
  }

  private getRequestParams() {
    return {
      msgType: this.type === 'like' ? LIKE_MESSAGE_TYPE : REPLY_MESSAGE_TYPE,
      num: this.num,
      start: this.start,
    };
  }
}
