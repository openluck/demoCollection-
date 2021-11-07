import VueRouter, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';

type ICustomRoute = {
  meta?: {
    hideNav?: boolean;
    hideTwoLevelNav?: boolean;
    back?: number;
  };
};

type IRoute = Route & ICustomRoute;

type IRouteConfig = RouteConfig & ICustomRoute;

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = Vue;
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

interface IDmpReportConfig {
  action: string; // 必填
  targetid?: string; // 可选，内容id，如v4的iNewsId / iVideoId / iId
  targettype?: string; // 可选，内容类型，填：news | video
  from?: string; // 可选，内容从哪个平台拉取：v4 | tgl | ingame
}

declare module 'vue/types/vue' {
  // 3. 声明为 Vue 补充的东西
  interface Vue {
    $router: VueRouter;
    $Route: IRoute;
    $store: Store<IRootState>;
    $toast: (msg: string) => void;
    $swiperImage: (config: { images: { url: string }[]; keyName: string }) => void;
    $mosso: { report: (type: string, pageId: string, cnName: string) => void };
    $dmpt: { report: (config: IDmpReportConfig) => void };
  }
}

declare module 'vue/types/vue' {
  // 可以使用 `VueConstructor` 接口
  // 来声明全局 property
  interface VueConstructor {
    $myGlobal: string;
  }
}

// ComponentOptions 声明于 types/options.d.ts 之中
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string;
  }
}
