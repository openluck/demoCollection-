interface IBaseDynamicInfoListItem {
  aid: string;
  // 点赞数
  approvalNum: number;
  articleType: number;
  author: {
    acctype: number;
    gender: number;
    platid: number;
    // titles: DyAuthorTitleItem[];
  };
  authorAvatar: string;
  authorName: string;
  content: string;
  publishTime: number;
  piclist: string;
  picnum: number;
  userOper: 0 | 1;
  title: string;
  topics: string;
  topicsInfo: { id: number; name: string }[];
  openid: string;
}

// note: 动态列表每一项数据定义
interface IDynamicInfoListItem extends IBaseDynamicInfoListItem {
  isMy: number;
  isTop: number;
  contentForm: number;
  cids: string;
  cidsInfo: [];
  createTime: number;
  display: string;
  extinfo: { qq: string; rejectMark: string };
  imgurl: string;
  latitude: number;
  longitude: number;
  oppositionNum: number;
  position: string;
  pv: number;
  summary: string;
  tags: string;
  updateTime: number;
  vid: string;
  videoLong: number;
  videoType: number;
  videoUrl: string;
  vv: number;
}

// note: 动态话题列表 item
interface IMossTopicItem {
  topic: {
    desc: string;
    img: string;
    name: string;
    id: number;
  };
  order: number;
}

interface IUgcTopicItem {
  contentCnt: number;
  desc: string;
  // 是否为热门
  hot: 0 | 1;
  img: string;
  name: string;
  topicid: number;
}

interface IUgcTopicListResponse {
  page: number;
  pageSize: number;
  topics: IUgcTopicItem[];
  total: number;
}

interface IDynamicTopicListResponse {
  hotTopics: IMossTopicItem[];
}

interface IMessageReponse {
  CmqMessage: IReplyMessageData[];
  totalCount: number;
}

interface IDynamiclatestMomentListData {
  infolist: IDynamicInfoListItem[];
  nextPageTime: number;
}

// note: 最热
interface IDynamicHottestMomentListData {
  infolist: IDynamicInfoListItem[];
  page: number;
  pageSize: number;
  rankversion: string;
  nextPageTime: number;
  total: number;
  userTopCount: number;
}

interface IDynamicCommentInfo {
  busikey: string;
  num: number;
  // "DJ5470146_ingame"
  objid: string;
  stime: number;
}

// 动态消息中心

type DynamicMessageItem = ILikeMessage | IReplyMessage;

interface IReplyMessageData {
  // note: JSON string For MsgContent
  msgContent: IReplyMsgContent | ILikeMsgContent;
  msgRelationId: string;
  msgTime: number;
  msgType: number;
  sndHeadUrl: string;
  sndName: string;
  sndUserId: string;
  tlistMsgId: string;
  userId: string;
}

interface IReplyMsgContent {
  bid: string;
  channel: string;
  content: string;
  ctime: number;
  game: string;
  moduleName: string;
  msgTime: number;
  msgType: number;
  objUrlMobile: string;
  objUrlPc: string;
  objid: string;
  remark: string;
  replyContent: string;
  replyTime: number;
  resourceId: string;
  resourceType: string;
  sndImgurl: string;
  sndName: string;
  sndOpenid: string;
  stime: number;
  title: string;
  userId: string;
}

interface ILikeMsgContent {
  accType: number;
  afterNum: number;
  bid: 'ingame';
  channel: string;
  game: string;
  moduleName: string;
  msgTime: number;
  msgType: number;
  nickName: string;
  openid: string;
  operateTime: number;
  operateType: number;
  partition: number;
  platId: number;
  roleId: string;
  userAdd: string;
  userHead: string;
  userId: string;
  worksAdd: string;
  worksId: string;
  worksType: number;
}

interface IMessageCommon {
  pic: string;
  id: string;
  dynamicContent: string;
}

type ILikeMessage = ILikeMsgContent & IMessageCommon;

type IReplyMessage = IReplyMsgContent & IMessageCommon;

type IMessageItem = ILikeMessage & IReplyMessage;

interface IPListItem {
  url: string;
}

interface IInfoListItem {
  aid: 'DJ253633';
  approvalNum: 0;
  articleType: 42;
  author: { acctype: number; gender: number; platid: number; titles: string[] };
  authorAvatar: string;
  authorName: string;
  cids: string;
  cidsInfo: any[];
  content: string;
  contentForm: number;
  createTime: number;
  display: string;
  extinfo: any;
  imgurl: string;
  isMy: number;
  isTop: number;
  latitude: number;
  longitude: number;
  openid: string;
  oppositionNum: number;
  piclist: IPListItem[];
  picnum: number;
  position: string;
  publishTime: number;
  pv: number;
  summary: string;
  tags: string;
  title: string;
  topics: string;
  topicsInfo: any;
  updateTime: number;
  userOper: number;
  vid: string;
  videoLong: number;
  videoType: number;
  videoUrl: string;
  vv: number;
}

// note: 上传图片

interface IDynamicPicSignature {
  expiredTime: number;
  sessionToken: string;
  tmpSecretId: string;
  tmpSecretKey: string;
  url: string;
}
