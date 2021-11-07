import { apiBaseUrl, TENCENT_OSS_BUCKEY, sandbox } from '@/config';
import { slugRequest } from '@tencent/slug-request';

/**
 * 获取动态列表-最热
 * @param params
 * @return {Promise<any>}
 */
export function getHottestMomentList(pageSize: number, page: number) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    path: '/gingame/ugc/query_moment_list',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    isAuth: true,
    query: {
      // note: 最热按点赞数
      orderType: 2,
      pageSize,
      page,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    underlizeQuery: true,
  };
  return slugRequest<IDynamicHottestMomentListData>(config);
}

/**
 * 获取动态列表-根据话题查询
 * @param params
 * @return {Promise<any>}
 */
export function getMomentListByTopic(pageSize: number, page: number, topicId: string) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    path: '/gingame/ugc/query_moment_list',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    isAuth: true,
    query: {
      // note: 最热按点赞数
      topic: topicId,
      orderType: 1,
      pageSize,
      page,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    underlizeQuery: true,
  };
  return slugRequest<IDynamicHottestMomentListData>(config);
}

/**
 * 查询详情
 * @param params
 * @return {Promise<any>}
 */
export function getDynamicDetail(aid: string) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    path: '/gingame/ugc/query_moment_detail',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    isAuth: true,
    query: {
      // note: 最热按点赞数
      aid,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    underlizeQuery: true,
  };
  return slugRequest<IDynamicInfoListItem>(config);
}

/**
 * 获取动态列表-查询用户动态
 * @param params
 * @return {Promise<any>}
 */
export function getUserMomentList(pageSize: number, page: number, userId: string) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    path: '/gingame/ugc/query_user_moment_list',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    isAuth: true,
    query: {
      // note: 最热按点赞数
      userid: userId,
      orderType: 1,
      pageSize,
      page,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    underlizeQuery: true,
  };
  return slugRequest<IDynamicHottestMomentListData>(config);
}

/**
 * 批量获取动态评论数据
 * @param params
 * @return {Promise<any>}
 */
export function getMomentCommentNumber(objlist: string) {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    url: `${apiBaseUrl}/php/ingame/comment/query_source_list_info.php`,
    source: 'backEnd',
    type: 'jsonp',
    isAuth: true,
    query: {
      busikey: 'all_mobile',
      objlist,
      sandbox,
      game: 'codm',
      bid: 'ingame',
      channel: 1,
      type: 0,
      gameid: 'codm',
    },
    underlizeQuery: true,
  };
  return slugRequest<{ statList: IDynamicCommentInfo[] }>(config);
}

/**
 * 获取动态列表-最新
 * @param params
 * @return {Promise<any>}
 */
export function getLatestMomentList(pageSize: number, pageTime: number) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    path: '/gingame/ugc/query_new_moment_list',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    isAuth: true,
    query: {
      orderType: 1,
      // note: 最热按点赞数
      pageTime,
      pageSize,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    underlizeQuery: true,
  };
  return slugRequest<IDynamiclatestMomentListData>(config);
}

/**
 * 获取热门话题
 * @return {Promise<any>}
 */
export function getHotTopic() {
  const config: ApiTypes.HttpRequestConfig = {
    source: 'cdnJson',
    type: 'cdnJson',
    isAuth: false,
    method: 'GET',
    baseUrl: 'https://tiem-cdn.qq.com/sy/codm/ingame/moment',
    path: '/index.json',
  };
  return slugRequest<IDynamicTopicListResponse>(config);
}

/**
 * 点赞
 */
export function addVote(aid: string) {
  return slugRequest({
    baseUrl: apiBaseUrl,
    path: '/gingame/ugc/add_vote',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    method: 'GET',
    underlizeQuery: true,
    query: {
      moduleid: 'moment',
      aid,
      optype: 1,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
  });
}
/**
 * 取消点赞
 */
export function cancelVote(aid: string) {
  return slugRequest({
    baseUrl: apiBaseUrl,
    path: '/gingame/ugc/cancel_vote',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    method: 'GET',
    underlizeQuery: true,
    query: {
      moduleid: 'moment',
      aid,
      optype: 1,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
  });
}

/**
 * 取消关注
 */

export function cancelUserAttention(userId: string) {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    url: `${apiBaseUrl}/interactcenter/cancel_user_attention.php`,
    isAuth: true,
    underlizeQuery: true,
    query: {
      userId,
      bid: 'ingame_person',
      game: 'codm',
      sandbox,
      // bid: 'ingame',
    },
    type: 'jsonp',
    source: 'backEnd',
  };
  return slugRequest(config);
}

export interface IAddUserAttentionQuery {
  headUrl: string;
  nickName: string;
  headUrlAtten: string;
  nickNameAtten: string;
  userId: string;
}
/**
 * 关注
 */
export function addUserAttention(userInfo: IAddUserAttentionQuery) {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    url: `${apiBaseUrl}/interactcenter/user_attention.php`,
    isAuth: true,
    underlizeQuery: true,
    query: {
      ...userInfo,
      bid: 'ingame_person',
      sandbox,
    },
    type: 'jsonp',
    source: 'backEnd',
  };
  return slugRequest(config);
}

// 获取话题列表
export function getUgcTopicList(page: number, pageSize: number) {
  return slugRequest<IUgcTopicListResponse>({
    baseUrl: apiBaseUrl,
    path: '/gingame/ugc/query_topic_list',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    method: 'GET',
    underlizeQuery: true,
    query: {
      moduleid: 'moment',
      optype: 1,
      page,
      pageSize,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
  });
}

export function getMessageList(query: { msgType: string; num: number; start: number }) {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    isAuth: true,
    source: 'backEnd',
    type: 'jsonp',
    url: `${apiBaseUrl}/php/ingame/messagecenter/query_message.php`,
    underlizeQuery: true,
    query: {
      ...query,
      game: 'codm',
      bid: 'ingame',
      channel: 1,
      sandbox,
    },
  };
  return slugRequest<IMessageReponse>(config);
}

// note: 根据 ids 批量查询动态
export function queryDynamicByIds(ids: string) {
  return slugRequest<{ infolist: IInfoListItem[] }>({
    source: 'backEnd',
    type: 'api',
    method: 'GET',
    underlizeQuery: true,
    baseUrl: apiBaseUrl,
    path: '/gingame/ugc/query_moment_list_by_ids',
    query: {
      ids,
      channel: 1,
      game: 'codm',
      bid: 'ingame',
      sandbox,
    },
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // },
  });
}

// note: 获取未读消息条数
export function getUnreadMessageNums(msgType: string) {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    isAuth: true,
    source: 'backEnd',
    type: 'jsonp',
    url: `${apiBaseUrl}/php/ingame/messagecenter/query_not_read_nums.php`,
    underlizeQuery: true,
    query: {
      msgType,
      game: 'codm',
      bid: 'ingame',
      channel: 1,
      sandbox,
    },
  };
  return slugRequest<{ num: number }>(config);
}

// note: 生成图片签名
export function generateDynamicImageSignature(suffixs: string[]) {
  return slugRequest<IDynamicPicSignature[]>({
    method: 'GET',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    path: '/gingame/ugc/get_pic_signature_batch',
    underlizeQuery: true,
    query: {
      sandbox,
      game: 'codm',
      bid: 'ingame',
      moduleid: 'moment',
      bucket: TENCENT_OSS_BUCKEY.TGL,
      region: 'ap-guangzhou',
      suffixBatch: suffixs.join(','),
      igRandom: parseInt(`${Math.random() * 1000000}`, 10), // 防止选择多张同一后缀的图片时，被当作重复请求被 safari 抛弃
    },
  });
}

// note: 图片鉴黄
export function checkDynamicUploadImage(url: string) {
  return slugRequest<{}>({
    method: 'GET',
    source: 'backEnd',
    type: 'api',
    baseUrl: apiBaseUrl,
    path: '/gingame/safecenter/check_image',
    query: {
      game: 'codm',
      bid: 'ingame',
      opkey: 'ugc_addmoment',
      module: 'moment',
      imglist: url,
      sandbox,
    },
  });
}

// note: 发布动态
export function subitDynamic(data: { content: string; cids: string; topics: string; piclist: string }) {
  return slugRequest<{ aid: number }>({
    method: 'POST',
    baseUrl: apiBaseUrl,
    path: '/php/ingame/ugc/add_moment.php',
    query: {
      sandbox,
      game: 'codm',
      bid: 'ingame',
      channel: 1,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    underlizeQuery: true,
    source: 'backEnd',
    type: 'api',
    data,
  });
}
