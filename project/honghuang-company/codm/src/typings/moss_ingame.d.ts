interface IIngameConfig {
  // serviceId
  p0: number;
  // 这个表示一级导航
  navigators: IngameConfigNavigators;
  theme: {
    color: { [key: number]: string };
  };
  // note: 控制了主导航页面的显示,隐藏
  options: {
    // 首页
    index: boolean;
    // 我的
    me: boolean;
    // 视频
    video: boolean;
    // 发现
    webview: boolean;
    // 评论
    comment: boolean;
  };
  downloadNav: {
    active: boolean;
    imgUrl: string;
    downloadUrl: string;
    weChatDownloadUrl?: string;
    qqDownloadUrl?: string;
  };
  // 白名单
  whiteUser: {
    dynamic: boolean;
    like: boolean;
    // 控制是否显示跳转测试链接
    link: boolean;
    video: boolean;
  };
}

// 广告的配置
interface IngameAdConfig {
  appid: string;
  configId: number;
  configTitle: string;
  describe: string;
  endTime: string;
  id: number;
  imageUrls: string | null | { location: string; img: string }[];
  images: string;
  publishTime: string;
  recommended: string;
  sort: number;
  startTime: string;
  status: number;
  title: string;
  type: number;
  // 跳转的 url
  url: string;
}
