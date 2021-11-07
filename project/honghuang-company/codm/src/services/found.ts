import { globalConfig, SITE_IDS, sandbox } from '@/config';
import { getAccountType } from '@/utils';
import { slugRequest } from '@tencent/slug-request';

// note: 获取积分站用户数据
export function getIntegralUserProfile() {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<{ user: IIntegralUserProfile }>({
    baseUrl: globalConfig.integralBaseUrl,
    source: 'backEnd',
    type: 'api',
    method: 'GET',
    isAuth: true,
    underlizeQuery: true,
    path: '/user/profile',
    query: { siteId, sandbox },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// note: 获取积分任务
export function getIntegralTaskList() {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<{ items: ITaskListItemData[] }>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'GET',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/task/list',
    query: { position: 8, siteId, sandbox },
  });
}

// note: 做积分任务
export function doIntegralTask(taskId: number) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<{ task: ITaskListItemData }>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'POST',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/task/do',
    query: { siteId, sandbox },
    data: { taskId },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// note: 发送积分事件
export function sendIntegralEvent(eventId: string, eventKey?: string) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  // formData.append('event_key', `${}`);
  return slugRequest<ITaskListItemData>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'POST',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/task/do_event_task',
    query: { siteId },
    data: { eventId, eventKey },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// note: 领取积分
export function pickIntegralTaskAward(taskId: number) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<IIntegralTaskAwardResData>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'POST',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/task/pick',
    query: { siteId },
    data: { taskId },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 获取积分消费列表
 * @param pageSize: 控制翻页大小
 * @param pageInfo: 分页数据
 */
export function getIntegralRecordList(pageSize: number, pageInfo?: string) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<IIntegralLogResponse>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'GET',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/point/log',
    query: { siteId, pageSize, pageInfo },
  });
}

/**
 * 获取积分兑换列表
 * @param pageSize: 控制翻页大小
 * @param pageInfo: 分页数据， 第一页不需要传递， 否则会获取不到数据
 */
export function getIntegralExchangeList(pageSize: number, pageInfo?: string) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  return slugRequest<{ items: IIntegralExchangeListItemData[]; pageInfo: string }>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'GET',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/order/list',
    query: { siteId, pageSize, pageInfo },
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // },
  });
}

// note: 获取礼包列表
export function getGoodsList(pageSize: number, pageInfo?: string) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  // formData.append('event_key', `${}`);
  return slugRequest<IIntegralGoodsListResponse>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'GET',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/goods/list',
    query: { siteId, pageSize, pageInfo },
  });
}

// note: 兑换礼包
export function doExchangeGood(goodsId: number) {
  const siteId = SITE_IDS[getAccountType() || 'qq'];
  // formData.append('event_key', `${}`);
  return slugRequest<{ orderId: number; dealMsg: string }>({
    baseUrl: globalConfig.integralBaseUrl,
    method: 'POST',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    path: '/order/exchange',
    query: { siteId },
    data: {
      goodsId,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
