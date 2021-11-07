declare module '@tencent/multi-report/Platform/Vue' {}
declare module 'vue-waterfall2' {}

interface UserTitleInfo {
  bid: 'ingame';
  game: 'mdnf';
  id: number;
  imgUrl: string;
  order: string;
  title: string;
}

interface UgcUserInfoData {
  acctype: number;
  gender: number;
  headimg: string;
  momentCnt: number;
  nickName: string;
  openid: string;
  platid: number;
  titles: UserTitleInfo[];
}

interface BatchAttentionData {
  addtime: number;
  ext1: string;
  ext2: string;
  ext3: string;
  fansNums: number;
  idolNums: number;
  mutual: number;
  nickName: string;
  userHead: string;
  isAttention: 0 | 1;
  userId: string;
}

interface IUserInfo {
  nickname: string;
  avatar: string;
  smallAvatar: string;
  gender: number;
}

// note: moss 广告位配置
interface IMossOperationItem {
  id: number;
  configId: number;
  configTitle: string;
  title: string;
  // image url
  images: string;
  imageUrls: any;
  url: string;
  status: number;
  startTime: string;
  endTime: string;
  timingStatus: number;
  sort: number;
  publishTime: string;
  appid: string;
  type: number;
  describe: string;
  // 推荐: hot, news ...
  recommended: string;
  clickRate: number;
  clickPv: number;
  popPv: number;
  source: any;
}
