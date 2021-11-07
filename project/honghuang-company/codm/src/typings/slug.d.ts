interface ISystemInfo {
  osSystem: string;
  osVersion: string;
  deviceName: string;
  deviceModel: string;
}

declare namespace customBrowserInterface {
  function closeWebview(): void;
  function getNetworkType(): 'NO NETWORK' | 'WIFI' | '4G' | '3G' | '2G' | 'UNKNOWN NETWORK';
  // 是否支持: 0（不支持），1（支持）
  function supportVideoPlayer(): '1' | '0';
  function customPlay(
    vid: string,
    title: string,
    left: number,
    top: number,
    width: number,
    height: number,
  ): string;
  function resizeCustomPlayer(left: number, top: number, width: number, height: number);
  function hideVideoPlayer();
  function destroyTPlayer();
  // note: json string => ISystemInfo
  function getDeviceInfo(): string;
}

type SwiperImageFn = (config: { images: { url: string }[]; keyName: 'url' }) => Promise<any>;

declare module '@tencent/slug-ui' {
  export const Scroll: any;
  export const Swiper: any;
  export const Image: any;
  export const Load: any;
  export const Toast: (content: string) => void;
  export const ActionSheet: (content: ActionSheetConfig) => Promise<any>;
  export const SwiperImage: SwiperImageFn;
}

interface ActionSheetConfig {
  title: string;
  options: Array<string>;
  colors?: Object;
}

interface CommentOptions {
  official_reply_only?: boolean;
  // 游戏 / 业务 id
  gameid: string;
  // 当前资源的标题
  title?: string;
  // 当前资源的创建时间
  stime?: number;
  // 当前资源的自定义 id
  objid?: string;
  moduleId: string;
  // 标识评论的资源来哪里, 该字段在消息中心使用
  resource_type?: string;
  href?: string;
  allCommentUrl?: string;
  // eslint-disable-next-line camelcase
  user_title?: boolean;
}

interface CommentConfigs {
  el?: HTMLElement | string;
  options: CommentOptions;
  env?: string;
  replyMode?: string;
  infinite?: string;
}

interface SlugComment {
  comments: {
    total: number;
  };
  new (config: CommentConfigs): SlugComment;
  refresh(config: { options: { objid: string; title: string } }): void;
}

declare module '@tencent/comment' {
  const SlugComment: SlugComment;
  export default SlugComment;
}

type ShareCallback = (channel: string, status: boolean) => void;

interface SlugShareCompConfig {
  el: string;
  title: string;
  desc: string;
  imgUrl: string;
  url: string;
}

interface SlugShareComp {
  afterShare?: ShareCallback;
  new (config: SlugShareCompConfig): SlugShareComp;
}

interface TxplayerConfig {
  containerId: string;
  vid: string;
  width: string;
  height: string;
  enForcePlayerType: boolean;
  playerType: 'html5hd';
  poster: string;
}

interface ITxplayerInstance {
  destroy();
  pause();
  getPlayerState();
}

type Txplayer = new (config: TxplayerConfig) => ITxplayerInstance;
