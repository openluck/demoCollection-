export interface ICustomPlayArgs {
  vid: string;
  title: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

class SlugSdk {
  public closeWebview() {
    console.log('call close webview by slugSdk');
    try {
      window.customBrowserInterface.closeWebview();
    } catch (error) {
      console.error(error);
    }
  }

  public getDeviceInfo() {
    try {
      const ret = window.customBrowserInterface.getDeviceInfo();
      return JSON.parse(ret || '{}') as ISystemInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public destroyTPlayer() {
    try {
      window.customBrowserInterface.destroyTPlayer();
    } catch (error) {
      console.error(error);
    }
  }

  public getCurrentNetworkStatus() {
    try {
      return window.customBrowserInterface.getNetworkType();
    } catch (error) {
      console.error(error);
      return 'UNKNOWN NETWORK';
    }
  }

  public isSupportVideoPlayer() {
    try {
      if (
        typeof window.customBrowserInterface === 'object' &&
        window.customBrowserInterface.supportVideoPlayer() === '1'
      ) {
        console.log('是否支持高清视频', window.customBrowserInterface.supportVideoPlayer());
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public customPlay(args: ICustomPlayArgs): boolean {
    try {
      if (typeof window.customBrowserInterface === 'object') {
        const ret = window.customBrowserInterface.customPlay(
          args.vid,
          args.title,
          args.left,
          args.top,
          args.width,
          args.height,
        );
        return ret === '1';
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public resizeCustomPlayer(left: number, top: number, width: number, height: number) {
    try {
      if (typeof window.customBrowserInterface === 'object') {
        window.customBrowserInterface.resizeCustomPlayer(left, top, width, height);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public hideVideoPlayer() {
    try {
      if (typeof window.customBrowserInterface === 'object') {
        window.customBrowserInterface.hideVideoPlayer();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
const slugSdk = new SlugSdk();

export default slugSdk;
