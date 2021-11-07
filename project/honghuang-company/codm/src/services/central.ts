import { apiBaseUrl, sandbox } from '@/config';
import { slugRequest } from '@tencent/slug-request';

// note: 根据 id 查询用户信息
export function queryUserInfoById(userId: string) {
  return slugRequest<UgcUserInfoData>({
    baseUrl: apiBaseUrl,
    method: 'GET',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    path: '/gingame/ugc/query_user_info_by_id',
    query: { userid: userId, fields: 'moment', channel: 1, sandbox },
  });
}

// note: 查询个人信息
export async function getUserInfo() {
  return await slugRequest<IUserInfo>({
    baseUrl: 'https://app.ingame.qq.com',
    path: '/php/ingame/comment/user_info.php',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    method: 'GET',
    query: {
      channel: 1,
    },
  });
}

// note: 保存个人信息
export async function saveUserInfo(userInfo: IUserInfo) {
  return await slugRequest({
    baseUrl: 'https://app.ingame.qq.com',
    path: '/php/ingame/usercenter/save_user_profile.php',
    isAuth: true,
    source: 'backEnd',
    type: 'api',
    underlizeQuery: true,
    method: 'GET',
    query: {
      game: 'codm',
      bid: 'ingame',
      channel: 1,
      ...userInfo,
    },
  });
}
