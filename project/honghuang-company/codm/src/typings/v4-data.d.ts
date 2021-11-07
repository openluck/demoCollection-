interface IV4DataDetailRecommentItem {
  iNewsId: string;
  iSubType: string;
  iTotalPlay: string;
  iType: string;
  sAuthor: string;
  sCreated: string;
  sExt1: string;
  sExt2: string;
  sExt3: string;
  sIMG: string;
  sTagIds: string;
  sTitle: string;
  sUrl: string;
}

// note: 这里的数据定义了 公告 和 攻略
interface IV4ListItemData extends IBaseV4ContenteListItemData {
  sRedirectType: string;
  sRedirectURL: string;
}

// note: 渲染v4 内容的数据
interface IBaseV4ContenteListItemData {
  sTitle: string;
  sIdxTime: string;
  iTotalPlay: number;
  // 攻略类型： 1 表示图文， 2 表示 视频
  iInfoType: 1 | 2;
  iId: number;
  sIMG: string;
  sDesc: string;
  sAuthor: string;
  iNewsId: number;
  sVID: string;
  sCoverList: {
    id: number;
    imgType: string;
    size: string;
    type: string;
    url: string;
  }[];
}

// note: v4 list
interface IV4DataResponseData {
  cache: number;
  total: number;
  items: IV4ListItemData[];
}

// 这里是攻略的详情的数据定义
interface IV4DetailData {
  iCanCmt: string;
  iCollect: string;
  iComment: string;
  iDigg: string;
  iFans: string;
  iIsRedirect: string;
  iNewsId: string;
  iNewsTotal: string;
  iSubType: string;
  iTotalPlay: string;
  iType: string;
  iUserId: string;
  iVideoTotal: string;
  linkList: V4DataDetailRecommentItem[];
  sAuthor: string;
  sContent: string;
  sCoverList: {
    id: number;
    imgType: string;
    size: string;
    type: string;
    url: string;
  }[];
  sCoverMap: string; // json string
  sCreated: string;
  sCreater: string;
  sData: string;
  sDesc: string;
  sExt1: string;
  sExt2: string;
  sExt3: string;
  sFaceUrl: string;
  sGameVersion: string;
  sIMG: string;
  sIdxTime: string;
  sNickName: string;
  sRedirectURL: string;
  sTagIds: string;
  sTitle: string;
  sUrl: string;
  sVID: string;
  tagflag: string;
  tagkey: string;
  userDesc: string;
  userNewsTotalPlay: string;
  userTotalPlay: string;
  userflag: string;
  videoCollect: number;
  videoDigg: number;
}
