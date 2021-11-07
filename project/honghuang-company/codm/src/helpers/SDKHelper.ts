import { checkIsSlugSdk } from '../utils';
import slugSdk, { ICustomPlayArgs } from './SlugSdk';
import msdkV5 from './Msdkv5Helper';

export type SDKCustomPlayArgs = ICustomPlayArgs;

class SDKHelper {
  public closeWebview() {
    if (checkIsSlugSdk()) {
      slugSdk.closeWebview();
    } else {
      msdkV5.closeWebview();
    }
  }

  public exitFullScreen() {
    if (!checkIsSlugSdk()) {
      msdkV5.exitFullScreen();
    }
    return false;
  }

  public setFullScreen() {
    if (!checkIsSlugSdk()) {
      msdkV5.setFullScreen();
    }
    return false;
  }

  public getDeviceInfo() {
    if (checkIsSlugSdk()) {
      return slugSdk.getDeviceInfo();
    }
    return null;
  }

  public destroyTPlayer() {
    if (checkIsSlugSdk()) {
      return slugSdk.destroyTPlayer();
    }
  }

  public getCurrentNetworkStatus() {
    if (checkIsSlugSdk()) {
      return slugSdk.getCurrentNetworkStatus();
    }
    return false;
  }

  public isSupportVideoPlayer() {
    if (checkIsSlugSdk()) {
      return slugSdk.isSupportVideoPlayer();
    }
    return false;
  }

  public hideVideoPlayer() {
    if (checkIsSlugSdk()) {
      return slugSdk.hideVideoPlayer();
    }
    return false;
  }

  public customPlay(args: SDKCustomPlayArgs): boolean {
    if (checkIsSlugSdk()) {
      return slugSdk.customPlay(args);
    }
    return false;
  }

  public resizeCustomPlayer(left: number, top: number, width: number, height: number) {
    if (checkIsSlugSdk()) {
      return slugSdk.resizeCustomPlayer(left, top, width, height);
    }
    return false;
  }
}

const sdkHelper = new SDKHelper();

export default sdkHelper;
